import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { NSelector } from '../components';
import { Award, CheckCircle2, XCircle, HelpCircle, GraduationCap } from 'lucide-react';

export const FinalConclusionPage: React.FC = () => {
  const { t } = useTranslation();
  const [n, setN] = useState(3);

  const perceptronParams = n + 1;
  const counterMlpParams = Math.pow(n + 1, 2);
  const cascadedMlpParams = 9 * (n - 1);

  const comparisonRows = [
    {
      gate: 'AND',
      singlePerceptron: true,
      mlp: true,
      paramsPerceptron: `${n} + 1 = ${perceptronParams}`,
      paramsMlp: `${counterMlpParams} (${t.conclusionPage.notNeeded})`,
      note: 'W = +1, b = -(n - 0.5)',
    },
    {
      gate: 'NAND',
      singlePerceptron: true,
      mlp: true,
      paramsPerceptron: `${n} + 1 = ${perceptronParams}`,
      paramsMlp: `${counterMlpParams} (${t.conclusionPage.notNeeded})`,
      note: 'W = -1, b = +(n - 0.5)',
    },
    {
      gate: 'OR',
      singlePerceptron: true,
      mlp: true,
      paramsPerceptron: `${n} + 1 = ${perceptronParams}`,
      paramsMlp: `${counterMlpParams} (${t.conclusionPage.notNeeded})`,
      note: 'W = +1, b = -0.5',
    },
    {
      gate: 'NOR',
      singlePerceptron: true,
      mlp: true,
      paramsPerceptron: `${n} + 1 = ${perceptronParams}`,
      paramsMlp: `${counterMlpParams} (${t.conclusionPage.notNeeded})`,
      note: 'W = -1, b = +0.5',
    },
    {
      gate: 'XOR (Paritet)',
      singlePerceptron: false,
      mlp: true,
      paramsPerceptron: '-',
      paramsMlp: `Sayğac: ${counterMlpParams} | Zəncir: ${cascadedMlpParams}`,
      note: 'Paritet qatları tək hipermüstəvi ilə ayrıla bilməz',
    },
    {
      gate: 'XNOR',
      singlePerceptron: false,
      mlp: true,
      paramsPerceptron: '-',
      paramsMlp: `Sayğac: ${counterMlpParams} | Zəncir: ${cascadedMlpParams}`,
      note: 'Tərs paritet, tək hipermüstəvi ilə ayrıla bilməz',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t.conclusionPage.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {t.conclusionPage.subtitle}
        </p>
      </div>

      {/* Instructor's Question Highlight */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-lab-card border border-purple-500/30 backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
          <HelpCircle size={16} />
          <span>{t.conclusionPage.instructorQuestion}</span>
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          Tədqiqatımız sübut etdi ki, girişlərin sayının artması (n = 2 ... 10) sistemin həndəsi təbiətini dəyişmir, lakin ölçəklənmə mürəkkəbliyini eksponensial artırır.
        </p>
      </div>

      {/* Dynamic N-Selector */}
      <NSelector n={n} onChange={setN} min={2} max={10} />

      {/* Dynamic Comparison Table */}
      <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GraduationCap size={18} className="text-lab-accentBlue" />
            <span>Müqayisə Cədvəli (n = {n} üçün hesablanmışdır)</span>
          </h2>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
            2^{n} = {Math.pow(2, n)} sətir
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{t.conclusionPage.colGate}</th>
                <th className="py-2.5 px-3">{t.conclusionPage.colSingle}</th>
                <th className="py-2.5 px-3">{t.conclusionPage.colMLP}</th>
                <th className="py-2.5 px-3">{t.conclusionPage.colParamsSingle}</th>
                <th className="py-2.5 px-3">{t.conclusionPage.colParamsMLP}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {comparisonRows.map((r, i) => (
                <tr
                  key={i}
                  className={!r.singlePerceptron ? 'bg-rose-950/20' : ''}
                >
                  <td className="py-2.5 px-3 font-bold text-white">{r.gate}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        r.singlePerceptron ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {r.singlePerceptron ? (
                        <>
                          <CheckCircle2 size={13} /> {t.common.yes}
                        </>
                      ) : (
                        <>
                          <XCircle size={13} /> {t.common.no}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 size={13} /> {t.common.yes}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{r.paramsPerceptron}</td>
                  <td className="py-2.5 px-3 font-mono text-purple-300">{r.paramsMlp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Findings List */}
      <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award size={18} className="text-emerald-400" />
          <span>{t.conclusionPage.keyFindingsTitle}</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <h3 className="font-bold text-blue-400">{t.conclusionPage.point1Title}</h3>
            <p className="text-slate-300 leading-relaxed">{t.conclusionPage.point1Desc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <h3 className="font-bold text-rose-400">{t.conclusionPage.point2Title}</h3>
            <p className="text-slate-300 leading-relaxed">{t.conclusionPage.point2Desc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <h3 className="font-bold text-purple-400">{t.conclusionPage.point3Title}</h3>
            <p className="text-slate-300 leading-relaxed">{t.conclusionPage.point3Desc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <h3 className="font-bold text-amber-400">{t.conclusionPage.point4Title}</h3>
            <p className="text-slate-300 leading-relaxed">{t.conclusionPage.point4Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
