import { useState, type ReactNode } from 'react';
import { BellRing, Globe, Shield, BookOpen } from 'lucide-react';
import { Toggle } from '../components/ui/Toggle';

export function Settings() {
  const [activeSettingsTab, setActiveSettingsTab] = useState('notifications');

  return (
    <div className="flex-1 flex flex-col gap-6 pb-20 md:pb-0 max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold px-2">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <SettingsTab
            icon={<BellRing size={18} />}
            label="Notifications"
            active={activeSettingsTab === 'notifications'}
            onClick={() => setActiveSettingsTab('notifications')}
          />
          <SettingsTab
            icon={<Globe size={18} />}
            label="Language & Region"
            active={activeSettingsTab === 'language'}
            onClick={() => setActiveSettingsTab('language')}
          />
          <SettingsTab
            icon={<Shield size={18} />}
            label="Privacy & Security"
            active={activeSettingsTab === 'privacy'}
            onClick={() => setActiveSettingsTab('privacy')}
          />
          <SettingsTab
            icon={<BookOpen size={18} />}
            label="Learning Preferences"
            active={activeSettingsTab === 'learning'}
            onClick={() => setActiveSettingsTab('learning')}
          />
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 glass-panel rounded-3xl p-6 md:p-8 flex flex-col gap-6">
          {/* Notifications */}
          {activeSettingsTab === 'notifications' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-navy/60">Receive push notifications for reminders.</p>
                  </div>
                  <Toggle label="Push Notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-navy/60">Get weekly progress reports via email.</p>
                  </div>
                  <Toggle label="Email Notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Streak Reminders</h4>
                    <p className="text-sm text-navy/60">Daily reminders to maintain your streak.</p>
                  </div>
                  <Toggle label="Streak Reminders" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Leaderboard Updates</h4>
                    <p className="text-sm text-navy/60">Notify when your rank changes.</p>
                  </div>
                  <Toggle label="Leaderboard Updates" />
                </div>
              </div>
            </div>
          )}

          {/* Language & Region */}
          {activeSettingsTab === 'language' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Language & Region</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Interface Language</h4>
                    <p className="text-sm text-navy/60">Display language for the app interface.</p>
                  </div>
                  <select
                    aria-label="Interface Language"
                    defaultValue="English"
                    className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-medium outline-none"
                  >
                    <option>English</option>
                    <option>O'zbek</option>
                    <option>Русский</option>
                    <option>Español</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Learning Language</h4>
                    <p className="text-sm text-navy/60">The language you are currently learning.</p>
                  </div>
                  <select
                    aria-label="Learning Language"
                    defaultValue="English"
                    className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-medium outline-none"
                  >
                    <option>English</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Spanish</option>
                    <option>Japanese</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Time Zone</h4>
                    <p className="text-sm text-navy/60">Used for streak tracking and reminders.</p>
                  </div>
                  <select
                    aria-label="Time Zone"
                    defaultValue="Asia/Tashkent"
                    className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-medium outline-none"
                  >
                    <option>Asia/Tashkent (UTC+5)</option>
                    <option>Europe/London (UTC+0)</option>
                    <option>America/New_York (UTC-5)</option>
                    <option>Asia/Tokyo (UTC+9)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security */}
          {activeSettingsTab === 'privacy' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Privacy & Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Show on Leaderboard</h4>
                    <p className="text-sm text-navy/60">Allow your name to appear in the leaderboard.</p>
                  </div>
                  <Toggle label="Show on Leaderboard" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Share Progress</h4>
                    <p className="text-sm text-navy/60">Let others see your learning progress.</p>
                  </div>
                  <Toggle label="Share Progress" />
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-navy/60">Update your account password.</p>
                  </div>
                  <button className="px-5 py-2 bg-charcoal hover:bg-charcoal/90 text-white rounded-xl text-sm font-medium transition-colors shadow-md">
                    Update Password
                  </button>
                </div>
                <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200/50 space-y-3">
                  <div>
                    <h4 className="font-medium text-red-600">Delete Account</h4>
                    <p className="text-sm text-red-500/80">Permanently delete your account and all data.</p>
                  </div>
                  <button className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors shadow-md">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Learning Preferences */}
          {activeSettingsTab === 'learning' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Learning Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Daily Goal</h4>
                    <p className="text-sm text-navy/60">How much time do you want to spend learning?</p>
                  </div>
                  <select
                    aria-label="Daily Goal"
                    defaultValue="30 mins / day"
                    className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-medium outline-none"
                  >
                    <option>15 mins / day</option>
                    <option>30 mins / day</option>
                    <option>60 mins / day</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Current Level</h4>
                    <p className="text-sm text-navy/60">Your estimated proficiency level.</p>
                  </div>
                  <select
                    aria-label="Current Level"
                    defaultValue="B1 Intermediate"
                    className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-medium outline-none"
                  >
                    <option>A1 Beginner</option>
                    <option>A2 Elementary</option>
                    <option>B1 Intermediate</option>
                    <option>B2 Upper Intermediate</option>
                    <option>C1 Advanced</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-medium">Focus Areas</h4>
                    <p className="text-sm text-navy/60">Prioritize specific skills in recommendations.</p>
                  </div>
                  <select
                    aria-label="Focus Areas"
                    defaultValue="Vocabulary"
                    className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-medium outline-none"
                  >
                    <option>Vocabulary</option>
                    <option>Grammar</option>
                    <option>Listening</option>
                    <option>Speaking</option>
                    <option>Reading</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsTab({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-left ${active ? 'bg-white/60 backdrop-blur-md text-amaranth font-semibold shadow-sm border border-white/50' : 'bg-white/30 backdrop-blur-md border border-white/20 text-charcoal font-medium hover:bg-white/40'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
