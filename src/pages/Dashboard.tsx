import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Star,
  PlayCircle,
  ChevronRight,
  Clock,
  TrendingUp,
  CheckCircle,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useProfile } from '../context/useProfile';
import { displayName } from '../context/profileContext';
import { useRecentActivity } from '../data/useRecentActivity';
import type { XpEvent, XpSourceType } from '../data/xp';
import { formatRelativeTime } from '../lib/time';
import { StatusPanel } from '../components/ui/StatusPanel';

export function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const firstName = displayName(profile, user?.email).split(/\s+/)[0];

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 pb-20 md:pb-0">
      {/* Left Column */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-amaranth/10 rounded-full blur-2xl"></div>
          <div className="absolute right-20 -bottom-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome back{firstName ? `, ${firstName}` : ''}! 👋</h2>
            <p className="text-navy/70 mb-6 max-w-md">
              You've learned 24 new words this week. Keep up the great work and reach your daily goal!
            </p>
            <button className="bg-amaranth hover:bg-amaranth/90 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-amaranth/20 transition-all flex items-center gap-2">
              Continue Learning <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* My Learning Path */}
        <LearningPathSection />

        {/* Feature Cards Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4 px-2">Core Skills</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard icon={<Headphones size={24} />} title="Listening" color="text-navy" progress={75} />
            <FeatureCard icon={<BookOpen size={24} />} title="Reading" color="text-amaranth" progress={40} />
            <FeatureCard icon={<PenLine size={24} />} title="Writing" color="text-navy" progress={55} />
            <FeatureCard icon={<Mic size={24} />} title="Speaking" color="text-amaranth" progress={20} />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivitySection />
      </div>

      {/* Right Column */}
      <div className="w-full xl:w-80 flex flex-col gap-6">
        {/* Idiom of the Day Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-panel rounded-3xl p-5 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                <Star size={14} className="text-amber-500" />
              </div>
              Idiom of the Day
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/15">
              Daily
            </span>
          </div>

          {/* Compact Image */}
          <div className="h-36 rounded-2xl overflow-hidden relative group mb-4 border border-white/10">
            <img
              src="https://picsum.photos/seed/comic/400/400?blur=1"
              alt="Idiom Illustration"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="text-xl font-bold text-white leading-tight">"Piece of cake"</h4>
            </div>
          </div>

          {/* Meaning */}
          <p className="text-sm text-navy/80 mb-3 leading-relaxed">
            <span className="font-semibold text-charcoal">Meaning:</span> Something that is very easy to do.
          </p>

          {/* Example */}
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 mb-4">
            <p className="text-xs font-medium text-navy/50 uppercase tracking-wider mb-1">Example</p>
            <p className="text-sm italic text-navy/80">"The math test was a piece of cake."</p>
          </div>

          {/* Pronunciation Button */}
          <button className="w-full bg-charcoal hover:bg-charcoal/90 text-white py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-md">
            <PlayCircle size={16} /> Listen to Pronunciation
          </button>

          {/* Next idiom link */}
          <button className="w-full text-xs text-navy/50 hover:text-amaranth font-medium mt-3 transition-colors flex items-center justify-center gap-1">
            Next idiom <ChevronRight size={14} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function LearningPathSection() {
  // Simulating dynamic recommendation based on user data
  const userLevel = 'B1';
  const recentFocus = 'Vocabulary';

  const recommendedLesson = {
    title: 'Business Meetings: Phrasal Verbs',
    type: recentFocus,
    level: `${userLevel} Intermediate`,
    duration: '15 mins',
    description:
      'Based on your recent focus on vocabulary, learn essential phrasal verbs used in professional settings.',
    image: 'meeting',
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 px-2 flex items-center gap-2">
        <TrendingUp size={20} className="text-amaranth" /> My Learning Path
      </h3>
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-full sm:w-40 h-32 rounded-2xl overflow-hidden relative shrink-0 shadow-sm border border-white/10">
            <img
              src={`https://picsum.photos/seed/${recommendedLesson.image}/400/300`}
              alt={recommendedLesson.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 left-2 bg-white/5 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-charcoal uppercase tracking-wider shadow-sm">
              Up Next
            </div>
          </div>

          <div className="flex-1 flex flex-col h-full w-full">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold text-amaranth bg-amaranth/10 px-2 py-1 rounded-md border border-amaranth/20">
                {recommendedLesson.type}
              </span>
              <span className="text-xs font-medium text-navy/70 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                <Clock size={12} /> {recommendedLesson.duration}
              </span>
              <span className="text-xs font-medium text-navy/70 bg-white/5 px-2 py-1 rounded-md sm:ml-auto">
                {recommendedLesson.level}
              </span>
            </div>

            <h4 className="text-xl font-bold mb-2 text-charcoal">{recommendedLesson.title}</h4>
            <p className="text-sm text-navy/70 mb-4 line-clamp-2">{recommendedLesson.description}</p>

            <div className="mt-auto flex items-center gap-4">
              <button className="bg-charcoal hover:bg-charcoal/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-md">
                <PlayCircle size={18} /> Start Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ACTIVITY_ICONS: Record<XpSourceType, ReactNode> = {
  lesson_completed: <BookOpen size={18} />,
  quiz_answer_correct: <CheckCircle size={18} />,
  streak_bonus: <Flame size={18} />,
};

function RecentActivitySection() {
  const { events, loading, error, reload } = useRecentActivity(5);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 px-2">Recent Activity</h3>
      {loading || error || events?.length === 0 ? (
        <StatusPanel
          loading={loading}
          error={error}
          onRetry={reload}
          message="No activity yet — complete a lesson to earn your first XP."
        />
      ) : (
        <ul className="glass-panel rounded-3xl p-2">
          {events?.map((event) => (
            <ActivityRow key={event.id} event={event} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ActivityRow({ event }: { event: XpEvent }) {
  return (
    <li className="flex items-center justify-between gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-navy shadow-sm shrink-0"
        >
          {ACTIVITY_ICONS[event.sourceType] ?? <Star size={18} />}
        </div>
        <div className="min-w-0">
          <h5 className="font-medium text-sm truncate">{event.title}</h5>
          <time
            dateTime={event.createdAt}
            title={new Date(event.createdAt).toLocaleString('en')}
            className="text-xs text-navy/60"
          >
            {formatRelativeTime(event.createdAt)}
          </time>
        </div>
      </div>
      <span className="text-sm font-semibold text-amaranth bg-amaranth/10 px-2 py-1 rounded-md shrink-0">
        +{event.xpAmount} XP
      </span>
    </li>
  );
}

function FeatureCard({
  icon,
  title,
  color,
  progress,
}: {
  icon: ReactNode;
  title: string;
  color: string;
  progress: number;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group flex flex-col h-full">
      <div
        className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform shadow-sm`}
      >
        {icon}
      </div>
      <h4 className="font-semibold mb-3 mt-auto">{title}</h4>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title} progress: ${progress}%`}
        className="w-full h-1.5 bg-navy/10 rounded-full overflow-hidden"
      >
        <div className="h-full bg-amaranth rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
