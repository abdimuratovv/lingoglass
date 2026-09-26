import { useAuth } from '../context/useAuth';
import { fetchCourses } from './courses';
import { useAsyncData } from './useAsyncData';

/**
 * Joriy user uchun kurslar (progress bilan). `courseId` berilsa — faqat o'sha kurs.
 * `reload()` paytida eski ma'lumot ekranda qoladi (`refreshing`), sahifa yuklanish paneliga o'tmaydi.
 */
export function useCourses(courseId?: string) {
  const { user } = useAuth();
  const userId = user?.id;
  const { data, ...state } = useAsyncData(userId ? `${userId}|${courseId ?? ''}` : null, () =>
    userId ? fetchCourses(userId, courseId) : Promise.resolve([]),
  );
  return { courses: data, ...state };
}
