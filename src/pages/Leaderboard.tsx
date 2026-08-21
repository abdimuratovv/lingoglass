import { Trophy, Award, TrendingUp } from 'lucide-react';

export function Leaderboard() {
  const users = [
    { rank: 1, name: 'Sarah Jenkins', xp: 12450, avatar: 'sarah', trend: 'up' },
    { rank: 2, name: 'Alex Johnson', xp: 11200, avatar: 'alex', trend: 'up', isCurrentUser: true },
    { rank: 3, name: 'Miguel Santos', xp: 10850, avatar: 'miguel', trend: 'down' },
    { rank: 4, name: 'Emma Wilson', xp: 9400, avatar: 'emma', trend: 'up' },
    { rank: 5, name: 'David Chen', xp: 8900, avatar: 'david', trend: 'down' },
    { rank: 6, name: 'Sophie Martin', xp: 8200, avatar: 'sophie', trend: 'up' },
    { rank: 7, name: 'James Park', xp: 7600, avatar: 'james', trend: 'up' },
    { rank: 8, name: 'Olivia Brown', xp: 7100, avatar: 'olivia', trend: 'down' },
    { rank: 9, name: 'Lucas Garcia', xp: 6500, avatar: 'lucas', trend: 'up' },
    { rank: 10, name: 'Aisha Khan', xp: 6200, avatar: 'aisha', trend: 'down' },
  ];

  const topThree = users.slice(0, 3);
  const restOfList = users.slice(3);
  const currentUser = users.find((u) => u.isCurrentUser);
  const currentUserInTop3 = currentUser && currentUser.rank <= 3;

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
              Compete with other learners and earn rewards!
            </p>
          </div>

          {/* Top 3 Podium */}
          <div className="flex items-end justify-center gap-4 md:gap-8 mt-4 h-48">
            {/* Rank 2 */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-gray-400 to-gray-200 shadow-md">
                  <img
                    src={`https://picsum.photos/seed/${topThree[1].avatar}/100/100`}
                    alt={topThree[1].name}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-gray-300 to-gray-400 text-charcoal rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                  2
                </div>
              </div>
              <div className="podium-stand w-20 md:w-24 h-24 rounded-t-xl flex flex-col items-center justify-start pt-3">
                <span
                  className="font-bold text-sm text-charcoal text-center truncate w-full px-1"
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}
                >
                  {topThree[1].name.split(' ')[0]}
                </span>
                <span className="text-xs text-charcoal/70 font-semibold">{topThree[1].xp.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Rank 1 */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-amber-400 drop-shadow-lg">
                  <Award size={30} />
                </div>
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-lg shadow-amber-400/30 ring-2 ring-amber-300/40 ring-offset-2 ring-offset-white/20">
                  <img
                    src={`https://picsum.photos/seed/${topThree[0].avatar}/100/100`}
                    alt={topThree[0].name}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
                  1
                </div>
              </div>
              <div className="podium-stand podium-stand-gold w-24 md:w-28 h-32 rounded-t-xl flex flex-col items-center justify-start pt-3">
                <span
                  className="font-bold text-sm text-charcoal text-center truncate w-full px-1"
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}
                >
                  {topThree[0].name.split(' ')[0]}
                </span>
                <span className="text-xs text-charcoal/70 font-semibold">{topThree[0].xp.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-orange-400 to-amber-600 shadow-md">
                  <img
                    src={`https://picsum.photos/seed/${topThree[2].avatar}/100/100`}
                    alt={topThree[2].name}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                  3
                </div>
              </div>
              <div className="podium-stand w-20 md:w-24 h-20 rounded-t-xl flex flex-col items-center justify-start pt-3">
                <span
                  className="font-bold text-sm text-charcoal text-center truncate w-full px-1"
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}
                >
                  {topThree[2].name.split(' ')[0]}
                </span>
                <span className="text-xs text-charcoal/70 font-semibold">{topThree[2].xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Position — shown when current user is in the top 3 */}
      {currentUserInTop3 && currentUser && (
        <div className="leaderboard-hero-panel rounded-3xl p-4 md:p-5 flex items-center gap-4 border-l-4 border-l-amaranth">
          <div className="w-9 h-9 rounded-full bg-amaranth/10 flex items-center justify-center text-amaranth font-bold text-sm shrink-0">
            {currentUser.rank}
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amaranth/30 shadow-sm shrink-0">
            <img
              src={`https://picsum.photos/seed/${currentUser.avatar}/100/100`}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-amaranth/70 mb-0.5">Your Position</p>
            <h4 className="font-semibold text-charcoal truncate">{currentUser.name}</h4>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-bold text-charcoal">
              {currentUser.xp.toLocaleString()} <span className="text-xs text-charcoal/60 font-medium">XP</span>
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${currentUser.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}
            >
              <span className="sr-only">{currentUser.trend === 'up' ? 'Trending up' : 'Trending down'}</span>
              <TrendingUp aria-hidden="true" size={14} className={currentUser.trend === 'down' ? 'rotate-180' : ''} />
            </div>
          </div>
        </div>
      )}

      {/* Remaining Rankings (4+) */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal/50 mb-3 px-2">Rankings</h3>
        <div className="leaderboard-hero-panel rounded-3xl p-2 md:p-4">
          {restOfList.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center p-3 md:p-4 rounded-2xl transition-colors ${user.isCurrentUser ? 'bg-amaranth/10 border border-amaranth/20' : 'hover:bg-white/10'}`}
            >
              <div className="w-8 text-center font-bold text-charcoal/60 mr-2">{user.rank}</div>
              <div className="w-10 h-10 rounded-full overflow-hidden mr-4 border border-white/20 shadow-sm">
                <img
                  src={`https://picsum.photos/seed/${user.avatar}/100/100`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${user.isCurrentUser ? 'text-amaranth' : 'text-charcoal'}`}>
                  {user.name} {user.isCurrentUser && '(You)'}
                </h4>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-charcoal">
                  {user.xp.toLocaleString()} <span className="text-xs text-charcoal/60 font-medium">XP</span>
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${user.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}
                >
                  <span className="sr-only">{user.trend === 'up' ? 'Trending up' : 'Trending down'}</span>
                  <TrendingUp aria-hidden="true" size={14} className={user.trend === 'down' ? 'rotate-180' : ''} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
