import React, { useState } from 'react';
import { CalculationTerm } from '../core';
import { useTranslation } from '../i18n';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface StepByStepCalculationProps {
  terms: CalculationTerm[];
  bias: number;
  z: number;
  y: number;
  expected: number;
  isCorrect: boolean;
  s: number;
}

export const StepByStepCalculation: React.FC<StepByStepCalculationProps> = ({
  terms,
  bias,
  z,
  y,
  expected,
  isCorrect,
  s,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-lab-card/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200">
            {t.common.stepByStep}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            s = {s}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono ${
              isCorrect
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 size={14} /> {t.common.correct}
              </>
            ) : (
              <>
                <XCircle size={14} /> {t.common.incorrect}
              </>
            )}
          </span>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 font-mono text-xs sm:text-sm">
          {/* Detailed terms */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto">
            <div className="text-slate-400 text-xs mb-1.5 font-sans">
              z = Σ (Xᵢ × Wᵢ) + b :
            </div>
            <div className="flex items-center flex-wrap gap-1.5 text-slate-200">
              <span className="text-lab-accentBlue">z =</span>
              {terms.map((term, i) => (
                <React.Fragment key={term.index}>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800/80 border border-slate-700/50">
                    <span className={term.x ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      X{term.index}({term.x})
                    </span>
                    <span className="text-slate-500 mx-1">×</span>
                    <span
                      className={
                        term.w > 0
                          ? 'text-blue-400'
                          : term.w < 0
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }
                    >
                      {term.w >= 0 ? `+${term.w}` : term.w}
                    </span>
                    <span className="text-slate-500 mx-1">=</span>
                    <span className="font-bold text-white">{term.product}</span>
                  </span>
                  {i < terms.length - 1 && <span className="text-slate-500">+</span>}
                </React.Fragment>
              ))}
              <span className="text-slate-500">+</span>
              <span className="inline-flex items-center px-2 py-1 rounded bg-purple-950/40 border border-purple-800/50 text-purple-300">
                b({bias >= 0 ? `+${bias}` : bias})
              </span>
            </div>
          </div>

          {/* Sum and Activation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Xətti cəm (z)</span>
              <span className="text-lg font-bold font-mono text-white">
                z = {z.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Addım (step) Aktivləşməsi</span>
              <span className="text-sm font-mono text-slate-300">
                step({z.toFixed(2)}) {z >= 0 ? '≥ 0 → 1' : '< 0 → 0'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">{t.common.output}</span>
                <span
                  className={`text-xl font-black font-mono ${
                    y === 1 ? 'text-lab-accentBlue' : 'text-slate-400'
                  }`}
                >
                  Y = {y}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block mb-1">{t.common.expected}</span>
                <span className="text-xl font-black font-mono text-slate-200">
                  {expected}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
