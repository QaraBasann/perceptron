import React from 'react';
import { useTranslation } from '../i18n';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-1 bg-lab-card/80 border border-lab-cardBorder/60 rounded-xl p-1 backdrop-blur-md">
      <div className="flex items-center pl-2 pr-1 text-slate-400">
        <Globe size={15} />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('az')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          language === 'az'
            ? 'bg-lab-accentBlue text-white shadow-glow-blue'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        AZ
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          language === 'en'
            ? 'bg-lab-accentBlue text-white shadow-glow-blue'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        EN
      </button>
    </div>
  );
};
