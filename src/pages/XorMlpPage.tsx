import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { evaluate2InputXorMLP, evaluate2InputGate } from '../core';
import { InputSwitch } from '../components';
import { CheckCircle2, AlertTriangle, Network } from 'lucide-react';

export const XorMlpPage: React.FC = () => {
  const { t } = useTranslation();

  const [type, setType] = useState<'XOR' | 'XNOR'>('XOR');
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(0);

  const res = evaluate2InputXorMLP(x1, x2, type);
  const expected = evaluate2InputGate(type, x1, x2);
  const isCorrect = res.y === expected;

  // Test all 4 combinations
  const allCombinations = [
    { x1: 0, x2: 0, ...evaluate2InputXorMLP(0, 0, type), expected: evaluate2InputGate(type, 0, 0) },
    { x1: 0, x2: 1, ...evaluate2InputXorMLP(0, 1, type), expected: evaluate2InputGate(type, 0, 1) },
    { x1: 1, x2: 0, ...evaluate2InputXorMLP(1, 0, type), expected: evaluate2InputGate(type, 1, 0) },
    { x1: 1, x2: 1, ...evaluate2InputXorMLP(1, 1, type), expected: evaluate2InputGate(type, 1, 1) },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.xorPage.title2}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Klassik 2-Gizli Neyronlu Çoxlaylı Perseptron (MLP)
          </p>
        </div>

        {/* Toggle XOR / XNOR */}
        <div className="flex gap-1 bg-lab-card/80 p-1.5 rounded-2xl border border-slate-700">
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

      {/* Why Single Perceptron Fails Banner */}
      <div className="p-5 rounded-3xl bg-rose-950/30 border border-rose-500/30 backdrop-blur-md space-y-2">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <AlertTriangle size={16} />
          <span>{t.xorPage.singlePerceptronFailedTitle}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {t.xorPage.singlePerceptronFailedDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Controls & MLP Diagram */}
        <div className="lg:col-span-2 space-y-5">
          {/* Inputs */}
          <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-4">
            <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block">
              Girişlər (X₁, X₂)
            </span>
            <div className="grid grid-cols-2 gap-4">
              <InputSwitch index={1} value={x1} onChange={setX1} />
              <InputSwitch index={2} value={x2} onChange={setX2} />
            </div>
          </div>

          {/* Network Breakdown Card */}
          <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Network size={16} className="text-lab-accentBlue" />
              <span>{t.xorPage.calculationTitle} (PRD 1 Dəqiq Düsturları)</span>
            </h3>

            {/* Hidden Layer Formula breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-400">Gizli Neyron h₁:</span>
                  <span
                    className={`px-2 py-0.5 rounded font-black ${
                      res.h1 === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    h₁ = {res.h1}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  h₁ = step(X₁ - X₂ - 0.5)
                </div>
                <div className="text-slate-300">
                  = step({x1} - {x2} - 0.5) = step({res.z1.toFixed(1)}) → {res.h1}
                </div>
                <div className="text-[10px] text-slate-500">
                  (Yalnız X₁=1 və X₂=0 olduqda aktivləşir)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-400">Gizli Neyron h₂:</span>
                  <span
                    className={`px-2 py-0.5 rounded font-black ${
                      res.h2 === 1 ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    h₂ = {res.h2}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  h₂ = step(-X₁ + X₂ - 0.5)
                </div>
                <div className="text-slate-300">
                  = step(-{x1} + {x2} - 0.5) = step({res.z2.toFixed(1)}) → {res.h2}
                </div>
                <div className="text-[10px] text-slate-500">
                  (Yalnız X₁=0 və X₂=1 olduqda aktivləşir)
                </div>
              </div>
            </div>

            {/* Output Layer */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-emerald-400">Çıxış Neyronu ({type}):</span>
                <span
                  className={`px-3 py-1 rounded-xl text-sm font-black ${
                    res.y === 1
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  Y = {res.y}
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">
                {type === 'XOR'
                  ? 'Y = step(h₁ + h₂ - 0.5)'
                  : 'Y = step(-(h₁ + h₂ - 0.5) + 0.5)'}
              </div>
              <div className="text-slate-300">
                {type === 'XOR'
                  ? `z = ${res.h1} + ${res.h2} - 0.5 = ${res.zOut.toFixed(1)} → Y = ${res.y}`
                  : `z = -(${res.h1} + ${res.h2} - 0.5) + 0.5 = ${res.zOut.toFixed(1)} → Y = ${res.y}`}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Table */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 size={16} />
              <span>{t.xorPage.allCombinations100}</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-center font-mono text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-2">X₁</th>
                    <th className="py-2 px-2">X₂</th>
                    <th className="py-2 px-2 text-blue-400">h₁</th>
                    <th className="py-2 px-2 text-purple-400">h₂</th>
                    <th className="py-2 px-2 text-emerald-400">Y</th>
                    <th className="py-2 px-2">Gözlənilən</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {allCombinations.map((c, i) => {
                    const isSelected = c.x1 === x1 && c.x2 === x2;
                    return (
                      <tr
                        key={i}
                        className={
                          isSelected ? 'bg-lab-accentBlue/20 font-bold text-white' : 'text-slate-300'
                        }
                      >
                        <td className="py-2 px-2">{c.x1}</td>
                        <td className="py-2 px-2">{c.x2}</td>
                        <td className="py-2 px-2 text-blue-400">{c.h1}</td>
                        <td className="py-2 px-2 text-purple-400">{c.h2}</td>
                        <td className="py-2 px-2 font-bold text-emerald-400">{c.y}</td>
                        <td className="py-2 px-2 text-slate-400">{c.expected}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              Gizli lay fəzanı transformasiya edir və paritet nöqtələrini xətti ayrıla bilən formaya salır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
