import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, CheckCircle, PlayCircle, Play, FileText, Volume2, Lock } from 'lucide-react';
import { coursesData, getCourseStats } from '../data/courses';

function lessonTypeIcon(type: string) {
  switch (type) {
    case 'video':
      return <Play size={16} />;
    case 'reading':
      return <FileText size={16} />;
    case 'listening':
      return <Volume2 size={16} />;
    case 'quiz':
      return <CheckCircle size={16} />;
    default:
      return <BookOpen size={16} />;
  }
}

function lessonTypeBg(type: string) {
  switch (type) {
    case 'video':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'reading':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'listening':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'quiz':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const course = coursesData.find((c) => c.id === courseId);

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const { totalLessons, completedLessons, progress } = getCourseStats(course);
  const isCompleted = progress === 100;
  const nextLessonIndex = course.lessonList.findIndex((l) => !l.completed);

  return (
    <div className="flex-1 flex flex-col gap-6 pb-20 md:pb-0 max-w-4xl mx-auto w-full">
      {/* Back Button */}
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-charcoal/70 hover:text-charcoal font-medium transition-colors w-fit px-2"
      >
        <ArrowLeft size={18} /> Back to My Courses
      </button>

      {/* Course Hero */}
      <div className="leaderboard-hero-panel rounded-3xl relative overflow-hidden">
        <div className="h-48 md:h-56 relative">
          <img
            src={`https://picsum.photos/seed/${course.image}/800/400`}
            alt={course.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                {course.level}
              </span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                <BookOpen size={12} /> {totalLessons} Lessons
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{course.title}</h2>
          </div>
        </div>

        <div className="p-6 md:p-8 pt-5">
          <p className="text-charcoal/70 mb-5">{course.description}</p>

          <div className="flex flex-wrap items-center gap-4">
            {/* Progress bar */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>{isCompleted ? 'Completed' : 'Progress'}</span>
                <span>
                  {completedLessons}/{totalLessons} lessons · {progress}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Course progress"
                className="w-full h-2.5 bg-navy/10 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full rounded-full transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-amaranth'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Action button */}
            {!isCompleted && nextLessonIndex !== -1 && (
              <button className="bg-amaranth hover:bg-amaranth/90 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-amaranth/20 transition-all flex items-center gap-2 shrink-0">
                <PlayCircle size={18} /> Continue Lesson {nextLessonIndex + 1}
              </button>
            )}
            {isCompleted && (
              <span className="flex items-center gap-2 text-emerald-600 font-semibold bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                <CheckCircle size={18} /> Course Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 px-2">Course Lessons</h3>
        <div className="leaderboard-hero-panel rounded-3xl p-2 md:p-4">
          {course.lessonList.map((lesson, idx) => {
            const isNext = idx === nextLessonIndex;
            return (
              <div
                key={lesson.id}
                className={`flex items-center p-3 md:p-4 rounded-2xl transition-colors group cursor-pointer ${
                  isNext
                    ? 'bg-amaranth/8 border border-amaranth/15'
                    : lesson.completed
                      ? 'hover:bg-white/10'
                      : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                {/* Lesson number */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 shrink-0 ${
                    lesson.completed
                      ? 'bg-emerald-100 text-emerald-600'
                      : isNext
                        ? 'bg-amaranth/10 text-amaranth'
                        : 'bg-navy/5 text-charcoal/40'
                  }`}
                >
                  {lesson.completed ? <CheckCircle size={16} /> : lesson.id}
                </div>

                {/* Type icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mr-3 border shrink-0 ${lessonTypeBg(lesson.type)}`}
                >
                  {lessonTypeIcon(lesson.type)}
                </div>

                {/* Title & meta */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-medium text-sm truncate ${lesson.completed ? 'text-charcoal' : isNext ? 'text-charcoal font-semibold' : 'text-charcoal/60'}`}
                  >
                    {lesson.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-charcoal/50 capitalize">{lesson.type}</span>
                    <span className="text-xs text-charcoal/40 flex items-center gap-1">
                      <Clock size={10} /> {lesson.duration}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0 ml-2">
                  {isNext && (
                    <button className="bg-amaranth text-white text-xs font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-amaranth/90 transition-colors flex items-center gap-1.5">
                      <Play size={12} /> Start
                    </button>
                  )}
                  {lesson.completed && <span className="text-xs text-emerald-500 font-medium">Done</span>}
                  {!lesson.completed && !isNext && (
                    <>
                      <span className="sr-only">Locked</span>
                      <Lock aria-hidden="true" size={14} className="text-charcoal/25" />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
