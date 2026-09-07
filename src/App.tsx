import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MyCourses } from './pages/MyCourses';
import { CourseDetail } from './pages/CourseDetail';
import { Leaderboard } from './pages/Leaderboard';
import { Settings } from './pages/Settings';
import { AdminPage } from './pages/admin/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

/** Sidebar + TopNav + MobileNav bilan o'ralgan asosiy layout -- faqat auth qilingan userlarga. */
function AppShell() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden text-charcoal">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-4 pt-24 md:p-6 md:pt-24 md:pl-0">
        <TopNav />

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ y: 12, scale: 0.99 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, scale: 0.99 }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="flex-1 flex flex-col"
          >
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<MyCourses />} />
              <Route path="/courses/:courseId" element={<CourseDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
