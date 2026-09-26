const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const DAY_MS = 86_400_000;

function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * "Just now", "5 minutes ago", "3 hours ago", "Yesterday", "4 days ago", undan eskisi sana ("Sep 12").
 * Kunlar mahalliy kalendar bo'yicha: kecha 23:00 dagi voqea ertasi ertalab "Yesterday" bo'ladi, "9 hours ago" emas.
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return relative.format(-minutes, 'minute');

  const days = Math.round((startOfLocalDay(now) - startOfLocalDay(date)) / DAY_MS);
  if (days === 0) return relative.format(-Math.floor(minutes / 60), 'hour');
  if (days < 7) return capitalize(relative.format(-days, 'day'));
  return date.toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  });
}
