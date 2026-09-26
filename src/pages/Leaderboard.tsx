import { Link } from 'react-router-dom';
import { Trophy, Award, TrendingUp, Minus } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { avatarUrl } from '../context/profileContext';
import { useLeaderboard } from '../data/useLeaderboard';
import { leaderboardName, type LeaderboardEntry, type LeaderboardTrend } from '../data/xp';
import { StatusPanel } from '../components/ui/StatusPanel';

type Place = 1 | 2 | 3;

/** Podium joyi bo'yicha bezak (rank emas — teng XP'da ikki kishi bir xil rank olishi mumkin). */
const PODIUM_STYLES: Record<Place, { ring: string; badge: string; stand: string; avatar: string }> = {
  1: {
    ring: 'bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-lg shadow-amber-400/30 ring-2 ring-amber-300/40 ring-offset-2 ring-offset-white/20',
    badge: 'bg-gradient-to-br from-amber-400 to-amber-500 text-white text-sm',
    stand: 'podium-stand podium-stand-gold w-24 md:w-28 h-32',
    avatar: 'w-20 h-20',
  },
  2: {
    ring: 'bg-gradient-to-tr from-gray-400 to-gray-200 shadow-md',
    badge: 'bg-gradient-to-br from-gray-300 to-gray-400 text-charcoal text-xs',
    stand: 'podium-stand w-20 md:w-24 h-24',
    avatar: 'w-16 h-16',
  },
  3: {
    ring: 'bg-gradient-to-tr from-orange-400 to-amber-600 shadow-md',
    badge: 'bg-gradient-to-br from-orange-400 to-orange-500 text-white text-xs',
    stand: 'podium-stand w-20 md:w-24 h-20',
    avatar: 'w-16 h-16',
  },
};

export function Leaderboard() {
  const { user } = useAuth();
  const { leaderboard, loading, error, reload } = useLeaderboard();

  const entries = leaderboard?.entries ?? [];
  const me = leaderboard?.me ?? null;
  const topThree = entries.slice(0, 3);
  const restOfList = entries.slice(3);
  const isMe = (entry: LeaderboardEntry) => entry.userId === user?.id;
  const meInList = entries.some(isMe);
  // Podiumda bo'lsa — alohida ajratib ko'rsatiladi; ro'yxatdan tashqarida (top 50 dan keyin) bo'lsa ham.
  const showMyPosition = me !== null && (topThree.some(isMe) || !meInList);

  return (
    <div className="flex-1 flex flex-col gap-6 pb-20 md:pb-0 max-w-4xl mx-auto w-full">
      {/* Glassmorphism Hero Panel — Title + Podium */}
      <div className="leaderboard-hero-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 bottom-0 w-40 h-40 bg-amaranth/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 top-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/25 px-4 py-1.5 rounded-full mb-4">
              <Trophy size={16} className="text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">This Week's Champions</span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-3 text-charcoal"
              style={{ textShadow: '0 1px 2px rgba(255,255,255,0.6)' }}
            >
              Weekly Leaderboard
            </h2>
            <p className="text-charcoal/70 font-medium max-w-md mx-auto">
              Earn XP from lessons and quizzes. The board resets every Monday at 00:00 UTC.
            </p>
          </div>

          {/* Top 3 Podium */}
          {leaderboard && entries.length > 0 && (
            <div className="flex items-end justify-center gap-4 md:gap-8 mt-4 h-56">
              <PodiumSlot place={2} entry={topThree[1]} />
              <PodiumSlot place={1} entry={topThree[0]} />
              <PodiumSlot place={3} entry={topThree[2]} />
            </div>
          )}
          {leaderboard && entries.length === 0 && (
            <p className="text-center text-charcoal/70 font-medium">
              No one has earned XP this week yet — complete a lesson and take the lead!
            </p>
          )}
        </div>
      </div>

      {(loading || error) && <StatusPanel loading={loading} error={error} onRetry={reload} />}

      {/* Your Position — podiumda yoki ro'yxatdan tashqarida bo'lsa */}
      {showMyPosition && (
        <div className="leaderboard-hero-panel rounded-3xl p-4 md:p-5 flex items-center gap-4 border-l-4 border-l-amaranth">
          <div className="w-9 h-9 rounded-full bg-amaranth/10 flex items-center justify-center text-amaranth font-bold text-sm shrink-0">
            {me.rank}
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amaranth/30 shadow-sm shrink-0">
            <img
              src={avatarUrl(me.avatarSeed, 100)}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-amaranth/70 mb-0.5">Your Position</p>
            <h4 className="font-semibold text-charcoal truncate">{leaderboardName(me)}</h4>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <XpAmount xp={me.xp} />
            <TrendBadge trend={me.trend} />
          </div>
        </div>
      )}

      {/* Bu hafta hali XP yo'q */}
      {leaderboard && me === null && (
        <div className="leaderboard-hero-panel rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-l-4 border-l-amaranth">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-amaranth/70 mb-0.5">Your Position</p>
            <p className="text-charcoal/80">You're not on this week's board yet. Complete a lesson to earn XP.</p>
          </div>
          <Link
            to="/courses"
            className="bg-amaranth hover:bg-amaranth/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0 text-center"
          >
            Go to My Courses
          </Link>
        </div>
      )}

      {/* Remaining Rankings (4+) */}
      {restOfList.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal/50 mb-3 px-2">Rankings</h3>
          <ol className="leaderboard-hero-panel rounded-3xl p-2 md:p-4">
            {restOfList.map((entry) => {
              const mine = isMe(entry);
              return (
                <li
                  key={entry.userId}
                  aria-current={mine ? 'true' : undefined}
                  className={`flex items-center p-3 md:p-4 rounded-2xl transition-colors ${mine ? 'bg-amaranth/10 border border-amaranth/20' : 'hover:bg-white/10'}`}
                >
                  <div className="w-8 text-center font-bold text-charcoal/60 mr-2">{entry.rank}</div>
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-4 border border-white/20 shadow-sm shrink-0">
                    <img
                      src={avatarUrl(entry.avatarSeed, 100)}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold truncate ${mine ? 'text-amaranth' : 'text-charcoal'}`}>
                      {leaderboardName(entry)} {mine && '(You)'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <XpAmount xp={entry.xp} />
                    <TrendBadge trend={entry.trend} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

/** Podium ustuni. Bu hafta 3 kishidan kam bo'lsa, bo'sh joy xira "—" bilan ko'rsatiladi (podium shakli saqlanadi). */
function PodiumSlot({ place, entry }: { place: Place; entry: LeaderboardEntry | undefined }) {
  const style = PODIUM_STYLES[place];
  const name = entry ? leaderboardName(entry) : '';

  return (
    <div className={`flex flex-col items-center ${entry ? '' : 'opacity-40'}`}>
      <div className="relative mb-2">
        {place === 1 && entry && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-amber-400 drop-shadow-lg">
            <Award size={30} aria-hidden="true" />
          </div>
        )}
        <div className={`${style.avatar} rounded-full p-1 ${style.ring}`}>
          {entry ? (
            <img
              src={avatarUrl(entry.avatarSeed, 100)}
              alt=""
              className="w-full h-full rounded-full object-cover border-2 border-white"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-white/60 border-2 border-white" />
          )}
        </div>
        <div
          className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md ${style.badge}`}
        >
          {entry?.rank ?? place}
        </div>
      </div>
      <div className={`${style.stand} rounded-t-xl flex flex-col items-center justify-start pt-3`}>
        <span
          className="font-bold text-sm text-charcoal text-center truncate w-full px-1"
          style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}
          title={name || undefined}
        >
          {entry ? name.split(' ')[0] : '—'}
        </span>
        {entry && <span className="text-xs text-charcoal/70 font-semibold">{entry.xp.toLocaleString('en-US')} XP</span>}
      </div>
    </div>
  );
}

function XpAmount({ xp }: { xp: number }) {
  return (
    <span className="font-bold text-charcoal">
      {xp.toLocaleString('en-US')} <span className="text-xs text-charcoal/60 font-medium">XP</span>
    </span>
  );
}

const TREND: Record<LeaderboardTrend, { label: string; className: string }> = {
  up: { label: 'Trending up', className: 'bg-emerald-100 text-emerald-600' },
  down: { label: 'Trending down', className: 'bg-red-100 text-red-600' },
  same: { label: 'No change', className: 'bg-gray-100 text-gray-500' },
};

/** O'tgan haftadagi o'rniga nisbatan (bu hafta yangi qo'shilgan — "up"). */
function TrendBadge({ trend }: { trend: LeaderboardTrend }) {
  const { label, className } = TREND[trend];
  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${className}`}>
      <span className="sr-only">{label}</span>
      {trend === 'same' ? (
        <Minus aria-hidden="true" size={14} />
      ) : (
        <TrendingUp aria-hidden="true" size={14} className={trend === 'down' ? 'rotate-180' : ''} />
      )}
    </div>
  );
}
