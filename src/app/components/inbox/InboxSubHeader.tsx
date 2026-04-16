import React, { useState, useRef, useEffect, useLayoutEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { FilterIcon, VerificationFilledIcon, CrownFilledIcon } from '../icons';
import type { FilterExperienceVersion } from '../filters/sharedFilters';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SortOption = 'recommended' | 'newest' | 'oldest' | 'recentlyActive';
export type ViewMode = 'card' | 'list';

export interface InboxFilterState {
  premiumUsers: boolean;
  onlineNow: boolean;
  withPhotos: boolean;
  verified: boolean;
  income: boolean;
  location: boolean;
  religion: boolean;
  career: boolean;
}

export const EMPTY_FILTERS: InboxFilterState = {
  premiumUsers: false,
  onlineNow: false,
  withPhotos: false,
  verified: false,
  income: false,
  location: false,
  religion: false,
  career: false,
};

const SORT_LABELS: Record<SortOption, string> = {
  recommended: 'Recommended',
  newest: 'Newest First',
  oldest: 'Oldest First',
  recentlyActive: 'Recently Active',
};

const SORT_OPTIONS: SortOption[] = ['recommended', 'newest', 'oldest', 'recentlyActive'];

export const FILTER_LABELS: Record<keyof InboxFilterState, string> = {
  premiumUsers: 'Premium Users',
  onlineNow: 'Online Now',
  withPhotos: 'With Photos',
  verified: 'Verified',
  income: 'Income',
  location: 'Location',
  religion: 'Religion',
  career: 'Work',
};

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar pills — MeowUI tokens (border-border, primary, muted); not Figma specs
// ─────────────────────────────────────────────────────────────────────────────

const toolbarPill = cva(
  [
    'inline-flex h-8 min-h-8 w-full min-w-0 items-center justify-center gap-2 rounded-full border pl-[13px] pr-[11px]',
    'text-sm font-normal text-foreground transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'ring-offset-background',
  ],
  {
    variants: {
      state: {
        idle: 'border-border bg-background hover:bg-muted',
        accent: 'border-primary bg-primary/10 text-primary font-medium hover:bg-primary/20',
      },
    },
    defaultVariants: { state: 'idle' },
  }
);

const iconStroke = 1.75;
const viewToggleButtonBaseClass = 'flex h-full w-8 items-center justify-center py-0 pr-0 pl-[1px] transition-colors duration-200';
const cardViewIconClass = 'block h-5 w-5 shrink-0 translate-x-[1px]';
const listViewIconClass = 'block h-5 w-5 shrink-0 -translate-x-[1px]';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-header component
// ─────────────────────────────────────────────────────────────────────────────

interface InboxSubHeaderProps {
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenFilterSheet: () => void;
  activeFilterCount: number;
  isCurrentUserPremium?: boolean;
  filterExperienceVersion?: FilterExperienceVersion;
  isScrolled?: boolean;
  /** When true (usually via ?figmaCaptureInboxSortOpen=1), opens sort menu on mount and ignores outside-click close briefly so Figma capture can snapshot the open dropdown after a full page load. */
  openSortMenuForFigmaCapture?: boolean;
  quickChipState?: {
    verified: boolean;
    withPhoto: boolean;
    recentlyJoined: boolean;
    nearBy: boolean;
  };
  onToggleQuickChip?: (chip: 'verified' | 'withPhoto' | 'recentlyJoined' | 'nearBy') => void;
}

export const InboxSubHeader = ({
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenFilterSheet,
  activeFilterCount,
  isCurrentUserPremium = false,
  filterExperienceVersion = 'option1',
  isScrolled = false,
  openSortMenuForFigmaCapture = false,
  quickChipState,
  onToggleQuickChip,
}: InboxSubHeaderProps) => {
  const [showSortDropdown, setShowSortDropdown] = useState(() => openSortMenuForFigmaCapture);
  const sortRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const [sortMenuPosition, setSortMenuPosition] = useState<{ left: number; top: number } | null>(null);
  const sortListId = useId();

  /** Figma HTML capture often sends stray clicks; the sort control toggles closed — lock menu open for full layer import. */
  const lockSortMenuForCapture = openSortMenuForFigmaCapture;

  const toggleSortDropdown = () => {
    if (lockSortMenuForCapture) {
      setShowSortDropdown(true);
      return;
    }
    setShowSortDropdown((o) => !o);
  };

  useEffect(() => {
    if (!showSortDropdown || lockSortMenuForCapture) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        sortRef.current &&
        !sortRef.current.contains(target) &&
        !(sortDropdownRef.current && sortDropdownRef.current.contains(target))
      ) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSortDropdown, lockSortMenuForCapture]);

  useEffect(() => {
    if (!showSortDropdown || lockSortMenuForCapture) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSortDropdown(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showSortDropdown, lockSortMenuForCapture]);

  const hasActiveFilters = activeFilterCount > 0;
  // Renumbered filter experiences:
  // - option3 = “Sticky quick actions” (formerly option5)
  const isStickyQuickActions = filterExperienceVersion === 'option3';
  const subHeaderSurfaceClass = cn(
    'w-full transition-all duration-200',
    isScrolled
      ? 'bg-background border-b border-border shadow-[0_6px_14px_rgba(0,0,0,0.06)]'
      : 'bg-transparent border-b border-transparent'
  );
  useLayoutEffect(() => {
    if (!showSortDropdown || !sortButtonRef.current) return;
    const rect = sortButtonRef.current.getBoundingClientRect();
    setSortMenuPosition({
      left: Math.max(12, rect.left),
      top: rect.bottom + 6,
    });
  }, [showSortDropdown, sortOption]);

  if (isStickyQuickActions) {
    const chips = [
      { id: 'verified' as const, label: 'Verified', active: !!quickChipState?.verified, premium: false },
      { id: 'withPhoto' as const, label: 'Has Photo', active: !!quickChipState?.withPhoto, premium: false },
      { id: 'recentlyJoined' as const, label: 'Just Joined', active: !!quickChipState?.recentlyJoined, premium: false },
      { id: 'nearBy' as const, label: 'Near Me', active: !!quickChipState?.nearBy, premium: true },
    ];
    return (
      <div className={cn(subHeaderSurfaceClass, 'sticky top-0 z-40')}>
        <div
          className="relative w-full pl-2.5 pr-2.5 py-2.5"
          role="toolbar"
          aria-label="Inbox filters and view"
        >
          <div className="relative flex w-full items-center">
            <div className="relative min-w-0 flex-1 overflow-x-auto overflow-y-visible scrollbar-hide touch-pan-x">
              <div className="inline-flex w-max items-center gap-2 pl-[40px] pr-[104px]">
                <div className="relative shrink-0" ref={sortRef}>
                  <button
                    ref={sortButtonRef}
                    type="button"
                    onClick={toggleSortDropdown}
                    className={cn(
                      'h-8 shrink-0 rounded-full border pl-3 pr-[9px] inline-flex items-center gap-1 text-sm font-normal transition-colors',
                      'border-border bg-background text-foreground hover:bg-muted'
                    )}
                    aria-expanded={showSortDropdown}
                    aria-haspopup="listbox"
                    aria-controls={showSortDropdown ? sortListId : undefined}
                    aria-label={`Sort: ${SORT_LABELS[sortOption]}`}
                  >
                    <span className="whitespace-nowrap">Sort</span>
                    <ChevronDown
                      className={cn(
                        'size-[18px] shrink-0 text-muted-foreground transition-transform',
                        showSortDropdown && 'rotate-180'
                      )}
                      strokeWidth={iconStroke}
                    />
                  </button>
                </div>

                {chips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => onToggleQuickChip?.(chip.id)}
                    className={cn(
                      'h-8 shrink-0 rounded-full border px-3 inline-flex items-center gap-1.5 text-sm font-normal transition-colors',
                      chip.active
                        ? 'border-[#0AA4B8] bg-[#E8F8FB] text-[#0AA4B8]'
                        : 'border-border bg-background text-foreground hover:bg-muted'
                    )}
                  >
                    {chip.premium && !isCurrentUserPremium ? (
                      <CrownFilledIcon className={cn('w-3.5 h-3.5 shrink-0', chip.active ? 'text-[#0AA4B8]' : 'text-[#ff5a60]')} />
                    ) : null}
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-0 w-[46px] pointer-events-none" style={{ background: 'linear-gradient(to right, var(--color-background) 72%, transparent)' }}>
              <button
                type="button"
                onClick={onOpenFilterSheet}
                className={cn(
                  'relative h-8 w-8 shrink-0 rounded-full border flex items-center justify-center transition-colors pointer-events-auto',
                  hasActiveFilters ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
                )}
                aria-label="Open filters"
              >
                <FilterIcon
                  className={cn(
                    'w-4 h-4 translate-y-[0.5px]',
                    hasActiveFilters ? 'text-primary' : 'text-foreground'
                  )}
                />
                {hasActiveFilters ? (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-background bg-[#FF5A6A]" />
                ) : null}
              </button>
            </div>

            <div className="pointer-events-none absolute top-0 bottom-0 w-[28px]" style={{ right: '56px', background: 'linear-gradient(to left, var(--color-background) 30%, transparent)' }} />
            <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-[56px]" style={{ background: 'linear-gradient(to right, transparent, var(--color-background) 2px)' }} />
            <div
              className={cn(
                'absolute right-0 top-1/2 -translate-y-1/2 flex h-8 shrink-0 items-center overflow-hidden rounded-full border border-border bg-background z-10',
                'ring-offset-background'
              )}
              role="group"
              aria-label="View layout"
            >
            <button
              type="button"
              onClick={() => onViewModeChange('card')}
              aria-pressed={viewMode === 'card'}
              className={cn(
                viewToggleButtonBaseClass,
                viewMode === 'card'
                  ? 'bg-[#E8F8FB]'
                  : 'bg-transparent hover:bg-muted/50'
              )}
            >
              <svg
                className={cardViewIconClass}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect
                  x="3.51416"
                  y="3.125"
                  width="12.9718"
                  height="14.4995"
                  rx="3.125"
                  fill={viewMode === 'card' ? '#D4F7FF' : 'none'}
                  stroke={viewMode === 'card' ? '#00BCD5' : '#B1B3B9'}
                  strokeWidth="1.25"
                />
              </svg>
            </button>
            <div className="h-5 w-px bg-border" />
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-pressed={viewMode === 'list'}
              className={cn(
                viewToggleButtonBaseClass,
                viewMode === 'list'
                  ? 'bg-[#E8F8FB]'
                  : 'bg-transparent hover:bg-muted/50'
              )}
            >
              <svg
                className={listViewIconClass}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect
                  x="2.47339"
                  y="2.83789"
                  width="15.0531"
                  height="5.625"
                  rx="2.5"
                  fill={viewMode === 'list' ? '#D4F7FF' : 'none'}
                  stroke={viewMode === 'list' ? '#00BCD5' : '#B1B3B9'}
                  strokeWidth="1.25"
                />
                <rect
                  x="2.47339"
                  y="11.5371"
                  width="15.0531"
                  height="5.625"
                  rx="2.5"
                  fill={viewMode === 'list' ? '#D4F7FF' : 'none'}
                  stroke={viewMode === 'list' ? '#00BCD5' : '#B1B3B9'}
                  strokeWidth="1.25"
                />
              </svg>
            </button>
            </div>
          </div>
          <AnimatePresence>
            {showSortDropdown && sortMenuPosition && (
              <motion.div
                ref={sortDropdownRef}
                id={sortListId}
                role="listbox"
                aria-label="Sort by"
                className={cn(
                  'fixed z-[75] min-w-[11rem] overflow-hidden rounded-xl',
                  'border border-border bg-popover text-popover-foreground shadow-lg',
                  'ring-1 ring-black/5 dark:ring-white/10'
                )}
                style={{ left: `${sortMenuPosition.left}px`, top: `${sortMenuPosition.top}px` }}
                initial={lockSortMenuForCapture ? false : { opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: lockSortMenuForCapture ? 0 : 0.15 }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    aria-selected={sortOption === opt}
                    onClick={() => {
                      onSortChange(opt);
                      if (!lockSortMenuForCapture) setShowSortDropdown(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors',
                      sortOption === opt
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                        sortOption === opt ? 'border-primary' : 'border-muted-foreground/35'
                      )}
                    >
                      {sortOption === opt ? (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      ) : null}
                    </span>
                    <span>{SORT_LABELS[opt]}</span>
                    {opt === 'recentlyActive' && !isCurrentUserPremium ? (
                      <CrownFilledIcon className="ml-auto w-4 h-4 text-[#ff5a60] shrink-0" />
                    ) : null}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className={subHeaderSurfaceClass}>
      <div
        className="flex w-full items-center gap-2 pl-2.5 pr-[10px] py-2.5"
        role="toolbar"
        aria-label="Inbox filters and view"
      >
        {/* Filters — use Matches tab icon-only filter button */}
        <button
          type="button"
          onClick={onOpenFilterSheet}
          className={cn(
            'relative h-8 w-8 shrink-0 rounded-full border flex items-center justify-center transition-colors',
            hasActiveFilters ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
          )}
          aria-label="Open filters"
        >
          <FilterIcon
            className={cn(
              'w-4 h-4 translate-y-[0.5px]',
              hasActiveFilters ? 'text-primary' : 'text-foreground'
            )}
          />
          {hasActiveFilters ? (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-background bg-[#FF5A6A]" />
          ) : null}
        </button>

        {/* Sort / Recommended — matched width and height to Filters */}
        <div className="relative min-w-0 w-fit" ref={sortRef}>
          <button
            type="button"
            onClick={toggleSortDropdown}
            className={cn(toolbarPill({ state: 'idle' }))}
            aria-expanded={showSortDropdown}
            aria-haspopup="listbox"
            aria-controls={showSortDropdown ? sortListId : undefined}
          >
            <span className="min-w-0 w-full whitespace-nowrap">Sort: {SORT_LABELS[sortOption]}</span>
            <ChevronDown
              className={cn(
                'size-[18px] shrink-0 transition-transform text-muted-foreground',
                showSortDropdown && 'rotate-180'
              )}
              strokeWidth={iconStroke}
            />
          </button>

          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                ref={sortDropdownRef}
                id={sortListId}
                role="listbox"
                aria-label="Sort by"
                className={cn(
                  'absolute left-0 top-full z-50 mt-1.5 min-w-[11rem] overflow-hidden rounded-xl',
                  'border border-border bg-popover text-popover-foreground shadow-lg',
                  'ring-1 ring-black/5 dark:ring-white/10'
                )}
                initial={lockSortMenuForCapture ? false : { opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: lockSortMenuForCapture ? 0 : 0.15 }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    aria-selected={sortOption === opt}
                    onClick={() => {
                      onSortChange(opt);
                      if (!lockSortMenuForCapture) setShowSortDropdown(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors',
                      sortOption === opt
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                        sortOption === opt ? 'border-primary' : 'border-muted-foreground/35'
                      )}
                    >
                      {sortOption === opt ? (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      ) : null}
                    </span>
                    <span>{SORT_LABELS[opt]}</span>
                    {opt === 'recentlyActive' && !isCurrentUserPremium ? (
                      <CrownFilledIcon className="ml-auto w-4 h-4 text-[#ff5a60] shrink-0" />
                    ) : null}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card / list — Figma card + list glyphs */}
        <div
          className={cn(
            'ml-auto flex h-8 shrink-0 items-center overflow-hidden rounded-full border border-border bg-background',
            'ring-offset-background'
          )}
          role="group"
          aria-label="View layout"
        >
          <button
            type="button"
            onClick={() => onViewModeChange('card')}
            aria-pressed={viewMode === 'card'}
            className={cn(
              viewToggleButtonBaseClass,
              viewMode === 'card'
                ? 'bg-[#E8F8FB]'
                : 'bg-transparent hover:bg-muted/50'
            )}
          >
            <svg
              className={cardViewIconClass}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect
                x="3.51416"
                y="3.125"
                width="12.9718"
                height="14.4995"
                rx="3.125"
                fill={viewMode === 'card' ? '#D4F7FF' : 'none'}
                stroke={viewMode === 'card' ? '#00BCD5' : '#B1B3B9'}
                strokeWidth="1.25"
              />
            </svg>
          </button>
          <div className="h-5 w-px bg-border" />
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            aria-pressed={viewMode === 'list'}
            className={cn(
              viewToggleButtonBaseClass,
              viewMode === 'list'
                ? 'bg-[#E8F8FB]'
                : 'bg-transparent hover:bg-muted/50'
            )}
          >
            <svg
              className={listViewIconClass}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect
                x="2.47339"
                y="2.83789"
                width="15.0531"
                height="5.625"
                rx="2.5"
                fill={viewMode === 'list' ? '#D4F7FF' : 'none'}
                stroke={viewMode === 'list' ? '#00BCD5' : '#B1B3B9'}
                strokeWidth="1.25"
              />
              <rect
                x="2.47339"
                y="11.5371"
                width="15.0531"
                height="5.625"
                rx="2.5"
                fill={viewMode === 'list' ? '#D4F7FF' : 'none'}
                stroke={viewMode === 'list' ? '#00BCD5' : '#B1B3B9'}
                strokeWidth="1.25"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
