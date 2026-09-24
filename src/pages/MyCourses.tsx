import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { getCourseStats, type Course } from '../data/courses';
import { useCourses } from '../data/useCourses';
import { StatusPanel } from '../components/ui/StatusPanel';

export function MyCourses() {
  const navigate = useNavigate();
  const { courses, loading, error, reload } = useCourses();

  return (
    <div className="flex-1 flex flex-col gap-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <button className="text-sm font-medium text-amaranth hover:text-amaranth/80 transition-colors">View All</button>
      </div>

      {!courses || courses.length === 0 ? (
        <StatusPanel loading={loading} error={error} onRetry={reload} message="No courses available yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onContinue={() => navigate(`/courses/${course.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, onContinue }: { course: Course; onContinue: () => void }) {
  const { totalLessons, completedLessons, progress } = getCourseStats(course);
  const isCompleted = progress === 100;

  return (
    <div className="glass-panel rounded-3xl p-5 flex flex-col group hover:-translate-y-1 transition-all duration-300">
      <div className="h-40 rounded-2xl overflow-hidden mb-5 relative">
        <img
          src={`https://picsum.photos/seed/${course.image}/400/200`}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-charcoal">
          {course.level}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2">{course.title}</h3>

      <div className="flex items-center gap-4 text-sm text-navy/70 mb-5">
        <span className="flex items-center gap-1">
          <BookOpen size={14} /> {totalLessons} Lessons
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} /> {completedLessons}/{totalLessons} Done
        </span>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between text-xs font-medium mb-2">
          <span>{isCompleted ? 'Completed' : 'Progress'}</span>
          <span>{progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${course.title} progress`}
          className="w-full h-2 bg-navy/10 rounded-full overflow-hidden mb-4"
        >
          <div
            className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amaranth'}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <button
          onClick={onContinue}
          className={`w-full py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100' : 'bg-amaranth text-white hover:bg-amaranth/90 shadow-md shadow-amaranth/20'}`}
        >
          {isCompleted ? (
            <>
              <CheckCircle size={18} /> Review Course
            </>
          ) : (
            <>
              <PlayCircle size={18} /> Continue
            </>
          )}
        </button>
      </div>
    </div>
  );
}
