import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import {
  LINEARLY_SEPARABLE_DATA,
  runBatchTraining,
} from '../core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { TrendingUp, Table, Sparkles } from 'lucide-react';

export const ScalingAnalysisPage: React.FC = () => {
  const { t } = useTranslation();

  const [useLogScaleCombinations, setUseLogScaleCombinations] = useState(false);

  // 1. Combinations data for n = 2...10
  const combinationsData = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const n = i + 2;
      return {
        n,
        combinations: Math.pow(2, n),
      };
    });
  }, []);

  // 2. Parameters data: Perceptron (n+1) vs Counter MLP ((n+1)²) vs Cascaded MLP (9(n-1))
  const parametersData = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const n = i + 2;
      return {
        n,
        perceptron: n + 1,
        counterMLP: Math.pow(n + 1, 2),
        cascadedMLP: 9 * (n - 1),
      };
    });
  }, []);

  // 3. Hidden Neurons data: Counter n vs Cascaded 2(n-1)
  const hiddenNeuronsData = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const n = i + 2;
      return {
        n,
        counter: n,
        cascaded: 2 * (n - 1),
      };
    });
  }, []);

  // 4. Output Y = 1 rows per gate
  const outputRowsData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const n = i + 2; // n = 2...7 for readable scale
      const total = Math.pow(2, n);
      return {
        n,
        AND: 1,
        OR: total - 1,
        XOR: Math.pow(2, n - 1),
      };
    });
  }, []);

  // 6. Convergence Epochs vs n (real batch runs)
  const convergenceData = useMemo(() => {
    const andBatch = runBatchTraining('AND', 2, 7, 1.0, 100);
    const orBatch = runBatchTraining('OR', 2, 7, 1.0, 100);
    return andBatch.map((a, i) => ({
      n: a.n,
      AND: a.epochs,
      OR: orBatch[i]?.epochs ?? 1,
    }));
  }, []);

  // 7. Bias magnitude for AND: -(n - 0.5)
  const biasMagnitudeData = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const n = i + 2;
      return {
        n,
        bias: -(n - 0.5),
        absBias: n - 0.5,
      };
    });
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t.scalingPage.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {t.scalingPage.subtitle} — Riyazi düsturlar və real simulyasiyalarla sübut
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Combinations 2^n */}
        <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-white">
              {t.scalingPage.chart1Title}
            </span>
            <button
              type="button"
              onClick={() => setUseLogScaleCombinations(!useLogScaleCombinations)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-[10px] font-mono text-lab-accentBlue border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              {useLogScaleCombinations ? t.common.logScale : t.common.linearScale}
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinationsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="n" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis
                  scale={useLogScaleCombinations ? 'log' : 'auto'}
                  domain={useLogScaleCombinations ? [2, 2048] : ['auto', 'auto']}
                  stroke="#64748B"
                  fontSize={11}
                  fontFamily="monospace"
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="combinations"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#3B82F6' }}
                  name="2ⁿ kombinasiya"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            {t.scalingPage.chart1Insight}
          </p>
        </div>

        {/* Chart 2: Parameters Count */}
        <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold font-mono text-white block">
            {t.scalingPage.chart2Title}
          </span>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={parametersData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="n" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line
                  type="monotone"
                  dataKey="perceptron"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Perseptron (n+1)"
                />
                <Line
                  type="monotone"
                  dataKey="counterMLP"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  name="Sayğac MLP ((n+1)²)"
                />
                <Line
                  type="monotone"
                  dataKey="cascadedMLP"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  name="Zəncirvari MLP (9(n-1))"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            {t.scalingPage.chart2Insight}
          </p>
        </div>

        {/* Chart 3: Hidden Neurons for XOR */}
        <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold font-mono text-white block">
            {t.scalingPage.chart3Title}
          </span>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiddenNeuronsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="n" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Bar dataKey="counter" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Sayğac (n)" />
                <Bar dataKey="cascaded" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Zəncirvari (2(n-1))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            {t.scalingPage.chart3Insight}
          </p>
        </div>

        {/* Chart 4: Output Y = 1 rows */}
        <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold font-mono text-white block">
            {t.scalingPage.chart4Title}
          </span>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outputRowsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="n" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="AND" stroke="#3B82F6" strokeWidth={2} name="AND (1 sətir)" />
                <Line type="monotone" dataKey="OR" stroke="#10B981" strokeWidth={2} name="OR (2ⁿ-1 sətir)" />
                <Line type="monotone" dataKey="XOR" stroke="#EC4899" strokeWidth={2} name="XOR (2ⁿ⁻¹ sətir)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            {t.scalingPage.chart4Insight}
          </p>
        </div>

        {/* Chart 6: Real Convergence Epochs */}
        <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold font-mono text-white block">
            {t.scalingPage.chart6Title}
          </span>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convergenceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="n" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="AND" stroke="#3B82F6" strokeWidth={2} name="AND Dövrü" />
                <Line type="monotone" dataKey="OR" stroke="#10B981" strokeWidth={2} name="OR Dövrü" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            {t.scalingPage.chart6Insight}
          </p>
        </div>

        {/* Chart 7: Bias Magnitude Growth for AND */}
        <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold font-mono text-white block">
            {t.scalingPage.chart7Title}
          </span>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={biasMagnitudeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="n" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="bias"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  name="b = -(n - 0.5)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            {t.scalingPage.chart7Insight}
          </p>
        </div>
      </div>

      {/* Reference Table 5: Linearly Separable Functions vs Total Boolean Functions */}
      <div className="p-6 rounded-3xl bg-lab-card/80 border border-purple-500/30 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
          <Table size={18} />
          <span>{t.scalingPage.chart5Title}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">{t.scalingPage.tableColN}</th>
                <th className="py-2.5 px-4">{t.scalingPage.tableColTotal}</th>
                <th className="py-2.5 px-4">{t.scalingPage.tableColSeparable}</th>
                <th className="py-2.5 px-4">{t.scalingPage.tableColPercent}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {LINEARLY_SEPARABLE_DATA.map((row) => (
                <tr key={row.n} className={row.n === 2 ? 'bg-blue-950/20 font-bold' : ''}>
                  <td className="py-2.5 px-4 text-white">n = {row.n}</td>
                  <td className="py-2.5 px-4">{row.totalFunctions}</td>
                  <td className="py-2.5 px-4 text-emerald-400">{row.separableFunctions}</td>
                  <td className="py-2.5 px-4 text-purple-300 font-bold">{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-300 font-mono leading-relaxed p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          {t.scalingPage.chart5Insight}
        </p>
      </div>
    </div>
  );
};
