import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { Link } from 'react-router-dom';
import {
  getCombinationsCount,
  getPerceptronParamCount,
  getCounterMLPParamCount,
  getHiddenNeuronsCount,
} from '../core';
import { StatCard, NSelector } from '../components';
import {
  Cpu,
  GitBranch,
  Network,
  FlaskConical,
  TrendingUp,
  TableProperties,
  ArrowRight,
  HelpCircle,
  Binary,
  Layers,
  Sparkles,
} from 'lucide-react';

export const MultiInputOverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const [n, setN] = useState(3); // default 3

  const combinations = getCombinationsCount(n);
  const perceptronParams = getPerceptronParamCount(n);
  const counterParams = getCounterMLPParamCount(n);
  const counterHidden = getHiddenNeuronsCount(n, 'counter');
  const cascadedHidden = getHiddenNeuronsCount(n, 'cascaded');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-lab-card via-slate-900 to-purple-950/40 border border-purple-500/30 shadow-glass overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
            <Sparkles size={14} />
            <span>{t.multiDashboard.subtitle}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {t.multiDashboard.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.multiDashboard.desc}
          </p>

          {/* Research Question Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-purple-500/40 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <HelpCircle size={16} />
              <span>{t.dashboard.instructorQuestionTitle}</span>
            </div>
            <p className="text-base sm:text-lg font-serif italic text-white font-medium">
              {t.dashboard.instructorQuestion}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic N-Selector */}
      <NSelector n={n} onChange={setN} min={2} max={10} />

      {/* Live Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.multiDashboard.statCombinationsTitle}
          value={combinations.toLocaleString()}
          subValue={`2^${n} = ${combinations} sətir`}
          icon={Binary}
          glowColor="blue"
        />
        <StatCard
          title={t.multiDashboard.statPerceptronParamsTitle}
          value={perceptronParams}
          subValue={`${n} çəki + 1 bias = ${n + 1}`}
          icon={GitBranch}
          glowColor="cyan"
        />
        <StatCard
          title={t.multiDashboard.statCounterParamsTitle}
          value={counterParams}
          subValue={`(${n} + 1)² = ${counterParams}`}
          icon={Network}
          glowColor="purple"
        />
        <StatCard
          title={t.multiDashboard.statHiddenNeuronsTitle}
          value={`${counterHidden} / ${cascadedHidden}`}
          subValue={`Sayğac: ${counterHidden} | Zəncir: ${cascadedHidden}`}
          icon={Layers}
          glowColor="green"
        />
      </div>

      {/* Experiments Quick Navigation Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          n-Girişli Laboratoriya Bölmələri:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            to="/multi-input/gates"
            className="group p-5 rounded-2xl bg-lab-card/80 border border-slate-700/80 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Cpu size={22} />
            </div>
            <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-400 transition-colors flex items-center justify-between">
              <span>{t.nav.multiGates}</span>
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.multiDashboard.quickGateDesc}
            </p>
          </Link>

          <Link
            to="/multi-input/perceptron"
            className="group p-5 rounded-2xl bg-lab-card/80 border border-slate-700/80 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <GitBranch size={22} />
            </div>
            <h3 className="font-bold text-white text-base mb-1 group-hover:text-purple-400 transition-colors flex items-center justify-between">
              <span>{t.nav.multiPerceptron}</span>
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.multiDashboard.quickPerceptronDesc}
            </p>
          </Link>

          <Link
            to="/multi-input/xor-mlp"
            className="group p-5 rounded-2xl bg-lab-card/80 border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Network size={22} />
            </div>
            <h3 className="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors flex items-center justify-between">
              <span>{t.nav.multiXorMlp}</span>
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.multiDashboard.quickXorDesc}
            </p>
          </Link>

          <Link
            to="/multi-input/training"
            className="group p-5 rounded-2xl bg-lab-card/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FlaskConical size={22} />
            </div>
            <h3 className="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors flex items-center justify-between">
              <span>{t.nav.trainingLab}</span>
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.multiDashboard.quickTrainDesc}
            </p>
          </Link>

          <Link
            to="/multi-input/scaling"
            className="group p-5 rounded-2xl bg-lab-card/80 border border-slate-700/80 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp size={22} />
            </div>
            <h3 className="font-bold text-white text-base mb-1 group-hover:text-amber-400 transition-colors flex items-center justify-between">
              <span>{t.nav.scalingAnalysis}</span>
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.multiDashboard.quickScalingDesc}
            </p>
          </Link>

          <Link
            to="/multi-input/truth-table"
            className="group p-5 rounded-2xl bg-lab-card/80 border border-slate-700/80 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TableProperties size={22} />
            </div>
            <h3 className="font-bold text-white text-base mb-1 group-hover:text-purple-400 transition-colors flex items-center justify-between">
              <span>{t.nav.multiTruthTable}</span>
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bütün 6 qapı üçün birləşdirilmiş interaktiv cədvəl və CSV ixracı.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
