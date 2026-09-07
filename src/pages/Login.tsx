import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export function Login() {
  const { session, loading, signIn, signUp } = useAuth();
  const location = useLocation();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auth holati tiklanmoqda -- hali qayoqqa redirect qilishni bilmaymiz.
  if (loading) return null;

  // Allaqachon tizimga kirgan bo'lsa, /login'ga kelgan joyidan qaytariladi.
  if (session) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password, fullName);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === 'signup') {
      setInfo("Ro'yxatdan o'tish muvaffaqiyatli! Tasdiqlash uchun emailingizni tekshiring.");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal">LingoGlass</h1>
          <p className="text-sm text-navy/60 mt-1">
            {mode === 'signin' ? 'Hisobingizga kiring' : 'Yangi hisob yarating'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-charcoal">To'liq ism</span>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <User size={16} className="text-navy/50" aria-hidden="true" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-navy/40"
                  placeholder="Ism Familiya"
                  autoComplete="name"
                />
              </div>
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-charcoal">Email</span>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <Mail size={16} className="text-navy/50" aria-hidden="true" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-navy/40"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-charcoal">Parol</span>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <Lock size={16} className="text-navy/50" aria-hidden="true" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-navy/40"
                placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>
          </label>

          {error && (
            <p role="alert" className="text-sm text-amaranth bg-amaranth/10 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="text-sm text-charcoal bg-white/10 rounded-xl px-3 py-2">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex items-center justify-center gap-2 bg-amaranth hover:bg-amaranth/90 disabled:opacity-60 text-white rounded-xl text-sm font-medium py-2.5 transition-colors shadow-md shadow-amaranth/20"
          >
            {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {mode === 'signin' ? 'Kirish' : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError(null);
            setInfo(null);
          }}
          className="text-sm text-navy/70 hover:text-amaranth transition-colors text-center"
        >
          {mode === 'signin' ? "Hisobingiz yo'qmi? Ro'yxatdan o'ting" : 'Hisobingiz bormi? Kiring'}
        </button>
      </div>
    </div>
  );
}
