import React from 'react';
import { useTranslation } from '../i18n';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle2, XCircle } from 'lucide-react';

export const ConclusionPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t.conclusionPage.title} (2-Girişli Modul)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Klassik 2-girişli neyron tədqiqatının yekunu
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award size={20} className="text-lab-accentBlue" />
          <span>2-Girişli Qapıların Xülasəsi</span>
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Qapı</th>
                <th className="py-2.5 px-3">Xətti Ayrıla Bilir?</th>
                <th className="py-2.5 px-3">Tək Perseptron</th>
                <th className="py-2.5 px-3">MLP Tələb Olunur?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">AND</td>
                <td className="py-2.5 px-3 text-emerald-400">Bəli</td>
                <td className="py-2.5 px-3 text-emerald-400">Həll edir (W=[1,1], b=-1.5)</td>
                <td className="py-2.5 px-3 text-slate-500">Xeyr</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">NAND</td>
                <td className="py-2.5 px-3 text-emerald-400">Bəli</td>
                <td className="py-2.5 px-3 text-emerald-400">Həll edir (W=[-1,-1], b=1.5)</td>
                <td className="py-2.5 px-3 text-slate-500">Xeyr</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">OR</td>
                <td className="py-2.5 px-3 text-emerald-400">Bəli</td>
                <td className="py-2.5 px-3 text-emerald-400">Həll edir (W=[1,1], b=-0.5)</td>
                <td className="py-2.5 px-3 text-slate-500">Xeyr</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">NOR</td>
                <td className="py-2.5 px-3 text-emerald-400">Bəli</td>
                <td className="py-2.5 px-3 text-emerald-400">Həll edir (W=[-1,-1], b=0.5)</td>
                <td className="py-2.5 px-3 text-slate-500">Xeyr</td>
              </tr>
              <tr className="bg-rose-950/20">
                <td className="py-2.5 px-3 font-bold text-white">XOR</td>
                <td className="py-2.5 px-3 text-rose-400">Xeyr</td>
                <td className="py-2.5 px-3 text-rose-400">Həll edə BİLMİR!</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">Bəli (2 gizli neyron)</td>
              </tr>
              <tr className="bg-rose-950/20">
                <td className="py-2.5 px-3 font-bold text-white">XNOR</td>
                <td className="py-2.5 px-3 text-rose-400">Xeyr</td>
                <td className="py-2.5 px-3 text-rose-400">Həll edə BİLMİR!</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">Bəli (2 gizli neyron)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bridge to Extension */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Bu baza araşdırma göstərdi ki, 2 giriş üçün XOR həll olunmur. Bəs girişlərin sayı 3, 4, ... 10 olduqda nə baş verir?
          </p>
          <Link
            to="/multi-input"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-lab-accentBlue to-lab-accentPurple text-white font-bold text-sm shadow-glow-purple/30 hover:opacity-95 transition-all"
          >
            <span>Çoxgirişli Laboratoriyaya Keçid (n = 2 ... 10)</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
