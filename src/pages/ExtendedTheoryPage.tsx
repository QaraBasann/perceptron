import React from 'react';
import { useTranslation } from '../i18n';
import { BookOpen, Layers, GitBranch, Cpu, Network, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ExtendedTheoryPage: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t.theoryPage.sec1Title,
      text: t.theoryPage.sec1Text,
      icon: Layers,
      color: 'text-blue-400',
      formula: 'Vəziyyətlər fəzası: |S| = 2 × 2 × ... × 2 = 2ⁿ',
    },
    {
      title: t.theoryPage.sec2Title,
      text: t.theoryPage.sec2Text,
      icon: GitBranch,
      color: 'text-purple-400',
      formula: 'z = Σ_{i=1}^n (X_i · W_i) + b,   Y = step(z) = { 1 əgər z ≥ 0; 0 əgər z < 0 }',
    },
    {
      title: t.theoryPage.sec3Title,
      text: t.theoryPage.sec3Text,
      icon: ShieldCheck,
      color: 'text-cyan-400',
      formula: 'Hipermüstəvi tənliyi: W₁·X₁ + W₂·X₂ + ... + W_n·X_n + b = 0',
    },
    {
      title: t.theoryPage.sec4Title,
      text: t.theoryPage.sec4Text,
      icon: Cpu,
      color: 'text-emerald-400',
      formula: 'AND(n): W_i = +1, b = -(n - 0.5)  =>  z = s - n + 0.5 (Y = 1 yalnız s = n olduqda)',
    },
    {
      title: t.theoryPage.sec5Title,
      text: t.theoryPage.sec5Text,
      icon: AlertTriangle,
      color: 'text-rose-400',
      formula: 'Paritet: s = 0 (Y=0), s = 1 (Y=1), s = 2 (Y=0), s = 3 (Y=1) ... (Tək hipermüstəvi ayıra bilməz)',
    },
    {
      title: t.theoryPage.sec6Title,
      text: t.theoryPage.sec6Text,
      icon: Network,
      color: 'text-purple-400',
      formula: 'h_k = step(s - (k - 0.5)),   Y_{XOR} = step(h₁ - h₂ + h₃ - h₄ + ... - 0.5)',
      example: 'n = 3, s = 2 nümunəsi: h₁ = 1, h₂ = 1, h₃ = 0  =>  Cəm = 1 - 1 + 0 = 0  =>  Y = step(0 - 0.5) = 0 (Düzgün, cüt paritet).',
    },
    {
      title: t.theoryPage.sec7Title,
      text: t.theoryPage.sec7Text,
      icon: TrendingUp,
      color: 'text-amber-400',
      formula: 'Perseptron: n + 1 parametrlər  |  Sayğac MLP: (n + 1)² parametrlər  |  Zəncir: 9(n - 1)',
    },
    {
      title: t.theoryPage.sec8Title,
      text: t.theoryPage.sec8Text,
      icon: BookOpen,
      color: 'text-blue-400',
      formula: 'Real AI: n >> 10 (milyonlarla giriş) => 2ⁿ cədvəl qeyri-mümkündür => Dərin Laylar & Backpropagation',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t.theoryPage.title} (n-Girişli Genişləndirilmiş)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Universitet tələbələri üçün riyazi əsaslar, sübutlar və dərin öyrənməyə keçid
        </p>
      </div>

      <div className="space-y-5">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3"
            >
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
                <Icon size={20} className={sec.color} />
                <span>{sec.title}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {sec.text}
              </p>

              {sec.formula && (
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-lab-accentBlueGlow overflow-x-auto">
                  {sec.formula}
                </div>
              )}

              {sec.example && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] font-mono text-purple-200">
                  <strong>İşlənmiş misal:</strong> {sec.example}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
