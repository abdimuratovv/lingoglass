-- LingoGlass — boshlang'ich kontent (seed)
--
-- Qo'llash tartibi: AVVAL migratsiya (supabase/migrations/20260817000000_init_schema.sql),
-- KEYIN shu fayl — SQL Editor'da qo'lda yoki `supabase db reset` (CLI seed.sql'ni o'zi ishga tushiradi).
-- Idempotent: qayta ishga tushirilsa hech narsa takrorlanmaydi va mavjud qatorlar o'zgarmaydi
-- (hamma joyda `on conflict do nothing`).
--
-- Manba: frontend'dagi hardcoded ma'lumot (src/data/courses.ts, Dashboard "Idiom of the Day",
-- AdminQuizBuilder). Kurs/dars qatorlari courses.ts'dan skript orqali generatsiya qilingan —
-- qo'lda ko'chirilmagan. Frontend Supabase'ga ulangandan keyin courses.ts'dagi coursesData
-- olib tashlanadi va shu fayl kontentning yagona manbai bo'ladi.
--
-- ATAYLAB KIRITILMAGAN:
--   * Foydalanuvchiga bog'liq ma'lumot — profiles, lesson_progress (courses.ts'dagi `completed`
--     bayroqlari demo-userning progressi, kontent emas), xp_events, notifications, admin_users.
--     Bular haqiqiy auth.users qatoriga bog'lanadi; soxta userlar production'ga seed qilinmaydi.
--     Leaderboard'dagi 8 ta ism ham shu sababli yo'q — u haqiqiy userlar XP yig'ganda to'ladi.
--   * resources — AdminContentManager'da faqat "Sample Resource Title N" bor, haqiqiy fayl yo'q.
--     Fayllar Storage bucket'i sozlangandan keyin admin panel orqali yuklanadi.

begin;

-- ============================================================
-- 1. KURSLAR
-- ============================================================
-- `image` — rasm URL emas, frontend ishlatadigan kalit (hozircha picsum seed'i).

insert into public.courses (id, title, level, image, description) values
  ('business-english', 'Advanced Business English', 'C1', 'business',
   'Master professional English for meetings, presentations, negotiations, and corporate communication.'),
  ('idioms-slang', 'Everyday Idioms & Slang', 'B2', 'conversation',
   'Learn common English idioms, slang expressions, and colloquialisms used in everyday conversation.'),
  ('grammar-tenses', 'Grammar Mastery: Tenses', 'B1', 'grammar',
   'Master all English tenses with clear explanations, examples, and practice exercises.'),
  ('toefl-prep', 'TOEFL Preparation', 'C1', 'exam',
   'Comprehensive TOEFL preparation covering reading, listening, speaking, and writing sections.')
on conflict (id) do nothing;

-- ============================================================
-- 2. DARSLAR
-- ============================================================
-- position = courses.ts'dagi dars `id`si (1 dan boshlab, uzilishsiz).
-- duration_minutes = "12 min" → 12.

insert into public.lessons (course_id, position, title, duration_minutes, type) values
  -- business-english (24 ta dars)
  ('business-english', 1, 'Introduction to Business Vocabulary', 12, 'video'),
  ('business-english', 2, 'Email Writing Essentials', 15, 'reading'),
  ('business-english', 3, 'Meeting Etiquette & Phrases', 18, 'video'),
  ('business-english', 4, 'Listening: Conference Calls', 10, 'listening'),
  ('business-english', 5, 'Business Idioms Quiz', 8, 'quiz'),
  ('business-english', 6, 'Presentation Skills Part 1', 20, 'video'),
  ('business-english', 7, 'Presentation Skills Part 2', 18, 'video'),
  ('business-english', 8, 'Negotiation Language', 15, 'reading'),
  ('business-english', 9, 'Listening: Negotiations', 12, 'listening'),
  ('business-english', 10, 'Mid-Course Assessment', 20, 'quiz'),
  ('business-english', 11, 'Report Writing', 16, 'reading'),
  ('business-english', 12, 'Financial Vocabulary', 14, 'video'),
  ('business-english', 13, 'Listening: Earnings Calls', 11, 'listening'),
  ('business-english', 14, 'Cross-Cultural Communication', 18, 'video'),
  ('business-english', 15, 'Review Quiz: Units 11-14', 10, 'quiz'),
  ('business-english', 16, 'Leadership Language', 16, 'video'),
  ('business-english', 17, 'Persuasive Writing', 14, 'reading'),
  ('business-english', 18, 'Listening: TED Talks', 20, 'listening'),
  ('business-english', 19, 'Conflict Resolution Phrases', 15, 'video'),
  ('business-english', 20, 'Advanced Email Strategies', 12, 'reading'),
  ('business-english', 21, 'Listening: Board Meetings', 18, 'listening'),
  ('business-english', 22, 'Public Speaking Mastery', 22, 'video'),
  ('business-english', 23, 'Case Study Analysis', 25, 'reading'),
  ('business-english', 24, 'Final Assessment', 30, 'quiz'),
  -- idioms-slang (18 ta dars)
  ('idioms-slang', 1, 'What Are Idioms?', 10, 'video'),
  ('idioms-slang', 2, 'Food & Cooking Idioms', 12, 'reading'),
  ('idioms-slang', 3, 'Listening: Idioms in Movies', 15, 'listening'),
  ('idioms-slang', 4, 'Animal Idioms', 12, 'video'),
  ('idioms-slang', 5, 'Quiz: Units 1-4', 8, 'quiz'),
  ('idioms-slang', 6, 'Weather & Nature Idioms', 14, 'video'),
  ('idioms-slang', 7, 'Body Language Idioms', 12, 'reading'),
  ('idioms-slang', 8, 'Listening: Song Lyrics', 16, 'listening'),
  ('idioms-slang', 9, 'Sport Idioms', 11, 'video'),
  ('idioms-slang', 10, 'Mid-Course Quiz', 10, 'quiz'),
  ('idioms-slang', 11, 'Money & Business Idioms', 13, 'video'),
  ('idioms-slang', 12, 'Slang in Social Media', 10, 'reading'),
  ('idioms-slang', 13, 'Listening: Podcasts', 18, 'listening'),
  ('idioms-slang', 14, 'Colour Idioms', 11, 'video'),
  ('idioms-slang', 15, 'Time & Life Idioms', 12, 'reading'),
  ('idioms-slang', 16, 'Regional Slang Variations', 15, 'video'),
  ('idioms-slang', 17, 'Idiom Pairs & Opposites', 10, 'reading'),
  ('idioms-slang', 18, 'Final Idiom Challenge', 20, 'quiz'),
  -- grammar-tenses (12 ta dars)
  ('grammar-tenses', 1, 'Simple Present Overview', 12, 'video'),
  ('grammar-tenses', 2, 'Present Continuous Usage', 10, 'reading'),
  ('grammar-tenses', 3, 'Simple Past Fundamentals', 14, 'video'),
  ('grammar-tenses', 4, 'Past Continuous & Interruptions', 12, 'listening'),
  ('grammar-tenses', 5, 'Quiz: Present & Past Tenses', 10, 'quiz'),
  ('grammar-tenses', 6, 'Present Perfect Explained', 16, 'video'),
  ('grammar-tenses', 7, 'Past Perfect & Sequencing', 14, 'reading'),
  ('grammar-tenses', 8, 'Future Tenses Overview', 15, 'video'),
  ('grammar-tenses', 9, 'Will vs. Going To', 10, 'listening'),
  ('grammar-tenses', 10, 'Quiz: Perfect & Future Tenses', 12, 'quiz'),
  ('grammar-tenses', 11, 'Mixed Tense Practice', 18, 'reading'),
  ('grammar-tenses', 12, 'Comprehensive Final Exam', 25, 'quiz'),
  -- toefl-prep (6 ta dars)
  ('toefl-prep', 1, 'TOEFL Overview & Strategy', 15, 'video'),
  ('toefl-prep', 2, 'Reading Section: Techniques', 20, 'reading'),
  ('toefl-prep', 3, 'Listening Section: Note-Taking', 18, 'listening'),
  ('toefl-prep', 4, 'Practice Quiz: Diagnostic', 25, 'quiz'),
  ('toefl-prep', 5, 'Reading: Academic Passages', 22, 'reading'),
  ('toefl-prep', 6, 'Listening: Lectures', 20, 'listening')
on conflict (course_id, position) do nothing;

-- ============================================================
-- 3. QUIZLAR
-- ============================================================
-- AdminQuizBuilder'dagi uchta quiz. UUID'lar qat'iy yozilgan — seed idempotent bo'lishi
-- (quizzes'da tabiiy unique kalit yo'q) va testlar/frontend ularga murojaat qila olishi uchun.
-- Faqat birinchisining savoli UI'da haqiqatan yozilgan (1 ta savol, 3 variant). Qolgan ikkitasi
-- UI'da "20 Qs"/"10 Qs" deb ko'rsatilgan bo'lsa ham, savol matni hech qayerda yo'q — o'ylab
-- topilmadi, savollarni admin Quiz Builder orqali qo'shadi.
-- lesson_id = null: qaysi quiz qaysi darsga tegishli ekani mock'da ko'rsatilmagan.
-- category: 1-quiz UI'da "Grammar"; qolgan ikkitasi nomiga ko'ra "Vocabulary" (UI'dagi
-- 4 variantdan — Grammar/Vocabulary/Reading/Listening — idiom/lug'at uchun mos keladigani).

insert into public.quizzes (id, lesson_id, title, level, category) values
  ('a0000000-0000-4000-8000-000000000001', null, 'Present Perfect vs Past Simple', 'B1', 'Grammar'),
  ('a0000000-0000-4000-8000-000000000002', null, 'Business Idioms Assessment', 'C1', 'Vocabulary'),
  ('a0000000-0000-4000-8000-000000000003', null, 'Travel Vocabulary Basics', 'A2', 'Vocabulary')
on conflict (id) do nothing;

insert into public.quiz_questions (id, quiz_id, position, question_text) values
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 1, 'I _____ to Paris three times.')
on conflict (id) do nothing;

insert into public.quiz_answer_options (id, question_id, option_text, is_correct, position) values
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'went', false, 1),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 'have been', true, 2),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'had gone', false, 3)
on conflict (id) do nothing;

-- ============================================================
-- 4. IDIOMLAR
-- ============================================================
-- Dashboard'dagi "Idiom of the Day". Hozircha bittasi — rotatsiya uchun admin qo'shadi.

insert into public.idioms (id, idiom_text, meaning, example) values
  ('d0000000-0000-4000-8000-000000000001', 'Piece of cake', 'Something that is very easy to do.',
   'The math test was a piece of cake.')
on conflict (id) do nothing;

commit;
