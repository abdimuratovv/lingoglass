# CLAUDE.md

Bu fayl **LingoGlass** loyihasi bo'yicha Claude uchun doimiy gid (Obsidian/ikkinchi miya o'rnini bosuvchi). Yangi chat boshlanganda barcha fayllarni qayta o'qib token sarflash shart emas — shu faylni o'qish yetarli. Loyihada muhim o'zgarish qilinganda (arxitektura, dependency, konvensiya, yangi muammo) ushbu faylni ham yangilab qo'yish kerak — "Oxirgi yangilanish" bo'limiga sana va nima o'zgargani yoziladi.

## 1. Loyiha nima

**LingoGlass** — ingliz tili o'rganish platformasi uchun **frontend dashboard prototipi**. Dizayn konsepsiyasi: _Light Theme Liquid Glassmorphism_ — shaffof/blur'langan panellar + `layoutId` orqali "suyuq" navigatsiya indikatori.

**Hozirgi holat: faqat UI maketi, lekin endi ko'p fayllik arxitektura va client-side routing bilan.** Backend, auth, DB, real API chaqiruvi yo'q — shu jumladan Gemini AI ham, va endi bundle'da uning kaliti uchun joy ham yo'q (§8 ga qarang). Barcha ma'lumot (`coursesData`, leaderboard, userlar) hardcoded, lekin endi mavzu bo'yicha alohida fayllarga bo'lingan (§3 ga qarang).

Git repozitoriy — **ha**. Remote: <https://github.com/abdimuratovv/lingoglass> (`origin`, `main` branch). 2026-08-21 da `git init` qilinib, bitta boshlang'ich commit bilan push qilindi — §8 dagi 2026-08-21 yozuviga qarang.

## 2. Texnologiyalar

| Qatlam     | Yechim                                               | Versiya                                      |
| ---------- | ---------------------------------------------------- | -------------------------------------------- |
| UI         | React + TypeScript                                   | React 19.2.8, TS ~5.8                        |
| Build      | Vite                                                 | 6.x, port 3000 (dev) / 4173 (preview)        |
| Routing    | `react-router-dom`                                   | 7.18.2 — pastdagi eslatmaga qarang           |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`) + custom CSS   | —                                            |
| Animatsiya | `motion` (Framer Motion)                             | `LayoutGroup`, `AnimatePresence`, `layoutId` |
| Ikonkalar  | `lucide-react`                                       | —                                            |
| Rasmlar    | tashqi `picsum.photos` (placeholder, hali real emas) | —                                            |

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
├── .gitignore                → node_modules/dist/.env*/.claude/settings.local.json va h.k.
├── .editorconfig             → utf-8, LF, 2 space indent
├── .gitattributes            → `* text=auto eol=lf` — Windows core.autocrlf=true ni bekor qiladi (§8 dagi 2026-08-21 yozuviga qarang)
├── .nvmrc                    → "22" (ESLint 10 uchun Node 22.13+ kerak)
├── .github/workflows/ci.yml  → GitHub Actions: npm ci → lint → typecheck → format:check → build (Node 22.x)
├── .claude/launch.json       → preview_start konfiguratsiyalari: lingoglass-dev (npm run dev, 3000), lingoglass-preview (npm run preview, 4173)
├── src/
│   ├── main.tsx              → StrictMode + BrowserRouter + createRoot entry point
│   ├── index.css             → Tailwind @theme tokenlar + glassmorphism CSS sinflari + hide-scrollbar/pb-safe
│   ├── App.tsx                → ~53 qator: layout shell (Sidebar + TopNav + MobileNav) + <Routes>
│   ├── data/
│   │   └── courses.ts         → Course/Lesson type, coursesData, getCourseStats() — progress% shu yerdan hisoblanadi
│   ├── components/
│   │   ├── TopNav.tsx          → ~333 qator: qidiruv/bildirishnoma/profil paneli (o'zgarmagan)
│   │   ├── Sidebar.tsx          → desktop sidebar, useLocation() orqali active holat
│   │   ├── MobileNav.tsx        → mobil pastki nav, useLocation() orqali active holat
│   │   └── ui/
│   │       └── Toggle.tsx        → Settings'dagi takrorlangan switch markup shu yerga chiqarilgan
│   └── pages/
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
    └── migrations/
        └── 20260817000000_init_schema.sql → boshlang'ich backend schema qoralamasi (§8 dagi 2026-08-17 yozuviga qarang) — hali hech qanday Supabase loyihasiga qarshi qo'llanmagan/sinalmagan, faqat SQL fayl sifatida yozilgan
```

## 4. Arxitektura / navigatsiya

Router **bor** — `react-router-dom` (`BrowserRouter`, [src/main.tsx](src/main.tsx) da `<App />`ni o'raydi). Marshrutlar [src/App.tsx](src/App.tsx) da e'lon qilingan:

| Yo'l                 | Komponent                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `/`                  | `Dashboard`                                                                                |
| `/courses`           | `MyCourses`                                                                                |
| `/courses/:courseId` | `CourseDetail` — `courseId` `coursesData`da topilmasa `<Navigate to="/courses" replace />` |
| `/leaderboard`       | `Leaderboard`                                                                              |
| `/settings`          | `Settings`                                                                                 |
| `/admin`             | `AdminPage` (ichida `content`/`quizzes`/`users` tab'lari `useState` bilan)                 |
| `*` (noma'lum yo'l)  | `<Navigate to="/" replace />`                                                              |

`Sidebar`/`MobileNav` faol holatni `useLocation().pathname`dan hisoblaydi (`/courses/:id` ham "My Courses"ni yoritadi, chunki `startsWith('/courses')` tekshiriladi). Ikkalasi ham endi haqiqiy `<Link>` (`<a href>`) — avvalgi `<button onClick={setState}>` o'rniga.

Sahifa o'tish animatsiyasi: `AnimatePresence mode="wait"` + `motion.div key={location.pathname}`, ichida `<Routes location={location}>`. **Eslatma:** bu animatsiya `requestAnimationFrame`ga tayanadi — brauzer tab compositing qilmasa (masalan headless/background avtomatlashtirilgan muhitda), exit-animatsiya hech qachon "tugamaydi" va yangi sahifa mount bo'lib ulgurmaydi. Bu xatti-harakat **asl kodda ham bor edi** (routing qo'shilishidan oldin ham xuddi shunday `AnimatePresence` naqshi ishlatilgan), ya'ni bu routing bilan bog'liq emas — oddiy brauzerda muammo yo'q, buni to'g'ridan-to'g'ri URL orqali navigatsiya qilib (barcha 7 marshrutda) tasdiqladim. Agar kelajakda shu joyda "click ishlayapti-yu lekin ekran yangilanmayapti" degan holat kuzatilsa — birinchi navbatda shu eslatmani yodda tuting, buni qayta debug qilib vaqt sarflashning hojati yo'q.

**Sahifalar tarkibi:**

- `Dashboard` — welcome banner, `LearningPathSection`, 4 ta core skill card, recent activity, "Idiom of the Day"
- `MyCourses` → `CourseDetail` — kurslar grid'i, bosilganda `/courses/:id`ga navigate qiladi
- `Leaderboard` — top-3 podium + qolgan reyting
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
2. Test yo'q (ESLint + Prettier endi bor, §8 dagi 5-bosqich yozuviga qarang), CI ham yo'q.
3. Backend yo'q — auth, real progress persistensiyasi, XP tizimi hali frontend'ga ulanmagan (schema qoralamasi tayyor, §8 dagi 2026-08-17 yozuviga qarang, lekin haqiqiy Supabase loyihasi hali yaratilmagan va frontend hamon 100% hardcoded data bilan ishlaydi). AI (Gemini) funksiyasi ham yo'q — agar kelajakda qo'shilsa, kalit **faqat server tomonda** (proxy orqali) saqlanishi kerak, `vite.config.ts`dagi `define` orqali klient bundle'ga inject qilinmasin (§8 dagi 2026-08-05 yozuviga qarang — bu xato allaqachon bir marta tuzatilgan).

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

## 8. Oxirgi yangilanish

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
