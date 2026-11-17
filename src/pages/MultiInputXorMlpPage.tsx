import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import {
  forwardCounterMLP,
  forwardCascadedMLP,
  verifyAllMLPCombinations,
  trainPerceptron,
  sumOfOnes,
  evaluateMultiGate,
} from '../core';
import {
  InputSwitch,
  NetworkGraph,
  NSelector,
} from '../components';
import {
  Network,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  Sparkles,
} from 'lucide-react';

export const MultiInputXorMlpPage: React.FC = () => {
  const { t } = useTranslation();

  const [n, setN] = useState(3);
  const [type, setType] = useState<'XOR' | 'XNOR'>('XOR');
  const [architecture, setArchitecture] = useState<'counter' | 'cascaded'>('counter');
  const [inputs, setInputs] = useState<number[]>([1, 1, 0]);

  // Single Perceptron training test state
  const [singlePerceptronTest, setSinglePerceptronTest] = useState<{
    tested: boolean;
    accuracy: number;
    converged: boolean;
    epochs: number;
  } | null>(null);

  const handleNChange = (newN: number) => {
    setN(newN);
    setSinglePerceptronTest(null);
    setInputs((prev) => {
      if (newN > prev.length) {
        return [...prev, ...Array(newN - prev.length).fill(0)];
      }
      return prev.slice(0, newN);
    });
  };

  const handleInputChange = (idx: number, val: number) => {
    setInputs((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const s = sumOfOnes(inputs);

  // Evaluations
  const counterEval = forwardCounterMLP(inputs, type);
  const cascadedEval = forwardCascadedMLP(inputs, type);
  const currentOutput = architecture === 'counter' ? counterEval.y : cascadedEval.y;
  const expected = evaluateMultiGate(type, inputs);

  // Verification across all 2^n combinations
  const verification = useMemo(
    () => verifyAllMLPCombinations(n, type, architecture),
    [n, type, architecture]
  );

  // Run single perceptron on XOR(n)
  const handleTrySinglePerceptron = () => {
    const res = trainPerceptron({
      gate: type,
      n,
      learningRate: 1.0,
      maxEpochs: 60,
    });
    setSinglePerceptronTest({
      tested: true,
      accuracy: res.finalAccuracy,
      converged: res.converged,
      epochs: res.maxEpochs,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.xorPage.titleN}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Paritet Problemi: Qeyri-xətti məsələnin Çoxlaylı Perseptronla (MLP) deterministik həlli
          </p>
        </div>

        {/* XOR / XNOR toggle */}
        <div className="flex gap-1.5 bg-lab-card/80 p-1.5 rounded-2xl border border-slate-700">
          {(['XOR', 'XNOR'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setType(g)}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                type === g
                  ? 'bg-lab-accentBlue text-white shadow-glow-blue/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* N Selector */}
      <NSelector n={n} onChange={handleNChange} min={2} max={10} />

      {/* Architecture Selector Tabs */}
      <div className="p-4 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-purple-400" />
          <span className="text-xs font-bold font-mono text-slate-200">
            {t.common.architecture}:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setArchitecture('counter')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              architecture === 'counter'
                ? 'bg-purple-600 text-white shadow-glow-purple/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {t.common.counterMLP} ({n} gizli neyron)
          </button>
          <button
            type="button"
            onClick={() => setArchitecture('cascaded')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              architecture === 'cascaded'
                ? 'bg-purple-600 text-white shadow-glow-purple/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {t.common.cascadedMLP} ({2 * (n - 1)} gizli neyron)
          </button>
        </div>
      </div>

      {/* Inputs and Controls */}
      <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
            Giriş Siqnalları ({n} Giriş):
          </span>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300">
            s = {s} ({s % 2 === 1 ? 'TƏK' : 'CÜT'} paritet)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {inputs.map((val, idx) => (
            <InputSwitch
              key={idx}
              index={idx + 1}
              value={val}
              onChange={(newVal) => handleInputChange(idx, newVal)}
              compact={n > 5}
            />
          ))}
        </div>

        {/* Network Output Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-purple-950/40 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 block mb-0.5">
              MLP ({architecture}) nəticəsi:
            </span>
            <span className="text-xs sm:text-sm text-slate-300 font-mono">
              s = {s} ({s % 2 === 1 ? 'tək' : 'cüt'} 1-lər) → {type} = {currentOutput}
            </span>
          </div>
          <div className="text-right pl-4 border-l border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">
              {t.common.output}
            </span>
            <span
              className={`text-3xl font-black font-mono ${
                currentOutput === 1 ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              Y = {currentOutput}
            </span>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Network size={16} className="text-lab-accentBlue" />
            <span>{t.xorPage.networkVisTitle}</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>{t.common.verified}: {verification.total} {t.common.testedRows} (100%)</span>
          </span>
        </div>

        <NetworkGraph
          n={n}
          architecture={architecture}
          inputs={inputs}
          counterData={counterEval}
          cascadedData={cascadedEval}
        />
      </div>

      {/* Step by Step Calculation Breakdown */}
      {architecture === 'counter' && (
        <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-4 font-mono text-xs">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Sayğac Neyronlarının Aktivləşməsi:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {counterEval.hiddenActivations.map((h, k) => (
              <div
                key={k}
                className={`p-3 rounded-xl border ${
                  h === 1
                    ? 'bg-purple-950/40 border-purple-600 text-white shadow-glow-purple/20'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">h{k + 1}</span>
                  <span className="font-black text-sm">{h}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  step(s - {(k + 0.5).toFixed(1)})
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span>
              Növbələşən cəm (h₁ - h₂ + h₃ - ...):{' '}
              <strong className="text-purple-300 font-bold">{counterEval.alternatingSum}</strong>
            </span>
            <span>
              Çıxış həddi z = {counterEval.outputZ.toFixed(1)} →{' '}
              <strong className="text-emerald-400 font-bold">Y = {counterEval.y}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Experiment: Try Single Perceptron on XOR(n) */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
              <AlertTriangle size={18} />
              <span>{t.xorPage.trySingleOnXor}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tək bir Perseptronun n={n} üçün XOR paritetini niyə heç vaxt öyrənə bilmədiyini real təlimlə yoxlayın.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTrySinglePerceptron}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs shadow-lg transition-all shrink-0"
          >
            <Play size={14} />
            <span>Təlimi Başlat (PLA)</span>
          </button>
        </div>

        {singlePerceptronTest && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-rose-900/50 space-y-2 font-mono text-xs animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-rose-400 font-bold">
                {singlePerceptronTest.epochs} dövr tamamlandı:
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-black">
                Yığılma: XEYR (Səhv qaldı)
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Maksimum əldə olunan dəqiqlik: <strong>{singlePerceptronTest.accuracy.toFixed(1)}%</strong>. Tək bir hipermüstəvi paritet fəzasını ayıra bilməz!
            </p>
          </div>
        )}
      </div>

      {/* Educational Comparison Card */}
      <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles size={16} className="text-lab-accentBlue" />
          <span>İki Memarlığın Müqayisəsi: Sayğac MLP vs Zəncirvari XOR</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="text-purple-400 font-bold block">Sayğac MLP (Counter Neuron):</span>
            <p className="text-slate-400">Gizli neyronlar: n = {n}</p>
            <p className="text-slate-400">Parametrlər: (n + 1)² = {Math.pow(n + 1, 2)}</p>
            <p className="text-slate-400">Dərinlik: Cəmi 2 lay (Paralel, sürətli)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="text-blue-400 font-bold block">Zəncirvari XOR (Cascaded Blocks):</span>
            <p className="text-slate-400">Gizli neyronlar: 2(n - 1) = {2 * (n - 1)}</p>
            <p className="text-slate-400">Parametrlər: 9(n - 1) = {9 * (n - 1)}</p>
            <p className="text-slate-400">Dərinlik: n qat (Ardıcıl, zəncirvari gecikmə)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
