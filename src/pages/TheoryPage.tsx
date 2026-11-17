import React from 'react';
import { useTranslation } from '../i18n';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

export const TheoryPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.theoryPage.title} (2-Girişli Baza)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            2-girişli neyron modelləri, həndəsi ayrılma və Minski-Peypert teoremi
          </p>
        </div>

        <Link
          to="/multi-input/theory"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-700/60 text-purple-300 text-xs font-mono font-bold hover:bg-purple-900/60 transition-all"
        >
          <span>{t.nav.extendedTheory}</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-5">
        {/* Section 1 */}
        <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen size={18} className="text-lab-accentBlue" />
            <span>2D Müstəvidə Xətti Ayrılma (Linear Separability)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            İki girişli tək Perseptronun qərar sərhədi 2D dekart müstəvisində düz xətdir:
          </p>
          <div className="p-3 rounded-xl bg-slate-900 font-mono text-sm text-center text-blue-400">
            W₁·X₁ + W₂·X₂ + b = 0
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Müstəvidə 4 nöqtə mövcuddur: (0,0), (0,1), (1,0) və (1,1). Əgər çıxışı 1 olan nöqtələri çıxışı 0 olan nöqtələrdən tək bir düz xətlə tam ayırmaq mümkündürsə, həmin funksiya <strong>xətti ayrıla biləndir</strong>.
          </p>
        </div>

        {/* Section 2 */}
        <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers size={18} className="text-rose-400" />
            <span>Niyə XOR Tək Xətlə Ayrıla Bilmir? (1969 Tarixi Mərhələ)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            XOR funksiyasında:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1 font-mono">
            <li>(0,0) → 0</li>
            <li>(1,1) → 0</li>
            <li>(0,1) → 1</li>
            <li>(1,0) → 1</li>
          </ul>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Gördüyünüz kimi, Y=1 nöqtələri bir diaqonalda, Y=0 nöqtələri isə digər diaqonalda yerləşir. İstənilən düz xətt çəksəniz, hər iki diaqonalı eyni anda ayıra bilməzsiniz. 1969-cu ildə Marvin Minski və Seymur Peypert özlərinin <em>"Perceptrons"</em> kitabında bunu riyazi olaraq sübut etdilər. Bu, tək perseptronun məhdudiyyətini göstərdi və süni intellektdə Çoxlaylı Perseptronların (MLP) yaranmasına yol açdı.
          </p>
        </div>

        {/* Section 3 */}
        <div className="p-6 rounded-3xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers size={18} className="text-purple-400" />
            <span>Çoxlaylı Perseptronun (MLP) Həlli</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            MLP gizli laydakı iki neyron vasitəsilə iki fərqli qərar xətti yaradır:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-blue-400 font-bold block mb-1">Xətt 1 (h₁):</span>
              X₁ - X₂ - 0.5 = 0
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-purple-400 font-bold block mb-1">Xətt 2 (h₂):</span>
              -X₁ + X₂ - 0.5 = 0
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Çıxış neyronu bu iki gizli neyronun nəticəsini OR kimi birləşdirir (Y = step(h₁ + h₂ - 0.5)). Beləliklə, qeyri-xətti məsələ iki xətti addımla tam həll olunur.
          </p>
        </div>
      </div>
    </div>
  );
};
