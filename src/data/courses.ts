export interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'listening' | 'quiz';
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
 */
export function getCourseStats(course: Course): CourseStats {
  const totalLessons = course.lessonList.length;
  const completedLessons = course.lessonList.filter((l) => l.completed).length;
  const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  return { totalLessons, completedLessons, progress };
}

export const coursesData: Course[] = [
  {
    id: 'business-english',
    title: 'Advanced Business English',
    level: 'C1',
    image: 'business',
    description: 'Master professional English for meetings, presentations, negotiations, and corporate communication.',
    lessonList: [
      { id: 1, title: 'Introduction to Business Vocabulary', duration: '12 min', type: 'video', completed: true },
      { id: 2, title: 'Email Writing Essentials', duration: '15 min', type: 'reading', completed: true },
      { id: 3, title: 'Meeting Etiquette & Phrases', duration: '18 min', type: 'video', completed: true },
      { id: 4, title: 'Listening: Conference Calls', duration: '10 min', type: 'listening', completed: true },
      { id: 5, title: 'Business Idioms Quiz', duration: '8 min', type: 'quiz', completed: true },
      { id: 6, title: 'Presentation Skills Part 1', duration: '20 min', type: 'video', completed: true },
      { id: 7, title: 'Presentation Skills Part 2', duration: '18 min', type: 'video', completed: true },
      { id: 8, title: 'Negotiation Language', duration: '15 min', type: 'reading', completed: true },
      { id: 9, title: 'Listening: Negotiations', duration: '12 min', type: 'listening', completed: true },
      { id: 10, title: 'Mid-Course Assessment', duration: '20 min', type: 'quiz', completed: true },
      { id: 11, title: 'Report Writing', duration: '16 min', type: 'reading', completed: true },
      { id: 12, title: 'Financial Vocabulary', duration: '14 min', type: 'video', completed: true },
      { id: 13, title: 'Listening: Earnings Calls', duration: '11 min', type: 'listening', completed: true },
      { id: 14, title: 'Cross-Cultural Communication', duration: '18 min', type: 'video', completed: true },
      { id: 15, title: 'Review Quiz: Units 11-14', duration: '10 min', type: 'quiz', completed: true },
      { id: 16, title: 'Leadership Language', duration: '16 min', type: 'video', completed: false },
      { id: 17, title: 'Persuasive Writing', duration: '14 min', type: 'reading', completed: false },
      { id: 18, title: 'Listening: TED Talks', duration: '20 min', type: 'listening', completed: false },
      { id: 19, title: 'Conflict Resolution Phrases', duration: '15 min', type: 'video', completed: false },
      { id: 20, title: 'Advanced Email Strategies', duration: '12 min', type: 'reading', completed: false },
      { id: 21, title: 'Listening: Board Meetings', duration: '18 min', type: 'listening', completed: false },
      { id: 22, title: 'Public Speaking Mastery', duration: '22 min', type: 'video', completed: false },
      { id: 23, title: 'Case Study Analysis', duration: '25 min', type: 'reading', completed: false },
      { id: 24, title: 'Final Assessment', duration: '30 min', type: 'quiz', completed: false },
    ],
  },
  {
    id: 'idioms-slang',
    title: 'Everyday Idioms & Slang',
    level: 'B2',
    image: 'conversation',
    description: 'Learn common English idioms, slang expressions, and colloquialisms used in everyday conversation.',
    lessonList: [
      { id: 1, title: 'What Are Idioms?', duration: '10 min', type: 'video', completed: true },
      { id: 2, title: 'Food & Cooking Idioms', duration: '12 min', type: 'reading', completed: true },
      { id: 3, title: 'Listening: Idioms in Movies', duration: '15 min', type: 'listening', completed: true },
      { id: 4, title: 'Animal Idioms', duration: '12 min', type: 'video', completed: true },
      { id: 5, title: 'Quiz: Units 1-4', duration: '8 min', type: 'quiz', completed: true },
      { id: 6, title: 'Weather & Nature Idioms', duration: '14 min', type: 'video', completed: false },
      { id: 7, title: 'Body Language Idioms', duration: '12 min', type: 'reading', completed: false },
      { id: 8, title: 'Listening: Song Lyrics', duration: '16 min', type: 'listening', completed: false },
      { id: 9, title: 'Sport Idioms', duration: '11 min', type: 'video', completed: false },
      { id: 10, title: 'Mid-Course Quiz', duration: '10 min', type: 'quiz', completed: false },
      { id: 11, title: 'Money & Business Idioms', duration: '13 min', type: 'video', completed: false },
      { id: 12, title: 'Slang in Social Media', duration: '10 min', type: 'reading', completed: false },
      { id: 13, title: 'Listening: Podcasts', duration: '18 min', type: 'listening', completed: false },
      { id: 14, title: 'Colour Idioms', duration: '11 min', type: 'video', completed: false },
      { id: 15, title: 'Time & Life Idioms', duration: '12 min', type: 'reading', completed: false },
      { id: 16, title: 'Regional Slang Variations', duration: '15 min', type: 'video', completed: false },
      { id: 17, title: 'Idiom Pairs & Opposites', duration: '10 min', type: 'reading', completed: false },
      { id: 18, title: 'Final Idiom Challenge', duration: '20 min', type: 'quiz', completed: false },
    ],
  },
  {
    id: 'grammar-tenses',
    title: 'Grammar Mastery: Tenses',
    level: 'B1',
    image: 'grammar',
    description: 'Master all English tenses with clear explanations, examples, and practice exercises.',
    lessonList: [
      { id: 1, title: 'Simple Present Overview', duration: '12 min', type: 'video', completed: true },
      { id: 2, title: 'Present Continuous Usage', duration: '10 min', type: 'reading', completed: true },
      { id: 3, title: 'Simple Past Fundamentals', duration: '14 min', type: 'video', completed: true },
      { id: 4, title: 'Past Continuous & Interruptions', duration: '12 min', type: 'listening', completed: true },
      { id: 5, title: 'Quiz: Present & Past Tenses', duration: '10 min', type: 'quiz', completed: true },
      { id: 6, title: 'Present Perfect Explained', duration: '16 min', type: 'video', completed: true },
      { id: 7, title: 'Past Perfect & Sequencing', duration: '14 min', type: 'reading', completed: true },
      { id: 8, title: 'Future Tenses Overview', duration: '15 min', type: 'video', completed: true },
      { id: 9, title: 'Will vs. Going To', duration: '10 min', type: 'listening', completed: true },
      { id: 10, title: 'Quiz: Perfect & Future Tenses', duration: '12 min', type: 'quiz', completed: true },
      { id: 11, title: 'Mixed Tense Practice', duration: '18 min', type: 'reading', completed: true },
      { id: 12, title: 'Comprehensive Final Exam', duration: '25 min', type: 'quiz', completed: true },
    ],
  },
  {
    id: 'toefl-prep',
    title: 'TOEFL Preparation',
    level: 'C1',
    image: 'exam',
    description: 'Comprehensive TOEFL preparation covering reading, listening, speaking, and writing sections.',
    lessonList: [
      { id: 1, title: 'TOEFL Overview & Strategy', duration: '15 min', type: 'video', completed: true },
      { id: 2, title: 'Reading Section: Techniques', duration: '20 min', type: 'reading', completed: true },
      { id: 3, title: 'Listening Section: Note-Taking', duration: '18 min', type: 'listening', completed: true },
      { id: 4, title: 'Practice Quiz: Diagnostic', duration: '25 min', type: 'quiz', completed: true },
      { id: 5, title: 'Reading: Academic Passages', duration: '22 min', type: 'reading', completed: false },
      { id: 6, title: 'Listening: Lectures', duration: '20 min', type: 'listening', completed: false },
    ],
  },
];
