import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Ko'rinadigan `<label htmlFor={id}>` bo'lmasa — accessible nom (aria-label). */
  label?: string;
  id?: string;
  disabled?: boolean;
  /** `value` hech bir variantga mos kelmasa trigger'da ko'rsatiladi. */
  placeholder?: ReactNode;
  /** Uzun ro'yxatlar uchun (masalan vaqt zonalari) — ochilganda qidiruv maydoni chiqadi. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Trigger kengligi va h.k. (masalan `w-full`). */
  className?: string;
}

const GAP = 6;
const VIEWPORT_MARGIN = 8;
const MAX_HEIGHT = 288;
const PAGE_STEP = 8;

function normalize(s: string) {
  return s.toLowerCase().replace(/_/g, ' ');
}

function isPrintable(e: KeyboardEvent) {
  return e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey;
}

/**
 * Native `<select>` o'rniga glass uslubidagi select. Native ro'yxatni (option'larni) OS chizadi va uni CSS bilan
 * bezab bo'lmaydi — shuning uchun o'zimizniki. WAI-ARIA "select-only combobox" naqshi: fokus trigger'da qoladi,
 * faol variant `aria-activedescendant` orqali e'lon qilinadi; `searchable` bo'lsa fokus qidiruv maydoniga o'tadi.
 *
 * Ro'yxat `document.body`ga portal qilinadi (`fixed`) — `<main>` `overflow-y-auto` bo'lgani uchun ichida
 * `absolute` bo'lsa kesilib qolardi. Joylashuv state'siz, to'g'ridan-to'g'ri DOM style orqali hisoblanadi.
 */
export function Select({
  value,
  onChange,
  options,
  label,
  id,
  disabled = false,
  placeholder = 'Select…',
  searchable = false,
  searchPlaceholder = 'Search…',
  className = '',
}: SelectProps) {
  const autoId = useId();
  const triggerId = id ?? `${autoId}-trigger`;
  const listId = `${autoId}-list`;
  const optionId = (i: number) => `${autoId}-opt-${i}`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const typeahead = useRef({ text: '', timer: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex === -1 ? undefined : options[selectedIndex];

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    if (!searchable || !q) return options;
    return options.filter((o) => normalize(o.label).includes(q) || normalize(o.value).includes(q));
  }, [options, query, searchable]);

  const openList = (index = selectedIndex) => {
    setQuery('');
    setActive(Math.max(0, index));
    setOpen(true);
  };

  const close = (focusTrigger: boolean) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const choose = (i: number) => {
    const option = visible[i];
    if (!option) return;
    if (option.value !== value) onChange(option.value);
    close(true);
  };

  /** Harf yozib variantga o'tish (native select kabi); bir xil harf qayta bosilsa keyingisiga aylanadi. */
  const typeaheadIndex = (key: string, current: number) => {
    const t = typeahead.current;
    window.clearTimeout(t.timer);
    t.text += key.toLowerCase();
    t.timer = window.setTimeout(() => {
      t.text = '';
    }, 500);
    const n = visible.length;
    const from = t.text.length === 1 ? current + 1 : current;
    for (let k = 0; k < n; k++) {
      const i = (from + k) % n;
      if (visible[i].label.toLowerCase().startsWith(t.text)) return i;
    }
    return -1;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      } else if (!searchable && isPrintable(e)) {
        e.preventDefault();
        const i = typeaheadIndex(e.key, Math.max(selectedIndex, 0));
        openList(i === -1 ? selectedIndex : i);
      }
      return;
    }

    const last = visible.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => Math.min(a + 1, last));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case 'PageDown':
        e.preventDefault();
        setActive((a) => Math.min(a + PAGE_STEP, last));
        break;
      case 'PageUp':
        e.preventDefault();
        setActive((a) => Math.max(a - PAGE_STEP, 0));
        break;
      case 'Home':
      case 'End':
        // Qidiruv maydonida Home/End matn kursorini boshqaradi.
        if (!searchable) {
          e.preventDefault();
          setActive(e.key === 'Home' ? 0 : last);
        }
        break;
      case 'Enter':
        e.preventDefault();
        choose(active);
        break;
      case ' ':
        if (!searchable) {
          e.preventDefault();
          choose(active);
        }
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        close(true);
        break;
      case 'Tab':
        // Fokus trigger'ga qaytariladi — keyin brauzerning Tab'i undan keyingi elementga o'tadi.
        close(searchable);
        break;
      default:
        if (!searchable && isPrintable(e)) {
          const i = typeaheadIndex(e.key, active);
          if (i !== -1) setActive(i);
        }
    }
  };

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    const popup = popupRef.current;
    if (!trigger || !popup) return;
    const r = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const below = vh - r.bottom - GAP - VIEWPORT_MARGIN;
    const above = r.top - GAP - VIEWPORT_MARGIN;
    const up = below < Math.min(MAX_HEIGHT, popup.scrollHeight) && above > below;
    const width = Math.min(Math.max(r.width, searchable ? 288 : 176), vw - 2 * VIEWPORT_MARGIN);
    const left = Math.min(Math.max(r.left, VIEWPORT_MARGIN), vw - VIEWPORT_MARGIN - width);

    popup.style.left = `${left}px`;
    popup.style.width = `${width}px`;
    popup.style.maxHeight = `${Math.min(MAX_HEIGHT, up ? above : below)}px`;
    popup.style.top = up ? '' : `${r.bottom + GAP}px`;
    popup.style.bottom = up ? `${vh - r.top + GAP}px` : '';
  }, [searchable]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    const onScroll = (e: Event) => {
      if (!popupRef.current?.contains(e.target as Node)) place();
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', place);
    };
  }, [open, place, visible.length]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || popupRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus({ preventScroll: true });
  }, [open, searchable]);

  useEffect(() => {
    if (open) document.getElementById(`${autoId}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, autoId]);

  const activeDescendant = open && visible.length > 0 ? optionId(active) : undefined;

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={searchable ? undefined : activeDescendant}
        disabled={disabled}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onKeyDown}
        // Bo'sh joy tugmani keyup'da "bosadi" — keydown'da ro'yxat allaqachon ochilgan/yopilgan.
        onKeyUp={(e) => e.key === ' ' && e.preventDefault()}
        className={`inline-flex items-center justify-between gap-2 shrink-0 max-w-full rounded-xl border px-3 py-2 text-sm font-medium text-charcoal text-left backdrop-blur-md shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amaranth/30 disabled:opacity-50 disabled:cursor-not-allowed ${
          open ? 'bg-white/70 border-amaranth/30' : 'bg-white/40 border-white/50 enabled:hover:bg-white/60'
        } ${className}`}
      >
        <span className={`truncate ${selected ? '' : 'text-navy/50'}`}>{selected?.label ?? placeholder}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-amaranth' : 'text-navy/50'}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={popupRef}
            className="fixed z-[100] flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-xl shadow-navy/10 text-charcoal motion-safe:animate-[profileDropIn_0.18s_cubic-bezier(0.16,1,0.3,1)]"
          >
            {searchable && (
              <div className="p-2 border-b border-navy/5 shrink-0">
                <div className="flex items-center gap-2 bg-navy/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-amaranth/30">
                  <Search size={14} className="text-navy/40 shrink-0" aria-hidden="true" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActive(0);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder={searchPlaceholder}
                    aria-label={label ? `Search ${label}` : 'Search'}
                    aria-controls={listId}
                    aria-activedescendant={activeDescendant}
                    aria-autocomplete="list"
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-navy/40"
                  />
                </div>
              </div>
            )}

            <ul
              id={listId}
              role="listbox"
              aria-label={label}
              aria-labelledby={label ? undefined : triggerId}
              // Bosilganda fokus trigger/qidiruv maydonida qolsin.
              onMouseDown={(e) => e.preventDefault()}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin]"
            >
              {visible.map((option, i) => {
                const isSelected = option.value === value;
                const isActive = i === active;
                return (
                  <li
                    key={option.value}
                    id={optionId(i)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseMove={() => i !== active && setActive(i)}
                    onClick={() => choose(i)}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors ${
                      isActive ? 'bg-amaranth/10 text-amaranth' : ''
                    } ${isSelected ? 'font-semibold' : ''}`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check size={14} aria-hidden="true" className="shrink-0 text-amaranth" />}
                  </li>
                );
              })}
            </ul>
            {visible.length === 0 && <p className="px-3 pb-4 pt-2 text-center text-sm text-navy/50">No matches</p>}
          </div>,
          document.body,
        )}
    </>
  );
}
