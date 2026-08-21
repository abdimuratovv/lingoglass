import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, LayoutGroup } from 'motion/react';
import { LayoutDashboard, BookMarked, Trophy, Settings, Shield } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
  { path: '/courses', label: 'My Courses', icon: <BookMarked size={24} /> },
  { path: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={24} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={24} /> },
  { path: '/admin', label: 'Admin', icon: <Shield size={24} /> },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <LayoutGroup id="mobile-nav">
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 p-4 flex justify-around items-center z-50 rounded-t-3xl pb-safe">
        {navItems.map((item) => {
          const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return <MobileNavItem key={item.path} to={item.path} icon={item.icon} label={item.label} active={active} />;
        })}
      </nav>
    </LayoutGroup>
  );
}

function MobileNavItem({ to, icon, label, active }: { to: string; icon: ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={`p-3 rounded-xl relative z-0 transition-colors duration-200 ${active ? 'text-white' : 'text-navy/60'}`}
    >
      {active && (
        <motion.div
          layoutId="mobile-liquid-blob"
          className="mobile-liquid-blob"
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.9,
          }}
          style={{ borderRadius: 12 }}
        />
      )}
      <motion.span
        className="relative z-10 block"
        animate={{
          scale: active ? 1.1 : 1,
          y: active ? -1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        {icon}
      </motion.span>
    </Link>
  );
}
