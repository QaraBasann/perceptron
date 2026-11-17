import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import {
  MultiGateType,
  trainPerceptron,
  runBatchTraining,
  BatchTrainingResult,
  TrainingResult,
} from '../core';
import { NSelector } from '../components';
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
} from 'recharts';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Zap,
} from 'lucide-react';

export const TrainingLabPage: React.FC = () => {
  const { t } = useTranslation();

  const [n, setN] = useState(3);
  const [gate, setGate] = useState<MultiGateType>('AND');
  const [learningRate, setLearningRate] = useState<number>(1.0);
  const [maxEpochs, setMaxEpochs] = useState<number>(100);

  // Training execution state
  const [trainResult, setTrainResult] = useState<TrainingResult | null>(null);
  const [batchResults, setBatchResults] = useState<BatchTrainingResult[] | null>(null);
  const [isRunningBatch, setIsRunningBatch] = useState(false);

  // Run training when user clicks run or parameters change
  const handleRunTraining = () => {
    const res = trainPerceptron({
      gate,
      n,
      learningRate,
      maxEpochs,
    });
    setTrainResult(res);
  };

  useEffect(() => {
    handleRunTraining();
  }, [n, gate, learningRate, maxEpochs]);

  // Run batch experiment for n = 2 ... 8
  const handleRunBatch = () => {
    setIsRunningBatch(true);
    setTimeout(() => {
      const bRes = runBatchTraining(gate, 2, 8, learningRate, maxEpochs);
      setBatchResults(bRes);
      setIsRunningBatch(false);
    }, 50);
  };

  const gatesList: MultiGateType[] = ['AND', 'NAND', 'OR', 'NOR', 'XOR', 'XNOR'];

  // Prepare chart data from training history
  const chartData = trainResult?.history.map((log) => {
    const entry: Record<string, number> = {
      epoch: log.epoch,
      errors: log.errors,
      accuracy: log.accuracy,
      bias: log.bias,
    };
    log.weights.forEach((w, i) => {
      entry[`W${i + 1}`] = w;
    });
    return entry;
  }) || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.trainingPage.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Rozenblatt Perseptron Öyrənmə Qaydasının (PLA) deterministik simulyasiyası
          </p>
        </div>

        {/* Gate Selector */}
        <div className="flex flex-wrap gap-1.5 bg-lab-card/80 p-1.5 rounded-2xl border border-slate-700">
          {gatesList.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGate(g);
                setBatchResults(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                gate === g
                  ? 'bg-lab-accentBlue text-white shadow-glow-blue/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* N Selector */}
      <NSelector n={n} onChange={setN} min={2} max={8} />

      {/* Training Controls Card */}
      <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {/* Learning Rate */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{t.common.learningRate}:</span>
              <select
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-white font-bold"
              >
                <option value={0.1}>0.1</option>
                <option value={0.5}>0.5</option>
                <option value={1.0}>1.0 (Standart)</option>
                <option value={2.0}>2.0</option>
              </select>
            </div>

            {/* Max Epochs */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{t.common.maxEpochs}:</span>
              <select
                value={maxEpochs}
                onChange={(e) => setMaxEpochs(parseInt(e.target.value, 10))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-white font-bold"
              >
                <option value={50}>50</option>
                <option value={100}>100 (Standart)</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunTraining}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lab-accentBlue hover:bg-blue-600 text-white font-mono font-bold text-xs shadow-glow-blue/30 transition-all"
            >
              <Play size={14} />
              <span>{t.common.run}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLearningRate(1.0);
                setMaxEpochs(100);
                handleRunTraining();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={t.common.reset}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Convergence Status Banner */}
        {trainResult && (
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono ${
              trainResult.converged
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {trainResult.converged ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : (
                <AlertTriangle size={18} className="text-rose-400" />
              )}
              <span className="font-bold text-sm">
                {trainResult.converged
                  ? `Alqoritm ${trainResult.convergedEpoch}-ci dövrdə tam yığıldı (0 xəta)!`
                  : `${maxEpochs} dövr ərzində yığılma baş vermədi (Xətti ayrıla bilmir)!`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span>
                Son dəqiqlik:{' '}
                <strong className="text-white">
                  {trainResult.finalAccuracy.toFixed(1)}%
                </strong>
              </span>
              <span>
                Yekun bias:{' '}
                <strong className="text-white">{trainResult.finalBias.toFixed(1)}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Errors per Epoch Chart */}
        <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-300 uppercase">
              {t.trainingPage.errorsChartTitle}
            </span>
            <span className="text-[10px] font-mono text-slate-500">Xətalar (0-a enməlidir)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="epoch" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="errors"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={false}
                  name="Səhv sayı"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy per Epoch Chart */}
        <div className="p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-300 uppercase">
              {t.trainingPage.accuracyChartTitle}
            </span>
            <span className="text-[10px] font-mono text-slate-500">% (100%-ə çatmalıdır)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="epoch" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={false}
                  name="Dəqiqlik (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weights & Bias Trajectory Chart */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-300 uppercase">
              {t.trainingPage.weightsChartTitle}
            </span>
            <span className="text-[10px] font-mono text-slate-500">W₁, W₂ ... və bias b</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="epoch" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                />
                {Array.from({ length: n }, (_, i) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={`W${i + 1}`}
                    stroke={['#3B82F6', '#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B', '#10B981'][i % 6]}
                    strokeWidth={1.8}
                    dot={false}
                    name={`W${i + 1}`}
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="bias"
                  stroke="#A855F7"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  dot={false}
                  name="Bias (b)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Batch Experiment Section */}
      <div className="p-6 rounded-3xl bg-lab-card/80 border border-purple-500/30 backdrop-blur-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FlaskConical size={18} className="text-lab-accentPurple" />
              <span>{t.trainingPage.batchTitle}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.trainingPage.batchDesc} ({gate} qapısı üçün)
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunBatch}
            disabled={isRunningBatch}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono font-bold text-xs shadow-glow-purple/40 transition-all shrink-0"
          >
            <Zap size={14} />
            <span>{isRunningBatch ? 'Hesablanır...' : t.trainingPage.runBatch}</span>
          </button>
        </div>

        {batchResults && (
          <div className="space-y-4 pt-2 border-t border-slate-800 animate-fadeIn">
            {/* Batch Chart */}
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchResults} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="n" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                  <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                  />
                  <Bar
                    dataKey="epochs"
                    fill={gate === 'XOR' || gate === 'XNOR' ? '#EF4444' : '#8B5CF6'}
                    radius={[6, 6, 0, 0]}
                    name="Tələb olunan dövr"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Batch Results Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-center font-mono text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Giriş sayı (n)</th>
                    <th className="py-2 px-3">Kombinasiyalar (2ⁿ)</th>
                    <th className="py-2 px-3">Yığılma?</th>
                    <th className="py-2 px-3">Tələb olunan Dövr</th>
                    <th className="py-2 px-3">Dəqiqlik (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {batchResults.map((r) => (
                    <tr key={r.n}>
                      <td className="py-2 px-3 font-bold text-white">n = {r.n}</td>
                      <td className="py-2 px-3">{Math.pow(2, r.n)}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            r.converged
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {r.converged ? 'Bəli' : 'Xeyr'}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-bold">{r.epochs}</td>
                      <td className="py-2 px-3">{r.accuracy.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
