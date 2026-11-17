import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  badge?: string;
  glowColor?: 'blue' | 'purple' | 'cyan' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  badge,
  glowColor = 'blue',
}) => {
  const glowClasses = {
    blue: 'border-blue-500/30 hover:border-blue-500/60 shadow-glow-blue/20',
    purple: 'border-purple-500/30 hover:border-purple-500/60 shadow-glow-purple/20',
    cyan: 'border-cyan-500/30 hover:border-cyan-500/60 shadow-glow-cyan/20',
    green: 'border-emerald-500/30 hover:border-emerald-500/60 shadow-glow-success/20',
  }[glowColor];

  const iconColors = {
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    green: 'text-emerald-400 bg-emerald-500/10',
  }[glowColor];

  return (
    <div
      className={`relative p-5 rounded-2xl bg-lab-card/90 border backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 ${glowClasses}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              {value}
            </span>
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-lab-cardLight border border-slate-700 text-lab-accentBlue">
                {badge}
              </span>
            )}
          </div>
          {subValue && (
            <p className="mt-1 text-xs text-slate-400 font-mono">{subValue}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconColors}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
};
