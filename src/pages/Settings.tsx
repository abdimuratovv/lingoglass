import { useCallback, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BellRing, Globe, Shield, BookOpen, Loader2, Check } from 'lucide-react';
import { Toggle } from '../components/ui/Toggle';
import { Select, type SelectOption } from '../components/ui/Select';
import { StatusPanel } from '../components/ui/StatusPanel';
import { useSettings } from '../context/useSettings';
import { useProfile } from '../context/useProfile';
import type { ProfileUpdate } from '../context/profileContext';
import type { UserSettings, UserSettingsUpdate } from '../data/settings';
import { browserTimeZone } from '../lib/time';

const TABS = [
  { id: 'notifications', label: 'Notifications', icon: <BellRing size={18} /> },
  { id: 'language', label: 'Language & Region', icon: <Globe size={18} /> },
  { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={18} /> },
  { id: 'learning', label: 'Learning Preferences', icon: <BookOpen size={18} /> },
] as const;

type TabId = (typeof TABS)[number]['id'];

const INTERFACE_LANGUAGES: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'uz', label: "O'zbek" },
  { value: 'ru', label: 'Русский' },
  { value: 'es', label: 'Español' },
];

const DAILY_GOALS = [15, 30, 60];

const CEFR_LEVELS: SelectOption[] = [
  { value: '', label: 'Not set' },
  { value: 'A1', label: 'A1 Beginner' },
  { value: 'A2', label: 'A2 Elementary' },
  { value: 'B1', label: 'B1 Intermediate' },
  { value: 'B2', label: 'B2 Upper Intermediate' },
  { value: 'C1', label: 'C1 Advanced' },
  { value: 'C2', label: 'C2 Proficiency' },
];

const FOCUS_AREAS = [
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'listening', label: 'Listening' },
  { id: 'speaking', label: 'Speaking' },
  { id: 'reading', label: 'Reading' },
];

type SaveState = { status: 'idle' | 'saving' | 'saved' } | { status: 'error'; message: string };

/** Bir nechta parallel saqlashdan umumiy holat: hammasi tugaguncha "Saving…", birortasi yiqilsa — xato. */
function useSaveStatus() {
  const [state, setState] = useState<SaveState>({ status: 'idle' });
  const inFlight = useRef(0);

  const track = useCallback(async (save: Promise<{ error: string | null }>) => {
    inFlight.current += 1;
    setState({ status: 'saving' });
    const { error } = await save;
    inFlight.current -= 1;
    if (error) setState({ status: 'error', message: error });
    else if (inFlight.current === 0) setState((s) => (s.status === 'error' ? s : { status: 'saved' }));
  }, []);

  return { state, track };
}

export function Settings() {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get('tab');
  const activeTab: TabId = TABS.find((t) => t.id === tabParam)?.id ?? 'notifications';
  const activeLabel = TABS.find((t) => t.id === activeTab)?.label;

  const { settings, loading, error, reload, updateSettings } = useSettings();
  const { profile, updateProfile } = useProfile();
  const { state: saveState, track } = useSaveStatus();
  // Profil maydonlari javob kelguncha tanlangan qiymatda turadi (select eski qiymatga "sakramasin").
  const [profileDraft, setProfileDraft] = useState<ProfileUpdate>({});

  const setSetting = (patch: UserSettingsUpdate) => void track(updateSettings(patch));

  const setProfileField = (patch: ProfileUpdate) => {
    setProfileDraft((d) => ({ ...d, ...patch }));
    const run = updateProfile(patch).then((res) => {
      setProfileDraft((d) => {
        const next = { ...d };
        for (const k of Object.keys(patch) as (keyof ProfileUpdate)[]) {
          if (next[k] === patch[k]) delete next[k];
        }
        return next;
      });
      return res;
    });
    void track(run);
  };

  const dailyGoal =
    'daily_goal_minutes' in profileDraft ? profileDraft.daily_goal_minutes : profile?.daily_goal_minutes;
  const cefrLevel = 'cefr_level' in profileDraft ? profileDraft.cefr_level : profile?.cefr_level;

  return (
    <div className="flex-1 flex flex-col gap-6 pb-20 md:pb-0 max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold px-2">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1 flex flex-col gap-2">
          {TABS.map((tab) => (
            <SettingsTab
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setParams({ tab: tab.id }, { replace: true })}
            />
          ))}
        </div>

        {/* Settings Content */}
        {!settings ? (
          <div className="md:col-span-2">
            <StatusPanel loading={loading} error={error} onRetry={reload} />
          </div>
        ) : (
          <div className="md:col-span-2 glass-panel rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold">{activeLabel}</h3>
                <SaveIndicator state={saveState} />
              </div>
              {saveState.status === 'error' && (
                <p
                  role="alert"
                  className="text-sm text-red-500 bg-red-50/60 border border-red-200/60 rounded-xl px-3 py-2 mb-4"
                >
                  Couldn't save: {saveState.message}. Your settings were reloaded from the server.
                </p>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <p className="text-sm text-navy/60">
                    Your choices are saved to your account. LingoGlass doesn't send notifications yet — once it does, it
                    will follow these settings.
                  </p>
                  <ToggleRow
                    settings={settings}
                    field="push_notifications"
                    title="Push Notifications"
                    description="Receive push notifications for reminders."
                    onChange={setSetting}
                  />
                  <ToggleRow
                    settings={settings}
                    field="email_notifications"
                    title="Email Notifications"
                    description="Get weekly progress reports via email."
                    onChange={setSetting}
                  />
                  <ToggleRow
                    settings={settings}
                    field="streak_reminders"
                    title="Streak Reminders"
                    description="Daily reminders to maintain your streak."
                    onChange={setSetting}
                  />
                  <ToggleRow
                    settings={settings}
                    field="leaderboard_updates"
                    title="Leaderboard Updates"
                    description="Notify when your rank changes."
                    onChange={setSetting}
                  />
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-4">
                  <SettingRow
                    title="Interface Language"
                    description="Display language for the app interface. Only English is available for now."
                    notActive
                  >
                    <Select
                      label="Interface Language"
                      value={settings.interface_language}
                      onChange={(interface_language) => setSetting({ interface_language })}
                      options={withCurrent(INTERFACE_LANGUAGES, settings.interface_language)}
                    />
                  </SettingRow>
                  <SettingRow title="Learning Language" description="LingoGlass currently teaches English only.">
                    <span className="text-sm font-medium text-charcoal px-3">English</span>
                  </SettingRow>
                  <SettingRow
                    title="Time Zone"
                    description="Used to count your daily streak. The weekly leaderboard resets on Monday 00:00 UTC for everyone."
                    stacked
                  >
                    <TimeZoneSelect value={settings.timezone} onChange={(timezone) => setSetting({ timezone })} />
                  </SettingRow>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <ToggleRow
                    settings={settings}
                    field="show_on_leaderboard"
                    title="Show on Leaderboard"
                    description="Show your name and weekly XP on the leaderboard. When off, other learners can't see you there."
                    onChange={setSetting}
                  />
                  <ToggleRow
                    settings={settings}
                    field="share_progress"
                    title="Share Progress"
                    description="Let others see your learning progress."
                    notActive
                    onChange={setSetting}
                  />
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
              )}

              {activeTab === 'learning' && (
                <div className="space-y-4">
                  <SettingRow
                    title="Daily Goal"
                    description="How much time do you want to spend learning each day?"
                    notActive
                  >
                    <Select
                      label="Daily Goal"
                      value={dailyGoal === undefined ? '' : String(dailyGoal)}
                      disabled={dailyGoal === undefined}
                      placeholder="—"
                      onChange={(v) => setProfileField({ daily_goal_minutes: Number(v) })}
                      options={[...new Set([...DAILY_GOALS, ...(dailyGoal === undefined ? [] : [dailyGoal])])]
                        .sort((a, b) => a - b)
                        .map((m) => ({ value: String(m), label: `${m} mins / day` }))}
                    />
                  </SettingRow>
                  <SettingRow
                    title="Current Level"
                    description="Your estimated proficiency level, shown on your profile."
                  >
                    <Select
                      label="Current Level"
                      value={cefrLevel ?? ''}
                      disabled={!profile}
                      onChange={(v) => setProfileField({ cefr_level: v || null })}
                      options={withCurrent(CEFR_LEVELS, cefrLevel ?? '')}
                    />
                  </SettingRow>
                  <SettingRow
                    title="Focus Areas"
                    description="Skills to prioritize in lesson recommendations."
                    notActive
                    stacked
                  >
                    <div role="group" aria-label="Focus Areas" className="flex flex-wrap gap-2">
                      {FOCUS_AREAS.map(({ id, label }) => {
                        const on = settings.focus_areas.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            aria-pressed={on}
                            onClick={() =>
                              setSetting({
                                focus_areas: on
                                  ? settings.focus_areas.filter((a) => a !== id)
                                  : [...settings.focus_areas, id],
                              })
                            }
                            className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${on ? 'bg-amaranth/10 text-amaranth border-amaranth/30 font-semibold' : 'bg-white/30 text-charcoal border-white/20 hover:bg-white/40'}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </SettingRow>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Bazadagi qiymat ro'yxatda bo'lmasa ham ko'rsatiladi — aks holda select jimgina birinchi variantni ko'rsatardi. */
function withCurrent(options: SelectOption[], current: string): SelectOption[] {
  return !current || options.some((o) => o.value === current)
    ? options
    : [...options, { value: current, label: current }];
}

type BooleanField = {
  [K in keyof UserSettings]: UserSettings[K] extends boolean ? K : never;
}[keyof UserSettings];

function ToggleRow({
  settings,
  field,
  title,
  description,
  notActive,
  onChange,
}: {
  settings: UserSettings;
  field: BooleanField;
  title: string;
  description: string;
  notActive?: boolean;
  onChange: (patch: UserSettingsUpdate) => void;
}) {
  return (
    <SettingRow title={title} description={description} notActive={notActive}>
      <Toggle label={title} checked={settings[field]} onChange={(checked) => onChange({ [field]: checked })} />
    </SettingRow>
  );
}

function SettingRow({
  title,
  description,
  notActive = false,
  stacked = false,
  children,
}: {
  title: string;
  description: string;
  /** Qiymat saqlanadi, lekin ilovada hali hech narsaga ta'sir qilmaydi — userni chalg'itmaslik uchun belgilanadi. */
  notActive?: boolean;
  stacked?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`p-4 bg-white/5 rounded-2xl border border-white/10 ${stacked ? 'space-y-3' : 'flex items-center justify-between gap-4'}`}
    >
      <div className="min-w-0">
        <h4 className="font-medium flex items-center gap-2 flex-wrap">
          {title}
          {notActive && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-navy/50 bg-navy/5 border border-navy/10 px-2 py-0.5 rounded-full">
              Not active yet
            </span>
          )}
        </h4>
        <p className="text-sm text-navy/60">{description}</p>
      </div>
      {children}
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  return (
    <div aria-live="polite" className="text-xs font-medium shrink-0">
      {state.status === 'saving' && (
        <span className="flex items-center gap-1.5 text-navy/60">
          <Loader2 size={12} className="animate-spin" aria-hidden="true" /> Saving…
        </span>
      )}
      {state.status === 'saved' && (
        <span className="flex items-center gap-1.5 text-emerald-600">
          <Check size={12} aria-hidden="true" /> Saved
        </span>
      )}
    </div>
  );
}

let timeZoneCache: SelectOption[] | null = null;

/** Brauzer biladigan barcha IANA zonalar, hozirgi UTC siljishi bilan (bir marta hisoblanadi). */
function allTimeZones(): SelectOption[] {
  if (timeZoneCache) return timeZoneCache;
  let ids: string[];
  try {
    ids = Intl.supportedValuesOf('timeZone');
  } catch {
    ids = [];
  }
  if (!ids.includes('UTC')) ids = ['UTC', ...ids];
  const now = new Date();
  timeZoneCache = ids.map((id) => {
    let offset = '';
    try {
      offset =
        new Intl.DateTimeFormat('en-US', { timeZone: id, timeZoneName: 'shortOffset' })
          .formatToParts(now)
          .find((p) => p.type === 'timeZoneName')?.value ?? '';
    } catch {
      // eski brauzer shortOffset'ni bilmasa — faqat nomi
    }
    const name = id.replace(/_/g, ' ');
    return { value: id, label: offset ? `${name} (${offset})` : name };
  });
  return timeZoneCache;
}

function TimeZoneSelect({ value, onChange }: { value: string | null; onChange: (timezone: string | null) => void }) {
  const detected = browserTimeZone().replace(/_/g, ' ');
  const options = [{ value: '', label: `Automatic (${detected})` }, ...withCurrent(allTimeZones(), value ?? '')];

  return (
    <Select
      label="Time Zone"
      value={value ?? ''}
      onChange={(v) => onChange(v || null)}
      options={options}
      searchable
      searchPlaceholder="Search city or region…"
      className="w-full sm:w-80"
    />
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
