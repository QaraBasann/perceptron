import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import {
  MultiGateType,
  getDefaultParameters,
  forwardPerceptron,
  testAllCombinations,
} from '../core';
import {
  InputSwitch,
  NumberInput,
  StepByStepCalculation,
  DecisionBoundary2D,
} from '../components';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

export const PerceptronPage: React.FC = () => {
  const { t } = useTranslation();

  const [gate, setGate] = useState<MultiGateType>('AND');
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(1);

  // Default parameters for n = 2
  const defaultParams = getDefaultParameters(gate, 2);
  const [w1, setW1] = useState<number>(defaultParams.weights[0]);
  const [w2, setW2] = useState<number>(defaultParams.weights[1]);
  const [bias, setBias] = useState<number>(defaultParams.bias);

  // Load preset handler
  const handleLoadPreset = (selectedGate: MultiGateType) => {
    setGate(selectedGate);
    const p = getDefaultParameters(selectedGate, 2);
    setW1(p.weights[0]);
    setW2(p.weights[1]);
    setBias(p.bias);
  };

  // Evaluation
  const evalResult = forwardPerceptron([w1, w2], bias, [x1, x2], gate);
  const testResults = testAllCombinations([w1, w2], bias, gate, 2);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.perceptronPage.title2}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            z = X₁·W₁ + X₂·W₂ + b | Y = step(z)
          </p>
        </div>

        {/* Gate selector */}
        <div className="flex flex-wrap gap-1.5 bg-lab-card/80 p-1.5 rounded-2xl border border-slate-700">
          {(['AND', 'NAND', 'OR', 'NOR'] as MultiGateType[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleLoadPreset(g)}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls & Inputs */}
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

          {/* Editable Parameters */}
          <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                {t.perceptronPage.editParams}
              </span>
              <button
                type="button"
                onClick={() => handleLoadPreset(gate)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-lab-accentBlue font-mono transition-colors"
              >
                <RotateCcw size={13} />
                <span>{t.common.loadPreset}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumberInput label="Çəki W1" value={w1} onChange={setW1} step={0.5} />
              <NumberInput label="Çəki W2" value={w2} onChange={setW2} step={0.5} />
              <NumberInput label="Bias (b)" value={bias} onChange={setBias} step={0.5} />
            </div>

            {/* Test All 4 combinations live banner */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">
                Bütün 4 kombinasiya üçün dəqiqlik:
              </span>
              <span
                className={`font-black px-2.5 py-1 rounded-lg ${
                  testResults.accuracy === 100
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {testResults.correct} / 4 ({testResults.accuracy.toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Step By Step */}
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

        {/* 2D Decision Boundary */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md">
            <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider mb-3">
              {t.perceptronPage.plane2DTitle}
            </h3>
            <DecisionBoundary2D
              x1={x1}
              x2={x2}
              w1={w1}
              w2={w2}
              bias={bias}
              activeGate={gate}
            />
            <p className="mt-3 text-[11px] text-slate-400 leading-relaxed font-mono">
              Xətt tənliyi: {w1}·X₁ + {w2}·X₂ + ({bias}) = 0. Yaşıl nöqtələr Y=1, qırmızı nöqtələr Y=0 qiymətini təmsil edir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
