# LingoGlass

[![CI](https://github.com/abdimuratovv/lingoglass/actions/workflows/ci.yml/badge.svg)](https://github.com/abdimuratovv/lingoglass/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-E63946.svg)](LICENSE)

Ingliz tili o'rganish platformasi uchun frontend dashboard prototipi. Dizayn konsepsiyasi — _Light Theme Liquid Glassmorphism_: shaffof/blur'langan panellar va `layoutId` orqali "suyuq" animatsiyali navigatsiya indikatori.

> **Loyiha holati:** UI maketi + Supabase auth infratuzilmasi (signup/login/logout, protected route). Backend haqiqiy loyihaga hali ulanmagan — `.env.local` to'ldirilmaguncha faqat `/login` sahifasi ochiladi, real autentifikatsiya ishlamaydi. Kurslar/leaderboard ma'lumoti hamon kodga hardcoded ([`src/data/courses.ts`](src/data/courses.ts)). Boshlang'ich Supabase schema qoralamasi [`supabase/migrations/`](supabase/migrations/) da bor, lekin hech qanday loyihaga qo'llanmagan.

## Texnologiyalar

| Qatlam     | Yechim                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| UI         | React 19 + TypeScript 5.8 (`strict`)                                    |
| Build      | Vite 6                                                                  |
| Routing    | `react-router-dom` 7 (client-side SPA)                                  |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`) + custom glass CSS                |
| Animatsiya | `motion` (Framer Motion) — `layoutId` shared-layout                     |
| Ikonkalar  | `lucide-react`                                                          |
| Backend    | Supabase (`@supabase/supabase-js`) — auth ulangan, DB hali qo'llanmagan |
| Sifat      | ESLint 10 (flat config) + Prettier                                      |

## Ishga tushirish

**Talab:** Node.js 22.13+ (ESLint 10 talabi). Repo ildizida [`.nvmrc`](.nvmrc) bor — `nvm use` kifoya.

```bash
npm install
cp .env.example .env.local   # keyin VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY'ni to'ldiring
npm run dev
```

`.env.local` to'ldirilmasa ham dev server ochiladi — faqat `/login` sahifasi ko'rinadi, tizimga kirib bo'lmaydi (konsolda ogohlantirish chiqadi). Supabase loyihasi va kalitlar haqida [Backend (Supabase)](#backend-supabase) bo'limiga qarang.

Dev server: <http://localhost:3000>

## Buyruqlar

| Buyruq                 | Vazifasi                            |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Dev server (port 3000)              |
| `npm run build`        | Production build (`dist/`)          |
| `npm run preview`      | Build'ni lokal ko'rish (port 4173)  |
| `npm run lint`         | ESLint                              |
| `npm run typecheck`    | `tsc --noEmit`                      |
| `npm run format`       | Prettier — fayllarni formatlash     |
| `npm run format:check` | Prettier — formatni tekshirish (CI) |

Har push va PR'da [GitHub Actions](.github/workflows/ci.yml) shu to'rttasini (lint → typecheck → format:check → build) avtomatik ishga tushiradi.

## Marshrutlar

| Yo'l                 | Sahifa                                                      | Himoyalangan? |
| -------------------- | ----------------------------------------------------------- | :-----------: |
| `/login`             | Kirish / ro'yxatdan o'tish (Supabase auth)                  |       —       |
| `/`                  | Dashboard — learning path, skill kartalari, recent activity |      ✅       |
| `/courses`           | My Courses — kurslar grid'i                                 |      ✅       |
| `/courses/:courseId` | Course Detail — darslar ro'yxati va progress                |      ✅       |
| `/leaderboard`       | Leaderboard — top-3 podium + reyting                        |      ✅       |
| `/settings`          | Settings — 4 ta tab                                         |      ✅       |
| `/admin`             | Admin — content / quizzes / users tab'lari                  |      ✅       |

Himoyalangan marshrutlarga sessiyasiz kirilsa `/login`ga redirect qilinadi ([`ProtectedRoute`](src/components/ProtectedRoute.tsx)), kirgandan keyin qaysi sahifadan kelgan bo'lsa o'sha yerga qaytariladi. Noma'lum yo'l `/` ga, mavjud bo'lmagan `courseId` esa `/courses` ga redirect qiladi.

## Loyiha tuzilishi

```
src/
├── main.tsx                 # BrowserRouter + AuthProvider + createRoot entry point
├── App.tsx                  # /login + himoyalangan AppShell (Sidebar+TopNav+MobileNav) <Routes>
├── index.css                # Tailwind @theme tokenlar + glassmorphism CSS sinflari
├── vite-env.d.ts             # import.meta.env uchun TS turlari (VITE_SUPABASE_*)
├── lib/supabaseClient.ts     # Supabase klienti + isSupabaseConfigured flag
├── context/
│   ├── authContext.ts         # AuthContext + AuthContextValue turi (faqat non-komponent)
│   ├── AuthContext.tsx         # <AuthProvider> — session holati, signIn/signUp/signOut
│   └── useAuth.ts              # useAuth() hook
├── data/courses.ts           # Course/Lesson type, coursesData, getCourseStats()
├── components/                # TopNav, Sidebar, MobileNav, ProtectedRoute, ui/Toggle
└── pages/                     # Login, Dashboard, MyCourses, CourseDetail, Leaderboard,
                               # Settings, admin/*
```

## Dizayn tizimi

Barcha glass qatlamlari [`src/index.css`](src/index.css) da markazlashgan — yangi UI qo'shganda mavjud sinflardan foydalaning, yangi glass varianti ixtiro qilmang:

- `.glass-panel` — asosiy glassmorphism qatlam (blur 12px)
- `.leaderboard-hero-panel` — kuchliroq glass (blur 20px), sahifa sarlavhalarida
- `.liquid-blob` / `.mobile-liquid-blob` — faol nav elementini ko'rsatuvchi animatsiyali blob

Brend ranglari (`@theme` orqali): `--color-amaranth: #E63946` (aksent), `--color-charcoal: #2B2D42` (matn), `--color-navy: #1D3557` (ikkinchi darajali matn).

## Backend (Supabase)

1. [supabase.com/dashboard](https://supabase.com/dashboard)da loyiha yarating.
2. **Project Settings → API** dan `Project URL` va `anon public` kalitni oling.
3. `.env.example`ni `.env.local`ga nusxalab, ikkalasini to'ldiring:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. [`supabase/migrations/20260817000000_init_schema.sql`](supabase/migrations/20260817000000_init_schema.sql) ni loyihangizning SQL Editor'ida ishga tushiring (jadvallar, RLS policy'lar, `get_course_stats()`/`submit_quiz_answer()` funksiyalari).
5. `npm run dev` — endi `/login` sahifasida haqiqiy signup/login ishlaydi.

`.env.local` **hech qachon commit qilinmaydi** (`.gitignore`da). `anon` kalit RLS orqali himoyalangan, klient tomonda ishlatilishi uchun mo'ljallangan — lekin `service_role` kalitini hech qachon frontend kodiga qo'ymang.

**Hozircha ulanmagan:** kurslar/progress/XP/leaderboard ma'lumoti hamon `src/data/courses.ts`dagi hardcoded holatda — faqat auth (signup/login/logout) real Supabase'ga ulangan. Schema'dagi qolgan jadvallar (`courses`, `lesson_progress`, `xp_events`, `quizzes`, ...) frontend'ga hali bog'lanmagan.

## Deploy (Render)

Loyiha sof client-side SPA (server kodi yo'q) — Render'da **Static Site** sifatida joylashtiriladi, "Web Service" emas. Repo ildizidagi [`render.yaml`](render.yaml) bularning barchasini tavsiflaydi (Render Blueprint).

1. [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint** → shu GitHub repo'ni tanlang. Render `render.yaml`ni o'qib, `lingoglass` nomli Static Site'ni taklif qiladi.
2. So'ralganda **`VITE_SUPABASE_URL`** va **`VITE_SUPABASE_ANON_KEY`**ni kiriting ([Backend (Supabase)](#backend-supabase) bo'limidagi qiymatlar bilan bir xil). **Muhim:** Vite bu qiymatlarni build paytida bundle ichiga yozadi, runtime'da o'qimaydi — birinchi build'dan oldin to'ldirilishi shart, keyin o'zgartirilsa qayta deploy qilish kerak.
3. Deploy tugagach, Supabase loyihasida **Authentication → URL Configuration** ga o'ting va **Site URL** hamda **Redirect URLs** ga Render bergan domenni (`https://lingoglass-xxxx.onrender.com` yoki custom domen) qo'shing — aks holda email tasdiqlash/parol tiklash havolalari `localhost:3000`ga ishora qiladi.

`render.yaml` ichida ta'minlangan narsalar:

- **SPA rewrite** (`/* → /index.html`) — `BrowserRouter` client-side routing ishlatgani uchun majburiy; bo'lmasa `/courses` kabi yo'lga to'g'ridan-to'g'ri kirish yoki sahifani yangilash 404 beradi.
- **`dist/assets/*` uchun abadiy cache** — Vite fayl nomlariga kontent hash qo'shadi, shuning uchun xavfsiz.
- Blueprint'siz qo'lda sozlasangiz: Build Command `npm ci && npm run build`, Publish Directory `dist`, va yuqoridagi rewrite qoidasini qo'lda qo'shing (Render dashboard'ining "Redirects/Rewrites" bo'limi).

## Keyingi qadamlar

- [x] Supabase auth ulash (signup/login/logout, protected route)
- [ ] `coursesData`/leaderboard/XP'ni hardcoded'dan real Supabase query'ga o'tkazish
- [ ] Test infratuzilmasi (hozircha test yo'q)
- [ ] Vizual accessibility audit (rang kontrasti, `prefers-reduced-motion`)
- [ ] Placeholder rasmlarni (`picsum.photos`) real assetlarga almashtirish
- [ ] `dist/assets/*.js` 500kB dan katta (Vite ogohlantiradi) — `manualChunks` bilan bo'lish ko'rib chiqilsin

## Xavfsizlik eslatmasi

Hech qanday API kaliti klient bundle'iga inject qilinmasligi kerak. Agar kelajakda AI (masalan Gemini) integratsiyasi qo'shilsa, kalit **faqat server tomonda** (proxy orqali) saqlanadi — `vite.config.ts` dagi `define` orqali emas.

## Loyiha haqida batafsil

Arxitektura qarorlari, konvensiyalar va o'zgarishlar tarixi uchun [CLAUDE.md](CLAUDE.md) fayliga qarang.

## Litsenziya

[MIT](LICENSE) © Tursinbay Abdimuratov
