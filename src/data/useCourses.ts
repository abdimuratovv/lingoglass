import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { fetchCourses, type Course } from './courses';

interface Result {
  dataKey: string;
  reloadCount: number;
  courses: Course[] | null;
  error: string | null;
}

/**
 * Joriy user uchun kurslar (progress bilan). `courseId` berilsa — faqat o'sha kurs.
 * `loading` alohida state emas, oxirgi natija joriy so'rovga tegishli emasligidan kelib chiqadi —
 * shu sababli effect ichida sinxron setState yo'q va eskirgan javob yangisining ustiga yozilmaydi.
 * `reload()` paytida eski ma'lumot ekranda qoladi (`refreshing`), sahifa yuklanish paneliga o'tmaydi.
 */
export function useCourses(courseId?: string) {
  const { user } = useAuth();
  const userId = user?.id;
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState<Result>({ dataKey: '', reloadCount: 0, courses: null, error: null });

  const dataKey = `${userId ?? ''}|${courseId ?? ''}`;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchCourses(userId, courseId).then(
      (courses) => !cancelled && setResult({ dataKey, reloadCount, courses, error: null }),
      (err: unknown) =>
        !cancelled &&
        setResult({ dataKey, reloadCount, courses: null, error: err instanceof Error ? err.message : String(err) }),
    );
    return () => {
      cancelled = true;
    };
  }, [dataKey, reloadCount, userId, courseId]);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);
  const sameData = result.dataKey === dataKey;

  return {
    courses: sameData ? result.courses : null,
    error: sameData ? result.error : null,
    loading: !sameData,
    refreshing: sameData && result.reloadCount !== reloadCount,
    reload,
  };
}
