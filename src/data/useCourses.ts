import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { fetchCourses, type Course } from './courses';

interface Result {
  key: string;
  courses: Course[] | null;
  error: string | null;
}

/**
 * Joriy user uchun kurslar (progress bilan). `courseId` berilsa — faqat o'sha kurs.
 * `loading` alohida state emas, oxirgi natija joriy so'rovga tegishli emasligidan kelib chiqadi —
 * shu sababli effect ichida sinxron setState yo'q va eskirgan javob yangisining ustiga yozilmaydi.
 */
export function useCourses(courseId?: string) {
  const { user } = useAuth();
  const userId = user?.id;
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState<Result>({ key: '', courses: null, error: null });

  const key = `${userId ?? ''}|${courseId ?? ''}|${reloadCount}`;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchCourses(userId, courseId).then(
      (courses) => !cancelled && setResult({ key, courses, error: null }),
      (err: unknown) =>
        !cancelled && setResult({ key, courses: null, error: err instanceof Error ? err.message : String(err) }),
    );
    return () => {
      cancelled = true;
    };
  }, [key, userId, courseId]);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);
  const isCurrent = result.key === key;

  return {
    courses: isCurrent ? result.courses : null,
    error: isCurrent ? result.error : null,
    loading: !isCurrent,
    reload,
  };
}
