import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import {
  MultiGateType,
  getDefaultParameters,
  forwardPerceptron,
  testAllCombinations,
  getAllowableBiasInterval,
  sumOfOnes,
} from '../core';
import {
  InputSwitch,
  NumberInput,
  StepByStepCalculation,
  NeuronDiagram,
  DecisionBoundary2D,
  SumLine1D,
  ScatterPlot3D,
  NSelector,
} from '../components';
import { RotateCcw, CheckCircle2, AlertCircle, Sliders } from 'lucide-react';

export const MultiInputPerceptronPage: React.FC = () => {
  const { t } = useTranslation();

  const [n, setN] = useState(3);
  const [gate, setGate] = useState<MultiGateType>('AND');
  const [inputs, setInputs] = useState<number[]>([1, 1, 1]);

  // Parameters
  const [weights, setWeights] = useState<number[]>([]);
  const [bias, setBias] = useState<number>(0);

  // Initialize or update parameters when n or gate changes
  const loadPresetParams = (targetGate: MultiGateType, targetN: number) => {
    const params = getDefaultParameters(targetGate, targetN);
    setWeights(params.weights);
    setBias(params.bias);
  };

  useEffect(() => {
    loadPresetParams(gate, n);
    setInputs((prev) => {
      if (n > prev.length) {
        return [...prev, ...Array(n - prev.length).fill(0)];
      }
      return prev.slice(0, n);
    });
  }, [n, gate]);

  const handleWeightChange = (idx: number, val: number) => {
    setWeights((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleInputChange = (idx: number, val: number) => {
    setInputs((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const currentS = sumOfOnes(inputs);

  // Forward pass and testing
  const evalResult = forwardPerceptron(weights, bias, inputs, gate);
  const testResults = testAllCombinations(weights, bias, gate, n);
  const allowableInterval = getAllowableBiasInterval(gate, n, weights);

  const gatesList: MultiGateType[] = ['AND', 'NAND', 'OR', 'NOR'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.perceptronPage.titleN}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            z = Σ(Xᵢ × Wᵢ) + b | Y = step(z)
          </p>
        </div>

        {/* Gate selector pills */}
        <div className="flex flex-wrap gap-1.5 bg-lab-card/80 p-1.5 rounded-2xl border border-slate-700">
          {gatesList.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGate(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                gate === g
                  ? 'bg-lab-accentBlue text-white shadow-glow-blue/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* N Selector */}
      <NSelector n={n} onChange={setN} min={2} max={10} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Inputs & Parameters */}
        <div className="lg:col-span-2 space-y-5">
          {/* Inputs Section */}
          <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                Girişlər (X₁ ... X{n})
              </span>
              <span className="text-xs font-mono text-slate-400">
                1-lərin sayı: <strong className="text-white">{currentS}</strong>
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
          </div>

          {/* Parameters & Validation */}
          <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                  {t.perceptronPage.editParams}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {n + 1} parametr
                </span>
              </div>

              <button
                type="button"
                onClick={() => loadPresetParams(gate, n)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-lab-accentBlue font-mono transition-colors"
              >
                <RotateCcw size={13} />
                <span>{t.common.loadPreset}</span>
              </button>
            </div>

            {/* Weights inputs */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block">
                Çəkilər (W₁ ... W{n}):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {weights.map((w, idx) => (
                  <NumberInput
                    key={idx}
                    label={`W${idx + 1}`}
                    value={w}
                    onChange={(val) => handleWeightChange(idx, val)}
                    step={0.5}
                  />
                ))}
              </div>
            </div>

            {/* Bias Input */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <NumberInput
                label="Sürüşmə Parametri (Bias b)"
                value={bias}
                onChange={setBias}
                step={0.5}
              />
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="text-slate-500 block text-[10px]">İcazə verilən işlək interval:</span>
                <span className="text-amber-400 font-bold">{allowableInterval.explanation}</span>
              </div>
            </div>

            {/* Accuracy Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-slate-300">
                Bütün 2^{n} ({testResults.total}) kombinasiya üzrə dəqiqlik:
              </span>
              <span
                className={`font-black px-3 py-1 rounded-lg text-sm ${
                  testResults.accuracy === 100
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {testResults.correct} / {testResults.total} ({testResults.accuracy.toFixed(1)}%)
              </span>
            </div>

            {/* Wrong rows list if accuracy < 100% */}
            {testResults.wrongRows.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/50 space-y-2 text-xs font-mono">
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  <span>{t.perceptronPage.wrongRowsList} ({testResults.wrongRows.length} səhv)</span>
                </span>
                <div className="max-h-28 overflow-y-auto space-y-1 text-slate-300 text-[11px]">
                  {testResults.wrongRows.slice(0, 10).map((r, i) => (
                    <div key={i} className="flex justify-between bg-slate-900/80 p-1.5 rounded">
                      <span>[{r.inputs.join(', ')}] (s={r.s})</span>
                      <span>
                        Faktiki: <strong className="text-rose-400">{r.actual}</strong> | Gözlənilən: <strong className="text-emerald-400">{r.expected}</strong> (z={r.z.toFixed(2)})
                      </span>
                    </div>
                  ))}
                  {testResults.wrongRows.length > 10 && (
                    <div className="text-center text-slate-500">
                      + daha {testResults.wrongRows.length - 10} sətir...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Experiment Panel: What if bias is wrong? */}
          <div className="p-5 rounded-3xl bg-lab-card/80 border border-purple-500/30 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <Sliders size={16} />
              <span>{t.perceptronPage.biasExperimentTitle}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.perceptronPage.biasExperimentDesc}{' '}
              <strong className="text-amber-400 font-mono">{allowableInterval.explanation}</strong>.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">-10</span>
              <input
                type="range"
                min={-10}
                max={10}
                step={0.5}
                value={bias}
                onChange={(e) => setBias(parseFloat(e.target.value))}
                className="flex-1 accent-purple-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400">+10</span>
              <span className="text-xs font-mono font-bold text-white px-2 py-1 rounded bg-slate-900 border border-slate-700 min-w-14 text-center">
                b = {bias.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Step-by-Step Calculation */}
          <StepByStepCalculation
            terms={evalResult.terms}
            bias={evalResult.bias}
            z={evalResult.z}
            y={evalResult.y}
            expected={evalResult.expected}
            isCorrect={evalResult.isCorrect}
            s={evalResult.s}
          />
        </div>

        {/* Right Column: Visualizations */}
        <div className="space-y-5">
          {/* Neuron Diagram */}
          <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
            <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block">
              Neyron Sxemi ({n} Giriş)
            </span>
            <NeuronDiagram
              inputs={inputs}
              weights={weights}
              bias={bias}
              z={evalResult.z}
              y={evalResult.y}
            />
          </div>

          {/* 1D Sum Line */}
          <SumLine1D
            n={n}
            currentS={currentS}
            bias={bias}
            gate={gate}
          />

          {/* 2D Plane if n = 2 */}
          {n === 2 && (
            <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md">
              <DecisionBoundary2D
                x1={inputs[0]}
                x2={inputs[1]}
                w1={weights[0] ?? 1}
                w2={weights[1] ?? 1}
                bias={bias}
                activeGate={gate}
              />
            </div>
          )}

          {/* 3D Cube Projection if n = 3 */}
          {n === 3 && (
            <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md">
              <ScatterPlot3D
                currentInputs={inputs}
                weights={weights}
                bias={bias}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
