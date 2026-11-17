import React from 'react';
import { motion } from 'framer-motion';

interface InputSwitchProps {
  index: number;
  value: number; // 0 or 1
  onChange: (val: number) => void;
  compact?: boolean;
}

export const InputSwitch: React.FC<InputSwitchProps> = ({
  index,
  value,
  onChange,
  compact = false,
}) => {
  const isOn = value === 1;

  return (
    <button
      type="button"
      onClick={() => onChange(isOn ? 0 : 1)}
      className={`group relative flex items-center justify-between transition-all rounded-xl border select-none ${
        compact ? 'p-1.5 px-2.5 gap-2' : 'p-3 px-4 gap-3'
      } ${
        isOn
          ? 'bg-lab-accentBlue/20 border-lab-accentBlue shadow-glow-blue/40 text-white'
          : 'bg-lab-card/80 border-slate-700/80 hover:border-slate-500 text-slate-400'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-mono font-bold text-xs sm:text-sm">X{index}</span>
      </div>

      <div
        className={`relative inline-flex items-center rounded-full transition-colors ${
          compact ? 'w-8 h-4' : 'w-10 h-5'
        } ${isOn ? 'bg-lab-accentBlue' : 'bg-slate-700'}`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`inline-block rounded-full bg-white shadow-md ${
            compact ? 'w-3 h-3' : 'w-4 h-4'
          }`}
          style={{
            marginLeft: isOn ? (compact ? '18px' : '22px') : '2px',
          }}
        />
      </div>

      <span
        className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
          isOn
            ? 'bg-lab-accentBlue text-white'
            : 'bg-slate-800 text-slate-400'
        }`}
      >
        {value}
      </span>
    </button>
  );
};
