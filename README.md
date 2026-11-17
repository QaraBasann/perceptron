# Multi-Input Logic Gates & Perceptron Lab (n-Inputs)

> **Universitet Tədris Simulyatoru / Educational AI Laboratory Simulator**  
> Bu tətbiq universitet müəlliminin sualına elmi və təcrübi cavab vermək üçün hazırlanmışdır:  
> *"Girişlərin sayı artdıqda nə baş verir? Nəticələr necə dəyişir və sistem necə işləyir?"*

---

## 🌟 Layihənin İcmalı (Project Overview)

Tətbiq **hər iki PRD spesifikasiyasını** (PRD 1: 2-girişli baza sistemi və PRD 2: n = 2...10 çoxgirişli genişləndirmə laboratoriyasını) vahid veb tətbiq daxilində birləşdirir:

1. **2-Girişli Baza Modul (Base 2-Input Module):**
   - 2-girişli məntiq qapıları (AND, NAND, OR, NOR, XOR, XNOR, NOT)
   - 2-girişli tək Perseptron simulyatoru və 2D qərar xətti vizualizasiyası ($W_1 \cdot X_1 + W_2 \cdot X_2 + b = 0$)
   - 2-gizli-neyronlu klassik XOR / XNOR MLP ($h_1 = \text{step}(X_1 - X_2 - 0.5)$, $h_2 = \text{step}(-X_1 + X_2 - 0.5)$, $Y = \text{step}(h_1 + h_2 - 0.5)$)
   - 2-girişli doğruluq cədvəli laboratoriyası, nəzəriyyə və yekun

2. **Çoxgirişli Laboratoriya (Multi-Input n-Input Lab, n = 2...10):**
   - **n-Girişli Məntiq Qapıları:** $2^n$ kombinasiyalı tam doğruluq cədvəli, filtrasiya və $s$ (1-lərin cəmi) analizi
   - **n-Girişli Perseptron Simulyatoru:** Analitik parametrlər ($AND: W=+1, b=-(n-0.5)$; $OR: W=+1, b=-0.5$), 1D cəm xətti və 3D kub proyeksiyası, işlək bias intervalının avtomatik hesablanması
   - **n-Girişli XOR / XNOR MLP:** Deterministik Sayğac Memarlığı ($n$ gizli neyron, növbələşən çəkilər $+1, -1, +1, -1\dots$) və Zəncirvari XOR memarlığı ($2(n-1)$ gizli neyron)
   - **Təlim Laboratoriyası (PLA):** Rozenblatt Perseptron Öyrənmə Qaydasının simulyasiyası, $n=2\dots8$ üçün toplu sınaq (XOR-un niyə yığılmadığının canlı sübutu)
   - **Ölçəklənmə Analizi (Scaling Analysis):** 7 dinamik Recharts qrafiki (eksponensial artım, parametr mürəkkəbliyi, xətti ayrıla bilən funksiyaların referans cədvəli)
   - **n-Girişli Doğruluq Cədvəli:** 1024 sətirə qədər səhifələmə və CSV ixracı
   - **Genişləndirilmiş Nəzəriyyə & Yekun Müqayisə:** Müəllimin sualına addım-addım elmi cavablar

---

## 🚀 Texnoloji Yığın (Tech Stack)

- **Frontend:** React 18 + TypeScript + Vite
- **Dizayn və Stillər:** Tailwind CSS (Dark AI Laboratory Theme, Glassmorphism, Deep Navy `#080C14`, Neon Blue `#3B82F6`, Purple `#8B5CF6`)
- **İkonlar və İnteqrasiya:** Lucide React
- **Animasiyalar:** Framer Motion
- **Qrafiklər:** Recharts
- **Naviqasiya:** React Router DOM (v6)
- **Vahid Testlər:** Vitest (100% test əhatəsi, bütün $n=1\dots10$ üçün riyazi təsdiq)
- **Beynəlmiləlləşdirmə (i18n):** Azərbaycan (Defolt) və İngilis dilləri, `localStorage` yaddaşı, ani keçid

---

## 🛠️ Lokal Quraşdırma və İcra (Local Run)

Layihəni lokal mühitinizdə işə salmaq üçün:

```bash
# 1. Asılılıqları quraşdırın
npm install

# 2. İnkişaf serverini işə salın
npm run dev

# 3. İstehsal (Production) yığımını hazırlayın
npm run build

# 4. Bütün vahid testləri icra edin
npm run test
```

İnkişaf serveri işə düşdükdən sonra brauzerinizdə `http://localhost:5173` ünvanını açın.

---

## ☁️ Render Deployment Təlimatı (Step-by-Step on Render)

Bu tətbiq 100% müştəri tərəfli (client-side) statik veb saytdır və Render-in ödənişsiz **Static Site** xidmətində problemsiz işləyir.

### Addım-addım Təlimat:

1. **Kodu GitHub-a yükləyin:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Multi-Input Logic Gates & Perceptron Lab"
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

2. **Render Dashboard-a daxil olun:**
   - [render.com](https://render.com) ünvanında daxil olun.
   - **New +** düyməsini sıxın və **Static Site** seçin.

3. **GitHub Repositoriyasını bağlayın:**
   - Tətbiqin yerləşdiyi repozitoriyanı seçin.

4. **Konfiqurasiya Parametrlərini daxil edin:**
   - **Name:** `perceptron-lab` (və ya istədiyiniz ad)
   - **Branch:** `main`
   - **Build Command:** `npm ci && npm run build`
   - **Publish Directory:** `dist`

5. **Rewrite / Redirect Qaydası (SPA üçün):**
   - Render layihədəki `render.yaml` blueprintini və `public/_redirects` faylını avtomatik oxuyacaq:
     - Source: `/*`
     - Destination: `/index.html`
     - Status: `200`
   - Bu qayda `/perceptron`, `/multi-input/gates` kimi daxili marşrutlarda səhifəni yenilədikdə 404 xətası yaranmasının qarşısını alır.

6. **Create Static Site** düyməsini sıxın. 1-2 dəqiqə ərzində saytınız canlı olaraq istifadəyə veriləcək!

*(Qeyd: Layihə eyni zamanda `vercel.json` və `public/_redirects` fayllarını ehtiva etdiyi üçün Netlify və ya Vercel platformalarına da heç bir əlavə sazlama olmadan birbaşa deploy edilə bilər.)*

---

## 🧪 Riyazi Dəqiqlik və Vahid Testlər (Testing & Verification)

Layihə PRD 2 bölmə 10-da tələb olunan bütün meyarlar üzrə Vitest ilə test edilmişdir:
- **Tək Perseptron:** $n = 1\dots10$ üçün AND, NAND, OR, NOR qapıları analitik parametrlərlə bütün $2^n$ hallarda 100% dəqiqlik göstərir.
- **Sayğac MLP (Counter Neuron):** $n = 2\dots10$ üçün XOR və XNOR paritet funksiyalarını bütün $2^n$ hallarda 100% dəqiqliklə həll edir.
- **Zəncirvari XOR:** $n = 2\dots10$ üçün bütün kombinasiyalarda çıxışı dəqiq generasiya edir.
- **Təlim Yığılması (Convergence):** AND/OR/NAND/NOR qapıları sonlu dövrdə yığılır, XOR isə xətti ayrıla bilmədiyi üçün heç vaxt yığılmır.
- **CSV İxracı:** Bütün $2^n$ sətirlər və düzgün başlıqlar generasiya olunur.

---

## 🎓 Universitet Tədqiqat Nəticəsi (Scientific Conclusions)

1. **Baza qapıların xassəsi dəyişmir:** $n$ artdıqca AND, NAND, OR, NOR xətti ayrıla bilən olaraq qalır ($n+1$ parametr kifayətdir).
2. **XOR/XNOR problemi aradan qalxmır:** Girişlərin artması paritet problemini tək perseptron üçün asanlaşdırmır; əksinə, layların sayı artdığı üçün MLP mütləq böyüməlidir ($n$ gizli neyron, $(n+1)^2$ parametr).
3. **Kombinator partlayış:** Hallar fəzası $2^n$ sürətilə böyüyür ($n=10$ üçün 1024 sətir).
4. **Xətti ayrıla bilən funksiyaların payı sıfıra düşür:** Ümumi $2^{2^n}$ Bul funksiyası arasında tək perseptronun həll edə biləcəyi funksiyaların payı sürətlə sıfıra yaxınlaşır ($n=5$-də cəmi 0.0022%), bu isə Çoxlaylı və Dərin Neyron Şəbəkələrinin (Deep Learning) zəruriliyini sübut edir.
