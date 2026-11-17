import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  LayoutDashboard,
  Cpu,
  GitBranch,
  Network,
  TableProperties,
  BookOpen,
  Award,
  Layers,
  GraduationCap,
  TrendingUp,
  FlaskConical,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const baseLinks = [
    { to: '/', label: t.nav.dashboard, icon: LayoutDashboard },
    { to: '/logic-gates', label: t.nav.gates, icon: Cpu },
    { to: '/perceptron', label: t.nav.perceptron, icon: GitBranch },
    { to: '/xor-mlp', label: t.nav.xorMlp, icon: Network },
    { to: '/truth-table', label: t.nav.truthTable, icon: TableProperties },
    { to: '/theory', label: t.nav.theory, icon: BookOpen },
    { to: '/conclusion', label: t.nav.conclusion, icon: Award },
  ];

  const multiLinks = [
    { to: '/multi-input', label: t.nav.multiOverview, icon: Layers, badge: 'n = 2..10' },
    { to: '/multi-input/gates', label: t.nav.multiGates, icon: Cpu },
    { to: '/multi-input/perceptron', label: t.nav.multiPerceptron, icon: GitBranch },
    { to: '/multi-input/xor-mlp', label: t.nav.multiXorMlp, icon: Network },
    { to: '/multi-input/training', label: t.nav.trainingLab, icon: FlaskConical, badge: 'PLA' },
    { to: '/multi-input/scaling', label: t.nav.scalingAnalysis, icon: TrendingUp },
    { to: '/multi-input/truth-table', label: t.nav.multiTruthTable, icon: TableProperties },
    { to: '/multi-input/theory', label: t.nav.extendedTheory, icon: BookOpen },
    { to: '/multi-input/conclusion', label: t.nav.finalConclusion, icon: GraduationCap },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-lab-card/95 border-r border-lab-cardBorder/80 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-lab-cardBorder/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lab-accentBlue to-lab-accentPurple flex items-center justify-center shadow-glow-blue/50 text-white font-black font-mono">
              AI
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-tight leading-tight">
                {t.nav.appTitle}
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                {t.nav.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Base 2-Input Module */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t.nav.baseGroup}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                2D
              </span>
            </div>
            <nav className="space-y-1">
              {baseLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-lab-accentBlue/20 text-white border border-lab-accentBlue/50 shadow-glow-blue/20 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Multi-Input Lab Module */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-lab-accentPurple uppercase tracking-wider">
                {t.nav.multiGroup}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/50 text-purple-300">
                n = 2..10
              </span>
            </div>
            <nav className="space-y-1">
              {multiLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/multi-input'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-lab-accentBlue/20 to-lab-accentPurple/20 text-white border border-lab-accentPurple/50 shadow-glow-purple/20 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-lab-accentBlueGlow border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Language Switcher */}
        <div className="p-4 border-t border-lab-cardBorder/60 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">{t.common.status}: Onlayn</span>
          <LanguageSwitcher />
        </div>
      </aside>
    </>
  );
};
