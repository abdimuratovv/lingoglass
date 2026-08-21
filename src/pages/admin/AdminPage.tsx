import { useState, type ReactNode } from 'react';
import { Shield, Settings, BookOpen, CheckCircle, User } from 'lucide-react';
import { AdminContentManager } from './AdminContentManager';
import { AdminQuizBuilder } from './AdminQuizBuilder';
import { AdminUserManagement } from './AdminUserManagement';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'users' | 'quizzes'>('content');

  return (
    <div className="flex-1 flex flex-col gap-6 pb-20 md:pb-0 max-w-6xl mx-auto w-full">
      {/* Glassmorphism Header Panel */}
      <div className="leaderboard-hero-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-amaranth/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-8 bottom-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/4 bottom-0 w-28 h-28 bg-amber-400/8 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amaranth/10 border border-amaranth/20 px-3 py-1 rounded-full mb-3">
                <Shield size={14} className="text-amaranth" />
                <span className="text-xs font-bold uppercase tracking-wider text-amaranth/80">Administration</span>
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-charcoal"
                style={{ textShadow: '0 1px 2px rgba(255,255,255,0.6)' }}
              >
                Admin Dashboard
              </h2>
              <p className="text-sm text-charcoal/60 font-medium mt-1">Manage platform content, users, and settings.</p>
            </div>
            <button className="bg-amaranth hover:bg-amaranth/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-amaranth/20 flex items-center gap-2">
              <Settings size={16} /> Platform Settings
            </button>
          </div>

          {/* Admin Tabs */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <AdminTab
              active={activeTab === 'content'}
              onClick={() => setActiveTab('content')}
              icon={<BookOpen size={18} />}
              label="Content Management"
            />
            <AdminTab
              active={activeTab === 'quizzes'}
              onClick={() => setActiveTab('quizzes')}
              icon={<CheckCircle size={18} />}
              label="Quiz Builder"
            />
            <AdminTab
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
              icon={<User size={18} />}
              label="User Management"
            />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'content' && <AdminContentManager />}
        {activeTab === 'quizzes' && <AdminQuizBuilder />}
        {activeTab === 'users' && <AdminUserManagement />}
      </div>
    </div>
  );
}

function AdminTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-white/40 text-amaranth shadow-sm border border-white/30 backdrop-blur-sm'
          : 'bg-white/15 text-charcoal/70 hover:bg-white/25 border border-white/15 hover:text-charcoal'
      }`}
    >
      {icon} {label}
    </button>
  );
}
