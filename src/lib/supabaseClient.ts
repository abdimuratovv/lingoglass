import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // `createClient` throws synchronously on an empty/invalid URL, which would crash the
  // whole app at import time before real credentials exist. We fall back to a syntactically
  // valid placeholder so the app still boots (and the UI mock-up still works standalone) --
  // actual auth/db calls will just fail over the network until ".env.local" is filled in.
  console.error(
    'Supabase konfiguratsiyasi topilmadi. ".env.example" faylini ".env.local"ga nusxalab, ' +
      "VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY qiymatlarini to'ldiring, so'ng dev serverni qayta ishga tushiring. " +
      "Hozircha auth/backend funksiyalari ishlamaydi, lekin UI maketi hardcoded ma'lumot bilan ishlashda davom etadi.",
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
);
