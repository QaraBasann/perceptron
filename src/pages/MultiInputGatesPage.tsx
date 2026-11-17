import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import {
  MultiGateType,
  evaluateMultiGate,
  sumOfOnes,
  getGateExplanation,
  generateFullTruthTable,
} from '../core';
import { InputSwitch, TruthTableView, NSelector } from '../components';

export const MultiInputGatesPage: React.FC = () => {
  const { t, language } = useTranslation();

  const [n, setN] = useState(3);
  const [gate, setGate] = useState<MultiGateType>('AND');
  const [inputs, setInputs] = useState<number[]>([1, 1, 0]);

  // Handle changing n: resize inputs array
  const handleNChange = (newN: number) => {
    setN(newN);
    setInputs((prev) => {
      if (newN > prev.length) {
        return [...prev, ...Array(newN - prev.length).fill(0)];
      } else {
        return prev.slice(0, newN);
      }
    });
  };

  const handleInputChange = (idx: number, val: number) => {
    setInputs((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  // Helper buttons
  const setAll = (val: number) => setInputs(Array(n).fill(val));
  const setRandom = () => setInputs(Array.from({ length: n }, () => (Math.random() > 0.5 ? 1 : 0)));
  const invertAll = () => setInputs((prev) => prev.map((x) => (x === 1 ? 0 : 1)));

  const s = sumOfOnes(inputs);
  const output = evaluateMultiGate(gate, inputs);
  const explanation = getGateExplanation(gate, inputs, language);

  // Generate truth table for current n
  const truthRows = useMemo(() => generateFullTruthTable(n), [n]);

  const gatesList: MultiGateType[] = ['AND', 'NAND', 'OR', 'NOR', 'XOR', 'XNOR'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.gatesPage.titleN}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            n = 2-dən 10-a qədər girişlərlə 6 Bul məntiq qapısının tədqiqi
          </p>
        </div>

        {/* Gate selector pills */}
        <div className="flex flex-wrap gap-1.5 bg-lab-card/80 p-1.5 rounded-2xl border border-slate-700">
          {gatesList.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGate(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
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
      <NSelector n={n} onChange={handleNChange} min={2} max={10} />

      {/* Simulator Control Card */}
      <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-200">
              Giriş Siqnalları ({n} giriş):
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              1-lərin sayı s = {s}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAll(0)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              {t.common.all0}
            </button>
            <button
              type="button"
              onClick={() => setAll(1)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              {t.common.all1}
            </button>
            <button
              type="button"
              onClick={setRandom}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              {t.common.random}
            </button>
            <button
              type="button"
              onClick={invertAll}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              {t.common.invert}
            </button>
          </div>
        </div>

        {/* Input Switches Grid */}
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

        {/* Live Output Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400">
              {gate}({n}) çıxış analizi:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-mono font-medium">
              {explanation}
            </p>
          </div>
          <div className="text-left sm:text-right sm:pl-6 sm:border-l sm:border-slate-800 shrink-0">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">
              {t.common.output}
            </span>
            <span
              className={`text-3xl sm:text-4xl font-black font-mono ${
                output === 1 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              Y = {output}
            </span>
          </div>
        </div>
      </div>

      {/* Truth Table */}
      <TruthTableView
        rows={truthRows}
        n={n}
        currentInputs={inputs}
        gate={gate}
      />
    </div>
  );
};
