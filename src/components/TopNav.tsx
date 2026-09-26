import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, LogOut, Camera, X, Flame } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useProfile } from '../context/useProfile';
import { useXpStats } from '../context/useXpStats';
import { avatarUrl, displayName } from '../context/profileContext';

/** Yig'ilgan panel: qidiruv ikonkasi + qo'ng'iroq + avatar; streak belgisi bo'lsa unga qo'shiladi. */
const COLLAPSED_WIDTH = 140;
const STREAK_CHIP_WIDTH = 48;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Ochilgan dropdown panelga Escape bilan yopish va Tab-trap qo'shadi;
 * yopilganda fokusni triggerButtonRef'ga qaytaradi.
 */
function useDropdownA11y(
  isOpen: boolean,
  onClose: () => void,
  panelRef: React.RefObject<HTMLDivElement | null>,
  triggerButtonRef: React.RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!isOpen) return;

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusables?.[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        triggerButtonRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, panelRef, triggerButtonRef]);
}

export function TopNav() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const name = displayName(profile, user?.email);
  const { stats } = useXpStats();
  const [formName, setFormName] = useState('');
  const [formBio, setFormBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifButtonRef = useRef<HTMLButtonElement>(null);
  const notifPanelRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profilePanelRef = useRef<HTMLDivElement>(null);

  const closeNotifications = useCallback(() => setShowNotifications(false), []);
  const closeProfile = useCallback(() => setShowProfile(false), []);

  // Forma har ochilganda bazadagi joriy qiymatlardan boshlanadi (bekor qilingan tahrir qolib ketmaydi).
  const toggleProfile = () => {
    if (!showProfile) {
      setFormName(profile?.full_name ?? '');
      setFormBio(profile?.bio ?? '');
      setSaveError(null);
    }
    setShowProfile(!showProfile);
  };

  const saveProfile = async () => {
    setSaving(true);
    setSaveError(null);
    const { error } = await updateProfile({ full_name: formName.trim(), bio: formBio.trim() });
    setSaving(false);
    if (error) setSaveError(error);
    else setShowProfile(false);
  };

  useDropdownA11y(showNotifications, closeNotifications, notifPanelRef, notifButtonRef);
  useDropdownA11y(showProfile, closeProfile, profilePanelRef, profileButtonRef);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePanelClick = (e: React.MouseEvent) => {
    if (isMobile) {
      if ((e.target as HTMLElement).tagName === 'INPUT') {
        setIsMobileOpen(true);
        return;
      }
      setIsMobileOpen(!isMobileOpen);
    }
  };

  const isOpen = isHovered || isFocused || (isMobile && isMobileOpen);
  // Mobilda ochilganda joy qidiruv maydoniga qoldiriladi (ism + XP baribir ko'rinadi).
  const showStreak = stats !== null && !(isMobile && isOpen);
  const streakLabel = !stats
    ? ''
    : stats.streakDays === 0
      ? 'No active streak — earn XP today to start one'
      : stats.activeToday
        ? `${stats.streakDays}-day streak`
        : `${stats.streakDays}-day streak — earn XP today to keep it`;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <div
        ref={navRef}
        className="pointer-events-auto relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: isOpen ? (isMobile ? '100%' : '480px') : `${COLLAPSED_WIDTH + (showStreak ? STREAK_CHIP_WIDTH : 0)}px`,
          maxWidth: '100%',
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {}
        <div
          className="absolute pointer-events-auto"
          style={{
            inset: '-12px -24px',
          }}
        />
        <div
          className="flex items-center justify-between cursor-pointer md:cursor-default w-full"
          onClick={handlePanelClick}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            height: '56px',
            padding: '0 8px',
          }}
        >
          {}
          <div
            className="flex items-center h-full overflow-hidden"
            style={{
              width: isOpen ? '100%' : '40px',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), flex-grow 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              flexGrow: isOpen ? 1 : 0,
            }}
          >
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-navy/70">
              <Search size={20} />
            </div>

            <div
              className="h-full flex items-center overflow-hidden"
              style={{
                opacity: isOpen ? 1 : 0,
                maxWidth: isOpen ? '300px' : '0px',
                flexGrow: isOpen ? 1 : 0,
                transition:
                  'opacity 0.4s ease, max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1), flex-grow 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: isOpen ? 'auto' : 'none',
              }}
            >
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full bg-transparent border-none outline-none text-charcoal placeholder:text-navy/40 text-sm h-full px-2"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                tabIndex={isOpen ? 0 : -1}
              />
            </div>
          </div>

          {}
          <div className="flex items-center shrink-0 h-full">
            <div className="relative" ref={notifRef}>
              <button
                ref={notifButtonRef}
                aria-label="Notifications"
                aria-haspopup="true"
                aria-expanded={showNotifications}
                className="w-10 h-10 rounded-full flex items-center justify-center text-navy/70 hover:bg-white/10 transition-colors relative shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
              >
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amaranth opacity-75"></span>
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-amaranth border border-white/20"></span>
                </span>
              </button>

              {}
              {showNotifications && (
                <div
                  ref={notifPanelRef}
                  role="dialog"
                  aria-label="Notifications"
                  className="absolute top-[52px] right-0 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-navy/5 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-semibold text-charcoal">Notifications</h3>
                    <button className="text-xs text-amaranth hover:text-orange-500 font-medium transition-colors">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    <div className="p-4 border-b border-navy/5 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-sm">📚</span>
                        </div>
                        <div>
                          <p className="text-sm text-charcoal font-medium">New Vocabulary List</p>
                          <p className="text-xs text-navy/70 mt-1 leading-relaxed">
                            "Travel & Directions" is now available in your B1 course.
                          </p>
                          <p className="text-[10px] text-navy/40 mt-2 font-medium">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-b border-navy/5 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-sm">🔥</span>
                        </div>
                        <div>
                          <p className="text-sm text-charcoal font-medium">5-Day Streak!</p>
                          <p className="text-xs text-navy/70 mt-1 leading-relaxed">
                            You're on fire! Keep up the great work.
                          </p>
                          <p className="text-[10px] text-navy/40 mt-2 font-medium">Yesterday</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-sm">💬</span>
                        </div>
                        <div>
                          <p className="text-sm text-charcoal font-medium">Tutor Feedback</p>
                          <p className="text-xs text-navy/70 mt-1 leading-relaxed">
                            Maria left feedback on your recent pronunciation exercise.
                          </p>
                          <p className="text-[10px] text-navy/40 mt-2 font-medium">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Streak belgisi (get_my_xp_stats) — yig'ilgan holatda ham ko'rinadi */}
            {stats && (
              <div
                className="flex items-center justify-center overflow-hidden shrink-0"
                title={streakLabel}
                style={{
                  width: showStreak ? `${STREAK_CHIP_WIDTH}px` : '0px',
                  opacity: showStreak ? 1 : 0,
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
                }}
              >
                <div
                  className={`flex items-center gap-0.5 h-8 px-2 rounded-full text-xs font-bold ${stats.activeToday ? 'bg-orange-500/10 text-orange-600' : 'bg-navy/5 text-navy/50'}`}
                >
                  <Flame
                    aria-hidden="true"
                    size={14}
                    className={stats.activeToday ? 'fill-orange-400 text-orange-500' : undefined}
                  />
                  <span aria-hidden="true">{stats.streakDays}</span>
                  <span className="sr-only">{streakLabel}</span>
                </div>
              </div>
            )}

            <div
              className="flex items-center overflow-hidden shrink-0"
              style={{
                width: isOpen ? '120px' : '0px',
                opacity: isOpen ? 1 : 0,
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
              }}
            >
              <div className="flex flex-col justify-center text-right whitespace-nowrap pr-3 w-full min-w-0">
                <span className="text-sm font-semibold text-charcoal leading-tight truncate">{name}</span>
                {stats && (
                  <span className="text-[11px] font-medium text-navy/60 leading-tight">
                    {stats.totalXp.toLocaleString('en-US')} XP
                  </span>
                )}
              </div>
            </div>

            {}
            <div className="relative" ref={profileRef}>
              <button
                ref={profileButtonRef}
                aria-label="Profile menu"
                aria-haspopup="true"
                aria-expanded={showProfile}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-amaranth to-orange-400 p-[2px] shrink-0 cursor-pointer ml-1 hover:shadow-lg hover:shadow-amaranth/20 transition-shadow"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProfile();
                  setShowNotifications(false);
                }}
              >
                <img
                  src={avatarUrl(profile?.avatar_seed, 100)}
                  alt="Profile"
                  className="w-full h-full rounded-full border border-white/50 object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>

              {}
              {showProfile && (
                <div
                  ref={profilePanelRef}
                  role="dialog"
                  aria-label="Profile menu"
                  className="absolute top-[52px] right-0 w-[360px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden cursor-default"
                  style={{
                    animation: 'profileDropIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {}
                  <div className="relative p-6 pb-4 bg-gradient-to-br from-amaranth/5 via-orange-50/50 to-transparent border-b border-navy/5">
                    <button
                      aria-label="Close"
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-navy/50 hover:text-charcoal transition-colors shadow-sm"
                      onClick={() => setShowProfile(false)}
                    >
                      <X size={14} />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amaranth to-orange-400">
                          <img
                            src={avatarUrl(profile?.avatar_seed, 200)}
                            alt="Profile"
                            className="w-full h-full rounded-full border-2 border-white object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <button
                          aria-label="Change photo"
                          className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center text-navy/60 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          <Camera size={11} />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">{name}</h4>
                        <p className="text-navy/60 text-xs mt-0.5">{user?.email}</p>
                        {profile?.cefr_level && (
                          <span className="inline-block mt-1.5 text-[10px] font-semibold text-amaranth bg-amaranth/10 px-2 py-0.5 rounded-full">
                            {profile.cefr_level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="p-5 space-y-3.5 max-h-[350px] overflow-y-auto">
                    <div className="space-y-1">
                      <label
                        htmlFor="profile-full-name"
                        className="text-[11px] font-semibold text-navy/60 uppercase tracking-wider"
                      >
                        Full Name
                      </label>
                      <input
                        id="profile-full-name"
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amaranth/30 focus:border-amaranth/30 transition-all text-charcoal"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="profile-email"
                        className="text-[11px] font-semibold text-navy/60 uppercase tracking-wider"
                      >
                        Email Address
                      </label>
                      {/* Email'ni o'zgartirish tasdiqlash oqimini talab qiladi (auth.updateUser) — hozircha faqat ko'rsatiladi. */}
                      <input
                        id="profile-email"
                        type="email"
                        value={user?.email ?? ''}
                        readOnly
                        aria-readonly="true"
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy/60 cursor-not-allowed focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="profile-bio"
                        className="text-[11px] font-semibold text-navy/60 uppercase tracking-wider"
                      >
                        Bio
                      </label>
                      <textarea
                        id="profile-bio"
                        rows={2}
                        value={formBio}
                        onChange={(e) => setFormBio(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amaranth/30 focus:border-amaranth/30 transition-all resize-none text-charcoal"
                      />
                    </div>

                    {saveError && (
                      <p role="alert" className="text-xs text-red-500">
                        {saveError}
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl text-sm font-medium transition-colors"
                        onClick={() => setShowProfile(false)}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => void saveProfile()}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-amaranth hover:bg-amaranth/90 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors shadow-md shadow-amaranth/20"
                      >
                        {saving ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  </div>

                  {}
                  <div className="border-t border-navy/5 p-3">
                    <button
                      onClick={() => void signOut()}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
