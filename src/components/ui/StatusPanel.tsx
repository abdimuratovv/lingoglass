import { Loader2 } from 'lucide-react';

/** Ma'lumot yuklanayotganda / xato bo'lganda / bo'sh bo'lganda ko'rsatiladigan glass panel. */
export function StatusPanel({
  loading,
  error,
  message,
  onRetry,
}: {
  loading?: boolean;
  error?: string | null;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 min-h-40">
      {loading ? (
        <p role="status" className="flex items-center gap-2 text-navy/70">
          <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Loading…
        </p>
      ) : error ? (
        <>
          <p role="alert" className="text-sm text-red-500">
            Couldn't load data: {error}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-amaranth hover:bg-amaranth/90 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Try again
            </button>
          )}
        </>
      ) : (
        <p className="text-navy/70">{message}</p>
      )}
    </div>
  );
}
