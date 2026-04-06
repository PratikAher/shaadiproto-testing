import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Search, X, User } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { CrownFilledIcon } from '../icons';
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
  type FilterOption,
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
}

// ─────────────────────────────────────────────────────
// Primitive controls
// ─────────────────────────────────────────────────────

const Checkbox = ({ checked, indeterminate = false }: { checked: boolean; indeterminate?: boolean }) => (
  <div
    className={cn(
      'w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors shrink-0',
      checked ? 'bg-[#0AA4B8] border-[#0AA4B8]' : 'bg-white border-[#c4c4c4]'
    )}
  >
    {checked && !indeterminate && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
    {!checked && indeterminate && (
      <div className="h-[2px] w-[9px] rounded-full bg-[#0AA4B8]" />
    )}
  </div>
);

const RadioDot = ({ checked }: { checked: boolean }) => (
  <div
    className={cn(
      'w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors shrink-0',
      checked ? 'border-[#0AA4B8]' : 'border-[#c4c4c4]'
    )}
  >
    {checked && <div className="w-[10px] h-[10px] rounded-full bg-[#0AA4B8]" />}
  </div>
);

/** Splits "Hindu (1,241)" → { main: "Hindu", count: "(1,241)" }. If no count, count is "". */
function splitLabel(label: string): { main: string; count: string } {
  const match = label.match(/^(.*?)\s*(\(\d[\d,]*\))\s*$/);
  if (match) return { main: match[1], count: match[2] };
  return { main: label, count: '' };
}

/** Hide community search when the catalog is short enough to scan without it. */
const COMMUNITY_SEARCH_MIN_OPTIONS = 10;

function hideDuplicateCategoryHeading(
  filterKey: SharedFilterKey,
  activeCategoryId: string | undefined,
  opts?: { iteration?: FilterExperienceVersion; currentUserReligion?: string }
): boolean {
  if (!activeCategoryId) return false;
  if (filterKey === 'motherTongue' && activeCategoryId === 'mother_tongue') return true;
  if (filterKey === 'astroFilter' && activeCategoryId === 'astro') return true;
  if (
    filterKey === 'religion' &&
    (activeCategoryId === 'religion' || activeCategoryId === 'religion_community')
  ) {
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

/** Renders a label with optional count badge in secondary gray. */
function LabelWithCount({ label, bold = false }: { label: string; bold?: boolean }) {
  const { main, count } = splitLabel(label);
  return (
    <span className={cn('text-[14px] leading-snug text-[#1a1a2e]', bold && 'font-medium')}>
      {main}
      {count && <span className="ml-1 font-normal text-[#9e9ea8]">{count}</span>}
    </span>
  );
}

/** Primary label + optional count; second line for option.description (e.g. Financial Status bands). */
function OptionLabel({ opt, bold }: { opt: FilterOption; bold: boolean }) {
  if (!opt.description) {
    return <LabelWithCount label={opt.label} bold={bold} />;
  }
  const { main, count } = splitLabel(opt.label);
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
      <span className={cn('text-[14px] leading-snug text-[#1a1a2e]', bold && 'font-medium')}>
        {main}
        {count ? <span className="ml-1 font-normal text-[#9e9ea8]">{count}</span> : null}
      </span>
      <span className="text-[11px] leading-snug text-[#9e9ea8]">{opt.description}</span>
    </span>
  );
}

const DualRangeSlider = ({
  min, max, step, value, onChange, formatLabel, allowedValues, minStepGap = 0,
}: {
  min: number; max: number; step: number;
  value: [number, number] | null;
  onChange: (v: [number, number] | null) => void;
  formatLabel: (v: number) => string;
  allowedValues?: number[];
  minStepGap?: number;
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
  return (
    <div className="px-1 pt-1 pb-3">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[15px] font-medium text-[#3d3d4a]">{formatLabel(lo)}</span>
        <span className="text-[15px] font-medium text-[#3d3d4a]">{formatLabel(hi)}</span>
      </div>
      <div className="relative h-2 rounded-full bg-[#d7d8de]">
        <div className="absolute top-0 h-full rounded-full bg-[#0AA4B8]" style={{ left: `${pctLo}%`, right: `${100 - pctHi}%` }} />
      </div>
      <div className="relative -mt-2 h-0">
        <input type="range" min={stops ? 0 : min} max={stops ? stops.length - 1 : max} step={stops ? 1 : step} value={stops ? loIndex : lo}
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
          className="range-input absolute w-full appearance-none bg-transparent"
          style={{ zIndex: 5 }}
          aria-label="Minimum income"
        />
        <input type="range" min={stops ? 0 : min} max={stops ? stops.length - 1 : max} step={stops ? 1 : step} value={stops ? hiIndex : hi}
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
          className="range-input absolute w-full appearance-none bg-transparent"
          style={{ zIndex: 4 }}
          aria-label="Maximum income"
        />
      </div>
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

// Figma star assets (node refs: 8156:16074, 8156:16075, 8156:16076)
const PREMIUM_STAR_SMALL_ASSET = 'https://www.figma.com/api/mcp/asset/38ce3153-b17a-485c-bcc5-3b4b50fe2207';
const PREMIUM_STAR_LARGE_ASSET = 'https://www.figma.com/api/mcp/asset/ca4b59be-62dc-4a15-bd9c-b1f20b767372';

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
  const { draft, isCurrentUserPremium, hasPremiumAccess, onPremiumUpgrade, searchByFilterKey, setSearchByFilterKey } = ctx;
  const isPremium = !!filter.premium;
  const isLocked = isPremium && !isCurrentUserPremium;
  const isVisuallyDimmed = isPremium && !hasPremiumAccess;
  const hideCommunity = filter.key === 'community' && draft.religion.length === 0;
  const hideState = filter.key === 'state' && draft.country.length === 0;
  const hideCity = filter.key === 'city' && draft.state.length === 0;

  if (hideCommunity || hideState || hideCity) return null;

  if (filter.controlType === 'toggle') {
    const checked = draft[filter.key] as boolean;
    const isNearMe = filter.key === 'nearBy';
    const q45Quick =
      ctx.renderSurface === 'option4Quick' || ctx.renderSurface === 'option5Quick';
    const { main: labelMain, count: labelCount } = splitLabel(filter.label);
    return (
      <div
        key={filter.key}
        className={cn(
          // Option 4/5 quick: match Photo rows (outer px-1 + row px-1 = px-2 total inset)
          q45Quick ? 'px-2' : 'px-1',
          q45Quick ? 'py-2.5' : isNearMe ? 'py-2' : 'py-0.5'
        )}
      >
        <button
          type="button"
          onClick={() => (isLocked ? onPremiumUpgrade?.() : ctx.toggleBoolean(filter.key, filter.premium))}
          className={cn(
            'flex w-full gap-3 text-left',
            q45Quick || isNearMe ? 'items-start' : 'items-center h-10',
            isVisuallyDimmed && 'opacity-55'
          )}
        >
          <div className={cn('shrink-0', q45Quick || isNearMe ? 'mt-0.5' : '')}>
            <Checkbox checked={checked} />
          </div>
          {isNearMe ? (
            <span className="flex min-w-0 flex-1 flex-col leading-snug pr-1">
              <span className="text-[14px] text-[#1a1a2e]">
                Near me
                {labelCount ? <span className="text-[#9e9ea8] font-normal ml-1 whitespace-nowrap">{labelCount}</span> : null}
              </span>
              <span className="text-[12px] text-[#9e9ea8] mt-0.5">(within 30km)</span>
            </span>
          ) : (
            <span className="min-w-0 flex-1 text-[14px] leading-snug text-[#1a1a2e] pr-1">
              {labelMain}
              {labelCount ? <span className="text-[#9e9ea8] font-normal whitespace-nowrap"> {labelCount}</span> : null}
            </span>
          )}
          {isPremium && !hasPremiumAccess && (
            <CrownFilledIcon
              className={cn('h-4 w-4 shrink-0 text-[#ff5a60]', q45Quick || isNearMe ? 'mt-0.5' : 'ml-auto')}
            />
          )}
        </button>
      </div>
    );
  }

  if (filter.controlType === 'range' && filter.rangeConfig) {
    const { min, max, step, formatLabel, allowedValues, minStepGap } = filter.rangeConfig;
    return (
      <div key={filter.key} className={cn('pt-2.5 pb-7 px-1', isVisuallyDimmed && 'opacity-50')}>
        <p className="text-[14px] text-[#3a3a4a] font-medium mb-2">{filter.label}</p>
        <DualRangeSlider min={min} max={max} step={step} allowedValues={allowedValues} minStepGap={minStepGap} value={draft[filter.key] as [number, number] | null} onChange={(v) => ctx.setRange(filter.key, v)} formatLabel={formatLabel} />
      </div>
    );
  }

  if (filter.controlType === 'multi-select' && filter.options) {
    if (filter.key === 'profileManagedBy' || filter.key === 'maritalStatus') {
      return <ChipSelect filter={filter} ctx={ctx} />;
    }
    if (filter.key === 'partnerHasChildren' && !shouldShowPartnerHasChildrenFilter(draft.maritalStatus)) {
      return null;
    }
    const useSimpleList = true;
    const supportsViewMore =
      filter.key === 'religion' ||
      filter.key === 'professionArea' ||
      filter.key === 'profession' ||
      filter.key === 'country' ||
      filter.key === 'state' ||
      filter.key === 'city' ||
      filter.key === 'familyState';
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
    const shownOptions = supportsViewMore && !searchQuery && !isExpanded ? visibleOptions.slice(0, 4) : visibleOptions;
    // community grouped by religion sub-headers when 2+ religions selected
    const isCommunity = filter.key === 'community';
    const communityGroups = isCommunity ? getCommunityGroupsForReligions(draft.religion) : [];
    const hideLabel =
      isCommunity ||
      hideDuplicateCategoryHeading(filter.key, ctx.activeCategoryId, {
        iteration: ctx.iteration,
        currentUserReligion: ctx.currentUserReligion,
      });
    const showCommunitySearch =
      filter.key !== 'community' || (filter.options?.length ?? 0) >= COMMUNITY_SEARCH_MIN_OPTIONS;
    return (
      <div key={filter.key} className="py-3 px-1">
        {!hideLabel && (
          <div className="flex items-center gap-2 mb-2.5">
            <p className={cn('text-[14px] font-medium', isLocked ? 'text-[#71717a]' : 'text-[#3a3a4a]')}>{filter.label}</p>
            {isPremium && !hasPremiumAccess && <CrownFilledIcon className="ml-auto w-4 h-4 text-[#ff5a60] shrink-0" />}
          </div>
        )}
        {isLocked ? (
          <button onClick={() => onPremiumUpgrade?.()} className="w-full text-left text-[12px] text-[#ff5a60] font-medium px-3 py-2.5 rounded-lg bg-[#ff5a60]/[0.05] border border-[#ff5a60]/[0.15]">Upgrade to Premium to use this filter</button>
        ) : (
          <div className="space-y-2">
            {filter.searchable && showCommunitySearch && !['religion', 'qualification', 'educationField'].includes(filter.key) && (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e9ea8]" />
                <input type="text" value={searchByFilterKey[filter.key] || ''} onChange={(e) => setSearchByFilterKey((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                  placeholder={`Search ${filter.label}`} className="h-10 w-full rounded-xl border border-[#dcdce2] bg-white pl-9 pr-3 text-[13px] text-[#3a3a4a] outline-none focus:border-[#0AA4B8]" />
              </div>
            )}
            {/* Community: grouped by religion with sub-headers */}
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
                      <p className="text-[11px] font-semibold text-[#9e9ea8] uppercase tracking-wide px-2 pt-3 pb-1">{group.religion}</p>
                      {groupOptions.map((opt) => {
                        const isActive = selectedSet.has(opt.value);
                        return (
                          <button key={opt.value} onClick={() => ctx.toggleMultiSelectValue(filter.key, opt.value, filter.premium)}
                            className="flex w-full items-center gap-3 text-left hover:bg-[#f8f8fa] px-2 py-2.5 rounded-md">
                            <Checkbox checked={isActive} /><LabelWithCount label={opt.label} bold={isActive} />
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
                {visibleOptions.length === 0 && <div className="px-2 py-2 text-[12px] text-[#9e9ea8]">No options found</div>}
              </div>
            ) : (
              <div className={cn(useSimpleList ? 'space-y-0.5' : 'overflow-hidden rounded-xl border border-[#ececf1] bg-white')}>
                {(filter.optionGroups || []).map((group) => {
                  const gv = group.optionValues.filter((v) => filter.options!.some((o) => o.value === v));
                  const si = gv.filter((v) => selectedSet.has(v)).length;
                  return (
                    <button key={group.id} onClick={() => ctx.toggleManyValues(filter.key, gv, filter.premium)}
                      className={cn('flex w-full items-center gap-3 text-left hover:bg-[#f8f8fa]',
                        useSimpleList ? 'px-2 py-2.5 rounded-md' : 'border-t border-[#f0f0f3] px-3 py-2.5')}>
                      <Checkbox checked={gv.length > 0 && si === gv.length} indeterminate={si > 0 && si < gv.length} /><span className="text-[13px] font-semibold text-[#32323c]">{group.label}</span>
                    </button>
                  );
                })}
                {shownOptions.map((opt) => {
                  const isActive = selectedSet.has(opt.value);
                  return (
                    <button key={opt.value} onClick={() => ctx.toggleMultiSelectValue(filter.key, opt.value, filter.premium)}
                      className={cn(
                        'flex w-full gap-3 text-left hover:bg-[#f8f8fa]',
                        opt.description ? 'items-start' : 'items-center',
                        useSimpleList ? 'px-2 py-2.5 rounded-md' : 'border-t border-[#f0f0f3] px-3 py-2.5'
                      )}>
                      <div className={cn('shrink-0', opt.description && 'pt-0.5')}>
                        <Checkbox checked={isActive} />
                      </div>
                      <OptionLabel opt={opt} bold={isActive} />
                    </button>
                  );
                })}
                {visibleOptions.length === 0 && (
                  <div className={cn(useSimpleList ? 'px-2 py-2 text-[12px] text-[#9e9ea8]' : 'border-t border-[#f0f0f3] px-3 py-3 text-[12px] text-[#9e9ea8]')}>
                    No options found
                  </div>
                )}
              </div>
            )}
            {supportsViewMore && !searchQuery && !isExpanded && visibleOptions.length > 4 && (
              <button type="button" onClick={() => ctx.setExpandedByFilterKey((prev) => ({ ...prev, [filter.key]: true }))}
                className="px-2 py-1 text-[12px] font-semibold text-[#0AA4B8] hover:underline">
                View more
              </button>
            )}
            {filter.key === 'country' && hasNonIndiaCountrySelection(selected) && (
              <div className="pt-2">
                <p className="text-[14px] font-medium text-[#3a3a4a] px-1 mb-1.5">Country grew up in</p>
                <div className="space-y-0.5">
                  <button type="button"
                    onClick={() => ctx.setMultiSelectValues('countryGrewUp', grewUpSet.has('India') ? [] : ['India'])}
                    className="flex w-full items-center gap-3 text-left hover:bg-[#f8f8fa] px-2 py-2.5 rounded-md">
                    <Checkbox checked={grewUpSet.has('India')} />
                    <span className="text-[13px] text-[#52525b]">Grew up in India</span>
                  </button>
                  <button type="button"
                    onClick={() => ctx.setMultiSelectValues('countryGrewUp', grewUpSet.has('Other') ? [] : ['Other'])}
                    className="flex w-full items-center gap-3 text-left hover:bg-[#f8f8fa] px-2 py-2.5 rounded-md">
                    <Checkbox checked={grewUpSet.has('Other')} />
                    <span className="text-[13px] text-[#52525b]">Grew up in Other</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (filter.controlType === 'single-select' && filter.options) {
    const selected = draft[filter.key] as string | null;
    return (
      <div key={filter.key} className="py-3 px-1">
        <p className="text-[14px] font-medium text-[#3a3a4a] mt-2 mb-2 px-1">{filter.label}</p>
        <div className="space-y-0.5">
          {filter.allowClear && (
            <button
              type="button"
              onClick={() => ctx.setSingleSelect(filter.key, null)}
              className="w-full flex items-center gap-3 py-2.5 px-2 rounded-md text-left transition-colors hover:bg-[#fafafa]"
            >
              <RadioDot checked={selected == null} />
              <span className={cn('text-[13px]', selected == null ? 'text-[#1a1a2e] font-medium' : 'text-[#52525b]')}>No preference</span>
            </button>
          )}
          {filter.options.map((opt) => (
            <button key={opt.value} onClick={() => ctx.setSingleSelect(filter.key, opt.value, filter.premium)}
              className="w-full flex items-center gap-3 py-2.5 px-2 rounded-md text-left transition-colors hover:bg-[#fafafa]">
              <RadioDot checked={selected === opt.value} />
              <LabelWithCount label={opt.label} bold={selected === opt.value} />
            </button>
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

const PROGRESSIVE_INITIAL_SHOW = 5;

function renderFilterProgressive(def: SharedFilterDefinition, ctx: FilterRenderContext) {
  const filter = resolveFilterDefinition(def, ctx.draft, ctx.currentUserReligion);
  const { draft, isCurrentUserPremium, hasPremiumAccess, onPremiumUpgrade } = ctx;
  if (filter.key === 'partnerHasChildren' && !shouldShowPartnerHasChildrenFilter(draft.maritalStatus)) return null;
  const isPremium = !!filter.premium;
  const isLocked = isPremium && !isCurrentUserPremium;
  const isVisuallyDimmed = isPremium && !hasPremiumAccess;
  const hideCommunity = filter.key === 'community' && draft.religion.length === 0;
  const hideState = filter.key === 'state' && draft.country.length === 0;
  const hideCity = filter.key === 'city' && draft.state.length === 0;

  if (hideCommunity || hideState || hideCity) return null;

  if (filter.controlType === 'toggle') {
    const checked = draft[filter.key] as boolean;
    const desc = TOGGLE_DESCRIPTIONS[filter.key];
    return (
      <div key={filter.key} className="py-3.5 px-1">
        <button
          type="button"
          onClick={() => (isLocked ? onPremiumUpgrade?.() : ctx.toggleBoolean(filter.key, filter.premium))}
          className={cn('flex w-full items-start gap-3 text-left', isVisuallyDimmed && 'opacity-55')}
        >
          <div className="pt-0.5">
            <Checkbox checked={checked} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-[#1a1a2e]">
                {splitLabel(filter.label).main}
                {splitLabel(filter.label).count && <span className="text-[#9e9ea8] font-normal ml-1">{splitLabel(filter.label).count}</span>}
              </span>
              {isPremium && !hasPremiumAccess && <CrownFilledIcon className="ml-auto w-4 h-4 text-[#ff5a60] shrink-0" />}
            </div>
            {desc && <p className="text-[11px] text-[#9e9ea8] mt-0.5">{desc}</p>}
          </div>
        </button>
      </div>
    );
  }

  if (filter.controlType === 'range' && filter.rangeConfig) {
    const { min, max, step, formatLabel, allowedValues, minStepGap } = filter.rangeConfig;
    const rangeVal = draft[filter.key] as [number, number] | null;
    const presets = RANGE_PRESETS[filter.key];
    return (
      <div key={filter.key} className={cn('pt-2.5 pb-7 px-1', isVisuallyDimmed && 'opacity-50')}>
        <p className="text-[14px] text-[#3a3a4a] font-medium mb-2">{filter.label}</p>
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
  const { draft, isCurrentUserPremium, hasPremiumAccess, onPremiumUpgrade } = ctx;
  const isPremium = !!filter.premium;
  const isLocked = isPremium && !isCurrentUserPremium;
  const isVisuallyDimmed = isPremium && !hasPremiumAccess;

  if (filter.controlType === 'single-select') {
    const selected = draft[filter.key] as string | null;
    return (
      <div className="py-3 px-1">
        <p className="text-[14px] text-[#3a3a4a] font-medium mb-2.5">{filter.label}</p>
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
              <button key={opt.value} onClick={() => ctx.setSingleSelect(filter.key, opt.value, filter.premium)}
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
          : 'py-3 px-1',
        isVisuallyDimmed && 'opacity-55'
      )}
    >
      {!hideLabel && (
        <div className={cn('flex items-center gap-2', q45Quick ? 'mb-2' : 'mb-2.5')}>
          <p className={cn('text-[14px] font-medium', isLocked ? 'text-[#71717a]' : 'text-[#3a3a4a]')}>{filter.label}</p>
          {isPremium && !hasPremiumAccess && (
            <CrownFilledIcon className="ml-auto h-4 w-4 shrink-0 text-[#ff5a60]" />
          )}
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
              onClick={() => (isLocked ? onPremiumUpgrade?.() : ctx.toggleMultiSelectValue(filter.key, opt.value, filter.premium))}
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
  const { draft, isCurrentUserPremium, hasPremiumAccess, onPremiumUpgrade, searchByFilterKey, setSearchByFilterKey } = ctx;
  const isPremium = !!filter.premium;
  const isLocked = isPremium && !isCurrentUserPremium;
  const isVisuallyDimmed = isPremium && !hasPremiumAccess;
  const selected = (draft[filter.key] as string[]) || [];
  const selectedSet = new Set(selected);
  const searchQuery = (searchByFilterKey[filter.key] || '').trim().toLowerCase();
  const allOptions = filter.options!;
  const visibleOptions = allOptions.filter((o) => {
    if (!searchQuery) return true;
    return `${o.label} ${o.value} ${(o.aliases || []).join(' ')} ${o.description || ''}`.toLowerCase().includes(searchQuery);
  });

  const showingOptions = expanded || searchQuery ? visibleOptions : visibleOptions.slice(0, PROGRESSIVE_INITIAL_SHOW);
  const hasMore = !expanded && !searchQuery && visibleOptions.length > PROGRESSIVE_INITIAL_SHOW;
  const showCommunitySearch =
    filter.key !== 'community' || allOptions.length >= COMMUNITY_SEARCH_MIN_OPTIONS;

  const hideSectionHeading = hideDuplicateCategoryHeading(filter.key, ctx.activeCategoryId, {
    iteration: ctx.iteration,
    currentUserReligion: ctx.currentUserReligion,
  });

  return (
    <div className={cn('py-3 px-1', isVisuallyDimmed && 'opacity-55')}>
      {!hideSectionHeading && (
        <div className="flex items-center gap-2 mb-2.5">
          {isPremium && !hasPremiumAccess && <CrownFilledIcon className="w-4 h-4 text-[#ff5a60] shrink-0" />}
          <p className={cn('text-[14px] font-medium', isLocked ? 'text-[#a0a0a8]' : 'text-[#3a3a4a]')}>{filter.label}</p>
        </div>
      )}
      {isLocked ? (
        <button onClick={() => onPremiumUpgrade?.()} className="w-full text-left text-[12px] text-[#ff5a60] font-medium px-3 py-2.5 rounded-lg bg-[#ff5a60]/[0.05] border border-[#ff5a60]/[0.15]">Upgrade to Premium</button>
      ) : (
        <div className="space-y-2">
          {(expanded || searchQuery) && filter.searchable && showCommunitySearch && !['religion', 'qualification', 'educationField'].includes(filter.key) && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e9ea8]" />
              <input type="text" value={searchByFilterKey[filter.key] || ''} onChange={(e) => setSearchByFilterKey((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                placeholder={`Search ${filter.label}`} className="h-10 w-full rounded-xl border border-[#dcdce2] bg-white pl-9 pr-3 text-[13px] text-[#3a3a4a] outline-none focus:border-[#0AA4B8]" />
            </div>
          )}
          <div className="overflow-hidden rounded-xl border border-[#ececf1] bg-white">
            {showingOptions.map((opt) => {
              const isActive = selectedSet.has(opt.value);
              return (
                <button key={opt.value} onClick={() => ctx.toggleMultiSelectValue(filter.key, opt.value, filter.premium)}
                  className={cn(
                    'flex w-full gap-3 border-t border-[#f0f0f3] first:border-t-0 px-3 py-2.5 text-left hover:bg-[#f8f8fa]',
                    opt.description ? 'items-start' : 'items-center'
                  )}>
                  <div className={cn('shrink-0', opt.description && 'pt-0.5')}>
                    <Checkbox checked={isActive} />
                  </div>
                  <OptionLabel opt={opt} bold={isActive} />
                </button>
              );
            })}
            {showingOptions.length === 0 && <div className="px-3 py-3 text-[12px] text-[#9e9ea8]">No options found</div>}
          </div>
          {hasMore && (
            <button onClick={() => setExpanded(true)} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0AA4B8] px-1 py-1 hover:underline">
              <ChevronDown className="w-3.5 h-3.5" />
              Show all {visibleOptions.length} options
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Right-pane content renderers (flat / sub-sectioned / progressive)
// ─────────────────────────────────────────────────────

function RightPaneFlat({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  return (
    <>
      <div className="px-3 pt-3 pb-4">
        {category.filters.map((f) => renderFilterFlat(f, ctx))}
      </div>
    </>
  );
}

function RightPaneSubSectioned({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  const filterByKey = useMemo(() => {
    const map = new Map<SharedFilterKey, SharedFilterDefinition>();
    category.filters.forEach((f) => map.set(f.key, f));
    return map;
  }, [category.filters]);

  if (!category.subSections) {
    return <RightPaneFlat category={category} ctx={ctx} />;
  }

  return (
    <>
      <div className="px-3 pt-3 pb-4">
        {category.subSections.map((section, i) => (
          <div key={section.title}>
            {i > 0 && <div className="h-px bg-[#ebebee] my-2" />}
            <p className="text-[12px] font-semibold text-[#6b6b78] mt-2 mb-1 px-1">{section.title}</p>
            <div>
              {section.filterKeys.map((key) => {
                const f = filterByKey.get(key);
                return f ? renderFilterFlat(f, ctx) : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function RightPaneProgressive({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  return (
    <>
      <div className="px-3 pt-3 pb-4">
        {category.filters.map((f) => renderFilterProgressive(f, ctx))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────
// Option4: Quick Filters — Photo block first, divider, discovery toggles (Profile managed by lives under Basic Details)
// ─────────────────────────────────────────────────────

const OPTION4_QUICK_TOGGLE_KEYS: SharedFilterKey[] = [
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
    <div className="px-1 pb-1 pt-1">
      <p className="mb-2 px-1 text-[14px] font-medium text-[#3a3a4a]">Photo</p>
      <div className="flex flex-col">
        {OPTION4_PHOTO_VISIBILITY_ROWS.map(({ value, label }) => {
          const isOn = selectedSet.has(value);
          const { main, count } = splitLabel(label);
          return (
            <div key={value} className="px-1 py-2.5">
              <button
                type="button"
                onClick={() => ctx.toggleMultiSelectValue('photoVisibility', value)}
                className="flex w-full items-center gap-3 text-left"
              >
                <div className="mt-0.5 shrink-0">
                  <Checkbox checked={isOn} />
                </div>
                <span className="min-w-0 flex-1 text-[14px] leading-snug text-[#1a1a2e]">
                  {main}
                  {count ? <span className="font-normal text-[#9e9ea8]"> {count}</span> : null}
                </span>
              </button>
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
    <div className="px-3 pb-5 pt-2">
      <div className="flex flex-col">
        <Option4PhotoVisibilityRows ctx={quickCtx} />
        <div className="mx-1 my-2 h-px shrink-0 bg-[#ebebee]" aria-hidden />
        {OPTION4_QUICK_TOGGLE_KEYS.map((key) => {
          const f = filterByKey.get(key);
          return f ? <React.Fragment key={key}>{renderFilterFlat(f, quickCtx)}</React.Fragment> : null;
        })}
      </div>
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
    <div className="px-3 pb-5 pt-2">
      <div className="flex flex-col">
        {OPTION4_QUICK_TOGGLE_KEYS.map((key) => {
          const f = filterByKey.get(key);
          return f ? <React.Fragment key={key}>{renderFilterFlat(f, quickCtx)}</React.Fragment> : null;
        })}
      </div>
    </div>
  );
}

function RightPaneOption5PhotoVisibility({ ctx }: { ctx: FilterRenderContext }) {
  const photoCtx: FilterRenderContext = { ...ctx, renderSurface: 'option5Quick' };
  return (
    <div className="px-3 pb-5 pt-2">
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

  const countrySelected = (draft.country as string[]) || [];
  const stateSelected = (draft.state as string[]) || [];
  const citySelected = (draft.city as string[]) || [];
  const countrySet = new Set(countrySelected);
  const stateSet = new Set(stateSelected);
  const citySet = new Set(citySelected);

  const stateQuery = (searchByFilterKey['state'] || '').trim().toLowerCase();
  const cityQuery = (searchByFilterKey['city'] || '').trim().toLowerCase();

  const filteredStateOpts = stateFilter?.options?.filter(o =>
    !stateQuery || `${o.label} ${o.value}`.toLowerCase().includes(stateQuery)
  ) ?? [];
  const stateListExpanded = !!expandedByFilterKey.state;
  const shownStateOpts =
    !stateQuery && !stateListExpanded ? filteredStateOpts.slice(0, 4) : filteredStateOpts;

  const allCityOpts = cityFilter?.options ?? [];
  const filteredCityOpts = cityQuery
    ? allCityOpts.filter(o => `${o.label} ${o.value}`.toLowerCase().includes(cityQuery))
    : allCityOpts;
  const popularCityOpts = filteredCityOpts.filter(o => OPTION4_POPULAR_CITIES.includes(o.value));
  const otherCityOpts = filteredCityOpts.filter(o => !OPTION4_POPULAR_CITIES.includes(o.value));

  return (
    <div className="px-3 pt-3 pb-4 space-y-1">
      {/* Country */}
      {countryFilter && (
        <div className="py-2 px-1">
          <p className="text-[14px] font-medium text-[#3a3a4a] mb-2">{countryFilter.label}</p>
          <div className="space-y-0.5">
            {countryFilter.options?.map(opt => {
              const isActive = countrySet.has(opt.value);
              return (
                <button key={opt.value} onClick={() => ctx.toggleMultiSelectValue('country', opt.value)}
                  className="flex w-full items-center gap-3 text-left hover:bg-[#f8f8fa] px-2 py-2.5 rounded-md">
                  <Checkbox checked={isActive} />
                  <LabelWithCount label={opt.label} bold={isActive} />
                </button>
              );
            })}
          </div>
          {countrySelected.length === 0 && (
            <p className="mt-3 px-2 text-[12px] italic leading-snug text-[#9e9ea8]">
              Select a country to see states.
            </p>
          )}
        </div>
      )}

      {/* State — only shown when at least one country is selected */}
      {stateFilter && countrySelected.length > 0 && (
        <>
          <div className="h-px bg-[#ebebee] mx-1" />
          <div className="py-2 px-1">
            <p className="text-[14px] font-medium text-[#3a3a4a] mb-2">{stateFilter.label}</p>
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e9ea8]" />
              <input
                type="text"
                value={searchByFilterKey['state'] || ''}
                onChange={(e) => setSearchByFilterKey(prev => ({ ...prev, state: e.target.value }))}
                placeholder="Search state"
                className="h-10 w-full rounded-xl border border-[#dcdce2] bg-white pl-9 pr-3 text-[13px] text-[#3a3a4a] outline-none focus:border-[#0AA4B8]"
              />
            </div>
            <div className="space-y-0.5">
              {shownStateOpts.map(opt => {
                const isActive = stateSet.has(opt.value);
                return (
                  <button key={opt.value} onClick={() => ctx.toggleMultiSelectValue('state', opt.value)}
                    className="flex w-full items-center gap-3 text-left hover:bg-[#f8f8fa] px-2 py-2.5 rounded-md">
                    <Checkbox checked={isActive} />
                    <LabelWithCount label={opt.label} bold={isActive} />
                  </button>
                );
              })}
              {filteredStateOpts.length === 0 && <p className="px-2 py-2 text-[12px] text-[#9e9ea8]">No states found</p>}
            </div>
            {!stateQuery && !stateListExpanded && filteredStateOpts.length > 4 && (
              <button
                type="button"
                onClick={() => setExpandedByFilterKey((prev) => ({ ...prev, state: true }))}
                className="px-2 py-1 text-[12px] font-semibold text-[#0AA4B8] hover:underline"
              >
                View More
              </button>
            )}
            {stateSelected.length === 0 && (
              <p className="mt-3 px-2 text-[12px] italic leading-snug text-[#9e9ea8]">
                Select a state to see cities.
              </p>
            )}
          </div>
        </>
      )}

      {/* City — only shown when at least one state is selected; popular 5 first (no label) + divider + rest */}
      {cityFilter && stateSelected.length > 0 && (
        <>
          <div className="h-px bg-[#ebebee] mx-1" />
          <div className="py-2 px-1">
            <p className="text-[14px] font-medium text-[#3a3a4a] mb-2">{cityFilter.label}</p>
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e9ea8]" />
              <input
                type="text"
                value={searchByFilterKey['city'] || ''}
                onChange={(e) => setSearchByFilterKey(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Search city"
                className="h-10 w-full rounded-xl border border-[#dcdce2] bg-white pl-9 pr-3 text-[13px] text-[#3a3a4a] outline-none focus:border-[#0AA4B8]"
              />
            </div>
            <div className="space-y-0.5">
              {popularCityOpts.map(opt => {
                const isActive = citySet.has(opt.value);
                return (
                  <button key={opt.value} onClick={() => ctx.toggleMultiSelectValue('city', opt.value)}
                    className="flex w-full items-center gap-3 text-left hover:bg-[#f8f8fa] px-2 py-2.5 rounded-md">
                    <Checkbox checked={isActive} />
                    <LabelWithCount label={opt.label} bold={isActive} />
                  </button>
                );
              })}
              {popularCityOpts.length > 0 && otherCityOpts.length > 0 && (
                <div className="h-px bg-[#ebebee] mx-1 my-1" />
              )}
              {otherCityOpts.map(opt => {
                const isActive = citySet.has(opt.value);
                return (
                  <button key={opt.value} onClick={() => ctx.toggleMultiSelectValue('city', opt.value)}
                    className="flex w-full items-center gap-3 text-left hover:bg-[#f8f8fa] px-2 py-2.5 rounded-md">
                    <Checkbox checked={isActive} />
                    <LabelWithCount label={opt.label} bold={isActive} />
                  </button>
                );
              })}
              {filteredCityOpts.length === 0 && <p className="px-2 py-2 text-[12px] text-[#9e9ea8]">No cities found</p>}
            </div>
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

  return (
    <div className="px-3 pt-3 pb-4">
      <div className="py-2 px-1 space-y-0.5">
        {incomeFilter.options.map(opt => {
          const isActive = selectedSet.has(opt.value);
          return (
            <button key={opt.value} onClick={() => ctx.toggleMultiSelectValue(filterKey, opt.value)}
              className="flex w-full items-center gap-3 text-left hover:bg-[#f8f8fa] px-2 py-2.5 rounded-md">
              <Checkbox checked={isActive} />
              <LabelWithCount label={opt.label} bold={isActive} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Option4: Community pane — always visible, search bar, skipResolve options with counts
// ─────────────────────────────────────────────────────

function RightPaneOption4Community({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  const { draft, searchByFilterKey, setSearchByFilterKey } = ctx;
  const communityFilter = category.filters.find(f => f.key === 'community');
  if (!communityFilter || !communityFilter.options) return null;

  const selected = (draft.community as string[]) || [];
  const selectedSet = new Set(selected);
  const query = (searchByFilterKey['community'] || '').trim().toLowerCase();

  const visibleOpts = communityFilter.options.filter(o =>
    !query || `${o.label} ${o.value} ${(o.aliases || []).join(' ')}`.toLowerCase().includes(query)
  );

  const showCommunitySearch = communityFilter.options.length >= COMMUNITY_SEARCH_MIN_OPTIONS;

  return (
    <div className="px-3 pt-3 pb-4">
      <div className="py-2 px-1">
        {showCommunitySearch && (
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e9ea8]" />
            <input
              type="text"
              value={searchByFilterKey['community'] || ''}
              onChange={(e) => setSearchByFilterKey(prev => ({ ...prev, community: e.target.value }))}
              placeholder="Search community"
              className="h-10 w-full rounded-xl border border-[#dcdce2] bg-white pl-9 pr-3 text-[13px] text-[#3a3a4a] outline-none focus:border-[#0AA4B8]"
            />
          </div>
        )}
        <div className="space-y-0.5">
          {visibleOpts.map(opt => {
            const isActive = selectedSet.has(opt.value);
            return (
              <button key={opt.value} onClick={() => ctx.toggleMultiSelectValue('community', opt.value)}
                className="flex w-full items-center gap-3 text-left hover:bg-[#f8f8fa] px-2 py-2.5 rounded-md">
                <Checkbox checked={isActive} />
                <LabelWithCount label={opt.label} bold={isActive} />
              </button>
            );
          })}
          {visibleOpts.length === 0 && <p className="px-2 py-2 text-[12px] text-[#9e9ea8]">No communities found</p>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Option4: Family pane — cascading country/state/city; no "Family Location" section header
// ─────────────────────────────────────────────────────

function RightPaneOption4Family({ category, ctx }: { category: IterationCategoryConfig; ctx: FilterRenderContext }) {
  const familyTypeFilters = category.filters.filter(f => f.key === 'familyType' || f.key === 'financialStatus');
  const familyLocationFilters = category.filters.filter(f => ['familyCountry', 'familyState', 'familyCity'].includes(f.key));
  return (
    <div className="px-3 pt-[1px] pb-4">
      {familyTypeFilters.map(f => renderFilterFlat(f, ctx))}
      {familyLocationFilters.length > 0 && (
        <>
          <div className="h-px bg-[#ebebee] my-2" />
          {familyLocationFilters.map(f => renderFilterFlat(f, ctx))}
        </>
      )}
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
}: SharedFilterBottomSheetProps) => {
  const personaBaseline = useMemo(
    () => currentUserPersonaId ? getBaselineFiltersForPersona(currentUserPersonaId) : PARTNER_PREFERENCE_BASELINE_FILTERS,
    [currentUserPersonaId]
  );
  const [draft, setDraft] = useState<SharedFilterState>(value);
  const [searchByFilterKey, setSearchByFilterKey] = useState<Partial<Record<SharedFilterKey, string>>>({});
  const [expandedByFilterKey, setExpandedByFilterKey] = useState<Partial<Record<SharedFilterKey, boolean>>>({});
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const premiumEffective = filtersIgnorePremium ? true : isCurrentUserPremium;

  const categories = useMemo(() => getIterationCategories(iteration, currentUserPersonaId), [iteration, currentUserPersonaId]);
  const paneStyle = useMemo(() => getRightPaneStyle(iteration), [iteration]);

  useEffect(() => {
    if (isOpen) {
      let v = value;
      if (!shouldShowPartnerHasChildrenFilter(v.maritalStatus) && (v.partnerHasChildren?.length ?? 0) > 0) {
        v = { ...v, partnerHasChildren: [] };
      }
      setDraft(v);
      setSearchByFilterKey({});
      setExpandedByFilterKey({});
      setActiveCategoryId(categories[0]?.id ?? '');
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
  const showPremiumCategoryOverlay = !!activeCategory && activeCategory.filters.length > 0
    && activeCategory.filters.every((f) => !!f.premium)
    && !isCurrentUserPremium;
  const premiumOverlayCardOffsetClass =
    activeCategory?.id === 'smart_discovery'
      ? 'pt-[320px]'
      : activeCategory?.id === 'income'
        ? 'pt-[280px]'
        : 'pt-[180px]';

  const estimatedResultCount = useMemo(() => estimateResultCount?.(draft), [draft, estimateResultCount]);
  const applyCtaText = useMemo(() => {
    // Default state: baseline partner-preference selections are prefilled but not considered
    // “active filters”. In this state, showing a small computed count feels wrong/noisy.
    if (totalActiveCount === 0) return 'Show Matches';
    if (typeof estimatedResultCount !== 'number') return 'Apply';
    const normalizedLabel = (resultLabel || '').trim().toLowerCase();
    const noun =
      normalizedLabel === 'match'
        ? (estimatedResultCount === 1 ? 'Match' : 'Matches')
        : (estimatedResultCount === 1
            ? resultLabel
            : `${resultLabel}s`);
    return `Show ${estimatedResultCount} ${noun}`;
  }, [estimatedResultCount, resultLabel, totalActiveCount]);

  const toggleBoolean = (key: SharedFilterKey, premium?: boolean) => {
    if (premium && !premiumEffective) { onPremiumUpgrade?.(); return; }
    setDraft((prev) => ({ ...prev, [key]: !prev[key] } as SharedFilterState));
  };
  const toggleMultiSelectValue = (key: SharedFilterKey, val: string, premium?: boolean) => {
    if (premium && !premiumEffective) { onPremiumUpgrade?.(); return; }
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
        const hasNonIndia = hasNonIndiaCountrySelection(nextValues);
        return {
          ...prev,
          country: nextValues,
          state: nextValues.length === 0 ? [] : prev.state,
          city: nextValues.length === 0 ? [] : prev.city,
          countryGrewUp: hasNonIndia ? prev.countryGrewUp : [],
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
    if (premium && !premiumEffective) { onPremiumUpgrade?.(); return; }
    setDraft((prev) => {
      if (val === null) return { ...prev, [key]: null } as SharedFilterState;
      return { ...prev, [key]: (prev[key] as string | null) === val ? null : val } as SharedFilterState;
    });
  };
  const setRange = (key: SharedFilterKey, val: [number, number] | null) => {
    setDraft((prev) => ({ ...prev, [key]: val } as SharedFilterState));
  };
  const setMultiSelectValues = (key: SharedFilterKey, values: string[], premium?: boolean) => {
    if (premium && !premiumEffective) { onPremiumUpgrade?.(); return; }
    setDraft((prev) => ({ ...prev, [key]: values } as SharedFilterState));
  };
  const toggleManyValues = (key: SharedFilterKey, values: string[], premium?: boolean) => {
    if (premium && !premiumEffective) { onPremiumUpgrade?.(); return; }
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
        const hasNonIndia = hasNonIndiaCountrySelection(nextValues);
        return {
          ...prev,
          country: nextValues,
          state: nextValues.length === 0 ? [] : prev.state,
          city: nextValues.length === 0 ? [] : prev.city,
          countryGrewUp: hasNonIndia ? prev.countryGrewUp : [],
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

  const ctx: FilterRenderContext = {
    draft, isCurrentUserPremium: premiumEffective, hasPremiumAccess: isCurrentUserPremium, onPremiumUpgrade,
    searchByFilterKey, setSearchByFilterKey,
    expandedByFilterKey, setExpandedByFilterKey,
    toggleBoolean, toggleMultiSelectValue, setMultiSelectValues, setSingleSelect, setRange, toggleManyValues,
    currentUserReligion,
    currentUserPersonaId,
    activeCategoryId,
    iteration,
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
      // Family: cascading country/state/city, no section header
      if (activeCategory.id === 'family') {
        const familyFilters = activeCategory.filters.filter(f => {
          if (f.key === 'familyState') return ctx.draft.familyCountry.length > 0;
          if (f.key === 'familyCity') return ctx.draft.familyState.length > 0;
          return true;
        });
        const overrideCategory = { ...activeCategory, filters: familyFilters };
        return <RightPaneOption4Family category={overrideCategory} ctx={ctx} />;
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="absolute inset-0 z-[60] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} />

          <motion.div
            className="absolute left-0 right-0 bottom-0 z-[65] overflow-visible"
            style={{ height: 'min(92%, calc(100% - env(safe-area-inset-top, 0px) - 24px))' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
          >
            <button onClick={onClose} className="absolute left-1/2 -top-14 z-[66] -translate-x-1/2 h-10 w-10 rounded-full border border-white/50 bg-white/65 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center justify-center" aria-label="Close filters">
              <X className="w-5 h-5 text-[#4a4a55]" />
            </button>

            <div className="h-full bg-white rounded-t-[24px] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2.5 shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold text-[#1a1a2e]">Filters</h2>
                </div>
                <button onClick={handleClear} className={cn('text-[13px] font-semibold transition-colors', totalActiveCount > 0 ? 'text-[#0AA4B8]' : 'text-[#a2a2ab]')} disabled={totalActiveCount === 0}>
                  Clear Filters
                </button>
              </div>
              <div className="h-px bg-[#ebebee] shrink-0" />

              {/* Split Pane: Sidebar + Right Content */}
              <div className="flex flex-1 overflow-hidden min-h-0">
                <div className="w-[128px] shrink-0 bg-[#f5f5f7] overflow-y-auto">
                  {categories.map((category) => {
                    const isActive = activeCategoryId === category.id;
                    const count = countIterationCategoryActiveFilters(draft, category, personaBaseline, iteration);
                    const isAllPremiumCategory = category.filters.length > 0 && category.filters.every((f) => !!f.premium);
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategoryId(category.id)}
                        className={cn(
                          'w-full text-left px-3.5 py-3.5 text-[14px] leading-tight font-medium transition-colors relative border-b border-[#ebebee]/60',
                          isActive ? 'bg-white text-[#0AA4B8]' : 'text-[#52525b] hover:bg-[#ededf0]'
                        )}
                      >
                        {isActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0AA4B8] rounded-r-full" />}
                        <span className="block leading-tight select-none pr-3">{category.title}</span>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 shrink-0 pointer-events-none">
                          {isAllPremiumCategory && !isCurrentUserPremium && <CrownFilledIcon className="w-3.5 h-3.5 text-[#ff5a60]" />}
                          {count > 0 && (
                            <span className="inline-flex items-center justify-center bg-[#0AA4B8] text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full px-1">
                              {count}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="relative flex-1 overflow-y-auto">
                  {/* Keep premium rows visible; disable interactions via existing checks,
                     but don’t cover content with an overlay card. */}
                  <div className={cn(showPremiumCategoryOverlay && 'opacity-55')}>
                    {renderRightPane()}
                  </div>

                  {showPremiumCategoryOverlay && (
                    <div
                      className="sticky bottom-0 z-20 px-4 pb-4 flex justify-center"
                      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
                    >
                      <div className="w-full max-w-[276px] rounded-[24px] bg-white border border-[#e9e9ee] px-4 py-4 flex flex-col items-center text-center">
                        <div className="relative mb-3.5">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-b from-[#ff7f82] to-[#ff4b57] flex items-center justify-center">
                            <CrownFilledIcon className="w-6 h-6 text-white" />
                          </div>
                          <img
                            src={PREMIUM_STAR_SMALL_ASSET}
                            alt=""
                            className="absolute -left-3 bottom-0 h-[9px] w-[9px] opacity-80"
                            aria-hidden
                          />
                          <img
                            src={PREMIUM_STAR_SMALL_ASSET}
                            alt=""
                            className="absolute -right-2 top-0.5 h-[9px] w-[9px] opacity-85"
                            aria-hidden
                          />
                          <img
                            src={PREMIUM_STAR_LARGE_ASSET}
                            alt=""
                            className="absolute right-0 -top-3 h-[14px] w-[12px] opacity-90"
                            aria-hidden
                          />
                        </div>
                        <p className="text-[13px] leading-[1.35] font-medium text-[#2d2d39] mb-3.5">
                          Unlock this filter with<br />Premium Membership
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          shape="pill"
                          className="min-w-[154px] h-9 border-[#0AA4B8] text-[#0AA4B8] font-semibold text-[13px]"
                          onClick={() => onPremiumUpgrade?.()}
                        >
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                            <CrownFilledIcon className="w-3.5 h-3.5 text-[#0AA4B8]" />
                            Upgrade Now
                          </span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="shrink-0 border-t border-[#ebebee] bg-white px-4 py-3 flex items-center gap-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
                <Button variant="default" size="default" shape="pill" className="flex-1" onClick={handleApply}>{applyCtaText}</Button>
              </div>
            </div>
          </motion.div>

          <style>{`
            .range-input { pointer-events: none; }
            .range-input::-webkit-slider-runnable-track { -webkit-appearance: none; height: 8px; background: transparent; }
            .range-input::-moz-range-track { height: 8px; background: transparent; }
            .range-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; pointer-events: auto; height: 30px; width: 30px; border-radius: 50%; background: #fff; border: 3px solid #0AA4B8; box-shadow: 0 1px 3px rgba(0,0,0,0.12); cursor: pointer; margin-top: -11px; }
            .range-input::-moz-range-thumb { pointer-events: auto; height: 30px; width: 30px; border-radius: 50%; background: #fff; border: 3px solid #0AA4B8; box-shadow: 0 1px 3px rgba(0,0,0,0.12); cursor: pointer; }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};
