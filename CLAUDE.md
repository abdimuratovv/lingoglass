# CLAUDE.md

Bu fayl **LingoGlass** loyihasi bo'yicha Claude uchun doimiy gid (Obsidian/ikkinchi miya o'rnini bosuvchi). Yangi chat boshlanganda barcha fayllarni qayta o'qib token sarflash shart emas — shu faylni o'qish yetarli. Loyihada muhim o'zgarish qilinganda (arxitektura, dependency, konvensiya, yangi muammo) ushbu faylni ham yangilab qo'yish kerak — "Oxirgi yangilanish" bo'limiga sana va nima o'zgargani yoziladi.

## 1. Loyiha nima

**LingoGlass** — ingliz tili o'rganish platformasi uchun **frontend dashboard prototipi**. Dizayn konsepsiyasi: _Light Theme Liquid Glassmorphism_ — shaffof/blur'langan panellar + `layoutId` orqali "suyuq" navigatsiya indikatori.

**Hozirgi holat: UI maketi + Supabase auth + profil, kurslar, XP va leaderboard bazaga ulangan (2026-09-26, §8 ga qarang).** Signup/login/logout, protected route, joriy userning profili (TopNav/Dashboard, profilni tahrirlash), kurslar/darslar/progress (MyCourses/CourseDetail), haftalik Leaderboard, TopNav'dagi streak + umumiy XP va Dashboard'dagi Recent Activity Supabase'dan keladi. Learning Path, Core Skills, welcome banner'dagi "24 new words", bildirishnomalar, Idiom of the Day, Settings va Admin panellari hamon **hardcoded**. Gemini AI yo'q, bundle'da uning kaliti uchun joy ham yo'q.

Git repozitoriy — **ha**. Remote: <https://github.com/abdimuratovv/lingoglass> (`origin`, `main` branch). 2026-08-21 da `git init` qilinib, bitta boshlang'ich commit bilan push qilindi — §8 dagi 2026-08-21 yozuviga qarang.

## 2. Texnologiyalar

| Qatlam     | Yechim                                                            | Versiya                                                           |
| ---------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| UI         | React + TypeScript                                                | React 19.2.8, TS ~5.8                                             |
| Build      | Vite                                                              | 6.x, port 3000 (dev) / 4173 (preview)                             |
| Routing    | `react-router-dom`                                                | 7.18.2 — pastdagi eslatmaga qarang                                |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`) + custom CSS                | —                                                                 |
| Animatsiya | `motion` (Framer Motion)                                          | `LayoutGroup`, `AnimatePresence`, `layoutId`                      |
| Ikonkalar  | `lucide-react`                                                    | —                                                                 |
| Rasmlar    | tashqi `picsum.photos` (placeholder, hali real emas)              | —                                                                 |
| Backend    | Supabase (`@supabase/supabase-js`) — auth + profil + kurslar + XP | ^2.115.0 — §8 dagi 2026-09-06, 2026-09-24 va 2026-09-26 yozuvlari |

Buyruqlar ([package.json](package.json)):

```bash
npm run dev           # vite --port=3000 --host=0.0.0.0
npm run build         # vite build
npm run preview       # build'ni lokal ko'rish (4173)
npm run lint          # eslint .
npm run typecheck     # tsc --noEmit
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

**`npm audit` haqida eslatma:** `react-router-dom@7.18.2` uchun bitta yuqori darajali advisory chiqadi (GHSA-qwww-vcr4-c8h2, RSC-mode CSRF). GitHub advisory'sini tekshirdim — **faqat "unstable RSC API"lardan foydalanilganda ta'sir qiladi**; bu loyiha oddiy client-side SPA (RSC umuman ishlatilmaydi), shuning uchun amalda xavfsiz. Yamalangan versiya `react-router@8.3.0` (endi `-dom` qo'shimchasisiz, paket birlashtirilgan), lekin u Node.js `>=22.22.0` talab qiladi — bu muhitda `v22.12.0` bor, shuning uchun hozircha barqaror `7.18.2`da qolindi. Kelajakda Node yangilansa, `react-router@8.x`ga o'tish ko'rib chiqilishi mumkin.

## 3. Fayl tuzilishi

```
lingoglass/
├── index.html               → #root, <title>LingoGlass</title>
├── vite.config.ts           → react + tailwind plaginlari, "@" → repo root alias (GEMINI_API_KEY inject va AI Studio DISABLE_HMR bloki §8'da olib tashlandi)
├── eslint.config.js         → ESLint flat config (typescript-eslint + react-hooks + react-refresh + eslint-config-prettier)
├── .prettierrc.json         → Prettier sozlamalari (singleQuote, trailingComma: all, printWidth: 120)
├── LICENSE                   → MIT, © 2026 Tursinbay Abdimuratov
├── .env.example               → VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY namunasi (haqiqiy qiymatlar .env.local'da, git'ga tushmaydi)
├── .gitignore                → node_modules/dist/.env*/.claude/settings.local.json va h.k.
├── .editorconfig             → utf-8, LF, 2 space indent
├── .gitattributes            → `* text=auto eol=lf` — Windows core.autocrlf=true ni bekor qiladi (§8 dagi 2026-08-21 yozuviga qarang)
├── .nvmrc                    → "22" (ESLint 10 uchun Node 22.13+ kerak)
├── .github/workflows/ci.yml  → GitHub Actions: npm ci → lint → typecheck → format:check → build (Node 22.x)
├── .claude/launch.json       → preview_start konfiguratsiyalari: lingoglass-dev (npm run dev, 3000), lingoglass-preview (npm run preview, 4173)
├── src/
│   ├── main.tsx              → StrictMode + BrowserRouter + AuthProvider + ProfileProvider + XpStatsProvider + createRoot entry point
│   ├── vite-env.d.ts          → import.meta.env uchun TS turlari (VITE_SUPABASE_URL/ANON_KEY)
│   ├── index.css             → Tailwind @theme tokenlar + glassmorphism CSS sinflari + hide-scrollbar/pb-safe
│   ├── App.tsx                → /login (ochiq) + /* ProtectedRoute ichida AppShell (Sidebar+TopNav+MobileNav+<Routes>)
│   ├── lib/
│   │   ├── supabaseClient.ts  → createClient() + isSupabaseConfigured flag (placeholder URL bilan crash oldini oladi, §8 dagi 2026-09-06 yozuviga qarang)
│   │   └── time.ts            → formatRelativeTime() — "Just now" / "5 minutes ago" / "Yesterday" / "Sep 12" (mahalliy kalendar kuni bo'yicha)
│   ├── context/
│   │   ├── authContext.ts     → AuthContext + AuthContextValue turi (faqat non-komponent — react-refresh lint qoidasi uchun ajratilgan)
│   │   ├── AuthContext.tsx    → <AuthProvider> — session holati, signIn/signUp/signOut (tarmoq xatolarini try/catch bilan tutadi)
│   │   ├── useAuth.ts         → useAuth() hook
│   │   ├── profileContext.ts  → ProfileContext + Profile turi + avatarUrl()/displayName() yordamchilari
│   │   ├── ProfileContext.tsx → <ProfileProvider> — joriy userning profiles qatori + updateProfile(full_name/bio)
│   │   ├── useProfile.ts      → useProfile() hook
│   │   ├── xpStatsContext.ts  → XpStatsContext + XpStatsContextValue turi
│   │   ├── XpStatsContext.tsx → <XpStatsProvider> — get_my_xp_stats() (umumiy XP + streak); CourseDetail dars tugatganda reload() qiladi
│   │   └── useXpStats.ts      → useXpStats() hook
│   ├── data/
│   │   ├── useAsyncData.ts    → barcha data hook'lar asosi: useAsyncData(key, load) → { data, loading, error, refreshing, reload } (§7)
│   │   ├── courses.ts         → Course/Lesson turlari, getCourseStats(), fetchCourses(userId, courseId?) — Supabase'dan kurs+dars+progress
│   │   ├── useCourses.ts      → useCourses(courseId?) hook — { courses, loading, error, refreshing, reload }
│   │   ├── xp.ts              → XpStats/XpEvent/LeaderboardEntry turlari, fetchXpStats(), fetchRecentXpEvents(), fetchLeaderboard(), leaderboardName()
│   │   ├── useLeaderboard.ts  → useLeaderboard() — top 50 + joriy userning o'z qatori
│   │   └── useRecentActivity.ts → useRecentActivity(limit) — joriy userning oxirgi xp_events
│   ├── components/
│   │   ├── TopNav.tsx          → ~333 qator: qidiruv/bildirishnoma/profil paneli + Log Out endi signOut()ga ulangan
│   │   ├── Sidebar.tsx          → desktop sidebar, useLocation() orqali active holat + Log Out signOut()ga ulangan
│   │   ├── MobileNav.tsx        → mobil pastki nav, useLocation() orqali active holat
│   │   ├── ProtectedRoute.tsx   → session yo'q bo'lsa /login'ga redirect (kelgan joyini location.state.from'da saqlaydi)
│   │   └── ui/
│   │       ├── Toggle.tsx        → Settings'dagi takrorlangan switch markup shu yerga chiqarilgan
│   │       └── StatusPanel.tsx   → yuklanish / xato (+ Try again) / bo'sh holat uchun glass panel
│   └── pages/
│       ├── Login.tsx          → email/parol signin+signup formasi, glass-panel dizayniga mos
│       ├── Dashboard.tsx
│       ├── MyCourses.tsx
│       ├── CourseDetail.tsx      → useParams() bilan courseId oladi; topilmasa /courses'ga redirect
│       ├── Leaderboard.tsx
│       ├── Settings.tsx
│       └── admin/
│           ├── AdminPage.tsx
│           ├── AdminContentManager.tsx
│           ├── AdminQuizBuilder.tsx
│           └── AdminUserManagement.tsx
├── public/
│   └── background.webp        → fon rasmi, ~32KB (avvalgi backgroun.png'dan ~97% kichik, §8 ga qarang)
└── supabase/
    ├── seed.sql               → boshlang'ich kontent (4 kurs, 60 dars, 3 quiz, 1 idiom), idempotent — migratsiyalardan KEYIN ishga tushiriladi (§8 dagi 2026-09-24 seed yozuvi)
    └── migrations/
        ├── 20260817000000_init_schema.sql → boshlang'ich backend schema (§8 dagi 2026-08-17 yozuvi) — PRODUCTION'GA QO'LLANGAN, tahrirlanmaydi
        ├── 20260924000000_fix_xp_dedup_and_function_grants.sql → XP takrorlanishi + anon funksiya huquqlari tuzatishi (§8 dagi 2026-09-24 "kechroq" yozuvi)
        ├── 20260924120000_complete_lesson.sql → complete_lesson() RPC + lesson_progress'ga to'g'ridan-to'g'ri yozish yopildi (§8 dagi 2026-09-24 complete_lesson yozuvi)
        └── 20260926000000_xp_stats.sql → get_my_xp_stats(p_tz) — umumiy XP + streak (§8 dagi 2026-09-26 yozuvi)
```

## 4. Arxitektura / navigatsiya

Router **bor** — `react-router-dom` (`BrowserRouter` + `AuthProvider`, [src/main.tsx](src/main.tsx) da `<App />`ni o'raydi). [src/App.tsx](src/App.tsx) endi ikki qavatli: tashqi `<Routes>` `/login`ni ochiq qoldiradi, qolgan hammasi (`/*`) `<ProtectedRoute>` ichidagi `AppShell`ga tushadi, ichki marshrutlar o'sha yerda e'lon qilingan (§8 dagi 2026-09-06 yozuviga qarang):

| Yo'l                 | Komponent                                                                   | Himoyalangan? |
| -------------------- | --------------------------------------------------------------------------- | :-----------: |
| `/login`             | `Login` — signin/signup formasi, `useAuth()` orqali                         |     yo'q      |
| `/`                  | `Dashboard`                                                                 |      ha       |
| `/courses`           | `MyCourses`                                                                 |      ha       |
| `/courses/:courseId` | `CourseDetail` — kurs bazada topilmasa `<Navigate to="/courses" replace />` |      ha       |
| `/leaderboard`       | `Leaderboard`                                                               |      ha       |
| `/settings`          | `Settings`                                                                  |      ha       |
| `/admin`             | `AdminPage` (ichida `content`/`quizzes`/`users` tab'lari `useState` bilan)  |      ha       |
| `*` (noma'lum yo'l)  | `<Navigate to="/" replace />`                                               |      ha       |

`ProtectedRoute` session yo'qligida `<Navigate to="/login" replace state={{ from: location.pathname }} />` qiladi; `Login` sahifasi kirgandan keyin shu `from`ga qaytaradi (aks holda `/`ga).

`Sidebar`/`MobileNav` faol holatni `useLocation().pathname`dan hisoblaydi (`/courses/:id` ham "My Courses"ni yoritadi, chunki `startsWith('/courses')` tekshiriladi). Ikkalasi ham endi haqiqiy `<Link>` (`<a href>`) — avvalgi `<button onClick={setState}>` o'rniga.

Sahifa o'tish animatsiyasi: `AnimatePresence mode="wait"` + `motion.div key={location.pathname}`, ichida `<Routes location={location}>`. **Eslatma:** bu animatsiya `requestAnimationFrame`ga tayanadi — brauzer tab compositing qilmasa (masalan headless/background avtomatlashtirilgan muhitda), exit-animatsiya hech qachon "tugamaydi" va yangi sahifa mount bo'lib ulgurmaydi. Bu xatti-harakat **asl kodda ham bor edi** (routing qo'shilishidan oldin ham xuddi shunday `AnimatePresence` naqshi ishlatilgan), ya'ni bu routing bilan bog'liq emas — oddiy brauzerda muammo yo'q, buni to'g'ridan-to'g'ri URL orqali navigatsiya qilib (barcha 7 marshrutda) tasdiqladim. Agar kelajakda shu joyda "click ishlayapti-yu lekin ekran yangilanmayapti" degan holat kuzatilsa — birinchi navbatda shu eslatmani yodda tuting, buni qayta debug qilib vaqt sarflashning hojati yo'q.

**Sahifalar tarkibi:**

- `Dashboard` — welcome banner, `LearningPathSection`, 4 ta core skill card, recent activity (`xp_events`dan, oxirgi 5 ta), "Idiom of the Day"
- `MyCourses` → `CourseDetail` — kurslar grid'i, bosilganda `/courses/:id`ga navigate qiladi
- `Leaderboard` — `leaderboard_current_week` view'idan: top-3 podium (3 kishidan kam bo'lsa bo'sh joylar xira), "Your Position" kartasi, qolgan reyting (top 50)
- `Settings` — 4 ta tab (Notifications / Language / Privacy / Learning)
- `AdminPage` — 3 ta tab (`AdminContentManager` / `AdminQuizBuilder` / `AdminUserManagement`)

## 5. Dizayn tizimi

[src/index.css](src/index.css) da markazlashgan:

- Brend ranglari (`@theme` orqali): `--color-amaranth: #E63946` (asosiy aksent), `--color-charcoal: #2B2D42` (matn), `--color-navy: #1D3557` (ikkinchi darajali matn)
- `.glass-panel` — asosiy glassmorphism qatlam (blur 12px)
- `.leaderboard-hero-panel` — kuchliroq glass (blur 20px), Leaderboard/CourseDetail/Admin sarlavhalarida
- `.podium-stand` / `.podium-stand-gold` — Leaderboard podium uchun
- `.liquid-blob` / `.mobile-liquid-blob` — sidebar/mobil nav faol elementini ko'rsatuvchi animatsiyali blob (`layoutId="sidebar-liquid-blob"` va `"mobile-liquid-blob"` orqali `motion` boshqaradi)

Yangi UI qo'shganda avval shu sinflardan foydalanish kerak, yangi glass variant ixtiro qilmaslik kerak.

## 6. Bilingan muammolar

2026-08-05/06 review'da topilgan, 1/2/3/4-bosqichda tuzatilganlar §8 ga ko'chirildi. Quyida hali tuzatilmagan, keyingi bosqichlarga tegishli narsalar. Hozircha kritik darajadagi muammo yo'q.

**Kichik:**

1. Accessibility strukturaviy/semantik jihatdan yaxshi holatda (§8 dagi 4-bosqich yozuviga qarang — icon-only tugmalar, progress-bar'lar, tab-almashtiruvchilar, rang+ikonka orqali uzatiladigan ma'lumot hammasi ko'rib chiqilgan), lekin **vizual** audit (rang kontrasti, `prefers-reduced-motion`, ekran o'lchamlarida real screen-reader/klaviatura sinovi) hali qilinmagan — bu sessiyada Browser pane haqiqiy fokus/compositing holatiga ega bo'lmagani uchun (`document.hasFocus()` doim `false`) vizual/fokus holatlarini avtomatik tekshirib bo'lmadi, faqat build'dagi CSS qoidalari va DOM/ARIA atributlari orqali tasdiqlandi.
2. Frontend uchun test yo'q (ESLint + Prettier + GitHub Actions CI bor, §8 dagi 5-bosqich va 2026-08-21 yozuvlariga qarang). Migratsiya faqat bir martalik PGlite sinovidan o'tgan (§8 dagi 2026-09-24 yozuvi), repoda doimiy SQL/RLS test yo'q.
3. **Frontend admin himoyasi yo'q:** `/admin` va Sidebar/MobileNav'dagi "Admin" havolasi har qanday login qilgan userga ko'rinadi. Yozishni RLS (`is_admin()`) to'xtatadi, lekin UI'da `is_admin()` bo'yicha yashirish/`AdminRoute` kerak.
4. **Auth UI qisman:** parolni tiklash oqimi yo'q; email'ni o'zgartirish yo'q (profil panelida faqat ko'rsatiladi); avatar yuklash (kamera tugmasi) ishlamaydi — Storage bucket kerak; Settings'dagi "Change Password" va toggle'lar hech narsa saqlamaydi.
5. Darsni tugatish o'z-o'zini belgilash: darslarda kontent yo'q, `complete_lesson()` "tugatdi"ni tekshira olmaydi — XP takrorlanmaydi va ketma-ketlik majburiy, lekin darslarni tez bosib chiqish mumkin. `submit_quiz_answer()` urinishlar sonini cheklamaydi — user variantlarni ketma-ket sinab to'g'risini topib XP olishi mumkin (har savol uchun faqat bir marta).
6. **Backend qisman ulangan:** auth, profil, kurslar/progress, darsni tugatish (`complete_lesson`), Leaderboard, TopNav streak/XP va Recent Activity ulangan (§8 dagi 2026-09-24 va 2026-09-26 yozuvlari). Learning Path, Core Skills, welcome banner matni ("24 new words this week"), bildirishnomalar (jumladan soxta "5-Day Streak!" — haqiqiy streak'ga zid bo'lishi mumkin), Idiom of the Day, Settings va Admin hamon hardcoded.
7. **Leaderboard haftasi UTC bo'yicha** (`date_trunc('week', now())` — dushanba 00:00 UTC, Toshkentda 05:00), streak esa userning brauzer vaqt zonasida. Sahifada "resets every Monday at 00:00 UTC" deb yozilgan. `show_on_leaderboard = false` bo'lgan user reytingda ko'rinmaydi, lekin "Your Position" kartasi unga "bu hafta XP yo'q" deb ko'rsatadi — Settings ulanganda aniqlashtirish kerak. AI (Gemini) funksiyasi ham yo'q — agar kelajakda qo'shilsa, kalit **faqat server tomonda** (proxy orqali) saqlanishi kerak, `vite.config.ts`dagi `define` orqali klient bundle'ga inject qilinmasin (§8 dagi 2026-08-05 yozuviga qarang).

## 7. Konvensiyalar / qoidalar

- Yangi glass-panel kerak bo'lsa — mavjud CSS sinflardan foydalanish (§5), yangisini yaratishdan oldin ikki marta o'ylash.
- Bir martalik codemod/migratsiya skriptlarini ishlatgandan keyin repo'dan darhol o'chirish — qoldirilsa keyingi safar tasodifan qayta ishga tushirilib, kaskad-bug beradi (masalan avvalgi `replace.js` shunday edi, §8.1 ga qarang).
- Yangi sahifa qo'shilganda: `src/pages/`ga komponent yoziladi, [App.tsx](src/App.tsx)dagi `<Routes>`ga `<Route>` qo'shiladi, [Sidebar.tsx](src/components/Sidebar.tsx) va [MobileNav.tsx](src/components/MobileNav.tsx)dagi `navItems` massiviga yozuv qo'shiladi (agar sidebar'da ko'rinishi kerak bo'lsa).
- Kurs progress/completed/total ma'lumotini qo'lda hisoblab yozmaslik — [src/data/courses.ts](src/data/courses.ts)dagi `getCourseStats()` orqali `lessonList`dan hisoblanadi. `Course` interfeysiga alohida `progress`/`completed`/`lessons` maydon qaytarib qo'shilmasin (avval shu sabab data mos kelmasligiga olib kelgan edi).
- Rasm/asset qo'shilganda fayl nomini tekshirish (mavjud `backgroun.png` kabi xato takrorlanmasin).
- Yangi `dependency` qo'shishdan oldin u haqiqatan kodda ishlatilishini tekshirish — `package.json` da "kelajakda kerak bo'ladi" degan asosda paket saqlab qo'yilmasin (§8.1 dagi tozalashning sababi shu edi).
- Ko'p marta `npm install`/`uninstall` qilingandan keyin (masalan dependency versiyasini sinab ko'rishda) agar `npm run dev` oldindan ishlab turgan bo'lsa — "Invalid hook call" / "more than one copy of React" xatosi chiqishi mumkin, chunki Vite'ning dependency pre-bundle jarayoni HMR WebSocket orqali avtomatik to'liq-reload signalini yuborishi kerak, lekin ba'zi avtomatlashtirilgan/proxy'langan brauzer muhitlarida bu WebSocket ulanmay qolishi mumkin (oddiy brauzerda muammo bo'lmaydi). Shubha tug'ilsa `npm run build` + `npm run preview` (statik, HMR'siz) orqali tekshirish ancha ishonchli.
- Bu loyihani Claude Code'ning Browser pane orqali test qilishda `document.hasFocus()` doim `false` va `document.visibilityState` doim `"hidden"` bo'ladi — ya'ni `:focus`/`:focus-within` CSS pseudo-klasslari va `requestAnimationFrame`ga tayanadigan animatsiyalar avtomatik tekshiruvda ishlamaydi, garchi kod to'g'ri bo'lsa ham (haqiqiy brauzerda muammo yo'q). Bunday holatlarda `getComputedStyle` + `document.activeElement` bilan emas, build'dagi CSS qoidalarini (`grep dist/assets/*.css`) va DOM/ARIA atributlarini tekshirib tasdiqlash kerak.
- Kod yozishdan oldin/keyin `npm run lint` (ESLint) va `npm run format` (Prettier) ishga tushirish kerak — ikkalasi ham sozlangan (§8 dagi 5-bosqich yozuviga qarang). `npm run typecheck` (`tsc --noEmit`) alohida buyruq, `lint`ning bir qismi emas.
- **Supabase klientini hech qachon `createClient(url ?? '', key ?? '')` bilan yaratmaslik** — bo'sh string bilan chaqirilsa `createClient` **sinxron throw** qiladi va butun ilova mount bo'lishdan oldin crash bo'ladi (§8 dagi 2026-09-06 yozuvida shu xato haqiqatan sodir bo'lgan va tuzatilgan). [src/lib/supabaseClient.ts](src/lib/supabaseClient.ts)dagi `isSupabaseConfigured` + placeholder URL naqshini davom ettirish kerak.
- **Yangi data hook — [useAsyncData](src/data/useAsyncData.ts) ustiga** (`useCourses`, `useLeaderboard`, `useRecentActivity`, `XpStatsProvider` shunday). `load()` o'qiydigan har bir qiymat (userId, courseId, limit…) `key`ga kirishi **shart** — effect faqat `key`/`reload()` bo'yicha qayta ishlaydi (`load` `useEffectEvent` orqali o'qiladi). Qo'lda `useEffect` + `setState` bilan yangi naqsh yozilmasin.
- Context fayllarini yozishda (`createContext` + Provider komponenti + hook) uchtasini **bitta faylga qo'ymaslik** — `react-refresh/only-export-components` lint ogohlantirishi beradi. Naqsh: `context/<name>Context.ts` (faqat `createContext` + tur, komponent yo'q) + `context/<Name>Context.tsx` (faqat Provider komponenti) + `context/use<Name>.ts` (faqat hook). [src/context/](src/context/) ga qarang.

## 8. Oxirgi yangilanish

**2026-09-26 — Leaderboard, XP/streak va Recent Activity Supabase'ga ulandi.** `lint`/`typecheck`/`format:check`/`build` toza; SQL PGlite'da production zanjiri (init → fix → seed → complete_lesson → yangi migratsiya ×2) bilan 44/44 sinaldi.

1. **[20260926000000_xp_stats.sql](supabase/migrations/20260926000000_xp_stats.sql):** `get_my_xp_stats(p_tz text default 'UTC') returns table (total_xp, streak_days, active_today)`, **SECURITY INVOKER** (xp_events RLS'i o'zi yetarli). Streak — XP olingan ketma-ket kunlar, bugun **yoki kechada** tugaydigan (bugun hali XP yo'q bo'lsa streak uzilmagan, `active_today = false`); kunlar `p_tz` zonasida (frontend brauzerning IANA zonasini yuboradi), noma'lum zona xato bermay UTC'ga tushadi. Huquq 20260924000000 naqshida. **Nega RPC:** umumiy XP client'da yig'ilsa PostgREST "Max rows" (default 1000) chegarasidan keyin jimgina noto'g'ri bo'lardi (test: 1500 qator → 4500 XP to'g'ri). Streak testlari JS'dagi mustaqil reference bilan 7 ssenariy × 4 zona (UTC, Asia/Tashkent, UTC+14, America/Los_Angeles) taqqoslandi; "kecha" qoidasi ataylab buzilganda 5 test yiqildi.
2. **Leaderboard** mavjud `leaderboard_current_week` view'idan (migratsiya shart emas): top 50 (`rank`, keyin `user_id` bo'yicha barqaror tartib) + joriy userning o'z qatori parallel. Podium `PodiumSlot` komponentiga chiqarildi (avval 3 marta takrorlangan markup); 3 kishidan kam bo'lsa bo'sh joylar xira "—". Podium bezagi **joy** bo'yicha, badge'dagi raqam haqiqiy `rank` (teng XP'da ikkita "1" bo'lishi mumkin). `trend = 'same'` endi kulrang `Minus` + "No change" (avval faqat up/down bor edi). "Your Position": podiumda yoki top 50 dan tashqarida bo'lsa; bu hafta XP yo'q bo'lsa — "Go to My Courses" havolasi bilan karta. Ism bo'sh bo'lsa "Anonymous learner" (email hech qachon ko'rsatilmaydi).
3. **TopNav:** yangi streak belgisi (olov + kunlar soni) — **avval umuman yo'q edi**, yig'ilgan holatda ham ko'rinadi (panel 140 → 188px; stats yo'q/xato bo'lsa belgi ham, qo'shimcha kenglik ham yo'q). Bugun XP olingan bo'lsa to'q sariq, aks holda xira + tooltip "earn XP today to keep it". Ochilganda ism ostida umumiy XP. Mobilda ochilganda belgi yashiriladi (qidiruv maydoniga joy). Holat `XpStatsProvider` contextida; CourseDetail dars tugatganda (XP > 0) `reload()` qiladi.
4. **Dashboard → Recent Activity:** `xp_events`dan oxirgi 5 ta (`created_at desc, id desc`), `<ul>/<li>`, ikonka `source_type` bo'yicha, vaqt `<time>` + `formatRelativeTime()`. Yuklanish/xato/bo'sh holat — `StatusPanel`. Qatorlardagi soxta `cursor-pointer` olib tashlandi (bosilganda hech narsa bo'lmasdi).
5. **Refaktor:** [useAsyncData](src/data/useAsyncData.ts) — `useCourses`dagi "natija kaliti = so'rov kaliti" naqshi umumiy hook'ga chiqarildi (§7), `useCourses` shu ustiga ko'chirildi (tashqi API o'zgarmadi). `load` React 19.2'ning `useEffectEvent`i orqali o'qiladi.
6. **Holat: production'ga qo'llandi va ishlashi tasdiqlandi (2026-09-26).** Foydalanuvchi migratsiyani SQL Editor'da ishga tushirdi. Browser pane'da (faqat o'qib, hech narsa yozilmadi): `get_my_xp_stats('Asia/Tashkent')` → 200, `35 XP / streak 0 / active_today false` (oxirgi XP 2026-09-24 — 2 kun oldin, streak to'g'ri 0); TopNav yig'ilgan holatda 188px, xira olov "0", ochilganda "35 XP"; Recent Activity'da 2 ta dars ("2 days ago", +20/+15 XP); Leaderboard'da 1 kishi — podiumning 1-o'rni to'lgan, 2/3 xira "—", "Your Position" kartasi. **Eslatma:** Browser pane'ning network paneli Supabase (`*.supabase.co`) so'rovlarini ko'rsatmadi — tekshiruv sahifa ichida `await import('/src/lib/supabaseClient.ts')` bilan ilovaning o'z klienti orqali qilindi (dev'da modul bir xil instansiya).
7. **Vizual tuzatish (tekshiruvda topildi):** podium konteyneri `h-48` (192px) edi, 1-o'rin ustuni esa 216px (avatar 80 + stand 128 + 8) — yuqoriga toshib, medal ikonkasi sarlavha matni ustiga chiqardi (asl kodda ham shu geometriya bor edi, subtitle ikki qatorga o'tgach ko'zga tashlandi). `h-56` qilindi.

**2026-09-24 — Darsni tugatish: `complete_lesson()` + CourseDetail tugmalari.** `lint`/`typecheck`/`format:check` toza; SQL PGlite'da production zanjiri (init → fix → seed → yangi migratsiya ×2) bilan 19/19 sinaldi.

1. **[20260924120000_complete_lesson.sql](supabase/migrations/20260924120000_complete_lesson.sql):** `complete_lesson(p_lesson_id) returns int` (SECURITY DEFINER) — `auth.uid()` bo'sh bo'lsa rad; dars topilmasa `P0002`; shu kursdagi oldingi darslar tugallanmagan bo'lsa `P0001 previous lessons are not completed` (UI'dagi "Locked" qoidasi endi serverda majburiy); `lesson_progress`ga upsert; `xp_events`ga `lesson_completed` (XP = `duration_minutes`, sarlavha `Completed: <dars nomi>`) `on conflict do nothing`; berilgan XP'ni qaytaradi (qayta chaqirilsa 0). **`lesson_progress`dan INSERT/UPDATE/DELETE huquqi olindi** — faqat `select`; progress va XP doim shu funksiya orqali birga yoziladi. Funksiya huquqi 20260924000000 naqshida (revoke public/anon/authenticated → grant authenticated).
2. **Frontend:** `completeLesson()` ([courses.ts](src/data/courses.ts)) RPC'ni chaqiradi. [CourseDetail](src/pages/CourseDetail.tsx)da "Start" → **Complete**, "Continue Lesson N" → **Complete Lesson N**; natija `role="status"` (+XP) yoki `role="alert"` (xato) bilan; so'rov va qayta yuklash tugaguncha tugmalar bloklanadi. `useCourses` endi `refreshing` qaytaradi — `reload()` paytida eski ma'lumot ekranda qoladi, sahifa yuklanish paneliga "miltillab" o'tmaydi.
3. **Holat: production'ga qo'llandi va ishlashi tasdiqlandi (2026-09-24).** Foydalanuvchi migratsiyani SQL Editor'da ishga tushirdi ("Success"). Keyin Browser pane'da (hech narsa bosilmasdan, faqat o'qib) tekshirildi: foydalanuvchi o'zi TOEFL'ning 1–2-darslarini tugatgan — CourseDetail'da `2/6 lessons · 33%`, 1–2 "Done", 3-dars "Complete", 4–6 "Locked"; MyCourses'da TOEFL `2/6 Done, 33%`. Ya'ni RPC, progress o'qish va ketma-ketlik haqiqiy bazada ishlaydi.

**2026-09-24 — Frontend: profil va kurslar Supabase'ga ulandi.** Hammasi `lint`/`typecheck`/`format:check`/`build` bilan va Browser pane'da haqiqiy akkaunt bilan (foydalanuvchi o'zi login qildi) tekshirildi:

1. **Profil:** `ProfileProvider` (§7 dagi uch faylli context naqshi) joriy userning `profiles` qatorini o'qiydi. TopNav'da ism, email (`user.email`), avatar (`avatar_seed` bo'yicha picsum), CEFR belgisi (faqat `cefr_level` to'ldirilgan bo'lsa); Dashboard'da "Welcome back, {ism}!" (`full_name` bo'sh bo'lsa email'ning @ gacha qismi). Profil paneli: "First/Last Name" → bitta **Full Name** (schema'da faqat `full_name` bor, bo'lib saqlash noaniq bo'lardi), email **faqat o'qish** (o'zgartirish `auth.updateUser` + tasdiqlash oqimi talab qiladi), "Save Changes" `profiles`ga `full_name`/`bio`ni yozadi (RLS: faqat o'zi), xato `role="alert"` bilan. Forma har ochilganda bazadagi qiymatdan boshlanadi.
2. **Kurslar:** `coursesData` o'chirildi (2026-09-24 seed yozuvidagi qoida bajarildi — kontentning yagona manbai endi baza). `fetchCourses()` ikki parallel so'rov: `courses` + ichki `lessons` (embedded select, `position` bo'yicha) va joriy userning `lesson_progress`i; `completed` client'da birlashtiriladi, `getCourseStats()` o'zgarmadi. `Lesson.id` endi uuid, raqam uchun `position`, davomiylik `durationMinutes`. Kurslar **`id` bo'yicha** tartiblanadi (bazada tartib ustuni yo'q) — Business English, Grammar, Idioms, TOEFL.
3. **Hook'lardagi naqsh (react-hooks v7 `set-state-in-effect` qoidasi uchun):** `loading` alohida state emas — natija so'rov kaliti (`userId|courseId|reloadCount`) bilan saqlanadi va `loading = natija kaliti ≠ joriy kalit`. Effect ichida sinxron setState yo'q, eskirgan javob `cancelled` bayrog'i bilan tashlanadi. Yangi data hook'lar shu naqshda yozilsin (`useCourses.ts`, `ProfileContext.tsx`).
4. **Tasdiqlandi (Browser pane):** Dashboard/TopNav'da haqiqiy ism; `/courses`da 4 kurs (24/12/18/6 dars, 0%); `/courses/toefl-prep`da 6 dars, 1-dars "Start", qolganlari "Locked"; `/courses/does-not-exist` → `/courses`; profil panelida haqiqiy ism/email, email readOnly; barcha `/rest/v1/` so'rovlari 200, konsolda xato yo'q. Dev'da har sahifada so'rovlar 2 martadan — `StrictMode` effektni ikki marta ishga tushiradi, production'da bitta. "Save Changes" haqiqiy bazaga yozgani uchun avtomatik sinalmadi.

**2026-09-24 (kechroq) — Init migratsiya production'ga allaqachon qo'llangan ekan; tuzatishlar alohida migratsiyaga ko'chirildi.** SQL Editor'da tuzatilgan init ishga tushirilganda `42P07: relation "profiles" already exists` chiqdi. Diagnostika: bazada init'ning **eski** (tuzatilmagan) nusxasi to'liq qo'llangan (`submit_quiz_answer` eski tanasi bilan) va `profiles`da **4 ta haqiqiy foydalanuvchi** bor — ya'ni avvalgi "migratsiya hali qo'llanmagan" degan ma'lumot noto'g'ri edi. Shu sabab:

1. [20260817000000_init_schema.sql](supabase/migrations/20260817000000_init_schema.sql) **production'da qo'llangan holatiga qaytarildi** (commit `b3e5bc1`dagi nusxa; faqat sarlavha izohi "tahrirlamang" deb o'zgartirildi). Quyidagi "birinchi" 2026-09-24 yozuvidagi in-place tahrir shu bilan bekor bo'ldi.
2. Ikkala tuzatish yangi [20260924000000_fix_xp_dedup_and_function_grants.sql](supabase/migrations/20260924000000_fix_xp_dedup_and_function_grants.sql)ga ko'chirildi, bitta `begin/commit` ichida: eski `source_type` CHECK'ni mazmuniga qarab topib almashtirish (nomi avtomatik bo'lgani uchun), `unique (user_id, source_type, source_id)`, yangi `submit_quiz_answer()`, **init §7 ning to'liq qayta qo'llanishi** (init'ning §7'siz eski nusxasi qo'llangan bo'lsa ham yakuniy holat bir xil) va funksiyalar uchun revoke/grant. Farqi: revoke `all functions` emas, **aniq ro'yxat** — public sxemada Supabase'ning o'z `rls_auto_enable()` funksiyasi (automatic RLS sozlamasi) bor, unga tegilmaydi.
3. **Sinov (PGlite):** init'ning ikkala ehtimoliy qo'llangan nusxasi (`fe82f4f` — §7'siz, `b3e5bc1` — §7 bilan) + 4 ta user → tuzatish (2 marta) → seed zanjiri, har birida 20/20: userlar ma'lumoti o'zgarmaydi, XP takrorlanmaydi, anon rad etiladi, admin RLS, signup trigger'i, `rls_auto_enable`ga tegilmagani. Qo'shimcha: `xp_events`da eski `quiz_passed` qatori bo'lsa tuzatish xato beradi va **to'liq bekor bo'ladi** (funksiya, CHECK, huquqlar o'zgarmaydi) — ma'lumot jimgina o'zgartirilmaydi.
4. **Production'ga qo'llandi (2026-09-24):** foydalanuvchi SQL Editor'da avval tuzatish migratsiyasini, keyin `seed.sql`ni ishga tushirdi (ikkalasi "Success"). Yakuniy o'qish-faqat tekshiruv so'rovi 17/17 `true` berdi: 4 kurs / 60 dars / 3 quiz / 1 savol / 3 variant / 1 idiom, har bir `auth.users` uchun profil bor, yangi `submit_quiz_answer`, unique cheklov, anon hech qanday funksiya/jadvalga kira olmaydi, `authenticated` `xp_events`ga yoza olmaydi, `admin_users` bo'sh emas. **Hozirgi production holati = init + tuzatish migratsiyasi + seed.**
5. **Qoida (§7 ga ham tegishli):** qo'llangan migratsiya fayli hech qachon tahrirlanmaydi — har bir o'zgarish yangi `YYYYMMDDHHMMSS_*.sql` fayl. Bazaga nima qo'llanganini taxmin qilmasdan, avval SQL Editor'da diagnostika so'rovi bilan tekshirish kerak.

**2026-09-24 — `supabase/seed.sql` yaratildi (boshlang'ich kontent).** Frontend kodi o'zgarmadi. Tarkibi: 4 kurs + 60 dars (`src/data/courses.ts`dan **skript orqali generatsiya qilingan**, qo'lda ko'chirilmagan; `position` = dars `id`si, `"12 min"` → `duration_minutes = 12`), AdminQuizBuilder'dagi 3 quiz (faqat birinchisining UI'da haqiqatan yozilgan 1 savoli + 3 varianti, "have been" to'g'ri), Dashboard'dagi 1 idiom ("Piece of cake"). Quiz/savol/variant/idiom UUID'lari qat'iy (`a…`/`b…`/`c…`/`d…0001`) — bu jadvallarda tabiiy unique kalit yo'q, qat'iy ID bo'lmasa seed idempotent bo'lmasdi.

- **Ataylab qo'shilmagan:** foydalanuvchiga bog'liq hamma narsa (profiles, lesson_progress — `courses.ts`dagi `completed` bayroqlari demo-user progressi, kontent emas; xp_events, notifications, leaderboard ismlari) — soxta userlar production'ga seed qilinmaydi. `resources` — mock'da faqat "Sample Resource Title N", haqiqiy fayl yo'q. Qolgan 2 quizning savollari va quiz↔dars bog'lanishi (`lesson_id = null`) — mock'da yo'q, o'ylab topilmadi.
- **Sinov (PGlite, migratsiya + seed):** seed ikki marta qo'llanganda qatorlar soni o'zgarmaydi (idempotent); 4 kurs va 60 darsning har bir maydoni `courses.ts` bilan birma-bir solishtirildi — 0 farq; `get_course_stats`, `quiz_answer_options_public` (is_correct'siz), `submit_quiz_answer` (to'g'ri/noto'g'ri) va idiom o'qish `authenticated` rolida ishlaydi.
- **Qoida:** frontend Supabase'ga ulangandan keyin `coursesData` olib tashlanadi va kontentning yagona manbai baza bo'ladi. Ungacha `courses.ts`ga dars qo'shilsa/o'zgartirilsa, seed ham yangilanishi kerak (aks holda ikkalasi uziladi). README "Backend (Supabase)" bo'limiga seed va admin qilish qadamlari qo'shildi.

**2026-09-24 — Migratsiyadagi ikkita xavfsizlik xatosi tuzatildi va migratsiya birinchi marta haqiqiy Postgres'da sinaldi.** Loyiha holati to'liq tahlil qilinganda topildi; migratsiya hali hech qaysi Supabase loyihasiga qo'llanmagani uchun yangi migratsiya fayli emas, shu fayl ([20260817000000_init_schema.sql](supabase/migrations/20260817000000_init_schema.sql)) to'g'ridan-to'g'ri tahrirlandi. Frontend kodi o'zgarmadi.

1. **Cheksiz XP:** `submit_quiz_answer()` har bir to'g'ri javob uchun cheklovsiz +10 XP yozardi — bitta to'g'ri javobni RPC orqali N marta yuborib N×10 XP olish mumkin edi (§8 dagi 2026-08-17 dizayn qarori #4 amalda buzilgan edi). Tuzatish: `xp_events`ga `unique (user_id, source_type, source_id)` + funksiyada `on conflict do nothing`. XP endi **savol bo'yicha** beriladi: `source_type` `'quiz_passed'` → `'quiz_answer_correct'`, `source_id` = savol ID (avval quiz ID edi va har javobda "Quiz completed" deb yozilardi). `source_id IS NULL` qatorlar (masalan kelajakdagi `streak_bonus`) cheklovga tushmaydi — ularni yozadigan funksiya takrorlanishni o'zi nazorat qilishi kerak. Ishlatilmagan `v_lesson_id`/`v_quiz_id` olib tashlandi.
2. **Anon orqali to'g'ri javobni aniqlash:** §7 dagi `revoke all on all tables` **funksiyalarga ta'sir qilmaydi**, Supabase esa public sxemadagi funksiyalarga default'da `anon`ga EXECUTE beradi. Mehmon `submit_quiz_answer`ni chaqirsa, to'g'ri variantda `user_id` not-null xatosi, noto'g'rida `false` qaytardi — bu farq login'siz javob kalitini ochib berardi. Tuzatish (ikki qatlam): funksiya boshida `auth.uid() is null` → `raise ... errcode 42501`; §7 da `revoke execute on all functions in schema public from public, anon, authenticated`, so'ng mavjud uchta `grant execute ... to authenticated` qoldi. **Yangi funksiya qo'shilganda** u ham §7 ga aniq grant bilan yozilishi kerak (revoke faqat mavjud funksiyalarni qamraydi). `handle_new_user()` trigger'iga revoke ta'sir qilmaydi (trigger ishga tushganda EXECUTE tekshirilmaydi).
3. **Sinov:** lokal Postgres yo'q, shuning uchun scratchpad'da `@electric-sql/pglite` (WASM Postgres) bilan Supabase muhiti imitatsiya qilindi (`anon`/`authenticated` rollari, `auth.users`, `auth.uid()` = `request.jwt.claim.sub`, Supabase default privileges) va 20 ta tekshiruv yozildi: migratsiya xatosiz qo'llanadi, signup trigger'i, XP takrorlanmasligi, anon/uid-NULL rad etilishi, `is_correct` yashirinligi, admin RLS, leaderboard view. Hammasi o'tdi; xuddi shu testlar eski (HEAD) versiyaga qarshi 5 ta joyda yiqildi (7 marta yuborishda 70 XP, anon oracle) — ya'ni testlar xatoni haqiqatan ushlaydi. Test skripti repoga qo'shilmadi (bir martalik, §7). **Cheklov:** PGlite haqiqiy Supabase emas (GoTrue, PostgREST, `supabase_auth_admin` roli yo'q) — SQL Editor'da birinchi qo'llash hamon yakuniy sinov.

**2026-09-22 — `.glass-panel` shaffofligi kamaytirildi (production'da ko'zga noqulaylik xabar qilingandan keyin).** Render'ga deploy qilingandan so'ng foydalanuvchi haqiqiy fon rasmi (`background.webp`, yuqori kontrastli geometrik naqsh) ustida Dashboard kartochkalari juda shaffof ko'rinib, matn o'qilishini qiyinlashtirayotganini xabar qildi. Sabab: [src/index.css](src/index.css)dagi `.glass-panel` (Dashboard/MyCourses/CourseDetail/Settings/Admin — deyarli barcha sahifa shu bitta sinfdan foydalanadi, §5) atigi 15%/5% oq qatlam + 12px blur bilan yozilgan edi — past kontrastli placeholder fonda ko'zga tashlanmagan, lekin haqiqiy fon rasmida yetarli emas edi.

Tuzatish: oq gradient 15%/5% → **62%/38%**, blur 12px → **20px**, chegara shaffofligi 15% → **45%**. Faqat shu bitta sinf o'zgartirildi (dizayn tizimi bitta manba bo'lgani uchun tuzatish barcha sahifaga avtomatik tarqaldi) — `.leaderboard-hero-panel` va `.podium-stand`ga tegilmadi, ular allaqachon yetarlicha xira edi (35–40%/15–20%). Lokal dev serverda (`/login` sahifasida, real fon rasmi bilan) vizual tasdiqlandi — matn aniq o'qiladi, "muzlangan shisha" ko'rinishi saqlanib qoldi. `npm run lint`/`format:check` toza.

**2026-09-22 — Migratsiyaga Data API grant'lari (§7) qo'shildi; Supabase loyiha sozlamalari va region tanlandi.** Foydalanuvchi Render'ga deploy qilishga tayyorgarlik ko'rayotgan payt Supabase loyihasini yaratdi. Kod o'zgarmadi — faqat [supabase/migrations/20260817000000_init_schema.sql](supabase/migrations/20260817000000_init_schema.sql). Migratsiya hamon **hech qanday loyihaga qo'llanmagan/sinalmagan**:

1. **§7 "DATA API GRANTS" bo'limi qo'shildi.** Avval migratsiya faqat RLS'ga tayanardi va jadval huquqlarini Supabase'ning "Automatically expose new tables" default'iga tashlab qo'yardi (ikkita view'dan tashqari — ular uchun inline `grant` bor edi). Endi blok `revoke all on all tables in schema public from anon, authenticated` bilan boshlanib, har bir jadvalga faqat RLS policy'lari ruxsat bergan amallarni qaytarib beradi. Natija: o'sha sozlama yoqiq bo'lsa ham, o'chiq bo'lsa ham yakuniy holat bir xil. Ikkita view'ning inline grant'i (avvalgi 184/222-qatorlar) §7 ga ko'chirildi — barcha huquqlar bitta joyda.
2. **Ataylab qoldirilgan istisnolar:** `admin_users` (hech qanday grant yo'q — `is_admin()` SECURITY DEFINER bo'lgani uchun kerak emas), `xp_events` (faqat `select` — INSERT yo'qligi XP'ni himoya qiladi), `user_settings`/`profiles` (INSERT yo'q — qatorlar `handle_new_user()` trigger'i orqali yaratiladi), `handle_new_user()` (EXECUTE grant'i yo'q — faqat auth trigger'i chaqiradi), `service_role` (umuman tegilmadi).
3. **`anon` uchun hech narsa ochilmadi**, garchi §6 dagi ba'zi policy'lar `using (true)` bo'lsa ham — ilovaning har bir sahifasi `ProtectedRoute` ortida, mehmon so'rov yubormaydi. Kelajakda ochiq landing/katalog qo'shilsa, `courses`/`lessons`/`idioms` uchun `grant select ... to anon` qo'shish kifoya (RLS tomoni allaqachon tayyor).
4. **`grant execute on function public.is_admin() to authenticated` muhim nuance:** policy ifodalari invoker huquqi bilan baholanadi, ya'ni bu grant bo'lmasa har bir admin-policy `permission denied for function is_admin` bilan yiqiladi.
5. **Supabase loyiha yaratish sozlamalari (tanlangan):** `Enable Data API` = ON (majburiy, `supabase-js` shu orqali ishlaydi), `Enable automatic RLS` = ON (migratsiya RLS'ni o'zi yoqadi, bu shunchaki kelajak uchun sug'urta), `Automatically expose new tables` = endi **OFF qilinishi mumkin**, chunki §7 huquqlarni aniq beradi.
6. **Region: Frankfurt (eu-central-1).** Supabase "Singapore (recommended)" ko'rsatgan edi, lekin foydalanuvchi mashinasidan real o'lchov (AWS endpoint'largacha TCP handshake, DNS keshi isigan holatda) Frankfurt ~118 ms, London ~123 ms, Singapur ~211 ms, Mumbay ~217 ms, Tokio ~269 ms berdi — O'zbekistonning xalqaro tranziti Yevropa orqali ketgani uchun. Region keyin o'zgartirilmaydi.
7. **`render.yaml` (Render Blueprint) yaratildi.** `runtime: static` (server kodi yo'q, sof SPA), `buildCommand: npm ci && npm run build`, `staticPublishPath: ./dist`. `envVars`da `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` `sync: false` bilan — qiymatlar repoda emas, faqat Render dashboard'ida so'raladi. **Muhim eslatma:** Vite `VITE_*` o'zgaruvchilarini build paytida bundle ichiga yozadi, runtime'da o'qimaydi — birinchi build'dan oldin to'ldirilishi shart, keyin o'zgartirilsa qayta deploy kerak. `routes` bo'limida SPA fallback (`/* → /index.html`, `rewrite` turi) — bu **majburiy**, aks holda `/courses` kabi yo'lga to'g'ridan-to'g'ri kirish yoki sahifani yangilash `BrowserRouter` bilan 404 beradi. `dist/assets/*` uchun abadiy cache header ham qo'shildi (Vite fayl nomlariga kontent hash qo'shgani uchun xavfsiz).
8. **README.md ga "Deploy (Render)" bo'limi qo'shildi** — Blueprint orqali deploy qadamlari, env o'zgaruvchilarining build-time ekanligi haqidagi ogohlantirish, va deploy'dan keyin Supabase Authentication → URL Configuration'ga domen qo'shish zarurligi (aks holda email tasdiqlash/parol tiklash havolalari `localhost:3000`ga ishora qiladi).

**Keyingi qadam:** migratsiyani SQL Editor'da qo'llash (birinchi real sinov — xato chiqsa shu fayl tuzatiladi), `.env.local`ni to'ldirish, so'ng Render deploy (§Render qo'shildi, pastga qarang).

**2026-09-06 — Supabase auth infratuzilmasi qo'shildi (signup/login/logout, protected route), hali frontend ma'lumotlari ulanmagan.** Foydalanuvchi bilan muhokamadan so'ng "to'liq (auth + barcha ma'lumotlar)" qamrovi tanlandi, lekin Supabase loyihasi/kalitlar hali foydalanuvchida yo'q edi — shuning uchun bu bosqich **faqat kodni tayyorlash**dan iborat (haqiqiy Supabase loyihasi va `.env.local` kalitlari foydalanuvchidan kutilmoqda, keyingi bosqich — schema'ni haqiqiy loyihaga qo'llash va `coursesData`ni real query'ga o'tkazish). Hammasi `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build` bilan tekshirildi, qo'shimcha Browser pane orqali haqiqiy klik/navigatsiya bilan ham sinaldi:

1. `@supabase/supabase-js@^2.115.0` o'rnatildi (0 zaiflik). `.env.example` (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`) va [src/vite-env.d.ts](src/vite-env.d.ts) (`import.meta.env` turlari) qo'shildi.
2. [src/lib/supabaseClient.ts](src/lib/supabaseClient.ts) — Supabase klienti. **Muhim topilma:** dastlabki versiyada kalitlar yo'qligida `createClient('', '')` chaqirilgan edi — bu `"supabaseUrl is required"` bilan **sinxron throw** qilib, butun React ilovasini mount bo'lishdan oldin crash qildirgan (Browser pane'da `document.getElementById('root').innerHTML === ''` bilan tasdiqlandi). Tuzatildi: kalitlar yo'q bo'lsa `https://placeholder.supabase.co` / `placeholder-anon-key` ishlatiladi (bu URL sintaktik to'g'ri, `createClient` throw qilmaydi) + `isSupabaseConfigured` flag eksport qilinadi. Natijada kalitlarsiz ham ilova ochiladi, faqat auth chaqiruvlari muvaffaqiyatsiz bo'ladi.
3. `src/context/` uchta faylga bo'lingan (§7 ga ham yozildi) — `react-refresh/only-export-components` ogohlantirishini yo'qotish uchun: `authContext.ts` (`AuthContext` + `AuthContextValue` turi), `AuthContext.tsx` (`<AuthProvider>` — `supabase.auth.getSession()` + `onAuthStateChange` bilan session holatini kuzatadi), `useAuth.ts` (hook). `signIn`/`signUp`/`signOut` barchasi `try/catch` bilan o'ralgan — `isSupabaseConfigured=false` bo'lsa tarmoqqa chiqmasdan darhol tushunarli xato qaytaradi (`NOT_CONFIGURED_ERROR`), tarmoq xatosi bo'lsa ham `{ error: string | null }` shaklida qaytadi, hech qachon uncaught exception tashlamaydi.
4. [src/pages/Login.tsx](src/pages/Login.tsx) — signin/signup formasi, mavjud dizayn tiliga mos (`glass-panel`, `bg-amaranth` tugma, `text-navy/60`). Xato `role="alert"`, muvaffaqiyat xabari `role="status"` bilan e'lon qilinadi (accessibility, §6/§8 4-bosqich konvensiyasiga mos).
5. [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx) — session yo'qligida `/login`ga redirect, `location.state.from` orqali kelgan joyini eslab qoladi. [src/App.tsx](src/App.tsx) qayta tuzildi: tashqi `<Routes>` `/login` (ochiq) va `/*` (`ProtectedRoute` ichida eski `AppShell`, avvalgi `App()` tanasi shu nom bilan ichki komponentga chiqarildi) ga bo'lingan.
6. [src/components/Sidebar.tsx](src/components/Sidebar.tsx) va [src/components/TopNav.tsx](src/components/TopNav.tsx) dagi "Log Out" tugmalari (avval hech narsa qilmasdi) endi `useAuth().signOut()`ga ulangan.
7. Browser pane orqali tasdiqlandi: (a) kalitlarsiz ilova crash bo'lmasdan `/login`ni ko'rsatadi; (b) `/` ga to'g'ridan-to'g'ri kirishga urinish `/login`ga redirect qiladi; (c) signin formasini to'ldirib submit qilinganda tarmoq xatosi emas, `"Supabase hali ulanmagan..."` alert (`role="alert"`) chiqadi; (d) signup rejimiga almashish "To'liq ism" maydonini qo'shadi.
8. `npm run build` toza o'tadi, lekin endi 500kB ogohlantirishi bor (`@supabase/supabase-js` og'irligi bilan, 679KB/195KB gzip) — README'ning "Keyingi qadamlar"iga `manualChunks` bilan bo'lish yozib qo'yildi, hozircha funksional muammo emas.
9. README.md'ga "Backend (Supabase)" bo'limi qo'shildi — loyiha yaratish, kalitlarni olish, migratsiyani qo'lda SQL Editor'da ishga tushirish bosqichlari.

**Ataylab qilinmagan narsalar:** Supabase CLI orqali migratsiyani avtomatik qo'llash (`supabase db push`) — bu DB parolini yoki access token'ni talab qiladi, buning o'rniga foydalanuvchi SQL Editor'da qo'lda ishga tushiradi (xavfsizroq, hech qanday maxfiy narsa Claude'ga berilmaydi). `coursesData`/leaderboard/XP'ni real query'ga o'tkazish — bu keyingi bosqich, foydalanuvchi haqiqiy Supabase loyihasi va kalitlarni bergandan keyin boshlanadi.

**2026-08-21 — Repozitoriy GitHub'ga yuklashga tayyorlandi (`git init` + infratuzilma).** Kod mantig'iga hech qanday o'zgarish kiritilmadi — faqat repo-darajasidagi fayllar. Hammasi `npm run lint`, `npm run typecheck`, `npm run format:check` va `npm run build` bilan tekshirildi (to'rttasi ham toza):

1. **AI Studio qoldiqlari tozalandi:** `metadata.json` (hech qayerda ishlatilmagan, faqat AI Studio metadata edi) o'chirildi; [vite.config.ts](vite.config.ts) dagi `server.hmr: process.env.DISABLE_HMR !== 'true'` bloki va uning "Do not modify" izohi olib tashlandi (AI Studio muhitiga xos hack edi, Vite'ning default HMR xatti-harakati aynan shu — ya'ni funksional o'zgarish yo'q).
2. **Yangi fayllar:** `LICENSE` (MIT, © 2026 Tursinbay Abdimuratov — foydalanuvchi tanlovi), `.editorconfig`, `.nvmrc` (`22`), `.github/workflows/ci.yml`.
3. **`.gitignore` kengaytirildi:** avvalgi 7 qatordan to'liq ro'yxatga — `*.tsbuildinfo`, `.vite/`, `.eslintcache`, `.idea/`, `.vscode/*`, `Thumbs.db`, `npm-debug.log*` qo'shildi; `.env*` endi `!.env.example` istisnosi bilan; `.claude/settings.local.json` ignore qilinadi, lekin `.claude/launch.json` **ataylab** tracked qoldirildi (jamoaviy preview konfiguratsiyasi).
4. **`package.json` metadata:** `description`, `license: "MIT"`, `author`, `repository`/`bugs`/`homepage` (GitHub URL) va `engines: { node: ">=22.13.0" }` qo'shildi. **Diqqat:** joriy lokal muhitda Node `v22.12.0` bor, ya'ni endi `npm install` da loyihaning o'zi uchun ham `EBADENGINE` ogohlantirishi chiqadi (avval faqat ESLint paketlari uchun chiqardi). Bu soft warning — hech narsani buzmaydi, lekin Node'ni 22.13+ ga yangilash bu shovqinni butunlay yo'q qiladi. `engines` ataylab shunday qo'yildi, chunki ESLint 10 haqiqatan `^20.19.0 || ^22.13.0 || >=24` talab qiladi.
5. **[README.md](README.md) qayta yozildi:** eski faylda `npm run lint` hamon "TypeScript type-check (tsc --noEmit)" deb noto'g'ri yozilgan edi (5-bosqichdan keyin eskirgan) — tuzatildi. Endi to'liq buyruqlar jadvali, marshrutlar jadvali, fayl tuzilishi, dizayn tizimi sinflari, keyingi qadamlar checklist'i va API-kalit xavfsizlik eslatmasi bor.
6. **CI:** `.github/workflows/ci.yml` — `main` ga push va PR'da Node 22.x da `npm ci` → `lint` → `typecheck` → `format:check` → `build`. `concurrency` bilan eskirgan run'lar bekor qilinadi.
7. **Sirlar tekshiruvi:** `api_key|secret|token|password|PRIVATE KEY|supabase.co|sk-...` bo'yicha butun repo skanerlandi — hech qanday haqiqiy sir topilmadi (yagona moslik Settings sahifasidagi "Change Password" UI matni).
8. **`.gitattributes` (`* text=auto eol=lf`) qo'shildi — bu majburiy edi, kosmetik emas.** Bu muhitda `git config core.autocrlf` = `true`, ya'ni `git add` da har bir matn faylida "LF will be replaced by CRLF" ogohlantirishi chiqardi va toza `git clone` dan keyin fayllar CRLF bilan checkout bo'lardi. Prettier'ning default `endOfLine` esa `"lf"` — natijada yangi klonlangan repo'da `npm run format:check` **har bir faylni** "formatlanmagan" deb hisoblab yiqilardi (Linux'dagi CI o'tsa ham, Windows'dagi ishlab chiquvchida yiqilardi). `.gitattributes` bilan ogohlantirishlar butunlay yo'qoldi.
9. `git init` qilindi (`main` branch), hamma narsa **bitta** boshlang'ich commit'ga qo'yildi va <https://github.com/abdimuratovv/lingoglass> ga push qilindi (`origin/main`). `gh` CLI bu muhitda yo'q, shuning uchun repo GitHub'da qo'lda yaratildi va oddiy `git push` ishlatildi.

**Ataylab qilinmagan narsalar:** `CONTRIBUTING.md`/issue-PR shablonlari yaratilmadi (bir kishilik loyiha uchun hozircha ortiqcha); README'da screenshot yo'q (rasm hali olinmagan).

**2026-08-17 — Backend/auth schema qoralamasi yozildi (Supabase, hali qo'llanmagan).** Foydalanuvchi bilan arxitektura muhokamasidan so'ng [supabase/migrations/20260817000000_init_schema.sql](supabase/migrations/20260817000000_init_schema.sql) yaratildi. Bu **faqat SQL fayl** — hech qanday Supabase loyihasiga qarshi ishga tushirilmagan/sinalmagan, frontend hamon o'zgarmagan (100% hardcoded data). Qamrov:

- Barcha sahifalardagi hardcoded data shakllari (Leaderboard, Dashboard activity/idiom, Admin Quiz Builder, Admin User Management, Admin Content Manager, TopNav notifications/profil, Settings toggle'lari) survey qilindi va schema'ga xaritalandi.
- Jadvallar: `profiles`, `user_settings`, `admin_users`, `courses`, `lessons`, `lesson_progress`, `xp_events`, `quizzes`/`quiz_questions`/`quiz_answer_options`, `notifications`, `resources`, `idioms`.
- **Muhim dizayn qarorlari (kelajakda qayta ko'tarilmasin uchun yozib qo'yilmoqda):**
  1. Admin ruxsati `profiles.role` ustuni emas, alohida `admin_users` jadvali — client tomondan yozib bo'lmaydi (self-escalation xavfini oldini olish uchun).
  2. `lesson_progress.completed`/course progress hech qachon alohida ustunda saqlanmaydi — `get_course_stats()` SQL funksiyasi orqali hisoblanadi, xuddi hozirgi `courses.ts`dagi `getCourseStats()` mantig'iga o'xshab (§7 qoidasi backend'da ham davom etadi).
  3. `quiz_answer_options.is_correct` to'g'ridan-to'g'ri client'ga ochilmaydi — oddiy user faqat `is_correct`siz `quiz_answer_options_public` view'dan o'qiydi, javob tekshiruvi `submit_quiz_answer()` SECURITY DEFINER funksiyasi orqali serverda bo'ladi.
  4. XP client tomonidan to'g'ridan-to'g'ri yozilmaydi (`xp_events`ga INSERT policy yo'q) — faqat `submit_quiz_answer()` kabi ishonchli funksiyalar orqali, aks holda user o'ziga cheksiz XP bera olardi.
  5. Haftalik leaderboard — rolling calendar-hafta (Dushanba boshlanadi), alohida "reset" job kerak emas; `leaderboard_current_week` view boshqa userlar xp yig'indisini ko'rsatishi kerak bo'lgani uchun ataylab RLS'ni chetlab o'tadi (definer huquqi), lekin faqat agregatsiya qilingan xavfsiz ustunlarni chiqaradi.
  6. `focus_areas` hozircha oddiy `text[]` (controlled vocabulary emas) — foydalanuvchi bilan kelishilgan, kerak bo'lsa keyinchalik alohida jadvalga chiqariladi.
- **Keyingi qadam:** foydalanuvchi Supabase loyihasini yaratib, `project URL` + `anon key`ni bergandan keyin shu migratsiya haqiqiy loyihaga qo'llanadi va frontend integratsiyasi (`@supabase/supabase-js`, `AuthContext`, hardcoded `coursesData`dan real query'ga o'tish) boshlanadi.

**2026-08-06 — 5-bosqich (test/lint infratuzilmasi) bajarildi.** ESLint 10 (flat config) va Prettier o'rnatildi, `npm run lint`ga ulandi. Hammasi `npm run lint`, `npm run typecheck`, `npm run format:check` va `vite build` bilan tekshirildi:

1. [eslint.config.js](eslint.config.js) yaratildi — `typescript-eslint` (recommended), `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, oxirida `eslint-config-prettier` (stilistik qoidalar Prettier bilan ziddiyat qilmasligi uchun). Butun kodda **0 ta lint xatosi** chiqdi — qo'shimcha kod tuzatish shart bo'lmadi.
2. [.prettierrc.json](.prettierrc.json) / [.prettierignore](.prettierignore) yaratildi (`singleQuote`, `trailingComma: "all"`, `printWidth: 120`). `prettier --write .` orqali 21 ta fayl birinchi marta formatlandi — barchasi kosmetik (qo'shtirnoq, bo'shliq, jadval pipe-tekislash), funksional o'zgarish yo'q. `tsc --noEmit`, `vite build` va `vite preview`da qayta tekshirildi — hammasi toza.
3. `package.json` scriptlari qayta tashkil qilindi: `lint` endi `eslint .` (avval `tsc --noEmit` edi), yangi `typecheck`/`format`/`format:check` qo'shildi.
4. Ishlatilmagan `autoprefixer` olib tashlandi (postcss.config yo'q, Tailwind v4'ning `@tailwindcss/vite` plagini o'zi CSS pipeline'ni boshqaradi — hech qayerda import qilinmagan edi).
5. Bonus: `npm audit`da chiqqan `nanoid` (Vite'ning `postcss` orqali kelgan transitive dependency'si, zaiflik) `npm audit fix` bilan **0 zaiflikkacha** tuzatildi.

**Diqqat — ESLint 10 engine ogohlantirishi:** o'rnatilgan `eslint`/`espree`/`eslint-scope` va h.k. paketlar Node `^20.19.0 || ^22.13.0 || >=24` talab qiladi, joriy muhitda `v22.12.0` bor — `npm warn EBADENGINE` chiqadi, lekin `npx eslint --version` va real lint ishga tushirish hech qanday muammosiz ishladi (soft warning, hard fail emas). react-router@8 holatidan farqli o'laroq bu yerda muqobil versiyani izlash shart bo'lmadi.

**2026-08-06 — 4-bosqich (to'liq accessibility audit) bajarildi.** 10 ta faylda quyidagi muammolar tuzatildi. Hammasi `tsc --noEmit`, `vite build` va `vite preview`(4173)da DOM/ARIA atributlarini JS orqali qo'lda tekshirish bilan tasdiqlandi:

1. [Sidebar.tsx](src/components/Sidebar.tsx) / [MobileNav.tsx](src/components/MobileNav.tsx) — faol nav elementiga `aria-current="page"` qo'shildi.
2. [Leaderboard.tsx](src/pages/Leaderboard.tsx) — trend ikonkasi (yuqori/past) faqat rang+ikonka orqali uzatilardi, endi `sr-only` matn (`"Trending up"`/`"Trending down"`) qo'shildi, ikonka `aria-hidden="true"` qilindi. 8 ta qatorda tasdiqlandi — matnlar `trend` ma'lumotiga aniq mos keladi.
3. [CourseDetail.tsx](src/pages/CourseDetail.tsx) — qulflangan dars `Lock` ikonkasiga `sr-only` "Locked" matni qo'shildi; progress bar'ga `role="progressbar"` + `aria-valuenow/min/max` qo'shildi.
4. [Dashboard.tsx](src/pages/Dashboard.tsx) — `FeatureCard` progress bar'iga ARIA qo'shildi (bu yerda vizual % matni umuman yo'q edi, endi `aria-label`da bor).
5. [MyCourses.tsx](src/pages/MyCourses.tsx) — `CourseCard` progress bar'iga xuddi shunday ARIA qo'shildi.
6. [AdminQuizBuilder.tsx](src/pages/admin/AdminQuizBuilder.tsx) — savol kartochkasidagi "Delete" tugmasi `opacity-0 group-hover:opacity-100` edi, ya'ni **klaviatura orqali fokuslansa ham ko'rinmas edi** (faqat sichqoncha hover'da paydo bo'lardi) — `group-focus-within:opacity-100 focus:opacity-100` qo'shildi. Javob variantlaridagi radio tugmalarga ("to'g'ri javobni belgilash" ma'nosini bildiruvchi) `aria-label` qo'shildi.
7. [AdminPage.tsx](src/pages/admin/AdminPage.tsx) (`AdminTab`), [AdminContentManager.tsx](src/pages/admin/AdminContentManager.tsx) (resurs turi tugmalari), [Settings.tsx](src/pages/Settings.tsx) (`SettingsTab`) — uchalasi ham "yon panelda tanlab, asosiy panelni almashtirish" naqshi; barchasiga `aria-pressed={active}` qo'shildi (to'liq `role="tablist"` naqshi emas — chunki strelka-tugma bilan navigatsiya joriy qilinmagan, `aria-pressed` esa haqiqiy klaviatura xatti-harakatiga mos, halol tanlov).

**Muhim tooling topilmasi (§7 ga ham yozildi):** bu sessiyada `document.hasFocus()` doim `false` va `visibilityState` doim `"hidden"` chiqdi — shuning uchun "Delete" tugmasining `:focus` orqali ko'rinishini `getComputedStyle`+`document.activeElement` bilan avtomatik tasdiqlab bo'lmadi (haqiqiy DOM focus bor edi, lekin CSS `:focus` pseudo-klassi mos kelmadi). Tasdiqlash o'rniga build'dagi `dist/assets/*.css` faylida `.focus\:opacity-100:focus{opacity:1}` va `.group-focus-within\:opacity-100:is(:where(.group):focus-within *){opacity:1}` qoidalari generatsiya bo'lganini `grep` bilan tekshirdim — ikkalasi ham to'g'ri, haqiqiy brauzerda ishlaydi.

**Qamrovdan tashqarida qoldirilgan narsalar** (asosli sabab bilan, ataylab): CourseDetail/Admin/Quiz Builder'dagi `cursor-pointer` bilan bezalgan, lekin hech qanday `onClick` handler'i yo'q qatorlar (masalan dars ro'yxati qatori, quiz ro'yxati kartochkasi) — bular "soxta interaktivlik ko'rinishi" muammosi, lekin funksionallik yo'qligi sababli klaviatura foydalanuvchisi hech narsa yo'qotmaydi; buni tuzatish yangi navigatsiya/tanlash funksiyasini **ixtiro qilish**ni talab qiladi, bu accessibility audit qamroviga kirmaydi — alohida funksionallik so'rovi sifatida ko'rib chiqilishi kerak. Rang kontrasti va `prefers-reduced-motion` ham tekshirilmadi (avtomatlashtirilgan vositasiz qo'lda vizual audit talab qiladi).

**2026-08-05 — GEMINI_API_KEY xavfi tuzatildi.** §6 dagi yagona kritik muammo edi. [vite.config.ts](vite.config.ts)dagi `loadEnv`/`define: {'process.env.GEMINI_API_KEY': ...}` bloki butunlay olib tashlandi — bu blok Gemini kalitini klient JS bundle'ga to'g'ridan-to'g'ri yozib qo'yardi. Kod hech qayerda bu o'zgaruvchini ishlatmagani uchun (tekshirildi: `grep`, faqat `vite.config.ts`ning o'zida bor edi) va boshqa hech narsa buzilmagani uchun eng toza yechim — shunchaki olib tashlash bo'ldi (Gemini funksiyasi qo'shilmagan hozircha, proxy arxitekturasi ham kerak emas). Shu bilan birga ishlatilmagan `.env.example` (GEMINI_API_KEY/APP_URL namunasi, hech narsa ularni o'qimaydi) o'chirildi. `tsc --noEmit`, `vite build` toza o'tdi; build chiqishida `GEMINI_API_KEY` so'zi qidirilib, izi yo'qligi tasdiqlandi.

**Muhim eslatma kelajak uchun:** agar Gemini (yoki boshqa) AI integratsiyasi qo'shilsa, kalit **hech qachon** `vite.config.ts`dagi `define` orqali klient bundle'ga inject qilinmasin — bu xato ikkinchi marta takrorlanmasin. To'g'ri yondashuv: kalit faqat serverda (masalan `express` proxy) saqlanadi, klient shu proxy'ga so'rov yuboradi.

**2026-08-05 — 3-bosqich (kichik/mexanik ishlar) bajarildi.** Foydalanuvchi 3-bosqich tarkibidan (backend/auth/DB, Gemini AI integratsiyasi, kichik ishlar) faqat "kichik/mexanik ishlar"ni tanladi — backend/AI qismi hali boshlanmagan, kerak bo'lsa alohida so'rov sifatida keladi. Hammasi `tsc --noEmit`, `vite build` va `vite preview`(4173)da real klik/klaviatura testi bilan tekshirildi:

1. `public/backgroun.png` (~1MB, imlo xatosi bilan) `sharp` orqali `public/background.webp`ga aylantirildi (~32KB, ~97% kichik) — `sharp` faqat vaqtincha (`--no-save`) o'rnatilib, konvertatsiyadan keyin butunlay olib tashlandi (`package.json`da yo'q, `node_modules`da ham qolmagan). [index.css](src/index.css)dagi havola yangilandi, eski PNG o'chirildi.
2. [TopNav.tsx](src/components/TopNav.tsx)dagi bildirishnoma va profil dropdown'lariga `useDropdownA11y` custom hook orqali: (a) ochilganda fokus panel ichidagi birinchi elementga o'tadi, (b) Tab/Shift+Tab panel ichida cheklanadi (trap), (c) Escape panelni yopadi va fokusni trigger tugmasiga qaytaradi. Trigger tugmalar va yopish/kamera tugmalariga `aria-label` qo'shildi (`aria-haspopup`, `aria-expanded`, `role="dialog"` bilan birga). Ikkalasi ham brauzerda klik+klaviatura orqali qo'lda tasdiqlandi (fokus tartibi, wrap-around, Escape — barchasi kutilganidek ishladi).

**2026-08-05 — 2-bosqich (struktura) bajarildi.** `App.tsx` (1382 qator) fayllarga bo'lindi, router qo'shildi, `coursesData` mos kelmasligi tuzatildi. Hammasi `tsc --noEmit`, `vite build` va `vite preview` orqali (7 marshrutning har biriga to'g'ridan-to'g'ri URL bilan kirib) tekshirildi:

1. `react-router-dom@7.18.2` o'rnatildi (versiya tanlovi sababi §2 dagi eslatmada). `BrowserRouter` [main.tsx](src/main.tsx)da, marshrutlar [App.tsx](src/App.tsx)da — to'liq ro'yxat §4da.
2. `App.tsx` `src/data/`, `src/components/`, `src/components/ui/`, `src/pages/`, `src/pages/admin/` fayllariga bo'lindi (§3 ga qarang). `App.tsx` o'zi 1382 → 53 qatorga tushdi (endi faqat layout shell + `<Routes>`).
3. `coursesData`dagi `progress`/`completed`/`lessons` hardcoded maydonlari olib tashlandi — [src/data/courses.ts](src/data/courses.ts)dagi `getCourseStats()` endi ularni `lessonList`dan hisoblab beradi. Natija: TOEFL endi "40 lessons" emas, haqiqiy "6 Lessons"ni ko'rsatadi; Business English 65%→63%, Idioms 30%→28% (haqiqiy hisoblangan qiymatlarga tuzatildi).
4. Settings'dagi 6 marta takrorlangan toggle-switch JSX'i [components/ui/Toggle.tsx](src/components/ui/Toggle.tsx)ga chiqarildi, `aria-label` bilan (accessibility'ga kichik hissa).
5. `Sidebar`/`MobileNav` endi `<button onClick={setState}>` emas, haqiqiy `<Link>`(`<a href>`) — brauzer tab/o'rta-klik/history bilan ishlaydi, `useLocation()` orqali active holatni aniqlaydi.
6. `CourseDetail` noto'g'ri `courseId` bilan ochilsa (masalan foydalanuvchi URL'ni qo'lda o'zgartirsa) `/courses`ga redirect qiladi — avval bu holat state-based navigatsiyada umuman yuzaga kelmasdi, endi URL orqali kirish mumkin bo'lgani uchun kerak bo'lib qoldi.

**Vite dev-server bilan bog'liq tooling holati (kod bilan bog'liq emas):** bu sessiyada Browser pane'da real click orqali navigatsiya sinalganda ikkita muammo chiqdi — (a) ko'p marta `npm install`/`uninstall` qilingandan keyin dev server "Invalid hook call" berdi (yuqoridagi §7 eslatmasiga qarang, `vite preview` bilan chetlab o'tildi); (b) `AnimatePresence`ning exit-animatsiyasi `requestAnimationFrame`ga tayangani uchun compositing bo'lmagan tab'da to'xtab qolishi mumkin (§4 dagi eslatmaga qarang, bu asl kodda ham bor edi). Ikkalasi ham haqiqiy foydalanuvchi brauzerida muammo emas — buni to'g'ridan-to'g'ri URL navigatsiyasi (barcha 7 marshrut, jumladan noto'g'ri courseId va noma'lum yo'l redirect'lari) va real click test (URL to'g'ri o'zgargani tasdiqlandi) orqali tekshirdim.

**2026-08-05 — 1-bosqich (gigiyena) bajarildi.** Quyidagi 6 ta ish amalga oshirildi, hammasi `tsc --noEmit` va `vite build` bilan tekshirildi (ikkalasi ham toza o'tadi):

1. `@types/react` + `@types/react-dom` o'rnatildi, `tsconfig.json` ga `"strict": true` va `"include": ["src"]` qo'shildi. `npm run lint` endi xatosiz ishlaydi.
2. `package.json` tozalandi: ishlatilmagan `@google/genai`, `express`, `better-sqlite3`, `dotenv`, `@types/express`, `tsx` olib tashlandi; `vite`/`@vitejs/plugin-react` takrorlanishi bartaraf etilib faqat `devDependencies`ga qo'yildi. Natija: 297 → 94 paket, 13 zaiflik (1 critical) → **0 zaiflik**.
3. [App.tsx:469](src/App.tsx:469) dagi `leaderboard-hero-paanel` typosi tuzatildi; [index.css](src/index.css) ga `.hide-scrollbar` va `.pb-safe` (safe-area-inset bilan) qo'shildi.
4. 7 ta ishlamaydigan `hover:bg-white/5`→`hover:bg-white/5` holati `hover:bg-white/10`ga ko'tarildi. Bonus: Quiz Builder'dagi tanlangan-quiz holati ([App.tsx:1219](src/App.tsx:1219)) endi `bg-amaranth/10 border-amaranth/20` bilan aniq ko'rinadi (avval faqat `shadow-sm` farq qilardi).
5. `replace.js` (idempotent bo'lmagan, xavfli codemod) o'chirildi; `App.tsx:1` dagi ishlatilmagan importlar (`useRef`, `useEffect`, `Bell`, `ChevronLeft`) tozalandi.
6. `package.json` nomi `"lingoglass"`ga, [index.html](index.html) `<title>` `"LingoGlass"`ga o'zgartirildi, [README.md](README.md) AI Studio shablonidan loyihaga xos matnga almashtirildi.

Qo'shimcha: `.claude/launch.json` yaratildi (dev-server preview uchun). Interaktiv click-through test bu sessiyada Browser pane ko'rinmaganligi sababli to'liq tasdiqlanmadi (React state yangilanishi flush bo'lmadi — muhit cheklovi, kod bilan bog'liq emas); build/typecheck va statik dashboard render orqali tekshirildi.

**2026-08-05 (ilk yozuv)** — Fayl yaratildi, loyiha birinchi marta to'liq o'qib chiqilib, arxitektura va muammolar ro'yxati hujjatlashtirildi.
