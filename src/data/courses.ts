import { supabase } from '../lib/supabaseClient';

export type LessonType = 'video' | 'reading' | 'listening' | 'quiz';

export interface Lesson {
  id: string;
  /** Kurs ichidagi tartib raqami (1 dan boshlab) — UI'da dars raqami sifatida ko'rsatiladi. */
  position: number;
  title: string;
  durationMinutes: number;
  type: LessonType;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  level: string;
  image: string;
  description: string;
  lessonList: Lesson[];
}

export interface CourseStats {
  totalLessons: number;
  completedLessons: number;
  progress: number;
}

/**
 * lessonList — kursning yagona haqiqat manbai. Umumiy/tugallangan dars soni va
 * progress% shu yerdan hisoblanadi, alohida hardcode qilinmaydi — aks holda
 * ular vaqt o'tishi bilan bir-biridan uzilib qolishi mumkin (ilgari shunday bo'lgan edi).
 * Mantiq bazadagi get_course_stats() SQL funksiyasi bilan bir xil.
 */
export function getCourseStats(course: Course): CourseStats {
  const totalLessons = course.lessonList.length;
  const completedLessons = course.lessonList.filter((l) => l.completed).length;
  const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  return { totalLessons, completedLessons, progress };
}

/**
 * Darsni joriy user uchun tugallangan deb belgilaydi (complete_lesson() RPC). Berilgan XP'ni
 * qaytaradi — dars avval tugatilgan bo'lsa 0. Oldingi darslar tugallanmagan bo'lsa server rad etadi.
 */
export async function completeLesson(lessonId: string): Promise<number> {
  const { data, error } = await supabase.rpc('complete_lesson', { p_lesson_id: lessonId });
  if (error) throw new Error(error.message);
  return typeof data === 'number' ? data : 0;
}

interface LessonRow {
  id: string;
  position: number;
  title: string;
  duration_minutes: number;
  type: LessonType;
}

interface CourseRow {
  id: string;
  title: string;
  level: string;
  image: string;
  description: string;
  lessons: LessonRow[];
}

/**
 * Kurslar + ularning darslari + joriy userning progressi. `courseId` berilsa faqat o'sha kurs.
 * Kontent (courses/lessons) va progress (lesson_progress) ikki parallel so'rov bilan olinadi,
 * `completed` bayrog'i client'da birlashtiriladi — lesson_progress RLS bo'yicha faqat o'z qatorlarini beradi.
 */
export async function fetchCourses(userId: string, courseId?: string): Promise<Course[]> {
  let coursesQuery = supabase
    .from('courses')
    .select('id, title, level, image, description, lessons (id, position, title, duration_minutes, type)')
    .order('id')
    .order('position', { referencedTable: 'lessons' });
  if (courseId) coursesQuery = coursesQuery.eq('id', courseId);

  const [coursesRes, progressRes] = await Promise.all([
    coursesQuery.overrideTypes<CourseRow[], { merge: false }>(),
    supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .overrideTypes<{ lesson_id: string }[], { merge: false }>(),
  ]);

  if (coursesRes.error) throw new Error(coursesRes.error.message);
  if (progressRes.error) throw new Error(progressRes.error.message);

  const completedIds = new Set(progressRes.data.map((p) => p.lesson_id));

  return coursesRes.data.map((c) => ({
    id: c.id,
    title: c.title,
    level: c.level,
    image: c.image,
    description: c.description,
    lessonList: c.lessons.map((l) => ({
      id: l.id,
      position: l.position,
      title: l.title,
      durationMinutes: l.duration_minutes,
      type: l.type,
      completed: completedIds.has(l.id),
    })),
  }));
}
