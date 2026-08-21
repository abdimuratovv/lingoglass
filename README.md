# LingoGlass

Ingliz tili o'rganish platformasi uchun frontend dashboard prototipi. Dizayn konsepsiyasi — _Light Theme Liquid Glassmorphism_: shaffof/blur'langan panellar va `layoutId` orqali "suyuq" animatsiyali navigatsiya indikatori.

> **Loyiha holati:** faqat UI maketi. Backend, autentifikatsiya va ma'lumotlar bazasi hali ulanmagan — barcha ma'lumot (kurslar, leaderboard, foydalanuvchilar) kodga hardcoded qilingan. Boshlang'ich Supabase schema qoralamasi [`supabase/migrations/`](supabase/migrations/) da bor, lekin hech qanday loyihaga qo'llanmagan.

## Texnologiyalar

| Qatlam     | Yechim                                                   |
| ---------- | -------------------------------------------------------- |
| UI         | React 19 + TypeScript 5.8 (`strict`)                     |
| Build      | Vite 6                                                   |
| Routing    | `react-router-dom` 7 (client-side SPA)                   |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`) + custom glass CSS |
| Animatsiya | `motion` (Framer Motion) — `layoutId` shared-layout      |
| Ikonkalar  | `lucide-react`                                           |
| Sifat      | ESLint 10 (flat config) + Prettier                       |

## Ishga tushirish

**Talab:** Node.js 22.13+ (ESLint 10 talabi). Repo ildizida [`.nvmrc`](.nvmrc) bor — `nvm use` kifoya.

```bash
npm install
npm run dev
```

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

| Yo'l                 | Sahifa                                                      |
| -------------------- | ----------------------------------------------------------- |
| `/`                  | Dashboard — learning path, skill kartalari, recent activity |
| `/courses`           | My Courses — kurslar grid'i                                 |
| `/courses/:courseId` | Course Detail — darslar ro'yxati va progress                |
| `/leaderboard`       | Leaderboard — top-3 podium + reyting                        |
| `/settings`          | Settings — 4 ta tab                                         |
| `/admin`             | Admin — content / quizzes / users tab'lari                  |

Noma'lum yo'l `/` ga, mavjud bo'lmagan `courseId` esa `/courses` ga redirect qiladi.

## Loyiha tuzilishi

```
src/
├── main.tsx           # BrowserRouter + createRoot entry point
├── App.tsx            # Layout shell (Sidebar + TopNav + MobileNav) + <Routes>
├── index.css          # Tailwind @theme tokenlar + glassmorphism CSS sinflari
├── data/courses.ts    # Course/Lesson type, coursesData, getCourseStats()
├── components/        # TopNav, Sidebar, MobileNav, ui/Toggle
└── pages/             # Dashboard, MyCourses, CourseDetail, Leaderboard,
                       # Settings, admin/*
```

## Dizayn tizimi

Barcha glass qatlamlari [`src/index.css`](src/index.css) da markazlashgan — yangi UI qo'shganda mavjud sinflardan foydalaning, yangi glass varianti ixtiro qilmang:

- `.glass-panel` — asosiy glassmorphism qatlam (blur 12px)
- `.leaderboard-hero-panel` — kuchliroq glass (blur 20px), sahifa sarlavhalarida
- `.liquid-blob` / `.mobile-liquid-blob` — faol nav elementini ko'rsatuvchi animatsiyali blob

Brend ranglari (`@theme` orqali): `--color-amaranth: #E63946` (aksent), `--color-charcoal: #2B2D42` (matn), `--color-navy: #1D3557` (ikkinchi darajali matn).

## Keyingi qadamlar

- [ ] Supabase backend'ni ulash (auth, real progress persistensiyasi, XP tizimi)
- [ ] Test infratuzilmasi (hozircha test yo'q)
- [ ] Vizual accessibility audit (rang kontrasti, `prefers-reduced-motion`)
- [ ] Placeholder rasmlarni (`picsum.photos`) real assetlarga almashtirish

## Xavfsizlik eslatmasi

Hech qanday API kaliti klient bundle'iga inject qilinmasligi kerak. Agar kelajakda AI (masalan Gemini) integratsiyasi qo'shilsa, kalit **faqat server tomonda** (proxy orqali) saqlanadi — `vite.config.ts` dagi `define` orqali emas.

## Loyiha haqida batafsil

Arxitektura qarorlari, konvensiyalar va o'zgarishlar tarixi uchun [CLAUDE.md](CLAUDE.md) fayliga qarang.

## Litsenziya

[MIT](LICENSE) © Tursinbay Abdimuratov
