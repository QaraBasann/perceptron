import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {children ? (
        <span className="cursor-help underline decoration-dotted decoration-lab-accentBlue underline-offset-4">
          {children}
        </span>
      ) : (
        <button
          type="button"
          aria-label="Informasiya"
          className="text-slate-400 hover:text-lab-accentBlue transition-colors p-0.5 ml-1"
        >
          <Info size={15} />
        </button>
      )}

      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 border border-slate-700/80 rounded-lg shadow-xl text-xs text-slate-200 backdrop-blur-md pointer-events-none animate-fadeIn">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
