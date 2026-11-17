import React from 'react';
import { useTranslation } from '../i18n';
import { Minus, Plus } from 'lucide-react';

interface NSelectorProps {
  n: number;
  onChange: (newN: number) => void;
  min?: number;
  max?: number;
}

export const NSelector: React.FC<NSelectorProps> = ({
  n,
  onChange,
  min = 2,
  max = 10,
}) => {
  const { t } = useTranslation();

  const handleDec = () => {
    if (n > min) onChange(n - 1);
  };

  const handleInc = () => {
    if (n < max) onChange(n + 1);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-lab-card/90 border border-slate-700/80 rounded-2xl backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm font-semibold text-slate-200">
          {t.common.nInputs}:
        </span>
        <span className="text-lg font-black font-mono text-lab-accentBlue px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
          n = {n}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1">
          <button
            type="button"
            onClick={handleDec}
            disabled={n <= min}
            className="p-1 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={16} />
          </button>

          <input
            type="range"
            min={min}
            max={max}
            value={n}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-24 sm:w-32 accent-lab-accentBlue cursor-pointer"
          />

          <button
            type="button"
            onClick={handleInc}
            disabled={n >= max}
            className="p-1 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Quick select pills */}
        <div className="hidden sm:flex items-center gap-1">
          {[2, 3, 4, 5, 8, 10].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              className={`px-2 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                n === val
                  ? 'bg-lab-accentBlue text-white shadow-glow-blue/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
