import { useCallback, useEffect, useEffectEvent, useState } from 'react';

interface Result<T> {
  key: string;
  reloadCount: number;
  data: T | null;
  error: string | null;
}

/**
 * Supabase'dan o'qiydigan data hook'larning umumiy asosi. `key` o'zgarganda yoki `reload()` chaqirilganda
 * `load()` ishga tushadi; `key = null` bo'lsa (masalan user hali yo'q) so'rov yuborilmaydi.
 *
 * `load` o'qiydigan barcha qiymatlar (userId, courseId, ...) `key`ga kirishi shart — effect faqat
 * `key`ga qarab qayta ishlaydi, `load`ning o'zi har renderda yangi funksiya bo'lishi mumkin.
 *
 * `loading` alohida state emas, oxirgi natija joriy kalitga tegishli emasligidan kelib chiqadi —
 * shu sababli effect ichida sinxron setState yo'q va eskirgan javob yangisining ustiga yozilmaydi.
 * `reload()` paytida eski ma'lumot ekranda qoladi (`refreshing`), yuklanish holatiga o'tmaydi.
 */
export function useAsyncData<T>(key: string | null, load: () => Promise<T>) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState<Result<T>>({ key: '', reloadCount: 0, data: null, error: null });
  const runLoad = useEffectEvent(load);

  useEffect(() => {
    if (key === null) return;
    let cancelled = false;
    runLoad().then(
      (data) => !cancelled && setResult({ key, reloadCount, data, error: null }),
      (err: unknown) =>
        !cancelled &&
        setResult({ key, reloadCount, data: null, error: err instanceof Error ? err.message : String(err) }),
    );
    return () => {
      cancelled = true;
    };
  }, [key, reloadCount]);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);
  const current = key !== null && result.key === key;

  return {
    data: current ? result.data : null,
    error: current ? result.error : null,
    loading: !current,
    refreshing: current && result.reloadCount !== reloadCount,
    reload,
  };
}
