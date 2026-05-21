import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronRight, Search, X, User } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { CrownFilledIcon, PremiumLockIcon } from '../icons';
import { getCityOptionsForStates, getCommunityOptionsForReligions, getCommunityGroupsForReligions } from '../../../data/filterOptionCatalog';
import {
  PARTNER_PREFERENCE_BASELINE_FILTERS,
  getBaselineFiltersForPersona,
  countActiveSharedFilters,
  countIterationCategoryActiveFilters,
  getIterationCategories,
  getRightPaneStyle,
  shouldShowPartnerHasChildrenFilter,
  type FilterExperienceVersion,
  type PremiumLockPromptPresentation,
  type IterationCategoryConfig,
  type SharedFilterDefinition,
  type SharedFilterKey,
  type SharedFilterState,
} from './sharedFilters';

interface SharedFilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  value: SharedFilterState;
  onApply: (filters: SharedFilterState) => void;
  isCurrentUserPremium: boolean;
  onPremiumUpgrade?: () => void;
  estimateResultCount?: (filters: SharedFilterState) => number;
  resultLabel?: string;
  iteration?: FilterExperienceVersion;
  /** When true, all filter rows are usable (crowns decorative only). */
  filtersIgnorePremium?: boolean;
  /** For option4 / option5: determines which income slider to show ('INR' or 'USD'). Defaults to 'INR'. */
  currentUserIncomeCurrency?: 'INR' | 'USD';
  /** For option4: shows 'Country grew up in' filter only when current user is outside India. */
  currentUserIsOutsideIndia?: boolean;
  /** For option4: pre-selects partner religion baseline matching the current user's religion. */
  currentUserReligion?: string;
  /** Persona ID — drives baseline defaults, community/religion options, and manglik visibility. */
  currentUserPersonaId?: string;
  /** When false, hides the Refine / Get more Matches segmented tab control. Defaults to true. */
  showFilterTabs?: boolean;
  /** How premium-locked rows render their trailing control. Defaults to 'chevron'. */
  premiumRowStyle?: 'chevron' | 'badge';
  /** Icon inside the red premium badge on rows and left nav. Defaults to 'lock'. */
  premiumIndicatorGlyph?: 'crown' | 'lock';
  /** How the upsell appears when tapping a locked premium control. Defaults to 'floating-card'. */
  premiumLockPromptPresentation?: PremiumLockPromptPresentation;
}

/**
 * Nested premium bottom sheet + `sheet-plain` layout debug: each box gets a distinct tint + outline.
 * Set `true` while tuning padding; set `false` for production UI.
 */
const DEBUG_PREMIUM_NESTED_SHEET = false;

// ─────────────────────────────────────────────────────
// Primitive controls
// ─────────────────────────────────────────────────────

const Checkbox = ({
  checked,
  indeterminate = false,
  variant = 'default',
}: {
  checked: boolean;
  indeterminate?: boolean;
  variant?: 'default' | 'option4';
}) => {
  const o4 = variant === 'option4';
  return (
    <div
      className={cn(
        'rounded-[4px] border-2 flex items-center justify-center transition-colors shrink-0',
        o4 ? 'w-5 h-5' : 'w-[18px] h-[18px]',
        checked
          ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)]'
          : o4
            ? 'bg-white border-[color:var(--color-filter-checkbox-border)]'
            : 'bg-white border-[#c4c4c4]'
      )}
    >
      {checked && !indeterminate && (
        <svg width={o4 ? 11 : 10} height={o4 ? 9 : 8} viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {!checked && indeterminate && (
        <div
          className={cn(
            'rounded-full bg-[color:var(--color-primary)]',
            o4 ? 'h-[2px] w-[10px]' : 'h-[2px] w-[9px]'
          )}
        />
      )}
    </div>
  );
};

const RadioDot = ({ checked, variant = 'default' }: { checked: boolean; variant?: 'default' | 'option4' }) => {
  const o4 = variant === 'option4';
  return (
    <div
      className={cn(
        'w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors shrink-0',
        checked
          ? 'border-[color:var(--color-primary)]'
          : o4
            ? 'border-[color:var(--color-filter-checkbox-border)]'
            : 'border-[#c4c4c4]'
      )}
    >
      {checked && <div className="w-[10px] h-[10px] rounded-full bg-[color:var(--color-primary)]" />}
    </div>
  );
};

/** Splits "Hindu (1,241)" → { main: "Hindu", count: "1,241" }. If no count, count is "". */
function splitLabel(label: string): { main: string; count: string } {
  const match = label.match(/^(.*?)\s*\((\d[\d,]*)\)\s*$/);
  if (match) {
    const parsed = Number(match[2].replace(/,/g, ''));
    const cappedCount = Number.isFinite(parsed) && parsed > 999 ? '999' : match[2];
    return { main: match[1], count: cappedCount };
  }
  return { main: label, count: '' };
}

function formatRightPaneHeading(label: string): string {
  const words = label.trim().split(/\s+/);
  if (words.length === 0) return label;

  return words
    .map((word, index) => {
      if (/^[A-Z]{2,}$/.test(word)) return word;
      const lower = word.toLowerCase();
      if (index === 0) return lower.charAt(0).toUpperCase() + lower.slice(1);
      return lower;
    })
    .join(' ');
}

function filterSearchPlaceholder(filter: SharedFilterDefinition): string {
  return filter.searchPlaceholder ?? `Search ${filter.label}`;
}

const CHECKBOX_VIEW_MORE_THRESHOLD = 5;
const CHECKBOX_SEARCH_THRESHOLD = 10;
const VIEW_MORE_DISABLED_KEYS: SharedFilterKey[] = ['qualification', 'educationField', 'workingWith', 'professionArea'];

function hideDuplicateCategoryHeading(
  filterKey: SharedFilterKey,
  activeCategoryId: string | undefined,
  opts?: { iteration?: FilterExperienceVersion; currentUserReligion?: string }
): boolean {
  if (!activeCategoryId) return false;
  if (filterKey === 'astroFilter' && activeCategoryId === 'astro') return true;
  if (filterKey === 'motherTongue' && (activeCategoryId === 'motherTongue' || activeCategoryId === 'mother_tongue')) return true;
  if (filterKey === 'community' && (activeCategoryId === 'community' || activeCategoryId === 'religion_community' || activeCategoryId === 'religion')) return true;
  if (filterKey === 'diet' && (activeCategoryId === 'diet' || activeCategoryId === 'lifestyle_family')) return true;
  if (filterKey === 'hobbies' && (activeCategoryId === 'hobbies' || activeCategoryId === 'hobbies_interests')) return true;
  if (
    filterKey === 'religion' &&
    (activeCategoryId === 'religion' || activeCategoryId === 'religion_community')
  ) {
    // Option 4 / 5: dedicated "Religion" left nav — no duplicate "Religion" heading in the right pane (Manglik keeps its own).
    if (
      (opts?.iteration === 'option4' || opts?.iteration === 'option5') &&
      activeCategoryId === 'religion'
    ) {
      return true;
    }
    // Keep the "Religion" heading when Manglik is also shown (two labeled blocks in one pane).
    const paneShowsManglik =
      activeCategoryId === 'religion_community' ||
      (activeCategoryId === 'religion' &&
        !(
          (opts?.iteration === 'option4' || opts?.iteration === 'option5') &&
          opts?.currentUserReligion === 'Muslim'
        ));
    if (paneShowsManglik) return false;
    return true;
  }
  return false;
}

const PREMIUM_ROW_ICON_CLASS = 'h-4 w-4 shrink-0 text-[color:var(--color-destructive)]';
function PremiumBadgeIcon() {
  const glyph = React.useContext(PremiumIndicatorGlyphContext);
  if (glyph === 'lock') {
    return (
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
        <PremiumLockIcon className="text-[color:var(--color-destructive)]" />
      </span>
    );
  }
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-destructive)] shrink-0"
      aria-hidden
    >
      <CrownFilledIcon className="h-[11px] w-[11px] text-white" />
    </span>
  );
}
const RIGHT_PANE_SECTION_HEADING_CLASS = 'mb-2 whitespace-nowrap text-[12px] font-semibold leading-snug text-[#6b6b78]';
const RIGHT_PANE_SECTION_DIVIDER_CLASS = '-mx-3 h-px bg-[#ebebee]';
const VIEW_MORE_CLASS = 'py-2 text-[14px] font-medium whitespace-nowrap text-[#0AA4B8] hover:underline';
const RIGHT_PANE_WRAPPER_CLASS = 'px-3 pt-2 pb-4';
const RIGHT_PANE_WRAPPER_TALL_CLASS = 'px-3 pt-3.5 pb-5';
const FIRST_TOP_SECTION_WITH_HEADING_CLASS = 'first:pt-3.5';
const FIRST_TOP_SECTION_WITH_ROW_CLASS = 'first:pt-1.5';

/** Option 4 right pane — no outer vertical padding; scroll area uses pb-[112px] for footer; spacing is inside O4 blocks only. */
const O4_PANE_OUTER = 'px-0';
const O4_DIVIDER = 'h-px w-full shrink-0 bg-[color:var(--color-filter-divider)]';
const O4_ROW_PAD = 'pl-3 pr-1 py-0';
/** 8px below last control in each O4 section (Figma core component / Inbox filters). */
const O4_SECTION_BOTTOM_PAD = 'pb-2';

function O4SectionHeader({ title }: { title: string }) {
  return (
    <div className="pl-3 pr-4 pt-4 pb-2">
      <p className="text-[12px] font-medium leading-4 tracking-[0.2px] text-[color:var(--color-filter-text-3)]">
        {formatRightPaneHeading(title)}
      </p>
    </div>
  );
}

function O4GroupSubheader({ label }: { label: string }) {
  return (
    <p className="pl-3 pr-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-filter-text-4)]">
      {label}
    </p>
  );
}

function O4ViewMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full pl-3 pr-3 py-2.5 text-left text-[14px] font-medium text-[color:var(--color-primary)] transition-opacity hover:opacity-[0.88]"
    >
      View more
    </button>
  );
}

function O4SliderSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-0', className)}>
      <div className="pl-3 pr-4 pt-4 pb-2">
        <p className="text-[12px] font-medium leading-4 tracking-[0.2px] text-[color:var(--color-filter-text-3)]">
          {formatRightPaneHeading(title)}
        </p>
      </div>
      <div className="px-3">{children}</div>
    </div>
  );
}

/** Vertical stack for checkbox/slider blocks — no gap between rows; each row supplies padding. */
function O4SectionBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-0', className)}>{children}</div>;
}

function RightPaneO4SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}) {
  return (
    <div className="px-3 py-1">
      <div className="relative flex h-10 w-full items-center gap-2 rounded-xl border border-[color:var(--color-filter-border)] bg-[color:var(--color-filter-surface-muted)] pl-3 pr-4">
        <Search className="pointer-events-none h-5 w-5 shrink-0 text-[color:var(--color-filter-text-4)]" strokeWidth={2} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[color:var(--color-filter-text-1)] outline-none placeholder:text-[color:var(--color-filter-text-3)]"
        />
      </div>
    </div>
  );
}

function O4SectionSearch(props: { value: string; onChange: (next: string) => void; placeholder: string }) {
  return <RightPaneO4SearchInput {...props} />;
}

const PremiumRowStyleContext = React.createContext<'chevron' | 'badge'>('chevron');
const PremiumIndicatorGlyphContext = React.createContext<'crown' | 'lock'>('crown');

/** Figma `8537:31340` / `8537:31341` — sparkle vectors (exported SVG from file). */
function PremiumBannerSparkleSmall({ className }: { className?: string }) {
  return (
    <svg className={cn('block', className)} viewBox="0 0 8.08605 8.69304" fill="none" aria-hidden>
      <path
        opacity="0.4"
        d="M3.97255 0.058421C3.98725 -0.0194738 4.0988 -0.0194736 4.1135 0.0584211L4.7645 3.50892C4.76983 3.53712 4.79145 3.55944 4.81947 3.56564L8.02984 4.2765C8.10479 4.29309 8.10479 4.39995 8.02984 4.41654L4.81947 5.1274C4.79145 5.1336 4.76983 5.15592 4.7645 5.18412L4.1135 8.63462C4.0988 8.71251 3.98725 8.71251 3.97255 8.63462L3.32155 5.18412C3.31623 5.15592 3.2946 5.1336 3.26658 5.1274L0.0562129 4.41654C-0.0187377 4.39995 -0.0187376 4.29309 0.056213 4.2765L3.26658 3.56564C3.2946 3.55944 3.31623 3.53712 3.32155 3.50892L3.97255 0.058421Z"
        fill="#FF5A60"
      />
    </svg>
  );
}

/** Figma `8537:31342` — larger sparkle. */
function PremiumBannerSparkleLarge({ className }: { className?: string }) {
  return (
    <svg className={cn('block', className)} viewBox="0 0 12.4342 14.3729" fill="none" aria-hidden>
      <path
        opacity="0.8"
        d="M6.14645 0.0593416C6.16031 -0.0197803 6.27387 -0.0197806 6.28774 0.0593413L7.30433 5.86206C7.30927 5.89025 7.3305 5.91281 7.35834 5.91945L12.3791 7.11669C12.4525 7.1342 12.4526 7.2387 12.3791 7.25621L7.35834 8.45345C7.3305 8.46009 7.30927 8.48264 7.30433 8.51083L6.28774 14.3136C6.27387 14.3927 6.16031 14.3927 6.14645 14.3136L5.12986 8.51083C5.12492 8.48264 5.10369 8.46009 5.07585 8.45345L0.0550824 7.25621C-0.0183606 7.2387 -0.0183609 7.1342 0.0550821 7.11669L5.07585 5.91945C5.10369 5.91281 5.12492 5.89025 5.12986 5.86206L6.14645 0.0593416Z"
        fill="#FF5A60"
      />
    </svg>
  );
}

/** Figma `8537:31335` — gradient circle + drop shadow (SVG from file). */
function PremiumBannerLockCircle({ className }: { className?: string }) {
  const uid = `pll-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const fid = `${uid}-f`;
  const gid = `${uid}-g`;
  return (
    <svg className={cn('pointer-events-none block h-[55px] w-[55px]', className)} viewBox="0 0 61.677 61.677" fill="none" aria-hidden>
      <defs>
        <filter id={fid} x="0" y="0" width="61.677" height="61.677" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1.19529" />
          <feGaussianBlur stdDeviation="1.79293" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.352941 0 0 0 0 0.376471 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient id={gid} x1="30.8385" y1="2.39058" x2="30.8385" y2="61.9002" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF8888" />
          <stop offset="1" stopColor="#FF4249" />
        </linearGradient>
      </defs>
      <g filter={`url(#${fid})`}>
        <circle cx="30.8385" cy="29.6432" r="27.2526" fill={`url(#${gid})`} />
      </g>
    </svg>
  );
}

/** Figma Inbox `8537:31330` — premium upsell inside locked filter categories. */
function PremiumUpgradeCard({
  onUpgrade,
  onClose,
  className,
  surface = 'framed-card',
  suppressCloseButton = false,
}: {
  onUpgrade?: () => void;
  onClose?: () => void;
  className?: string;
  /** `framed-card` = red border + radius (Figma / modal-style). `sheet-plain` = same content, no red frame (nested sheet). */
  surface?: 'framed-card' | 'sheet-plain';
  /** When true, no in-card close (parent renders a Filters-style header close). */
  suppressCloseButton?: boolean;
}) {
  const isPlain = surface === 'sheet-plain';
  const dbg = DEBUG_PREMIUM_NESTED_SHEET && isPlain;
  const showClose = Boolean(onClose) && !suppressCloseButton;
  return (
    <div
      className={cn(
        'w-full shrink-0',
        isPlain ? 'px-0 pb-0 pt-0' : 'p-3',
        dbg && 'bg-lime-300/45 outline outline-2 outline-lime-700'
      )}
    >
      <div
        className={cn(
          'relative flex w-full flex-col',
          isPlain
            ? cn('gap-6 bg-white px-5', suppressCloseButton ? 'pt-0' : 'pt-4', dbg && 'bg-violet-200/55 outline outline-2 outline-violet-700')
            : 'gap-2.5 rounded-2xl border border-[#ff5a60] bg-[color-mix(in_srgb,#FFEDEB_10%,white)] p-3 shadow-[0_10px_32px_rgba(19,33,68,0.12),0_3px_10px_rgba(19,33,68,0.07)]',
          className
        )}
      >
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close premium prompt"
            className={cn(
              'absolute z-10 flex items-center justify-center rounded-full text-[#8e90a0] transition-colors hover:bg-[#f4f4f6] hover:text-[#636674]',
              isPlain ? 'right-3 top-3 h-10 w-10' : 'right-2 top-2 h-7 w-7'
            )}
          >
            <X className={isPlain ? 'h-5 w-5' : 'h-4 w-4'} />
          </button>
        ) : null}
        <div
          className={cn(
            'flex flex-col items-center',
            isPlain ? 'gap-2.5' : 'gap-2',
            dbg && 'bg-cyan-200/50 outline outline-2 outline-cyan-700'
          )}
        >
          {isPlain ? (
            <div
              className={cn(
                'relative mx-auto h-[68px] w-[106px] shrink-0',
                dbg && 'bg-orange-200/60 outline outline-2 outline-orange-700'
              )}
            >
              <div
                className={cn(
                  'absolute left-1/2 top-[2px] flex h-[64px] w-[64px] -translate-x-1/2 items-center justify-center',
                  dbg && 'bg-red-200/50 outline outline-2 outline-red-600'
                )}
              >
                <PremiumBannerLockCircle className="absolute inset-0 h-[64px] w-[64px]" />
                <span
                  className={cn(
                    'relative z-[1] inline-flex flex-col items-center justify-center pb-2',
                    dbg && 'bg-amber-100/70 outline outline-1 outline-amber-800'
                  )}
                >
                  <PremiumLockIcon className="h-[32px] w-[32px] text-white" />
                </span>
              </div>
              <PremiumBannerSparkleSmall className="absolute left-[10px] top-[56px] h-[10px] w-[9px]" />
              <PremiumBannerSparkleSmall className="absolute left-[78px] top-0 h-[10px] w-[9px]" />
              <PremiumBannerSparkleLarge className="absolute left-[88px] top-[9px] h-[16px] w-[14px]" />
            </div>
          ) : (
            <div className="relative mx-auto h-[66px] w-[99px] shrink-0">
              <div className="absolute left-1/2 top-[6px] flex h-[55px] w-[55px] -translate-x-1/2 items-center justify-center">
                <PremiumBannerLockCircle className="absolute inset-0" />
                <span className="relative z-[1] inline-flex flex-col items-center justify-center pb-1.5">
                  <PremiumLockIcon className="h-[27px] w-[27px] text-white" />
                </span>
              </div>
              <PremiumBannerSparkleSmall className="absolute left-[9px] top-[50px] h-[9.5px] w-[8.5px]" />
              <PremiumBannerSparkleSmall className="absolute left-[68px] top-[1px] h-[9.5px] w-[8.5px]" />
              <PremiumBannerSparkleLarge className="absolute left-[77px] top-[9px] h-[15px] w-[13px]" />
            </div>
          )}
          <div
            className={cn(
              'flex flex-col items-center text-center',
              isPlain ? 'gap-1' : 'gap-0.5',
              dbg && 'bg-teal-200/50 outline outline-2 outline-teal-700'
            )}
          >
            <p
              {...(isPlain ? { id: 'premium-lock-sheet-title' } : {})}
              className={cn(
                'text-[color:var(--color-filter-text-1)]',
                isPlain ? 'text-[22px] font-semibold leading-7' : 'text-[16px] font-medium leading-6'
              )}
            >
              Unlock Premium Filters
            </p>
            <p
              className={cn(
                'w-full max-w-none font-normal text-[color:var(--color-filter-text-3)]',
                isPlain ? 'text-[16px] leading-6' : 'text-[12px] leading-4 tracking-[0.2px]'
              )}
            >
              Refine your Matches with more filters
            </p>
          </div>
        </div>
        <div className={cn('w-full', dbg && 'bg-fuchsia-200/50 p-1 outline outline-2 outline-fuchsia-700')}>
          <Button
            type="button"
            variant="default"
            size={isPlain ? 'lg' : 'md'}
            shape={isPlain ? 'pill' : undefined}
            className={cn(
              'w-full font-semibold',
              isPlain ? 'h-12 gap-2 px-6 text-[17px] shadow-none' : 'h-10 gap-1.5',
              dbg && 'outline outline-2 outline-fuchsia-900'
            )}
            style={isPlain ? { fontWeight: 700 } : { fontSize: '15px', fontWeight: 700 }}
            onClick={() => onUpgrade?.()}
          >
            <CrownFilledIcon className={cn('shrink-0', isPlain ? '!h-5 !w-5' : '!h-4 !w-4')} />
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilterCheckboxRow({
  label,
  description,
  checked,
  indeterminate = false,
  premium = false,
  hasPremiumAccess = true,
  onClick,
  className,
  rowPaddingClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  controlClassName,
  hoverable = true,
  rowVariant = 'default',
}: {
  label: string;
  description?: string;
  checked: boolean;
  indeterminate?: boolean;
  premium?: boolean;
  hasPremiumAccess?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  rowPaddingClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  controlClassName?: string;
  hoverable?: boolean;
  rowVariant?: 'default' | 'option4';
}) {
  const premiumRowStyle = React.useContext(PremiumRowStyleContext);
  const { main, count } = splitLabel(label);
  const showPremiumControl = premium && !hasPremiumAccess;
  const isO4 = rowVariant === 'option4';
  const hasDescription = Boolean(description);
  /** Option 4 + subtitle: row height follows copy (Financial status, etc.). Single-line rows keep 48px min tap band. */
  const o4DynamicHeight = isO4 && hasDescription;
  const emphasizeLabel = !isO4 && checked && !showPremiumControl;
  const resolvedPadding = rowPaddingClassName ?? (isO4 ? O4_ROW_PAD : 'px-2 py-2.5');
  const trailingControlShellClass = cn(
    isO4
      ? o4DynamicHeight
        ? 'flex w-10 shrink-0 items-start justify-center self-start'
        : 'flex h-10 w-10 shrink-0 items-center justify-center'
      : 'shrink-0',
    controlClassName
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full text-left transition-colors',
        !isO4 && 'items-center gap-2.5 rounded-md',
        isO4 && 'gap-0.5 rounded-none',
        isO4 && !o4DynamicHeight && 'min-h-[48px] items-center',
        !isO4 && hoverable && 'hover:bg-[#f8f8fa]',
        isO4 && hoverable && !checked && !showPremiumControl && 'hover:bg-[color:var(--color-filter-surface-muted)]',
        isO4 && checked && !showPremiumControl && 'bg-[color:var(--color-filter-row-selected)]',
        resolvedPadding,
        className,
        o4DynamicHeight && 'min-h-0 items-start py-2.5'
      )}
    >
      {showPremiumControl && premiumRowStyle === 'chevron' && <PremiumBadgeIcon />}
      <span className={cn('min-w-0 flex-1', contentClassName, isO4 && description && 'flex flex-col gap-0.5')}>
        <span className={cn('flex min-w-0 items-baseline', isO4 ? 'gap-1.5' : 'gap-1')}>
          <span
            className={cn(
              'block min-w-0 text-[14px] leading-5',
              isO4
                ? cn(
                    'text-[color:var(--color-filter-text-1)]',
                    checked && !showPremiumControl ? 'font-medium' : 'font-normal'
                  )
                : cn('leading-snug text-[#1a1a2e]', emphasizeLabel && 'font-medium'),
              titleClassName
            )}
          >
            {main}
          </span>
          {count ? (
            <span
              className={cn(
                'shrink-0 whitespace-nowrap align-baseline text-[12px] font-normal leading-4',
                isO4 ? 'tracking-[0.2px] text-[color:var(--color-filter-text-3)]' : 'text-[#9e9ea8]'
              )}
            >
              {count}
            </span>
          ) : null}
        </span>
        {description ? (
          <span
            className={cn(
              'block min-w-0 text-[12px] leading-4',
              isO4 ? 'tracking-[0.2px] text-[color:var(--color-filter-text-4)]' : 'mt-0.5 leading-snug text-[#9e9ea8]',
              descriptionClassName
            )}
          >
            {description}
          </span>
        ) : null}
      </span>
      {showPremiumControl ? (
        premiumRowStyle === 'chevron' ? (
          <span className={trailingControlShellClass}>
            <ChevronRight className="h-[18px] w-[18px] shrink-0 text-[#c0c2cc]" />
          </span>
        ) : (
          <span className={cn(trailingControlShellClass, 'pointer-events-none')}>
            <PremiumBadgeIcon />
          </span>
        )
      ) : (
        <span className={trailingControlShellClass}>
          <Checkbox checked={checked} indeterminate={indeterminate} variant={isO4 ? 'option4' : 'default'} />
        </span>
      )}
    </button>
  );
}

function FilterRadioRow({
  label,
  checked,
  onClick,
  className,
  rowPaddingClassName,
  rowVariant = 'default',
}: {
  label: string;
  checked: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  rowPaddingClassName?: string;
  rowVariant?: 'default' | 'option4';
}) {
  const { main, count } = splitLabel(label);
  const isO4 = rowVariant === 'option4';
  const resolvedPadding = rowPaddingClassName ?? (isO4 ? O4_ROW_PAD : 'px-2 py-2.5');
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center text-left transition-colors',
        isO4
          ? 'min-h-[48px] gap-0.5 rounded-none hover:bg-[color:var(--color-filter-surface-muted)]'
          : 'gap-2.5 rounded-md hover:bg-[#fafafa]',
        checked && isO4 && 'bg-[color:var(--color-filter-row-selected)]',
        resolvedPadding,
        className
      )}
    >
      <span className={cn('flex min-w-0 flex-1 items-baseline', isO4 ? 'gap-1.5' : 'gap-1')}>
        <span
          className={cn(
            'block min-w-0 text-[14px] leading-5',
            isO4
              ? cn(
                  'text-[color:var(--color-filter-text-1)]',
                  checked ? 'font-medium' : 'font-normal'
                )
              : cn('whitespace-nowrap leading-snug text-[#1a1a2e]', checked ? 'font-medium' : 'text-[#52525b]')
          )}
        >
          {main}
        </span>
        {count ? (
          <span
            className={cn(
              'shrink-0 whitespace-nowrap text-[12px] font-normal leading-4',
              isO4 ? 'tracking-[0.2px] text-[color:var(--color-filter-text-3)]' : 'text-[#9e9ea8]'
            )}
          >
            {count}
          </span>
        ) : null}
      </span>
      <span className={cn(isO4 ? 'flex h-10 w-10 shrink-0 items-center justify-center' : 'shrink-0')}>
        <RadioDot checked={checked} variant={isO4 ? 'option4' : 'default'} />
      </span>
    </button>
  );
}

const DualRangeSlider = ({
  min, max, step, value, onChange, formatLabel, allowedValues, minStepGap = 0,
  visualVariant = 'default',
}: {
  min: number; max: number; step: number;
  value: [number, number] | null;
  onChange: (v: [number, number] | null) => void;
  formatLabel: (v: number) => string;
  allowedValues?: number[];
  minStepGap?: number;
  visualVariant?: 'default' | 'option4';
}) => {
  const hasDiscreteStops = Array.isArray(allowedValues) && allowedValues.length > 1;
  const stops = hasDiscreteStops ? allowedValues : undefined;
  const resolvedGap = Math.max(0, minStepGap);
  const numericGap = step * resolvedGap;

  const [defaultLo, defaultHi] = hasDiscreteStops
    ? [stops![0], stops![stops!.length - 1]]
    : [min, max];

  const lo = value ? value[0] : defaultLo;
  const hi = value ? value[1] : defaultHi;

  const toIndex = (v: number): number => {
    if (!stops) return 0;
    let bestIdx = 0;
    let bestDiff = Math.abs(stops[0] - v);
    for (let i = 1; i < stops.length; i += 1) {
      const diff = Math.abs(stops[i] - v);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  const loIndex = stops ? toIndex(lo) : 0;
  const hiIndex = stops ? toIndex(hi) : 0;
  // For discrete sliders, thumb position is index-based (not value-based).
  // Fill must use the same coordinate system to stay locked to thumbs.
  const pctLo = stops
    ? (loIndex / (stops.length - 1)) * 100
    : ((lo - min) / (max - min)) * 100;
  const pctHi = stops
    ? (hiIndex / (stops.length - 1)) * 100
    : ((hi - min) / (max - min)) * 100;
  const o4 = visualVariant === 'option4';
  const rangeInputClass = cn(
    'absolute inset-0 h-full w-full appearance-none bg-transparent',
    o4 ? 'range-input-o4' : 'range-input'
  );
  const labelRow = (
    <div
      className={cn(
        'flex items-center justify-between',
        o4
          ? 'mt-1 text-[14px] font-normal leading-5 text-[color:var(--color-filter-text-1)]'
          : 'mb-4 text-[14px] font-medium text-[#3d3d4a]'
      )}
    >
      <span>{formatLabel(lo)}</span>
      <span>{formatLabel(hi)}</span>
    </div>
  );
  /** Hit area height matches thumb diameter so native thumbs align to the visual track (Figma 8516:27628 / 8520:29847). */
  const sliderHitAreaClass = o4 ? 'h-6' : 'h-7';
  const fillWidthPct = Math.max(0, pctHi - pctLo);
  return (
    <div className={cn(o4 ? cn('pt-0', O4_SECTION_BOTTOM_PAD) : 'pt-1 pb-1.5')}>
      {!o4 && labelRow}
      <div className={cn('relative w-full', sliderHitAreaClass)}>
        <div
          className={cn(
            'pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full',
            o4 ? 'bg-[color:var(--color-filter-border)]' : 'bg-[#d7d8de]'
          )}
        >
          <div
            className="absolute inset-y-0 rounded-full bg-[color:var(--color-primary)]"
            style={{ left: `${pctLo}%`, width: `${fillWidthPct}%` }}
          />
        </div>
        <input
          type="range"
          min={stops ? 0 : min}
          max={stops ? stops.length - 1 : max}
          step={stops ? 1 : step}
          value={stops ? loIndex : lo}
          onChange={(e) => {
            if (stops) {
              const nextIdx = Math.min(Number(e.target.value), hiIndex - resolvedGap);
              const clampedIdx = Math.max(0, nextIdx);
              onChange([stops[clampedIdx], hi]);
              return;
            }
            const v = Math.min(Number(e.target.value), hi - numericGap);
            onChange([v, hi]);
          }}
          className={rangeInputClass}
          style={{ zIndex: 4 }}
          aria-label="Range minimum"
        />
        <input
          type="range"
          min={stops ? 0 : min}
          max={stops ? stops.length - 1 : max}
          step={stops ? 1 : step}
          value={stops ? hiIndex : hi}
          onChange={(e) => {
            if (stops) {
              const nextIdx = Math.max(Number(e.target.value), loIndex + resolvedGap);
              const clampedIdx = Math.min(stops.length - 1, nextIdx);
              onChange([lo, stops[clampedIdx]]);
              return;
            }
            const v = Math.max(Number(e.target.value), lo + numericGap);
            onChange([lo, v]);
          }}
          className={rangeInputClass}
          style={{ zIndex: 5 }}
          aria-label="Range maximum"
        />
      </div>
      {o4 && labelRow}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// Shared render context
// ─────────────────────────────────────────────────────

interface FilterRenderContext {
  draft: SharedFilterState;
  isCurrentUserPremium: boolean;
  hasPremiumAccess: boolean;
  onPremiumUpgrade?: () => void;
  openPremiumPrompt?: (sourceEl?: HTMLElement | null) => void;
  searchByFilterKey: Partial<Record<SharedFilterKey, string>>;
  setSearchByFilterKey: React.Dispatch<React.SetStateAction<Partial<Record<SharedFilterKey, string>>>>;
  expandedByFilterKey: Partial<Record<SharedFilterKey, boolean>>;
  setExpandedByFilterKey: React.Dispatch<React.SetStateAction<Partial<Record<SharedFilterKey, boolean>>>>;
  toggleBoolean: (key: SharedFilterKey, premium?: boolean) => void;
  toggleMultiSelectValue: (key: SharedFilterKey, val: string, premium?: boolean) => void;
  setMultiSelectValues: (key: SharedFilterKey, values: string[], premium?: boolean) => void;
  setSingleSelect: (key: SharedFilterKey, val: string | null, premium?: boolean) => void;
  setRange: (key: SharedFilterKey, val: [number, number] | null) => void;
  toggleManyValues: (key: SharedFilterKey, values: string[], premium?: boolean) => void;
  currentUserReligion?: string;
  currentUserPersonaId?: string;
  /** Active left-sidebar category — used to avoid duplicating the category title in the right pane when the pane only shows that category’s filter(s). */
  activeCategoryId?: string;
  /** Drives religion vs Manglik heading rules with activeCategoryId. */
  iteration?: FilterExperienceVersion;
  /** Option 4 / 5 quick pane: tighter photo row, even toggle rows, spacing before chips */
  renderSurface?: 'option4Quick' | 'option5Quick';
  /** Number of sections/filters rendered in current right pane. */
  paneSectionCount?: number;
}

// ─────────────────────────────────────────────────────
// Toggle descriptions (for progressive mode)
// ─────────────────────────────────────────────────────

const TOGGLE_DESCRIPTIONS: Partial<Record<SharedFilterKey, string>> = {
  verified: 'ID & selfie verified',
  withPhoto: 'Has profile photo',
  onlineNow: 'Active in last 15 min',
  recentlyJoined: 'Joined in last 30 days',
  premiumProfiles: 'Premium or VIP member',
  topColleges: 'IIT, IIM, AIIMS, BITS, etc.',
  topMatches: 'High compatibility score',
  recentlyActive: 'Active in the last few days',
};

// Prototype defaults — persona-aware.
function getReligionPrefOptions(religion?: string): Set<string> {
  if (religion === 'Muslim') return new Set(['Muslim']);
  return new Set(['Hindu']);
}
const COUNTRY_PREF_OPTIONS = new Set(['India']);
function getCommunityPrefOptions(religion?: string): Set<string> {
  if (religion === 'Muslim') {
    return new Set([
      'Shaikh', 'Syed', 'Pathan', 'Ansari', 'Mughal', 'Qureshi',
      'Khan', 'Bohra', 'Memon', 'Khoja', 'Julaha',
    ]);
  }
  return new Set([
    'Maratha', '96 Kuli Maratha', 'Kunbi', 'Brahmin',
    'Deshastha Brahmin', 'Karhade Brahmin', 'Kokastha Brahmin',
    'CKP', 'Bhandari', 'Rajput', 'Kshatriya', 'Vaishya',
    'Sonar', 'Teli', 'Nai',
  ]);
}

function hasNonIndiaCountrySelection(values: string[]): boolean {
  return values.some((v) => v.trim().toLowerCase() !== 'india');
}

// ─────────────────────────────────────────────────────
// Range quick-pick presets (for progressive mode)
// ─────────────────────────────────────────────────────

function resolveFilterDefinition(filter: SharedFilterDefinition, draft: SharedFilterState, religion?: string): SharedFilterDefinition {
  if (filter.skipResolve) return filter;
  if (filter.key === 'religion') {
    const RELIGION_PREF_OPTIONS = getReligionPrefOptions(religion);
    return {
      ...filter,
      options: (filter.options || []).filter((o) => RELIGION_PREF_OPTIONS.has(o.value)),
    };
  }
  if (filter.key === 'country') {
    return {
      ...filter,
      options: (filter.options || []).filter((o) => COUNTRY_PREF_OPTIONS.has(o.value)),
    };
  }
  if (filter.key === 'community') {
    const COMMUNITY_PREF_OPTIONS = getCommunityPrefOptions(religion);
    return {
      ...filter,
      options: getCommunityOptionsForReligions(draft.religion)
        .filter((o) => COMMUNITY_PREF_OPTIONS.has(o.value))
        .map((o) => ({
          value: o.value,
          label: o.label,
          aliases: o.aliases,
        })),
    };
  }
  if (filter.key === 'city') {
    return {
      ...filter,
      options: getCityOptionsForStates(draft.state, draft.country).map((o) => ({
        value: o.value,
        label: o.label,
        aliases: o.aliases,
      })),
    };
  }
  return filter;
}

const RANGE_PRESETS: Partial<Record<SharedFilterKey, { label: string; value: [number, number] }[]>> = {
  ageRange: [
    { label: '21–25', value: [21, 25] },
    { label: '25–30', value: [25, 30] },
    { label: '30–35', value: [30, 35] },
    { label: '35–40', value: [35, 40] },
    { label: '40–45', value: [40, 45] },
  ],
  heightRange: [
    { label: '4\'10–5\'2', value: [147, 157] },
    { label: '5\'2–5\'6', value: [157, 168] },
    { label: '5\'6–5\'10', value: [168, 178] },
    { label: '5\'10+', value: [178, 200] },
  ],
};

// ─────────────────────────────────────────────────────
// Standard (flat) filter renderer
// ─────────────────────────────────────────────────────

function renderFilterFlat(def: SharedFilterDefinition, ctx: FilterRenderContext) {
  const filter = resolveFilterDefinition(def, ctx.draft, ctx.currentUserReligion);
  const { draft, isCurrentUserPremium, hasPremiumAccess, openPremiumPrompt, searchByFilterKey, setSearchByFilterKey } = ctx;
  const alwaysShowHasChildren = ctx.iteration === 'option4';
  const isPremium = !!filter.premium;
  const isLocked = isPremium && !isCurrentUserPremium;
  const hideCommunity = filter.key === 'community' && draft.religion.length === 0;
  const hideState = filter.key === 'state' && draft.country.length === 0;
  const hideCity = filter.key === 'city' && draft.state.length === 0;

  if (hideCommunity || hideState || hideCity) return null;

  const useO4RightPane = ctx.iteration === 'option4';

  if (filter.controlType === 'toggle') {
    const checked = draft[filter.key] as boolean;
    const isNearMe = filter.key === 'nearBy';
    const q45Quick =
      ctx.renderSurface === 'option4Quick' || ctx.renderSurface === 'option5Quick';
    if (q45Quick) {
      return (
        <FilterCheckboxRow
          key={filter.key}
          label={filter.label}
          description={isNearMe ? 'Within 30km' : undefined}
          checked={checked}
          premium={isPremium}
          hasPremiumAccess={hasPremiumAccess}
          onClick={(e) => (isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.toggleBoolean(filter.key, filter.premium))}
          rowPaddingClassName={useO4RightPane ? undefined : 'px-0 py-[7px]'}
          className={useO4RightPane ? 'min-h-[48px]' : 'min-h-10'}
          descriptionClassName={isNearMe ? 'text-[12px]' : undefined}
          hoverable={false}
          rowVariant={useO4RightPane ? 'option4' : 'default'}
        />
      );
    }
    if (useO4RightPane) {
      return (
        <div key={filter.key} className={cn('px-0', O4_SECTION_BOTTOM_PAD)}>
          <FilterCheckboxRow
            label={filter.label}
            description={isNearMe ? 'Within 30km' : undefined}
            checked={checked}
            premium={isPremium}
            hasPremiumAccess={hasPremiumAccess}
            onClick={(e) => (isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.toggleBoolean(filter.key, filter.premium))}
            descriptionClassName={isNearMe ? 'text-[12px]' : undefined}
            hoverable={false}
            rowVariant="option4"
            className="min-h-[48px]"
          />
        </div>
      );
    }
    return (
      <div key={filter.key} className="px-1 py-0.5">
        <FilterCheckboxRow
          label={filter.label}
          description={isNearMe ? 'Within 30km' : undefined}
          checked={checked}
          premium={isPremium}
          hasPremiumAccess={hasPremiumAccess}
          onClick={(e) => (isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.toggleBoolean(filter.key, filter.premium))}
          rowPaddingClassName="px-1 py-0.5"
          className="min-h-10"
          descriptionClassName={isNearMe ? 'text-[12px]' : undefined}
          hoverable={false}
        />
      </div>
    );
  }

  if (filter.controlType === 'range' && filter.rangeConfig) {
    const { min, max, step, formatLabel, allowedValues, minStepGap } = filter.rangeConfig;
    const rangeSpacingClassName =
      filter.key === 'ageRange'
        ? 'pt-0 pb-[18px]'
        : filter.key === 'heightRange'
          ? 'pt-[14px] pb-[18px]'
          : 'pt-4 pb-4';
    const slider = (
      <DualRangeSlider
        min={min}
        max={max}
        step={step}
        allowedValues={allowedValues}
        minStepGap={minStepGap}
        value={draft[filter.key] as [number, number] | null}
        onChange={(v) => ctx.setRange(filter.key, v)}
        formatLabel={formatLabel}
        visualVariant={useO4RightPane ? 'option4' : 'default'}
      />
    );
    if (useO4RightPane) {
      return (
        <O4SliderSection key={filter.key} title={filter.label}>
          {slider}
        </O4SliderSection>
      );
    }
    return (
      <div key={filter.key} className={cn(rangeSpacingClassName, 'px-1', FIRST_TOP_SECTION_WITH_HEADING_CLASS)}>
        <p className={RIGHT_PANE_SECTION_HEADING_CLASS}>{formatRightPaneHeading(filter.label)}</p>
        {slider}
      </div>
    );
  }

  if (filter.controlType === 'multi-select' && filter.options) {
    if (filter.key === 'partnerHasChildren' && !alwaysShowHasChildren && !shouldShowPartnerHasChildrenFilter(draft.maritalStatus)) {
      return null;
    }
    const useSimpleList = true;
    const forceSearchOnly = filter.key === 'familyCountry' && ctx.iteration === 'option4';
    const supportsViewMore =
      !forceSearchOnly &&
      !VIEW_MORE_DISABLED_KEYS.includes(filter.key) &&
      (filter.options?.length ?? 0) > CHECKBOX_VIEW_MORE_THRESHOLD &&
      (ctx.paneSectionCount ?? 0) > 1;
    const selected = (draft[filter.key] as string[]) || [];
    const selectedSet = new Set(selected);
    const grewUpSelected = draft.countryGrewUp || [];
    const grewUpSet = new Set(grewUpSelected);
    const searchQuery = (searchByFilterKey[filter.key] || '').trim().toLowerCase();
    const visibleOptions = filter.options.filter((o) => {
      if (!searchQuery) return true;
      return `${o.label} ${o.value} ${(o.aliases || []).join(' ')} ${o.description || ''}`.toLowerCase().includes(searchQuery);
    });
    const isExpanded = !!ctx.expandedByFilterKey[filter.key];
    const shownOptions = forceSearchOnly && !searchQuery
      ? []
      : (supportsViewMore && !searchQuery && !isExpanded ? visibleOptions.slice(0, CHECKBOX_VIEW_MORE_THRESHOLD) : visibleOptions);
    // community grouped by religion sub-headers when 2+ religions selected
    const isCommunity = filter.key === 'community';
    const communityGroups = isCommunity ? getCommunityGroupsForReligions(draft.religion) : [];
    const hideLabel =
      isCommunity ||
      hideDuplicateCategoryHeading(filter.key, ctx.activeCategoryId, {
        iteration: ctx.iteration,
        currentUserReligion: ctx.currentUserReligion,
      });
    const showSearch = forceSearchOnly || (filter.options?.length ?? 0) > CHECKBOX_SEARCH_THRESHOLD;

    if (useO4RightPane) {
      return (
        <div key={filter.key} className={cn('px-0', O4_SECTION_BOTTOM_PAD)}>
          {!hideLabel && <O4SectionHeader title={filter.label} />}
          {filter.searchable && showSearch && (
            <O4SectionSearch
              value={searchByFilterKey[filter.key] || ''}
              onChange={(next) => setSearchByFilterKey((prev) => ({ ...prev, [filter.key]: next }))}
              placeholder={filterSearchPlaceholder(filter)}
            />
          )}
          {isCommunity && communityGroups.length > 0 ? (
            <O4SectionBody>
              {communityGroups.map((group) => {
                const groupOptions = group.communities.filter((o) => {
                  if (!searchQuery) return true;
                  return `${o.label} ${o.value}`.toLowerCase().includes(searchQuery);
                });
                if (groupOptions.length === 0) return null;
                return (
                  <div key={group.religion}>
                    <O4GroupSubheader label={group.religion} />
                    {groupOptions.map((opt) => {
                      const isActive = selectedSet.has(opt.value);
                      return (
                        <FilterCheckboxRow
                          key={opt.value}
                          label={opt.label}
                          checked={isActive}
                          premium={isPremium}
                          hasPremiumAccess={hasPremiumAccess}
                          onClick={(e) =>
                            isLocked
                              ? openPremiumPrompt?.(e.currentTarget)
                              : ctx.toggleMultiSelectValue(filter.key, opt.value, filter.premium)
                          }
                          rowVariant="option4"
                          className="min-h-[48px]"
                          hoverable={false}
                        />
                      );
                    })}
                  </div>
                );
              })}
              {visibleOptions.length === 0 && (
                <div className="pl-3 pr-4 py-2 text-[12px] text-[color:var(--color-filter-text-3)]">No options found</div>
              )}
            </O4SectionBody>
          ) : (
            <O4SectionBody>
              <div className={cn(useSimpleList ? '' : 'overflow-hidden rounded-xl border border-[#ececf1] bg-white')}>
                {(filter.optionGroups || []).map((group) => {
                  const gv = group.optionValues.filter((v) => filter.options!.some((o) => o.value === v));
                  const si = gv.filter((v) => selectedSet.has(v)).length;
                  return (
                    <FilterCheckboxRow
                      key={group.id}
                      label={group.label}
                      checked={gv.length > 0 && si === gv.length}
                      indeterminate={si > 0 && si < gv.length}
                      premium={isPremium}
                      hasPremiumAccess={hasPremiumAccess}
                      onClick={(e) =>
                        isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.toggleManyValues(filter.key, gv, filter.premium)
                      }
                      rowPaddingClassName={useSimpleList ? undefined : 'px-3 py-2.5'}
                      className={cn(
                        'min-h-[48px]',
                        !useSimpleList && 'border-t border-[#f0f0f3] first:border-t-0'
                      )}
                      titleClassName="text-[13px] font-semibold text-[color:var(--color-filter-text-1)]"
                      hoverable={!useSimpleList}
                      rowVariant={useSimpleList ? 'option4' : 'default'}
                    />
                  );
                })}
                {shownOptions.map((opt) => {
                  const isActive = selectedSet.has(opt.value);
                  return (
                    <FilterCheckboxRow
                      key={opt.value}
                      label={opt.label}
                      description={opt.description}
                      checked={isActive}
                      premium={isPremium}
                      hasPremiumAccess={hasPremiumAccess}
                      onClick={(e) =>
                        isLocked
                          ? openPremiumPrompt?.(e.currentTarget)
                          : ctx.toggleMultiSelectValue(filter.key, opt.value, filter.premium)
                      }
                      rowPaddingClassName={useSimpleList ? undefined : 'px-3 py-2.5'}
                      className={cn(
                        'min-h-[48px]',
                        !useSimpleList && 'border-t border-[#f0f0f3] first:border-t-0'
                      )}
                      hoverable={!useSimpleList}
                      rowVariant={useSimpleList ? 'option4' : 'default'}
                    />
                  );
                })}
                {visibleOptions.length === 0 && (
                  <div
                    className={cn(
                      'text-[12px] text-[color:var(--color-filter-text-3)]',
                      useSimpleList ? 'pl-3 pr-4 py-2' : 'border-t border-[#f0f0f3] px-3 py-3'
                    )}
                  >
                    No options found
                  </div>
                )}
              </div>
            </O4SectionBody>
          )}
          {supportsViewMore && !searchQuery && !isExpanded && visibleOptions.length > CHECKBOX_VIEW_MORE_THRESHOLD && (
            <O4ViewMoreButton onClick={() => ctx.setExpandedByFilterKey((prev) => ({ ...prev, [filter.key]: true }))} />
          )}
        </div>
      );
    }

    return (
      <div
        key={filter.key}
        className={cn(
          'pt-1.5 pb-3 px-1',
          hideLabel ? FIRST_TOP_SECTION_WITH_ROW_CLASS : FIRST_TOP_SECTION_WITH_HEADING_CLASS
        )}
      >
        {!hideLabel && (
          <div className="flex items-center gap-2 mb-3.5">
            <p className={cn(RIGHT_PANE_SECTION_HEADING_CLASS, 'mb-0')}>{formatRightPaneHeading(filter.label)}</p>
          </div>
        )}
        <div className="space-y-3">
          {filter.searchable && showSearch && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e9ea8]" />
              <input
                type="text"
                value={searchByFilterKey[filter.key] || ''}
                onChange={(e) => setSearchByFilterKey((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                placeholder={filterSearchPlaceholder(filter)}
                className="h-10 w-full rounded-xl border border-[#dcdce2] bg-white pl-9 pr-3 text-[12px] text-[#3a3a4a] outline-none focus:border-[#0AA4B8]"
              />
            </div>
          )}
          {isCommunity && communityGroups.length > 0 ? (
            <div className="space-y-0.5">
              {communityGroups.map((group) => {
                const groupOptions = group.communities.filter((o) => {
                  if (!searchQuery) return true;
                  return `${o.label} ${o.value}`.toLowerCase().includes(searchQuery);
                });
                if (groupOptions.length === 0) return null;
                return (
                  <div key={group.religion}>
                    <p className="text-[11px] font-semibold text-[#9e9ea8] uppercase tracking-wide px-2 pt-3 pb-1">
                      {group.religion}
                    </p>
                    {groupOptions.map((opt) => {
                      const isActive = selectedSet.has(opt.value);
                      return (
                        <FilterCheckboxRow
                          key={opt.value}
                          label={opt.label}
                          checked={isActive}
                          premium={isPremium}
                          hasPremiumAccess={hasPremiumAccess}
                          onClick={(e) =>
                            isLocked
                              ? openPremiumPrompt?.(e.currentTarget)
                              : ctx.toggleMultiSelectValue(filter.key, opt.value, filter.premium)
                          }
                          rowPaddingClassName="px-0 py-[9px]"
                          className="min-h-10"
                          hoverable={false}
                        />
                      );
                    })}
                  </div>
                );
              })}
              {visibleOptions.length === 0 && (
                <div className="px-2 py-2 text-[12px] text-[#9e9ea8]">No options found</div>
              )}
            </div>
          ) : (
            <div className={cn(useSimpleList ? 'space-y-0.5' : 'overflow-hidden rounded-xl border border-[#ececf1] bg-white')}>
              {(filter.optionGroups || []).map((group) => {
                const gv = group.optionValues.filter((v) => filter.options!.some((o) => o.value === v));
                const si = gv.filter((v) => selectedSet.has(v)).length;
                return (
                  <FilterCheckboxRow
                    key={group.id}
                    label={group.label}
                    checked={gv.length > 0 && si === gv.length}
                    indeterminate={si > 0 && si < gv.length}
                    premium={isPremium}
                    hasPremiumAccess={hasPremiumAccess}
                    onClick={(e) =>
                      isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.toggleManyValues(filter.key, gv, filter.premium)
                    }
                    rowPaddingClassName={useSimpleList ? 'px-0 py-[9px]' : 'px-3 py-2.5'}
                    className={cn('min-h-10', !useSimpleList && 'border-t border-[#f0f0f3] first:border-t-0')}
                    titleClassName="text-[13px] font-semibold text-[#32323c]"
                    hoverable={!useSimpleList}
                  />
                );
              })}
              {shownOptions.map((opt) => {
                const isActive = selectedSet.has(opt.value);
                return (
                  <FilterCheckboxRow
                    key={opt.value}
                    label={opt.label}
                    description={opt.description}
                    checked={isActive}
                    premium={isPremium}
                    hasPremiumAccess={hasPremiumAccess}
                    onClick={(e) =>
                      isLocked
                        ? openPremiumPrompt?.(e.currentTarget)
                        : ctx.toggleMultiSelectValue(filter.key, opt.value, filter.premium)
                    }
                    rowPaddingClassName={useSimpleList ? 'px-0 py-[9px]' : 'px-3 py-2.5'}
                    className={cn('min-h-10', !useSimpleList && 'border-t border-[#f0f0f3] first:border-t-0')}
                    hoverable={!useSimpleList}
                  />
                );
              })}
              {visibleOptions.length === 0 && (
                <div
                  className={cn(
                    useSimpleList ? 'px-0 py-2 text-[12px] text-[#9e9ea8]' : 'border-t border-[#f0f0f3] px-3 py-3 text-[12px] text-[#9e9ea8]'
                  )}
                >
                  No options found
                </div>
              )}
            </div>
          )}
          {supportsViewMore && !searchQuery && !isExpanded && visibleOptions.length > CHECKBOX_VIEW_MORE_THRESHOLD && (
            <button
              type="button"
              onClick={() => ctx.setExpandedByFilterKey((prev) => ({ ...prev, [filter.key]: true }))}
              className={VIEW_MORE_CLASS}
            >
              View more
            </button>
          )}
          {filter.key === 'country' && hasNonIndiaCountrySelection(selected) && (
            <div className="pt-2">
              <p className={cn(RIGHT_PANE_SECTION_HEADING_CLASS, 'mb-1.5')}>
                {formatRightPaneHeading('Country grew up in')}
              </p>
              <div className="space-y-0.5">
                <FilterCheckboxRow
                  label="Grew up in India"
                  checked={grewUpSet.has('India')}
                  onClick={() => ctx.setMultiSelectValues('countryGrewUp', grewUpSet.has('India') ? [] : ['India'])}
                  rowPaddingClassName="px-0 py-2.5"
                />
                <FilterCheckboxRow
                  label="Grew up in Other"
                  checked={grewUpSet.has('Other')}
                  onClick={() => ctx.setMultiSelectValues('countryGrewUp', grewUpSet.has('Other') ? [] : ['Other'])}
                  rowPaddingClassName="px-0 py-2.5"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (filter.controlType === 'single-select' && filter.options) {
    const selected = draft[filter.key] as string | null;
    if (useO4RightPane) {
      return (
        <div key={filter.key} className={cn('px-0', O4_SECTION_BOTTOM_PAD)}>
          <O4SectionHeader title={filter.label} />
          <O4SectionBody>
            {filter.allowClear && (
              <FilterRadioRow
                label="No preference"
                checked={selected == null}
                onClick={() => ctx.setSingleSelect(filter.key, null)}
                rowVariant="option4"
                className="min-h-[48px]"
              />
            )}
            {filter.options.map((opt) => (
              <FilterRadioRow
                key={opt.value}
                label={opt.label}
                checked={selected === opt.value}
                onClick={(e) =>
                  isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.setSingleSelect(filter.key, opt.value, filter.premium)
                }
                rowVariant="option4"
                className="min-h-[48px]"
              />
            ))}
          </O4SectionBody>
        </div>
      );
    }
    return (
      <div key={filter.key} className={cn('pt-1.5 pb-3 px-1', FIRST_TOP_SECTION_WITH_HEADING_CLASS)}>
        <p className={cn(RIGHT_PANE_SECTION_HEADING_CLASS, 'mt-2')}>{formatRightPaneHeading(filter.label)}</p>
        <div className="space-y-0.5">
          {filter.allowClear && (
            <FilterRadioRow
              label="No preference"
              checked={selected == null}
              onClick={() => ctx.setSingleSelect(filter.key, null)}
            />
          )}
          {filter.options.map((opt) => (
            <FilterRadioRow
              key={opt.value}
              label={opt.label}
              checked={selected === opt.value}
              onClick={(e) => (isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.setSingleSelect(filter.key, opt.value, filter.premium))}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────
// Progressive filter renderer — chips, smart defaults, descriptions
// ─────────────────────────────────────────────────────

const PROGRESSIVE_INITIAL_SHOW = CHECKBOX_VIEW_MORE_THRESHOLD;

function renderFilterProgressive(def: SharedFilterDefinition, ctx: FilterRenderContext) {
  const filter = resolveFilterDefinition(def, ctx.draft, ctx.currentUserReligion);
  const { draft, isCurrentUserPremium, hasPremiumAccess, openPremiumPrompt } = ctx;
  const alwaysShowHasChildren = ctx.iteration === 'option4';
  if (filter.key === 'partnerHasChildren' && !alwaysShowHasChildren && !shouldShowPartnerHasChildrenFilter(draft.maritalStatus)) return null;
  const isPremium = !!filter.premium;
  const isLocked = isPremium && !isCurrentUserPremium;
  const hideCommunity = filter.key === 'community' && draft.religion.length === 0;
  const hideState = filter.key === 'state' && draft.country.length === 0;
  const hideCity = filter.key === 'city' && draft.state.length === 0;

  if (hideCommunity || hideState || hideCity) return null;

  if (filter.controlType === 'toggle') {
    const checked = draft[filter.key] as boolean;
    const desc = TOGGLE_DESCRIPTIONS[filter.key];
    return (
      <div key={filter.key} className={cn('pt-1.5 pb-3.5 px-1', FIRST_TOP_SECTION_WITH_ROW_CLASS)}>
        <FilterCheckboxRow
          label={filter.label}
          description={desc}
          checked={checked}
          premium={isPremium}
          hasPremiumAccess={hasPremiumAccess}
          onClick={(e) => (isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.toggleBoolean(filter.key, filter.premium))}
          rowPaddingClassName="px-1 py-0"
          descriptionClassName="text-[12px]"
          hoverable={false}
        />
      </div>
    );
  }

  if (filter.controlType === 'range' && filter.rangeConfig) {
    const { min, max, step, formatLabel, allowedValues, minStepGap } = filter.rangeConfig;
    const rangeVal = draft[filter.key] as [number, number] | null;
    const presets = RANGE_PRESETS[filter.key];
    const rangeSpacingClassName =
      filter.key === 'ageRange'
        ? 'pt-0 pb-[18px]'
        : filter.key === 'heightRange'
          ? 'pt-[14px] pb-[18px]'
          : 'pt-4 pb-4';
    return (
      <div key={filter.key} className={cn(rangeSpacingClassName, 'px-1', FIRST_TOP_SECTION_WITH_HEADING_CLASS)}>
        <p className={RIGHT_PANE_SECTION_HEADING_CLASS}>{formatRightPaneHeading(filter.label)}</p>
        {presets && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {presets.map((p) => {
              const isActive = rangeVal && rangeVal[0] === p.value[0] && rangeVal[1] === p.value[1];
              return (
                <button key={p.label} onClick={() => ctx.setRange(filter.key, isActive ? null : p.value)}
                  className={cn('px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors border',
                    isActive ? 'bg-[#0AA4B8] text-white border-[#0AA4B8]' : 'bg-white text-[#52525b] border-[#dcdce2] hover:border-[#0AA4B8]/40')}>
                  {p.label}
                </button>
              );
            })}
          </div>
        )}
        <DualRangeSlider min={min} max={max} step={step} allowedValues={allowedValues} minStepGap={minStepGap} value={rangeVal} onChange={(v) => ctx.setRange(filter.key, v)} formatLabel={formatLabel} />
      </div>
    );
  }

  if ((filter.controlType === 'multi-select' || filter.controlType === 'single-select') && filter.options) {
    const optCount = filter.options.length;
    if (filter.controlType === 'single-select' || (optCount <= 6 && filter.key !== 'workingWith' && filter.key !== 'partnerHasChildren')) {
      return <ChipSelect key={filter.key} filter={filter} ctx={ctx} />;
    }
    return <ProgressiveMultiSelect key={filter.key} filter={filter} ctx={ctx} />;
  }

  return null;
}

function ChipSelect({ filter, ctx }: { filter: SharedFilterDefinition; ctx: FilterRenderContext }) {
  const { draft, isCurrentUserPremium, hasPremiumAccess, openPremiumPrompt } = ctx;
  const isPremium = !!filter.premium;
  const isLocked = isPremium && !isCurrentUserPremium;

  if (filter.controlType === 'single-select') {
    const selected = draft[filter.key] as string | null;
    return (
      <div className="pt-1.5 pb-3 px-1">
        <p className={RIGHT_PANE_SECTION_HEADING_CLASS}>{formatRightPaneHeading(filter.label)}</p>
        <div className="flex flex-wrap gap-1.5">
          {filter.allowClear && (
            <button
              type="button"
              onClick={() => ctx.setSingleSelect(filter.key, null)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors border',
                selected == null ? 'bg-[#0AA4B8] text-white border-[#0AA4B8]' : 'bg-white text-[#52525b] border-[#dcdce2] hover:border-[#0AA4B8]/40'
              )}
            >
              No preference
            </button>
          )}
          {filter.options!.map((opt) => {
            const isActive = selected === opt.value;
            return (
              <button key={opt.value} onClick={(e) => (isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.setSingleSelect(filter.key, opt.value, filter.premium))}
                className={cn('px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors border',
                  isActive ? 'bg-[#0AA4B8] text-white border-[#0AA4B8]' : 'bg-white text-[#52525b] border-[#dcdce2] hover:border-[#0AA4B8]/40')}>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const selected = (draft[filter.key] as string[]) || [];
  const selectedSet = new Set(selected);
  const hideLabel =
    filter.key === 'incomeRangeInr' ||
    filter.key === 'incomeRangeUsd' ||
    hideDuplicateCategoryHeading(filter.key, ctx.activeCategoryId, {
      iteration: ctx.iteration,
      currentUserReligion: ctx.currentUserReligion,
    });
  const q45Quick =
    ctx.renderSurface === 'option4Quick' || ctx.renderSurface === 'option5Quick';
  const chipGap = q45Quick ? 'gap-x-2 gap-y-2' : 'gap-1.5';
  return (
    <div
      className={cn(
        q45Quick
          ? cn('px-1', filter.key === 'profileManagedBy' ? 'pb-2 pt-3' : 'py-2')
          : cn('pt-1.5 pb-3 px-1', hideLabel ? FIRST_TOP_SECTION_WITH_ROW_CLASS : FIRST_TOP_SECTION_WITH_HEADING_CLASS)
      )}
    >
      {!hideLabel && (
        <div className={cn('flex items-center gap-2', q45Quick ? 'mb-2' : 'mb-2.5')}>
          <p className={cn(RIGHT_PANE_SECTION_HEADING_CLASS, 'mb-0')}>{formatRightPaneHeading(filter.label)}</p>
        </div>
      )}
      <div className={cn('flex flex-wrap', chipGap)}>
        {filter.options!.map((opt) => {
          const isActive = selectedSet.has(opt.value);
          return (
            <Chip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={isActive}
              onClick={(e) => (isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.toggleMultiSelectValue(filter.key, opt.value, filter.premium))}
              size="md"
            />
          );
        })}
      </div>
    </div>
  );
}

function ProgressiveMultiSelect({ filter, ctx }: { filter: SharedFilterDefinition; ctx: FilterRenderContext }) {
  const [expanded, setExpanded] = useState(false);
  const { draft, isCurrentUserPremium, hasPremiumAccess, openPremiumPrompt, searchByFilterKey, setSearchByFilterKey } = ctx;
  const isPremium = !!filter.premium;
  const isLocked = isPremium && !isCurrentUserPremium;
  const selected = (draft[filter.key] as string[]) || [];
  const selectedSet = new Set(selected);
  const searchQuery = (searchByFilterKey[filter.key] || '').trim().toLowerCase();
  const allOptions = filter.options!;
  const supportsViewMore =
    !VIEW_MORE_DISABLED_KEYS.includes(filter.key) &&
    allOptions.length > CHECKBOX_VIEW_MORE_THRESHOLD &&
    (ctx.paneSectionCount ?? 0) > 1;
  const visibleOptions = allOptions.filter((o) => {
    if (!searchQuery) return true;
    return `${o.label} ${o.value} ${(o.aliases || []).join(' ')} ${o.description || ''}`.toLowerCase().includes(searchQuery);
  });

  const showingOptions = expanded || searchQuery || !supportsViewMore ? visibleOptions : visibleOptions.slice(0, PROGRESSIVE_INITIAL_SHOW);
  const hasMore = supportsViewMore && !expanded && !searchQuery && visibleOptions.length > PROGRESSIVE_INITIAL_SHOW;
  const showSearch = allOptions.length > CHECKBOX_SEARCH_THRESHOLD;

  const hideSectionHeading = hideDuplicateCategoryHeading(filter.key, ctx.activeCategoryId, {
    iteration: ctx.iteration,
    currentUserReligion: ctx.currentUserReligion,
  });

  return (
    <div className={cn('pt-1.5 pb-3 px-1', hideSectionHeading ? FIRST_TOP_SECTION_WITH_ROW_CLASS : FIRST_TOP_SECTION_WITH_HEADING_CLASS)}>
      {!hideSectionHeading && (
        <div className="flex items-center gap-2 mb-3.5">
          <p className={cn(RIGHT_PANE_SECTION_HEADING_CLASS, 'mb-0')}>{formatRightPaneHeading(filter.label)}</p>
        </div>
      )}
      <div className="space-y-3">
          {filter.searchable && showSearch && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e9ea8]" />
              <input type="text" value={searchByFilterKey[filter.key] || ''} onChange={(e) => setSearchByFilterKey((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                placeholder={filterSearchPlaceholder(filter)} className="h-10 w-full rounded-xl border border-[#dcdce2] bg-white pl-9 pr-3 text-[12px] text-[#3a3a4a] outline-none focus:border-[#0AA4B8]" />
            </div>
          )}
          <div className="overflow-hidden rounded-xl border border-[#ececf1] bg-white">
            {showingOptions.map((opt) => {
              const isActive = selectedSet.has(opt.value);
              return (
                <FilterCheckboxRow
                  key={opt.value}
                  label={opt.label}
                  description={opt.description}
                  checked={isActive}
                  premium={isPremium}
                  hasPremiumAccess={hasPremiumAccess}
                  onClick={(e) => (isLocked ? openPremiumPrompt?.(e.currentTarget) : ctx.toggleMultiSelectValue(filter.key, opt.value, filter.premium))}
                  rowPaddingClassName="px-3 py-2.5"
                  className="border-t border-[#f0f0f3] first:border-t-0"
                  hoverable
                />
              );
            })}
            {showingOptions.length === 0 && <div className="px-3 py-3 text-[12px] text-[#9e9ea8]">No options found</div>}
          </div>
          {hasMore && (
            <button onClick={() => setExpanded(true)} className={VIEW_MORE_CLASS}>
              View more
            </button>
          )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Right-pane content renderers (flat / sub-sectioned / progressive)
// ─────────────────────────────────────────────────────

function RightPaneFlat({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  const paneCtx: FilterRenderContext = { ...ctx, paneSectionCount: category.filters.length };
  const o4 = ctx.iteration === 'option4';
  return (
    <>
      <div className={o4 ? O4_PANE_OUTER : RIGHT_PANE_WRAPPER_CLASS}>
        {category.filters.map((f, index) => (
          <React.Fragment key={f.key}>
            {index > 0 && <div className={o4 ? O4_DIVIDER : cn(RIGHT_PANE_SECTION_DIVIDER_CLASS, 'my-2')} />}
            {renderFilterFlat(f, paneCtx)}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

function RightPaneSubSectioned({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  const paneCtx: FilterRenderContext = { ...ctx, paneSectionCount: category.filters.length };
  const filterByKey = useMemo(() => {
    const map = new Map<SharedFilterKey, SharedFilterDefinition>();
    category.filters.forEach((f) => map.set(f.key, f));
    return map;
  }, [category.filters]);

  if (!category.subSections) {
    return <RightPaneFlat category={category} ctx={ctx} />;
  }

  const o4 = ctx.iteration === 'option4';
  return (
    <>
      <div className={o4 ? O4_PANE_OUTER : RIGHT_PANE_WRAPPER_CLASS}>
        {category.subSections.map((section, i) => (
          <div key={section.title}>
            {i > 0 && <div className={o4 ? O4_DIVIDER : cn(RIGHT_PANE_SECTION_DIVIDER_CLASS, 'my-2')} />}
            {o4 ? (
              <O4SectionHeader title={section.title} />
            ) : (
              <p className={cn(RIGHT_PANE_SECTION_HEADING_CLASS, 'mt-2 mb-1 px-1')}>{formatRightPaneHeading(section.title)}</p>
            )}
            <div>
              {section.filterKeys.map((key) => {
                const f = filterByKey.get(key);
                return f ? renderFilterFlat(f, paneCtx) : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function RightPaneProgressive({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  const paneCtx: FilterRenderContext = { ...ctx, paneSectionCount: category.filters.length };
  return (
    <>
      <div className={RIGHT_PANE_WRAPPER_CLASS}>
        {category.filters.map((f, index) => (
          <React.Fragment key={f.key}>
            {index > 0 && <div className={cn(RIGHT_PANE_SECTION_DIVIDER_CLASS, 'my-2')} />}
            {renderFilterProgressive(f, paneCtx)}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────
// Option4: Quick Filters — single “Profiles with Photos” toggle, then discovery toggles (no Photo heading / divider)
// ─────────────────────────────────────────────────────

const OPTION4_QUICK_TOGGLE_KEYS: SharedFilterKey[] = [
  'withPhoto',
  'recentlyActive',
  'recentlyJoined',
  'verified',
  'premiumProfiles',
  'topColleges',
  'nearBy',
];

const OPTION4_PHOTO_VISIBILITY_ROWS: { value: string; label: string }[] = [
  { value: 'public', label: 'Visible Photos (2,156)' },
  { value: 'protected', label: 'Protected Photos (432)' },
  { value: 'none', label: 'No Photos (198)' },
];

function Option4PhotoVisibilityRows({ ctx }: { ctx: FilterRenderContext }) {
  const selected = (ctx.draft.photoVisibility as string[]) || [];
  const selectedSet = new Set(selected);
  return (
    <div className="px-1 pb-1 pt-1.5">
      <p className="mb-2 px-1 text-[12px] font-semibold text-[#6b6b78]">{formatRightPaneHeading('Photo')}</p>
      <div className="flex flex-col">
        {OPTION4_PHOTO_VISIBILITY_ROWS.map(({ value, label }) => {
          const isOn = selectedSet.has(value);
          return (
            <div key={value} className="px-1 py-2.5">
              <FilterCheckboxRow
                label={label}
                checked={isOn}
                onClick={() => ctx.toggleMultiSelectValue('photoVisibility', value)}
                rowPaddingClassName="px-1 py-0"
                hoverable={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RightPaneOption4Quick({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  const quickCtx: FilterRenderContext = { ...ctx, renderSurface: 'option4Quick' };
  const filterByKey = useMemo(() => {
    const m = new Map<SharedFilterKey, SharedFilterDefinition>();
    category.filters.forEach((f) => m.set(f.key, f));
    return m;
  }, [category.filters]);

  return (
    <div className={cn(O4_PANE_OUTER, O4_SECTION_BOTTOM_PAD)}>
      <O4SectionBody>
        {OPTION4_QUICK_TOGGLE_KEYS.map((key) => {
          const f = filterByKey.get(key);
          return f ? <React.Fragment key={key}>{renderFilterFlat(f, quickCtx)}</React.Fragment> : null;
        })}
      </O4SectionBody>
    </div>
  );
}

/** Option 5 — Quick Filters without Photo block (Photo lives in its own sidebar category). */
function RightPaneOption5Quick({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  const quickCtx: FilterRenderContext = { ...ctx, renderSurface: 'option5Quick' };
  const filterByKey = useMemo(() => {
    const m = new Map<SharedFilterKey, SharedFilterDefinition>();
    category.filters.forEach((f) => m.set(f.key, f));
    return m;
  }, [category.filters]);

  return (
    <div className={cn(O4_PANE_OUTER, O4_SECTION_BOTTOM_PAD)}>
      <O4SectionBody>
        {OPTION4_QUICK_TOGGLE_KEYS.map((key) => {
          const f = filterByKey.get(key);
          return f ? <React.Fragment key={key}>{renderFilterFlat(f, quickCtx)}</React.Fragment> : null;
        })}
      </O4SectionBody>
    </div>
  );
}

function RightPaneOption5PhotoVisibility({ ctx }: { ctx: FilterRenderContext }) {
  const photoCtx: FilterRenderContext = { ...ctx, renderSurface: 'option5Quick' };
  return (
    <div className={RIGHT_PANE_WRAPPER_TALL_CLASS}>
      <Option4PhotoVisibilityRows ctx={photoCtx} />
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Option4: Location pane — 4 countries, cascading state/city, top-5 popular cities + divider
// ─────────────────────────────────────────────────────

const OPTION4_POPULAR_CITIES = ['Bengaluru', 'Mumbai', 'Hyderabad', 'Chennai', 'Pune'];

function RightPaneOption4Location({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  const { draft, searchByFilterKey, setSearchByFilterKey, expandedByFilterKey, setExpandedByFilterKey } = ctx;
  const countryFilter = category.filters.find(f => f.key === 'country');
  const stateFilter = category.filters.find(f => f.key === 'state');
  const cityFilter = category.filters.find(f => f.key === 'city');
  const countryGrewUpFilter = category.filters.find(f => f.key === 'countryGrewUp');
  const residencyStatusFilter = category.filters.find(f => f.key === 'residencyStatus');

  const countrySelected = (draft.country as string[]) || [];
  const stateSelected = (draft.state as string[]) || [];
  const citySelected = (draft.city as string[]) || [];
  const countryGrewUpSelected = (draft.countryGrewUp as string[]) || [];
  const residencyStatusSelected = (draft.residencyStatus as string[]) || [];
  const countrySet = new Set(countrySelected);
  const stateSet = new Set(stateSelected);
  const citySet = new Set(citySelected);
  const countryGrewUpSet = new Set(countryGrewUpSelected);
  const residencyStatusSet = new Set(residencyStatusSelected);

  const hasCountry = countrySelected.length > 0;
  const hasState = stateSelected.length > 0;

  const stateQuery = (searchByFilterKey['state'] || '').trim().toLowerCase();
  const cityQuery = (searchByFilterKey['city'] || '').trim().toLowerCase();
  const showStateSearch = (stateFilter?.options?.length ?? 0) > CHECKBOX_SEARCH_THRESHOLD;

  const filteredStateOpts = stateFilter?.options?.filter(o =>
    !stateQuery || `${o.label} ${o.value}`.toLowerCase().includes(stateQuery)
  ) ?? [];
  const stateListExpanded = !!expandedByFilterKey.state;
  const shownStateOpts =
    !stateQuery && !stateListExpanded ? filteredStateOpts.slice(0, CHECKBOX_VIEW_MORE_THRESHOLD) : filteredStateOpts;

  const allCityOpts = cityFilter?.options ?? [];
  const showCitySearch = allCityOpts.length > CHECKBOX_SEARCH_THRESHOLD;
  const filteredCityOpts = cityQuery
    ? allCityOpts.filter(o => `${o.label} ${o.value}`.toLowerCase().includes(cityQuery))
    : allCityOpts;
  const cityListExpanded = !!expandedByFilterKey.city;
  const shownCityOpts =
    !cityQuery && !cityListExpanded ? filteredCityOpts.slice(0, CHECKBOX_VIEW_MORE_THRESHOLD) : filteredCityOpts;
  const popularCityOpts = shownCityOpts.filter(o => OPTION4_POPULAR_CITIES.includes(o.value));
  const otherCityOpts = shownCityOpts.filter(o => !OPTION4_POPULAR_CITIES.includes(o.value));
  const DependentPlaceholder = ({ message }: { message: string }) => (
    <p className="pl-3 pr-4 pb-2 text-[12px] leading-[1.4] text-[color:var(--color-filter-text-3)]">{message}</p>
  );

  return (
    <div className={O4_PANE_OUTER}>
      {countryFilter && (
        <div className={O4_SECTION_BOTTOM_PAD}>
          <O4SectionHeader title={countryFilter.label} />
          <O4SectionBody>
            {countryFilter.options?.map((opt) => {
              const isActive = countrySet.has(opt.value);
              return (
                <FilterCheckboxRow
                  key={opt.value}
                  label={opt.label}
                  checked={isActive}
                  onClick={() => ctx.toggleMultiSelectValue('country', opt.value)}
                  rowVariant="option4"
                  className="min-h-[48px]"
                  hoverable={false}
                />
              );
            })}
          </O4SectionBody>
        </div>
      )}

      {stateFilter && (
        <>
          <div className={O4_DIVIDER} />
          <div className={O4_SECTION_BOTTOM_PAD}>
            <O4SectionHeader title={stateFilter.label} />
            {hasCountry ? (
              <>
                {showStateSearch && (
                  <O4SectionSearch
                    value={searchByFilterKey['state'] || ''}
                    onChange={(next) => setSearchByFilterKey((prev) => ({ ...prev, state: next }))}
                    placeholder="Search state"
                  />
                )}
                <O4SectionBody>
                  {shownStateOpts.map((opt) => {
                    const isActive = stateSet.has(opt.value);
                    return (
                      <FilterCheckboxRow
                        key={opt.value}
                        label={opt.label}
                        checked={isActive}
                        onClick={() => ctx.toggleMultiSelectValue('state', opt.value)}
                        rowVariant="option4"
                        className="min-h-[48px]"
                        hoverable={false}
                      />
                    );
                  })}
                  {filteredStateOpts.length === 0 && (
                    <p className="pl-3 pr-4 py-2 text-[12px] text-[color:var(--color-filter-text-3)]">No states found</p>
                  )}
                </O4SectionBody>
                {!stateQuery && !stateListExpanded && filteredStateOpts.length > CHECKBOX_VIEW_MORE_THRESHOLD && (
                  <O4ViewMoreButton onClick={() => setExpandedByFilterKey((prev) => ({ ...prev, state: true }))} />
                )}
              </>
            ) : (
              <DependentPlaceholder message="Select a country above to see states" />
            )}
          </div>
        </>
      )}

      {cityFilter && (
        <>
          <div className={O4_DIVIDER} />
          <div className={O4_SECTION_BOTTOM_PAD}>
            <O4SectionHeader title={cityFilter.label} />
            {hasState ? (
              <>
                {showCitySearch && (
                  <O4SectionSearch
                    value={searchByFilterKey['city'] || ''}
                    onChange={(next) => setSearchByFilterKey((prev) => ({ ...prev, city: next }))}
                    placeholder="Search city"
                  />
                )}
                <O4SectionBody>
                  {popularCityOpts.map((opt) => {
                    const isActive = citySet.has(opt.value);
                    return (
                      <FilterCheckboxRow
                        key={opt.value}
                        label={opt.label}
                        checked={isActive}
                        onClick={() => ctx.toggleMultiSelectValue('city', opt.value)}
                        rowVariant="option4"
                        className="min-h-[48px]"
                        hoverable={false}
                      />
                    );
                  })}
                  {popularCityOpts.length > 0 && otherCityOpts.length > 0 && (
                    <div className="my-2 h-px w-full bg-[color:var(--color-filter-divider)]" />
                  )}
                  {otherCityOpts.map((opt) => {
                    const isActive = citySet.has(opt.value);
                    return (
                      <FilterCheckboxRow
                        key={opt.value}
                        label={opt.label}
                        checked={isActive}
                        onClick={() => ctx.toggleMultiSelectValue('city', opt.value)}
                        rowVariant="option4"
                        className="min-h-[48px]"
                        hoverable={false}
                      />
                    );
                  })}
                  {filteredCityOpts.length === 0 && (
                    <p className="pl-3 pr-4 py-2 text-[12px] text-[color:var(--color-filter-text-3)]">No cities found</p>
                  )}
                </O4SectionBody>
                {!cityQuery && !cityListExpanded && filteredCityOpts.length > CHECKBOX_VIEW_MORE_THRESHOLD && (
                  <O4ViewMoreButton onClick={() => setExpandedByFilterKey((prev) => ({ ...prev, city: true }))} />
                )}
              </>
            ) : (
              <DependentPlaceholder message="Select a state above to see cities" />
            )}
          </div>
        </>
      )}

      {countryGrewUpFilter && (
        <>
          <div className={O4_DIVIDER} />
          <div className={O4_SECTION_BOTTOM_PAD}>
            <O4SectionHeader title={countryGrewUpFilter.label} />
            <O4SectionBody>
              {(countryGrewUpFilter.options ?? []).map((opt) => {
                const isActive = countryGrewUpSet.has(opt.value);
                return (
                  <FilterCheckboxRow
                    key={opt.value}
                    label={opt.label}
                    checked={isActive}
                    onClick={() => ctx.toggleMultiSelectValue('countryGrewUp', opt.value)}
                    rowVariant="option4"
                    className="min-h-[48px]"
                    hoverable={false}
                  />
                );
              })}
            </O4SectionBody>
          </div>
        </>
      )}

      {residencyStatusFilter && (
        <>
          <div className={O4_DIVIDER} />
          <div className={O4_SECTION_BOTTOM_PAD}>
            <O4SectionHeader title={residencyStatusFilter.label} />
            <O4SectionBody>
              {residencyStatusFilter.options?.map((opt) => {
                const isActive = residencyStatusSet.has(opt.value);
                return (
                  <FilterCheckboxRow
                    key={opt.value}
                    label={opt.label}
                    checked={isActive}
                    premium={!!residencyStatusFilter.premium}
                    hasPremiumAccess={ctx.hasPremiumAccess}
                    onClick={() => ctx.toggleMultiSelectValue('residencyStatus', opt.value, residencyStatusFilter.premium)}
                    rowVariant="option4"
                    className="min-h-[48px]"
                    hoverable={false}
                  />
                );
              })}
            </O4SectionBody>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Option4: Income pane — checkboxes instead of chips/slider
// ─────────────────────────────────────────────────────

function RightPaneOption4Income({ category, ctx, currency }: { category: IterationCategoryConfig; ctx: FilterRenderContext; currency: 'INR' | 'USD' }) {
  const { draft } = ctx;
  const incomeFilter = currency === 'USD'
    ? category.filters.find(f => f.key === 'incomeRangeUsd')
    : category.filters.find(f => f.key === 'incomeRangeInr');
  if (!incomeFilter || !incomeFilter.options) return null;

  const filterKey = incomeFilter.key;
  const selected = (draft[filterKey] as string[]) || [];
  const selectedSet = new Set(selected);
  const isLocked = !!incomeFilter.premium && !ctx.hasPremiumAccess;

  return (
    <div className={cn(O4_PANE_OUTER, 'flex flex-col gap-0')}>
      {isLocked && <PremiumUpgradeCard onUpgrade={ctx.onPremiumUpgrade} className="shadow-none" />}
      <div className={cn('relative', O4_SECTION_BOTTOM_PAD)}>
        <O4SectionHeader title={incomeFilter.label} />
        <O4SectionBody>
          {incomeFilter.options.map((opt) => {
            const isActive = selectedSet.has(opt.value);
            return (
              <FilterCheckboxRow
                key={opt.value}
                label={opt.label}
                checked={isActive}
                premium={false}
                hasPremiumAccess={true}
                onClick={
                  isLocked
                    ? () => {}
                    : () => ctx.toggleMultiSelectValue(filterKey, opt.value, incomeFilter.premium)
                }
                rowVariant="option4"
                className="min-h-[48px]"
                hoverable={false}
              />
            );
          })}
        </O4SectionBody>
        {isLocked ? (
          <div
            className="pointer-events-auto absolute inset-0 z-10 cursor-not-allowed bg-white/60"
            aria-hidden
          />
        ) : null}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Option4: Community pane — always visible, search bar, skipResolve options with counts
// ─────────────────────────────────────────────────────

function RightPaneOption4Community({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  const { draft, searchByFilterKey, setSearchByFilterKey, expandedByFilterKey, setExpandedByFilterKey } = ctx;
  const communityFilter = category.filters.find(f => f.key === 'community');
  if (!communityFilter || !communityFilter.options) return null;

  const selected = (draft.community as string[]) || [];
  const selectedSet = new Set(selected);
  const query = (searchByFilterKey['community'] || '').trim().toLowerCase();

  const visibleOpts = communityFilter.options.filter(o =>
    !query || `${o.label} ${o.value} ${(o.aliases || []).join(' ')}`.toLowerCase().includes(query)
  );
  const showCommunitySearch = communityFilter.options.length > CHECKBOX_SEARCH_THRESHOLD;
  const communityExpanded = !!expandedByFilterKey.community;
  const supportsCommunityViewMore =
    communityFilter.options.length > CHECKBOX_VIEW_MORE_THRESHOLD && (ctx.paneSectionCount ?? 0) > 1;
  const shownCommunityOpts =
    supportsCommunityViewMore && !query && !communityExpanded
      ? visibleOpts.slice(0, CHECKBOX_VIEW_MORE_THRESHOLD)
      : visibleOpts;

  return (
    <div className={cn(O4_PANE_OUTER, O4_SECTION_BOTTOM_PAD)}>
      {showCommunitySearch && (
        <O4SectionSearch
          value={searchByFilterKey['community'] || ''}
          onChange={(next) => setSearchByFilterKey((prev) => ({ ...prev, community: next }))}
          placeholder="Search community"
        />
      )}
      <O4SectionBody>
        {shownCommunityOpts.map((opt) => {
          const isActive = selectedSet.has(opt.value);
          return (
            <FilterCheckboxRow
              key={opt.value}
              label={opt.label}
              checked={isActive}
              onClick={() => ctx.toggleMultiSelectValue('community', opt.value)}
              rowVariant="option4"
              className="min-h-[48px]"
              hoverable={false}
            />
          );
        })}
        {visibleOpts.length === 0 && (
          <p className="pl-3 pr-4 py-2 text-[12px] text-[color:var(--color-filter-text-3)]">No communities found</p>
        )}
      </O4SectionBody>
      {supportsCommunityViewMore && !query && !communityExpanded && visibleOpts.length > CHECKBOX_VIEW_MORE_THRESHOLD && (
        <O4ViewMoreButton onClick={() => setExpandedByFilterKey((prev) => ({ ...prev, community: true }))} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Option4: Family pane — flat list with Family Type, Financial Status, Family Location
// ─────────────────────────────────────────────────────

function RightPaneOption4Family({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  return (
    <div className={O4_PANE_OUTER}>
      {category.filters.map((f, index) => (
        <React.Fragment key={f.key}>
          {index > 0 && <div className={O4_DIVIDER} />}
          {renderFilterFlat(f, ctx)}
        </React.Fragment>
      ))}
    </div>
  );
}

/** Must match the left nav column `w-[…px]` below — used for premium overlay horizontal alignment. */
const LEFT_NAV_WIDTH_LEGACY = 120;
const LEFT_NAV_WIDTH_OPTION45 = 120;

const LEFT_NAV_TWO_LINE_CATEGORY_IDS = new Set(['mother_tongue', 'hobbies']);

/** Option 4 / 5 left category column — Figma 8516:26991 (Roboto via font-sans). */
function FilterCategoryNavRow({
  categoryId,
  title,
  active,
  onClick,
  showPremiumCrown,
  showActivity,
}: {
  categoryId: string;
  title: string;
  active: boolean;
  onClick: () => void;
  showPremiumCrown: boolean;
  showActivity: boolean;
}) {
  const hasTrailing = showPremiumCrown || showActivity;
  const allowTwoLineTitle = LEFT_NAV_TWO_LINE_CATEGORY_IDS.has(categoryId);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // Option 4/5: active row visually "bridges" into the right pane with a rounded corner,
        // while still living inside the left strip (matches native app reference).
        'font-sans flex w-full min-h-[48px] items-center py-[10px] pl-[14px] text-left transition-colors relative border-b border-[color:var(--color-filter-divider)]',
        hasTrailing ? 'pr-[10px]' : 'pr-4',
        active
          // Reference shows only the top-right notch (not a full pill).
          ? 'bg-white z-[2] -mr-px rounded-tr-[14px]'
          : 'bg-[color:var(--color-filter-nav-strip-bg)] hover:bg-[color:var(--color-filter-nav-strip-hover)]'
      )}
    >
      {active ? (
        <span
          className={cn(
            'absolute left-0 w-1 rounded-r-lg bg-[color:var(--color-primary)]',
            allowTwoLineTitle
              ? 'top-3 bottom-3'
              : 'top-1/2 h-5 -translate-y-1/2'
          )}
          aria-hidden
        />
      ) : null}
      <span
        className={cn(
          'min-w-0 flex-1 select-none text-[14px]',
          allowTwoLineTitle ? 'line-clamp-2 leading-tight' : 'line-clamp-1 leading-5',
          active
            ? 'font-medium text-[color:var(--color-primary)]'
            : 'font-normal text-[color:var(--color-filter-text-1)]'
        )}
      >
        {title}
      </span>
      {(showPremiumCrown || showActivity) && (
        <span className="flex shrink-0 items-center gap-1">
          {showPremiumCrown ? <PremiumBadgeIcon /> : null}
          {showActivity ? (
            <span
              className="h-[6px] w-[6px] shrink-0 rounded-full bg-[color:var(--color-primary)]"
              aria-hidden
            />
          ) : null}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────
// Get More Matches tab (toggle + copy)
// ─────────────────────────────────────────────────────

function GetMoreMatchesPanel({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-[calc(20px+env(safe-area-inset-bottom,0px))] pt-3">
      {!enabled && (
        <div className="mb-5 space-y-1.5 px-1 text-left">
          <p className="text-[15px] font-normal leading-snug text-[#4b5563]">
            Currently, you see Profiles that match all your Partner Preferences
          </p>
          <p className="text-[13px] font-normal leading-snug text-[#9ca3af]">
            This may limit the number of Profiles
          </p>
        </div>
      )}
      <div className="rounded-[14px] border border-[#e8eaee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3 border-b border-[#e8eef1] bg-[#F0F5F9] px-4 py-3.5">
          <span className="min-w-0 flex-1 text-left text-[15px] font-bold leading-tight text-[#1a1a2e]">
            {enabled ? 'Get More Matches' : 'Turn on Get More Matches'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className={cn(
              'flex h-[28px] w-[48px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-200',
              enabled ? 'justify-end bg-[#00BCD4]' : 'justify-start bg-[#D1D5DB]'
            )}
            aria-label={enabled ? 'Turn off Get More Matches' : 'Turn on Get More Matches'}
          >
            <span className="pointer-events-none block h-[22px] w-[22px] shrink-0 rounded-full bg-white" />
          </button>
        </div>
        <div className="space-y-4 px-4 py-5 text-left">
          {enabled ? (
            <p className="text-[15px] font-normal leading-relaxed text-[#4b5563]">
              You are seeing Matches that may not match some of your Preferences.
            </p>
          ) : (
            <>
              <div className="flex gap-3">
                <span
                  className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#E85D4C] text-[12px] font-bold leading-none text-white"
                  aria-hidden
                >
                  !
                </span>
                <p className="min-w-0 text-[14px] font-normal leading-snug text-[#E85D4C]">
                  Turning this &apos;Off&apos; may result in fewer Profiles
                </p>
              </div>
              <p className="text-[15px] font-normal leading-snug text-[#1a1a2e]">
                This will show you Profiles that match <strong className="font-bold">most</strong> of your Preferences.
              </p>
              <p className="text-[13px] font-normal leading-snug text-[#9ca3af]">
                Some Profiles may not match all your Preferences
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────

export const SharedFilterBottomSheet = ({
  isOpen, onClose, value, onApply, isCurrentUserPremium, onPremiumUpgrade,
  estimateResultCount, resultLabel = 'match', iteration = 'option1', filtersIgnorePremium = false,
  currentUserIncomeCurrency = 'INR',
  currentUserIsOutsideIndia = false,
  currentUserReligion,
  currentUserPersonaId,
  showFilterTabs = true,
  premiumRowStyle = 'chevron',
  premiumIndicatorGlyph = 'lock',
  premiumLockPromptPresentation = 'nested-bottom-sheet',
}: SharedFilterBottomSheetProps) => {
  const personaBaseline = useMemo(
    () => currentUserPersonaId ? getBaselineFiltersForPersona(currentUserPersonaId) : PARTNER_PREFERENCE_BASELINE_FILTERS,
    [currentUserPersonaId]
  );
  const [draft, setDraft] = useState<SharedFilterState>(value);
  const [searchByFilterKey, setSearchByFilterKey] = useState<Partial<Record<SharedFilterKey, string>>>({});
  const [expandedByFilterKey, setExpandedByFilterKey] = useState<Partial<Record<SharedFilterKey, boolean>>>({});
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [activeTab, setActiveTab] = useState<'refine' | 'get-matches'>('refine');
  const [getMoreMatchesEnabled, setGetMoreMatchesEnabled] = useState(false);
  const [isPremiumPromptOpen, setIsPremiumPromptOpen] = useState(false);
  const [premiumPromptTop, setPremiumPromptTop] = useState(12);
  const rightPaneRef = React.useRef<HTMLDivElement | null>(null);
  const premiumEffective = filtersIgnorePremium ? true : isCurrentUserPremium;

  const categories = useMemo(() => getIterationCategories(iteration, currentUserPersonaId), [iteration, currentUserPersonaId]);
  const paneStyle = useMemo(() => getRightPaneStyle(iteration), [iteration]);
  const alwaysShowHasChildren = iteration === 'option4';
  const useO45LeftNav = iteration === 'option4' || iteration === 'option5';
  const leftNavWidthPx = useO45LeftNav ? LEFT_NAV_WIDTH_OPTION45 : LEFT_NAV_WIDTH_LEGACY;

  useEffect(() => {
    if (isOpen) {
      let v = value;
      if (!alwaysShowHasChildren && !shouldShowPartnerHasChildrenFilter(v.maritalStatus) && (v.partnerHasChildren?.length ?? 0) > 0) {
        v = { ...v, partnerHasChildren: [] };
      }
      setDraft(v);
      setSearchByFilterKey({});
      setExpandedByFilterKey({});
      setActiveCategoryId(categories[0]?.id ?? '');
      setActiveTab('refine');
      setGetMoreMatchesEnabled(false);
      setIsPremiumPromptOpen(false);
      setPremiumPromptTop(12);
    }
  }, [isOpen, value, categories]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId) ?? categories[0],
    [categories, activeCategoryId]
  );

  const totalActiveCount = useMemo(
    () => countActiveSharedFilters(draft, personaBaseline),
    [draft, personaBaseline]
  );
  const estimatedResultCount = useMemo(() => estimateResultCount?.(draft), [draft, estimateResultCount]);
  const applyCtaText = 'Show Matches';
  const openPremiumPrompt = useCallback((sourceEl?: HTMLElement | null) => {
    const paneEl = rightPaneRef.current;
    if (paneEl && sourceEl) {
      const paneRect = paneEl.getBoundingClientRect();
      const triggerRect = sourceEl.getBoundingClientRect();
      const relativeTop = triggerRect.top - paneRect.top + paneEl.scrollTop;
      const cardHeight = 190;
      const nextTop = Math.max(12, Math.min(relativeTop - 12, Math.max(12, paneEl.scrollHeight - cardHeight - 16)));
      setPremiumPromptTop(nextTop);
    } else {
      setPremiumPromptTop(12);
    }
    setIsPremiumPromptOpen(true);
  }, []);
  const closePremiumPrompt = useCallback(() => setIsPremiumPromptOpen(false), []);

  const toggleBoolean = (key: SharedFilterKey, premium?: boolean) => {
    if (premium && !premiumEffective) { openPremiumPrompt(); return; }
    setDraft((prev) => ({ ...prev, [key]: !prev[key] } as SharedFilterState));
  };
  const toggleMultiSelectValue = (key: SharedFilterKey, val: string, premium?: boolean) => {
    if (premium && !premiumEffective) { openPremiumPrompt(); return; }
    setDraft((prev) => {
      const arr = (prev[key] as string[]) || [];
      const nextValues = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
      if (key === 'religion') {
        return {
          ...prev,
          religion: nextValues,
          community: nextValues.length === 0 ? [] : prev.community,
        } as SharedFilterState;
      }
      if (key === 'country') {
        return {
          ...prev,
          country: nextValues,
          state: nextValues.length === 0 ? [] : prev.state,
          city: nextValues.length === 0 ? [] : prev.city,
        } as SharedFilterState;
      }
      if (key === 'state') {
        return {
          ...prev,
          state: nextValues,
          city: nextValues.length === 0 ? [] : prev.city,
        } as SharedFilterState;
      }
      if (key === 'maritalStatus') {
        if (alwaysShowHasChildren) {
          return {
            ...prev,
            maritalStatus: nextValues,
          } as SharedFilterState;
        }
        const showPc = nextValues.length > 0 && nextValues.some((m) => m !== 'Never Married');
        return {
          ...prev,
          maritalStatus: nextValues,
          partnerHasChildren: showPc ? prev.partnerHasChildren : [],
        } as SharedFilterState;
      }
      return { ...prev, [key]: nextValues } as SharedFilterState;
    });
  };
  const setSingleSelect = (key: SharedFilterKey, val: string | null, premium?: boolean) => {
    if (premium && !premiumEffective) { openPremiumPrompt(); return; }
    setDraft((prev) => {
      if (val === null) return { ...prev, [key]: null } as SharedFilterState;
      return { ...prev, [key]: (prev[key] as string | null) === val ? null : val } as SharedFilterState;
    });
  };
  const setRange = (key: SharedFilterKey, val: [number, number] | null) => {
    setDraft((prev) => ({ ...prev, [key]: val } as SharedFilterState));
  };
  const setMultiSelectValues = (key: SharedFilterKey, values: string[], premium?: boolean) => {
    if (premium && !premiumEffective) { openPremiumPrompt(); return; }
    setDraft((prev) => ({ ...prev, [key]: values } as SharedFilterState));
  };
  const toggleManyValues = (key: SharedFilterKey, values: string[], premium?: boolean) => {
    if (premium && !premiumEffective) { openPremiumPrompt(); return; }
    setDraft((prev) => {
      const current = new Set((prev[key] as string[]) || []);
      const allIn = values.length > 0 && values.every((v) => current.has(v));
      if (allIn) values.forEach((v) => current.delete(v));
      else values.forEach((v) => current.add(v));
      const nextValues = Array.from(current);
      if (key === 'religion') {
        return {
          ...prev,
          religion: nextValues,
          community: nextValues.length === 0 ? [] : prev.community,
        } as SharedFilterState;
      }
      if (key === 'country') {
        return {
          ...prev,
          country: nextValues,
          state: nextValues.length === 0 ? [] : prev.state,
          city: nextValues.length === 0 ? [] : prev.city,
        } as SharedFilterState;
      }
      if (key === 'state') {
        return {
          ...prev,
          state: nextValues,
          city: nextValues.length === 0 ? [] : prev.city,
        } as SharedFilterState;
      }
      if (key === 'maritalStatus') {
        if (alwaysShowHasChildren) {
          return {
            ...prev,
            maritalStatus: nextValues,
          } as SharedFilterState;
        }
        const showPc = nextValues.length > 0 && nextValues.some((m) => m !== 'Never Married');
        return {
          ...prev,
          maritalStatus: nextValues,
          partnerHasChildren: showPc ? prev.partnerHasChildren : [],
        } as SharedFilterState;
      }
      return { ...prev, [key]: nextValues } as SharedFilterState;
    });
  };

  const handleClear = () => setDraft(personaBaseline);
  const handleApply = () => { onApply(draft); onClose(); };

  const nestedPremiumActive =
    isPremiumPromptOpen && premiumLockPromptPresentation === 'nested-bottom-sheet';

  const ctx: FilterRenderContext = {
    draft, isCurrentUserPremium: premiumEffective, hasPremiumAccess: isCurrentUserPremium, onPremiumUpgrade, openPremiumPrompt,
    searchByFilterKey, setSearchByFilterKey,
    expandedByFilterKey, setExpandedByFilterKey,
    toggleBoolean, toggleMultiSelectValue, setMultiSelectValues, setSingleSelect, setRange, toggleManyValues,
    currentUserReligion,
    currentUserPersonaId,
    activeCategoryId,
    iteration,
    paneSectionCount: activeCategory?.filters.length ?? 0,
  };

  const renderRightPane = useCallback(() => {
    // For option4 / option5, apply special per-category overrides (same discovery UI; option5 splits Photo)
    if ((iteration === 'option4' || iteration === 'option5') && activeCategory) {
      // Income: custom checkbox pane (INR or USD based on persona currency)
      if (activeCategory.id === 'income') {
        return <RightPaneOption4Income category={activeCategory} ctx={ctx} currency={currentUserIncomeCurrency} />;
      }
      // Location: custom pane with top-5 popular cities + cascading
      if (activeCategory.id === 'location') {
        return <RightPaneOption4Location category={activeCategory} ctx={ctx} />;
      }
      // Family: Family Type, Financial Status, Family Location (search-first)
      if (activeCategory.id === 'family') {
        return <RightPaneOption4Family category={activeCategory} ctx={ctx} />;
      }
      // Quick Filters
      if (activeCategory.id === 'quick') {
        if (iteration === 'option4') {
          return <RightPaneOption4Quick category={activeCategory} ctx={ctx} />;
        }
        return <RightPaneOption5Quick category={activeCategory} ctx={ctx} />;
      }
      // Option 5 only: Photo as its own category
      if (activeCategory.id === 'photo_visibility' && iteration === 'option5') {
        return <RightPaneOption5PhotoVisibility ctx={ctx} />;
      }
      // Community: custom pane — always visible, has search, skips resolveFilterDefinition community override
      if (activeCategory.id === 'community') {
        return <RightPaneOption4Community category={activeCategory} ctx={ctx} />;
      }
      // Religion: hide Manglik for Muslim persona (Manglik is Hindu-specific)
      if (activeCategory.id === 'religion' && currentUserReligion === 'Muslim') {
        const religionFilters = activeCategory.filters.filter(f => f.key !== 'manglik');
        const overrideCategory = { ...activeCategory, filters: religionFilters };
        return <RightPaneFlat category={overrideCategory} ctx={ctx} />;
      }
    }
    switch (paneStyle) {
      case 'sub-sectioned': return <RightPaneSubSectioned category={activeCategory} ctx={ctx} />;
      case 'progressive': return <RightPaneProgressive category={activeCategory} ctx={ctx} />;
      default: return <RightPaneFlat category={activeCategory} ctx={ctx} />;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paneStyle,
    iteration,
    currentUserIncomeCurrency,
    currentUserIsOutsideIndia,
    activeCategory,
    ctx.draft,
    ctx.searchByFilterKey,
    ctx.expandedByFilterKey,
    ctx.isCurrentUserPremium,
    ctx.hasPremiumAccess,
    ctx.onPremiumUpgrade,
  ]);

  return (
    <PremiumIndicatorGlyphContext.Provider value={premiumIndicatorGlyph}>
    <PremiumRowStyleContext.Provider value={premiumRowStyle}>
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={cn('absolute inset-0 z-[60]', nestedPremiumActive ? 'bg-black/55' : 'bg-black/40')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="absolute left-0 right-0 bottom-0 z-[65] overflow-visible"
            style={{ height: 'min(92%, calc(100% - env(safe-area-inset-top, 0px) - 24px))' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-t-[24px] bg-white">
              {/* Header + Tab bar */}
              <div className="relative z-10 shrink-0 border-b border-[#ebebee] bg-white">
                <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
                  <h2 className="text-[18px] font-bold text-[#1a1a2e]">Filters</h2>
                  <button
                    onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center transition-colors hover:opacity-60"
                    aria-label="Close filters"
                  >
                    <X className="h-[20px] w-[20px] text-[#636674]" />
                  </button>
                </div>
                {/* Tab segmented control */}
                {showFilterTabs && <div className="px-4 pb-3">
                  <div className="flex rounded-full bg-[#ececef] p-[3px]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('refine')}
                      className={cn(
                        'flex-1 rounded-full py-[6px] text-[13px] font-medium text-center transition-all',
                        activeTab === 'refine'
                          ? 'bg-white text-[#1a1a2e] shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                          : 'text-[#9a9daa]'
                      )}
                    >
                      Refine
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('get-matches')}
                      className={cn(
                        'flex-1 rounded-full py-[6px] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all',
                        activeTab === 'get-matches'
                          ? 'bg-white text-[#1a1a2e] shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                          : 'text-[#9a9daa]'
                      )}
                    >
                      Get more Matches
                      <span
                        className={cn(
                          'text-[9px] font-semibold px-[4px] py-[2px] rounded-[3px] leading-none',
                          getMoreMatchesEnabled
                            ? 'bg-[#00BCD4] text-white'
                            : 'bg-[#e2e2e5] text-[#8a8a9a]'
                        )}
                      >
                        {getMoreMatchesEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                </div>}
              </div>

              {/* Refine: split pane · Get more Matches: dedicated panel */}
              {!showFilterTabs || activeTab === 'refine' ? (
                <div className="relative flex min-h-0 flex-1 overflow-hidden">
                  {/* Option 4/5: persistent divider between panes. The active left row overlaps this line to form the rounded notch. */}
                  {useO45LeftNav && (
                    <div
                      className="pointer-events-none absolute inset-y-0 z-[1] w-px bg-[color:var(--color-filter-divider)]"
                      style={{ left: 120 }}
                      aria-hidden
                    />
                  )}
                  <div
                    className={cn(
                      'hide-scrollbar w-[120px] shrink-0 overflow-y-auto pb-[112px]',
                      useO45LeftNav ? 'bg-[color:var(--color-filter-nav-strip-bg)]' : 'bg-[#f5f5f7]'
                    )}
                  >
                    {categories.map((category) => {
                      const isActive = activeCategoryId === category.id;
                      const count = countIterationCategoryActiveFilters(draft, category, personaBaseline, iteration);
                      const isAllPremiumCategory =
                        category.filters.length > 0 && category.filters.every((f) => !!f.premium);
                      if (useO45LeftNav) {
                        return (
                          <FilterCategoryNavRow
                            key={category.id}
                            categoryId={category.id}
                            title={category.title}
                            active={isActive}
                            onClick={() => setActiveCategoryId(category.id)}
                            showPremiumCrown={isAllPremiumCategory && !isCurrentUserPremium}
                            showActivity={count > 0}
                          />
                        );
                      }
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategoryId(category.id)}
                          className={cn(
                            'w-full text-left px-3.5 py-3.5 text-[14px] leading-tight font-medium transition-colors relative border-b border-[#ebebee]/60',
                            isActive ? 'bg-white text-[#0AA4B8]' : 'text-[#52525b] hover:bg-[#ededf0]'
                          )}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0AA4B8] rounded-r-full" />
                          )}
                          <span className="block leading-tight select-none pr-3">{category.title}</span>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 shrink-0 pointer-events-none">
                            {isAllPremiumCategory && !isCurrentUserPremium && <PremiumBadgeIcon />}
                            {count > 0 && (
                              <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#0AA4B8]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div ref={rightPaneRef} className="hide-scrollbar relative flex-1 overflow-y-auto pb-[112px]">
                    {renderRightPane()}
                  </div>
                </div>
              ) : (
                <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                  <GetMoreMatchesPanel
                    enabled={getMoreMatchesEnabled}
                    onToggle={() => setGetMoreMatchesEnabled((v) => !v)}
                  />
                </div>
              )}

              <AnimatePresence>
                {isPremiumPromptOpen && premiumLockPromptPresentation === 'floating-card' && (
                  <>
                    <motion.button
                      type="button"
                      aria-label="Close premium prompt"
                      className="absolute inset-0 z-[15] cursor-default bg-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      onClick={closePremiumPrompt}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute z-[16]"
                      style={{
                        top: `calc(${premiumPromptTop}px + 66px)`,
                        /* Align to right pane: no extra +12 here — outer padding on the card matches row insets. */
                        left: `${leftNavWidthPx}px`,
                        right: 0,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PremiumUpgradeCard
                        onUpgrade={() => {
                          closePremiumPrompt();
                          onPremiumUpgrade?.();
                        }}
                        onClose={closePremiumPrompt}
                        surface="framed-card"
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Bottom action bar — hidden on Get more Matches (design: no Show Matches there) */}
              {(!showFilterTabs || activeTab === 'refine') && (
                <div
                  className="pointer-events-none absolute inset-x-0 z-20 px-4"
                  style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)' }}
                >
                  <div className="pointer-events-auto rounded-full border border-[#d3d7dc] bg-white pl-4 pr-[8px] py-[8px] shadow-[0_10px_28px_rgba(19,33,68,0.10),0_2px_8px_rgba(19,33,68,0.04)]">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handleClear}
                        className={cn(
                          'shrink-0 whitespace-nowrap bg-transparent px-2 text-left text-[16px] font-semibold leading-none transition-colors',
                          totalActiveCount > 0 ? 'text-[#0AA4B8] hover:text-[#089ab0]' : 'text-[#7b8595] hover:text-[#667183]'
                        )}
                      >
                        Clear All
                      </button>
                      <Button
                        variant="default"
                        size="lg"
                        shape="pill"
                        className="ml-auto h-12 flex-none whitespace-nowrap px-8 text-[18px] font-semibold shadow-none"
                        onClick={handleApply}
                      >
                        {applyCtaText}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {isPremiumPromptOpen && premiumLockPromptPresentation === 'nested-bottom-sheet' && (
                  <>
                    <motion.button
                      type="button"
                      aria-label="Close premium prompt"
                      className={cn(
                        'absolute inset-0 z-[40] cursor-default bg-black/35',
                        DEBUG_PREMIUM_NESTED_SHEET && 'outline outline-2 outline-dashed outline-yellow-400'
                      )}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      onClick={closePremiumPrompt}
                    />
                    <motion.div
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="premium-lock-sheet-title"
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 32, stiffness: 360, mass: 0.85 }}
                      className={cn(
                        'absolute bottom-0 left-0 right-0 z-[45] flex max-h-[min(84%,440px)] flex-col overflow-hidden rounded-t-[24px] bg-white pb-[calc(32px+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_40px_rgba(19,33,68,0.18)]',
                        DEBUG_PREMIUM_NESTED_SHEET && 'bg-rose-100/90 outline outline-2 outline-rose-600'
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={closePremiumPrompt}
                        className={cn(
                          'absolute right-4 top-3 z-[2] flex h-9 w-9 items-center justify-center transition-colors hover:opacity-60',
                          DEBUG_PREMIUM_NESTED_SHEET && 'bg-orange-300/80 outline outline-1 outline-orange-800'
                        )}
                        aria-label="Close premium prompt"
                      >
                        <X className="h-[20px] w-[20px] text-[#636674]" />
                      </button>
                      <div
                        className={cn(
                          'min-h-0 flex-1 overflow-y-auto overflow-x-hidden pt-[32px]',
                          DEBUG_PREMIUM_NESTED_SHEET && 'bg-sky-200/70 outline outline-2 outline-sky-700'
                        )}
                      >
                        <PremiumUpgradeCard
                          surface="sheet-plain"
                          suppressCloseButton
                          className="shadow-none"
                          onUpgrade={() => {
                            closePremiumPrompt();
                            onPremiumUpgrade?.();
                          }}
                          onClose={closePremiumPrompt}
                        />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <style>{`
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .range-input,
            .range-input-o4 { pointer-events: none; }
            .range-input::-webkit-slider-runnable-track {
              -webkit-appearance: none;
              height: 4px;
              background: transparent;
            }
            .range-input::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              pointer-events: auto;
              box-sizing: border-box;
              height: 28px;
              width: 28px;
              border-radius: 50%;
              background: #fff;
              border: 2px solid var(--color-primary, #0aa4b8);
              box-shadow: 0 1px 3px rgba(0,0,0,0.12);
              cursor: pointer;
              margin-top: -12px;
            }
            .range-input::-moz-range-track { height: 4px; background: transparent; }
            .range-input::-moz-range-thumb {
              pointer-events: auto;
              box-sizing: border-box;
              height: 28px;
              width: 28px;
              border-radius: 50%;
              background: #fff;
              border: 2px solid var(--color-primary, #0aa4b8);
              box-shadow: 0 1px 3px rgba(0,0,0,0.12);
              cursor: pointer;
            }
            /* Option 4 / Figma: 24px thumbs, 4px track on token divider (#dfe0e3). */
            .range-input-o4::-webkit-slider-runnable-track {
              -webkit-appearance: none;
              height: 4px;
              background: transparent;
            }
            .range-input-o4::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              pointer-events: auto;
              box-sizing: border-box;
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: #fff;
              border: 2px solid var(--color-primary, #0aa4b8);
              box-shadow: 0 1px 2px rgba(0,0,0,0.1);
              cursor: pointer;
              margin-top: -10px;
            }
            .range-input-o4::-moz-range-track { height: 4px; background: transparent; }
            .range-input-o4::-moz-range-thumb {
              pointer-events: auto;
              box-sizing: border-box;
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: #fff;
              border: 2px solid var(--color-primary, #0aa4b8);
              box-shadow: 0 1px 2px rgba(0,0,0,0.1);
              cursor: pointer;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
    </PremiumRowStyleContext.Provider>
    </PremiumIndicatorGlyphContext.Provider>
  );
};
