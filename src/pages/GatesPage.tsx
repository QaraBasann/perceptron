import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { GateType2Input, evaluate2InputGate, getGateExplanation, MultiGateType } from '../core';
import { InputSwitch, TruthTableView } from '../components';

export const GatesPage: React.FC = () => {
  const { t, language } = useTranslation();

  const [gate, setGate] = useState<GateType2Input>('AND');
  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);

  const gatesList: GateType2Input[] = ['AND', 'NAND', 'OR', 'NOR', 'XOR', 'XNOR', 'NOT'];

  const output = evaluate2InputGate(gate, x1, x2);
  const explanation =
    gate === 'NOT'
      ? `NOT(1): X1 = ${x1}, ona görə çıxış Y = ${output}.`
      : getGateExplanation(gate as MultiGateType, [x1, x2], language);

  // Generate 2-input truth table rows
  const truthRows = [
    { index: 0, inputs: [0, 0], s: 0, outputs: { [gate]: evaluate2InputGate(gate, 0, 0) } },
    { index: 1, inputs: [0, 1], s: 1, outputs: { [gate]: evaluate2InputGate(gate, 0, 1) } },
    { index: 2, inputs: [1, 0], s: 1, outputs: { [gate]: evaluate2InputGate(gate, 1, 0) } },
    { index: 3, inputs: [1, 1], s: 2, outputs: { [gate]: evaluate2InputGate(gate, 1, 1) } },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.gatesPage.title2}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            2-girişli klassik Bul məntiq qapıları və doğruluq cədvəlləri
          </p>
        </div>

        {/* Gate Selector Pills */}
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

      {/* Simulator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200">
              Giriş Siqnalları:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setX1(0);
                  setX2(0);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700"
              >
                {t.common.all0}
              </button>
              <button
                type="button"
                onClick={() => {
                  setX1(1);
                  setX2(1);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700"
              >
                {t.common.all1}
              </button>
              <button
                type="button"
                onClick={() => {
                  setX1(Math.random() > 0.5 ? 1 : 0);
                  setX2(Math.random() > 0.5 ? 1 : 0);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700"
              >
                {t.common.random}
              </button>
            </div>
          </div>

          {/* Switches */}
          <div className="grid grid-cols-2 gap-4">
            <InputSwitch index={1} value={x1} onChange={setX1} />
            {gate !== 'NOT' ? (
              <InputSwitch index={2} value={x2} onChange={setX2} />
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-500 text-xs flex items-center justify-center font-mono">
                NOT tək girişlidir (yalnız X1)
              </div>
            )}
          </div>

          {/* Visual Output Display */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1">
                {gate}({x1}{gate !== 'NOT' ? `, ${x2}` : ''}) nəticəsi:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-mono">
                {explanation}
              </p>
            </div>
            <div className="text-center pl-4 border-l border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">
                {t.common.output}
              </span>
              <span
                className={`text-3xl sm:text-4xl font-black font-mono ${
                  output === 1 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {output}
              </span>
            </div>
          </div>
        </div>

        {/* Gate Info Card */}
        <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono text-lab-accentBlue uppercase tracking-wider">
              Qapı Haqqında
            </span>
            <h3 className="text-xl font-black text-white font-mono">{gate} Qapısı</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {gate === 'AND' && 'Yalnız hər iki giriş 1 olduqda çıxış 1 olur (xətti ayrıla biləndir).'}
              {gate === 'NAND' && 'AND qapısının tərsi. Yalnız hər iki giriş 1 olduqda 0 verir.'}
              {gate === 'OR' && 'Girişlərdən ən azı biri 1 olduqda çıxış 1 olur (xətti ayrıla biləndir).'}
              {gate === 'NOR' && 'OR qapısının tərsi. Yalnız hər iki giriş 0 olduqda 1 verir.'}
              {gate === 'XOR' && 'Girişlər fərqli olduqda 1, eyni olduqda 0 verir (Tək xətlə ayrıla BİLMİR!).'}
              {gate === 'XNOR' && 'XOR-un tərsi. Girişlər eyni olduqda 1 verir (Xətti ayrıla BİLMİR!).'}
              {gate === 'NOT' && 'Tək girişli qapı, girişi tərsinə çevirir (1→0, 0→1).'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
            Kombinasiyalar: 2² = 4 sətir
          </div>
        </div>
      </div>

      {/* Truth Table */}
      <TruthTableView
        rows={truthRows}
        n={2}
        currentInputs={gate === 'NOT' ? [x1] : [x1, x2]}
        gate={gate as MultiGateType}
      />
    </div>
  );
};
