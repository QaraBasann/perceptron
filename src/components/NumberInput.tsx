import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  prefix?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min = -100,
  max = 100,
  step = 0.5,
  disabled = false,
  prefix,
}) => {
  const { t } = useTranslation();
  const [strVal, setStrVal] = useState<string>(value.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStrVal(value.toString());
    setError(null);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setStrVal(raw);

    if (raw.trim() === '') {
      setError(t.common.errorInputNumber);
      return;
    }

    const parsed = parseFloat(raw);
    if (isNaN(parsed)) {
      setError(t.common.errorInputNumber);
      return;
    }

    if (parsed < min || parsed > max) {
      setError(`${t.common.errorRange} [${min}, ${max}]`);
      return;
    }

    setError(null);
    onChange(parsed);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center text-xs">
        <label className="text-slate-300 font-mono font-medium">{label}</label>
        {prefix && <span className="text-slate-500 font-mono text-[10px]">{prefix}</span>}
      </div>
      <div className="relative">
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          value={strVal}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full bg-lab-card/90 border rounded-xl px-3 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-lab-error focus:ring-lab-error/40'
              : 'border-slate-700/80 focus:border-lab-accentBlue focus:ring-lab-accentBlue/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && (
        <span className="text-[11px] text-lab-error font-medium animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
};
