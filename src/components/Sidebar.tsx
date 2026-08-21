import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, BookMarked, Trophy, Settings, Shield, Sparkles, LogOut } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/courses', label: 'My Courses', icon: <BookMarked size={20} /> },
  { path: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  { path: '/admin', label: 'Admin', icon: <Shield size={20} /> },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 p-6">
      <div className="glass-panel h-full rounded-3xl flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-amaranth flex items-center justify-center text-white shadow-lg shadow-amaranth/30">
            <Sparkles size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Lingo<span className="text-amaranth">Glass</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            return <SidebarItem key={item.path} to={item.path} icon={item.icon} label={item.label} active={active} />;
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-navy/70 hover:text-charcoal transition-colors duration-200">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ to, icon, label, active }: { to: string; icon: ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl relative z-0 transition-colors duration-200 ${
        active ? 'text-amaranth font-medium' : 'text-navy/70 hover:text-charcoal'
      }`}
    >
      {active && (
        <motion.div
          layoutId="sidebar-liquid-blob"
          className="liquid-blob"
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 32,
            mass: 1,
          }}
          style={{ borderRadius: 14 }}
        />
      )}
      <motion.span
        className="relative z-10 flex items-center gap-3"
        animate={{
          scale: active ? 1 : 0.98,
          x: active ? 2 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {icon}
        <span>{label}</span>
      </motion.span>
    </Link>
  );
}
