import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import { StatCard } from '../components';
import {
  Cpu,
  GitBranch,
  Network,
  TableProperties,
  ArrowRight,
  Layers,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-lab-card via-slate-900 to-lab-card border border-lab-cardBorder/80 shadow-glass overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -mb-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-lab-accentBlueGlow text-xs font-mono font-semibold">
            <Sparkles size={14} />
            <span>Süni İntellekt & Neyron Şəbəkələri Laboratoriyası</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {t.dashboard.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.dashboard.heroDesc}
          </p>

          {/* Instructor Question Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-md space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <HelpCircle size={16} />
              <span>{t.dashboard.instructorQuestionTitle}</span>
            </div>
            <p className="text-base sm:text-lg font-serif italic text-white font-medium">
              {t.dashboard.instructorQuestion}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/multi-input"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-lab-accentBlue to-lab-accentPurple text-white font-bold text-sm shadow-glow-blue hover:opacity-95 transition-all"
            >
              <span>{t.dashboard.exploreMultiLab}</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/logic-gates"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
            >
              <span>{t.dashboard.quickStart}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Base 2-Input Stats */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>{t.dashboard.baseOverviewTitle}</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            n = 2
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title={t.dashboard.statInputs}
            value="2"
            subValue="X1, X2"
            icon={Cpu}
            glowColor="blue"
          />
          <StatCard
            title={t.dashboard.statCombinations}
            value="4"
            subValue="2² = 4 sətir"
            icon={Layers}
            glowColor="purple"
          />
          <StatCard
            title={t.dashboard.statWeights}
            value="2"
            subValue="W1, W2"
            icon={GitBranch}
            glowColor="cyan"
          />
          <StatCard
            title={t.dashboard.statBias}
            value="1"
            subValue="b parametri"
            icon={TrendingUp}
            glowColor="green"
          />
        </div>
      </div>

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link
          to="/logic-gates"
          className="group p-5 rounded-2xl bg-lab-card/80 border border-slate-700/80 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Cpu size={22} />
          </div>
          <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-400 transition-colors">
            {t.nav.gates}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AND, OR, NOT, NAND, NOR, XOR, XNOR qapılarının 2-girişli interaktiv analizi.
          </p>
        </Link>

        <Link
          to="/perceptron"
          className="group p-5 rounded-2xl bg-lab-card/80 border border-slate-700/80 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <GitBranch size={22} />
          </div>
          <h3 className="font-bold text-white text-base mb-1 group-hover:text-purple-400 transition-colors">
            {t.nav.perceptron}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            2D qərar xətti (W1·X1 + W2·X2 + b = 0) və redaktə olunan çəkilər.
          </p>
        </Link>

        <Link
          to="/xor-mlp"
          className="group p-5 rounded-2xl bg-lab-card/80 border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Network size={22} />
          </div>
          <h3 className="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">
            {t.nav.xorMlp}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Klassik 2-gizli-neyronlu XOR MLP memarlığı və paritet problemi.
          </p>
        </Link>
      </div>
    </div>
  );
};
