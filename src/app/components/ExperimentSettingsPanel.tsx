import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/cn';
import type { FilterExperienceVersion, PremiumLockPromptPresentation } from './filters/sharedFilters';

// ─── Current User Persona ───────────────────────────────────────────
export interface CurrentUserPersona {
  id: 'priya' | 'arjun' | 'zaid';
  displayName: string;
  emoji: string;
  description: string;
  religion: string;
  gender: 'male' | 'female';
  countryOfResidence: string; // 'India' or other
  incomeCurrency: 'INR' | 'USD';
  isOutsideIndia: boolean;
  isPremium: boolean;
}

export const USER_PERSONAS: CurrentUserPersona[] = [
  {
    id: 'priya',
    displayName: 'Priya',
    emoji: '🌸',
    description: 'Hindu Female · South India · India',
    religion: 'Hindu',
    gender: 'female',
    countryOfResidence: 'India',
    incomeCurrency: 'INR',
    isOutsideIndia: false,
    isPremium: false,
  },
  {
    id: 'arjun',
    displayName: 'Arjun',
    emoji: '✈️',
    description: 'Hindu Male · USA',
    religion: 'Hindu',
    gender: 'male',
    countryOfResidence: 'United States',
    incomeCurrency: 'USD',
    isOutsideIndia: true,
    isPremium: true,
  },
  {
    id: 'zaid',
    displayName: 'Zaid',
    emoji: '🌙',
    description: 'Muslim Male · India · Divorced, remarriage',
    religion: 'Muslim',
    gender: 'male',
    countryOfResidence: 'India',
    incomeCurrency: 'INR',
    isOutsideIndia: false,
    isPremium: true,
  },
];

const VERSION_ITEMS: { id: FilterExperienceVersion; label: string; desc: string }[] = [
  { id: 'option1', label: 'Option 1 — Detailed discovery', desc: 'Quick filters + full sections (Figma-aligned)' },
  { id: 'option2', label: 'Option 2 — Reduced cognitive load', desc: 'Quick-first IA with split discovery' },
  { id: 'option3', label: 'Option 3 — Sticky quick actions', desc: 'Scrollable chips + focused sheet' },
  { id: 'option4', label: 'Option 4 — Redesigned discovery', desc: 'Hobbies, Astro Details, Family Location & more' },
  { id: 'option5', label: 'Option 5 — Photo split', desc: 'Same as Option 4; Photo is its own tab' },
];

export interface ExperimentSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filterExperienceVersion: FilterExperienceVersion;
  onFilterExperienceVersionChange: (v: FilterExperienceVersion) => void;
  useInboxSimulation?: boolean;
  onUseInboxSimulationChange?: (next: boolean) => void;
  currentPersona?: CurrentUserPersona;
  onPersonaChange?: (p: CurrentUserPersona) => void;
  showFilterTabs?: boolean;
  onShowFilterTabsChange?: (next: boolean) => void;
  premiumRowStyle?: 'chevron' | 'badge';
  onPremiumRowStyleChange?: (next: 'chevron' | 'badge') => void;
  premiumIndicatorGlyph?: 'crown' | 'lock';
  onPremiumIndicatorGlyphChange?: (next: 'crown' | 'lock') => void;
  premiumLockPromptPresentation?: PremiumLockPromptPresentation;
  onPremiumLockPromptPresentationChange?: (next: PremiumLockPromptPresentation) => void;
  /** Force the Inbox → Received view into a specific state for demo. */
  inboxDevStateOverride?: 'auto' | 'A' | 'B' | 'C' | 'D' | 'E';
  onInboxDevStateOverrideChange?: (next: 'auto' | 'A' | 'B' | 'C' | 'D' | 'E') => void;
  /** Which copy version (v1/v2) the Tier empty-state should render. */
  inboxCopyVersion?: 'v1' | 'v2';
  onInboxCopyVersionChange?: (next: 'v1' | 'v2') => void;
}

const INBOX_COPY_OPTIONS: Array<{
  id: 'v1' | 'v2';
  label: string;
  desc: string;
}> = [
  { id: 'v1', label: 'Copy v1 (current)', desc: '"You’ve viewed all your top Requests"' },
  { id: 'v2', label: 'Copy v2 (alt)', desc: '"You are all caught up" / "Nothing new for now"' },
];

const INBOX_STATE_OPTIONS: Array<{
  id: 'auto' | 'A' | 'B' | 'C' | 'D' | 'E';
  label: string;
  desc: string;
}> = [
  { id: 'auto', label: 'Auto (natural)', desc: 'Derive state from actions & counts' },
  { id: 'A', label: 'Top Requests', desc: 'Stack/list of top requests' },
  { id: 'B', label: 'Top + More', desc: 'Cleared top, More available' },
  { id: 'C', label: 'Top (0) + More', desc: 'No top yet, More available' },
  { id: 'D', label: 'Top + More (0)', desc: 'Cleared top, no More left' },
  { id: 'E', label: 'All caught up', desc: 'Nothing in either pool' },
];

export const ExperimentSettingsPanel = ({
  isOpen,
  onClose,
  filterExperienceVersion,
  onFilterExperienceVersionChange,
  useInboxSimulation = false,
  onUseInboxSimulationChange,
  currentPersona = USER_PERSONAS[0],
  onPersonaChange,
  showFilterTabs = false,
  onShowFilterTabsChange,
  premiumRowStyle = 'badge',
  onPremiumRowStyleChange,
  premiumIndicatorGlyph = 'lock',
  onPremiumIndicatorGlyphChange,
  premiumLockPromptPresentation = 'nested-bottom-sheet',
  onPremiumLockPromptPresentationChange,
  inboxDevStateOverride = 'auto',
  onInboxDevStateOverrideChange,
  inboxCopyVersion = 'v1',
  onInboxCopyVersionChange,
}: ExperimentSettingsPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute left-4 right-4 z-50 flex flex-col p-3 bg-card border border-border rounded-2xl shadow-xl overflow-y-auto"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              top: 'calc(env(safe-area-inset-top, 0px) + 72px)',
              maxHeight: 'calc(100% - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 96px)',
            }}
          >
            {/* ── Inbox State (Top + More Requests prototype) ── */}
            <p className="text-muted-foreground px-2 pt-0.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em' }}>
              INBOX STATE
            </p>
            <p className="text-muted-foreground/60 px-2 pb-1.5 mt-0.5" style={{ fontSize: '9px', fontWeight: 400 }}>
              Force a specific Top / More Requests state for demo
            </p>
            <div className="flex flex-col gap-0.5">
              {INBOX_STATE_OPTIONS.map((item) => {
                const isActive = inboxDevStateOverride === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onInboxDevStateOverrideChange?.(item.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'min-w-[22px] h-[20px] rounded-md flex items-center justify-center shrink-0 px-1',
                        isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}
                      style={{ fontSize: '9px', fontWeight: 700 }}
                    >
                      {item.id === 'auto' ? '~' : item.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{item.label}</span>
                      <span className="text-muted-foreground block truncate" style={{ fontSize: '9px' }}>
                        {item.desc}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border/60 my-2 mx-2" />

            {/* ── Inbox Copy (Top + More tier empty-state copy variant) ── */}
            <p className="text-muted-foreground px-2 pt-0.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em' }}>
              INBOX COPY
            </p>
            <p className="text-muted-foreground/60 px-2 pb-1.5 mt-0.5" style={{ fontSize: '9px', fontWeight: 400 }}>
              Test alternate headline / sub-line copy on the tier states
            </p>
            <div className="flex flex-col gap-0.5">
              {INBOX_COPY_OPTIONS.map((item) => {
                const isActive = inboxCopyVersion === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onInboxCopyVersionChange?.(item.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'min-w-[22px] h-[20px] rounded-md flex items-center justify-center shrink-0 px-1',
                        isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}
                      style={{ fontSize: '9px', fontWeight: 700 }}
                    >
                      {item.id === 'v1' ? '1' : '2'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{item.label}</span>
                      <span className="text-muted-foreground block truncate" style={{ fontSize: '9px' }}>
                        {item.desc}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border/60 my-2 mx-2" />

            <p className="text-muted-foreground px-2 pt-0.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em' }}>
              FILTER EXPERIENCE
            </p>
            <p className="text-muted-foreground/60 px-2 pb-1.5 mt-0.5" style={{ fontSize: '9px', fontWeight: 400 }}>
              Switch layout for Inbox &amp; Matches filters
            </p>
            <div className="flex flex-col gap-0.5">
              {VERSION_ITEMS.map((item) => {
                const isActive = filterExperienceVersion === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onFilterExperienceVersionChange(item.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'min-w-[22px] h-[20px] rounded-md flex items-center justify-center shrink-0 px-1',
                        isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}
                      style={{ fontSize: '9px', fontWeight: 700 }}
                    >
                      {item.id === 'option1'
                        ? '1'
                        : item.id === 'option2'
                          ? '2'
                          : item.id === 'option3'
                            ? '3'
                            : item.id === 'option4'
                              ? '4'
                              : item.id === 'option5'
                                ? '5'
                                : '?'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{item.label}</span>
                      <span className="text-muted-foreground block truncate" style={{ fontSize: '9px' }}>
                        {item.desc}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border/60 my-2 mx-2" />

            {/* ── Current User Persona ── */}
            <p className="text-muted-foreground px-2 pt-0.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em' }}>
              SIMULATE CURRENT USER
            </p>
            <p className="text-muted-foreground/60 px-2 pb-1.5 mt-0.5" style={{ fontSize: '9px', fontWeight: 400 }}>
              Affects income currency, location filters &amp; religion defaults
            </p>
            <div className="flex flex-col gap-0.5">
              {USER_PERSONAS.map((persona) => {
                const isActive = currentPersona.id === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => onPersonaChange?.(persona)}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'min-w-[22px] h-[20px] rounded-md flex items-center justify-center shrink-0 px-1 text-base leading-none',
                        isActive ? 'bg-primary/10' : 'bg-muted'
                      )}
                    >
                      {persona.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{persona.displayName}</span>
                      <span className="text-muted-foreground block truncate" style={{ fontSize: '9px' }}>
                        {persona.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border/60 my-2 mx-2" />

            {/* ── Filter Tabs toggle ── */}
            <button
              type="button"
              onClick={() => onShowFilterTabsChange?.(!showFilterTabs)}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors',
                showFilterTabs ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
              )}
              aria-pressed={showFilterTabs}
            >
              <span
                className={cn(
                  'min-w-[22px] h-[20px] rounded-md flex items-center justify-center shrink-0 px-1',
                  showFilterTabs ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                )}
                style={{ fontSize: '9px', fontWeight: 700 }}
              >
                TAB
              </span>
              <div className="flex-1 min-w-0">
                <span style={{ fontSize: '11px', fontWeight: 600 }}>Refine / Get more Matches tabs</span>
                <span className="text-muted-foreground block truncate" style={{ fontSize: '9px' }}>
                  Show segmented tab control in filter sheet header
                </span>
              </div>
              <div
                className={cn(
                  'w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0',
                  showFilterTabs ? 'bg-primary border-primary' : 'border-border'
                )}
                aria-hidden
              >
                {showFilterTabs && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>

            {/* ── Premium row style toggle ── */}
            <div className="flex flex-col gap-0.5">
              {(['chevron', 'badge'] as const).map((style) => {
                const isActive = premiumRowStyle === style;
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => onPremiumRowStyleChange?.(style)}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'min-w-[22px] h-[20px] rounded-md flex items-center justify-center shrink-0 px-1',
                        isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}
                      style={{ fontSize: '9px', fontWeight: 700 }}
                    >
                      {style === 'chevron' ? '›' : '👑'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>
                        {style === 'chevron' ? 'Premium — Crown + Chevron' : 'Premium — Badge at end'}
                      </span>
                      <span className="text-muted-foreground block truncate" style={{ fontSize: '9px' }}>
                        {style === 'chevron' ? '🔴 Label Count ›' : 'Label Count 🔴'}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Premium badge icon (crown vs lock) ── */}
            <div className="flex flex-col gap-0.5 mt-1">
              {(['crown', 'lock'] as const).map((glyph) => {
                const isActive = premiumIndicatorGlyph === glyph;
                return (
                  <button
                    key={glyph}
                    type="button"
                    onClick={() => onPremiumIndicatorGlyphChange?.(glyph)}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'min-w-[22px] h-[20px] rounded-md flex items-center justify-center shrink-0 px-1',
                        isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}
                      style={{ fontSize: '9px', fontWeight: 700 }}
                    >
                      {glyph === 'crown' ? '👑' : '🔒'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>
                        {glyph === 'crown' ? 'Premium badge: Crown' : 'Premium badge: Lock'}
                      </span>
                      <span className="text-muted-foreground block truncate" style={{ fontSize: '9px' }}>
                        {glyph === 'crown'
                          ? 'Red circle + crown in filter rows and left nav'
                          : 'Lock only (no circle) in filter rows and left nav'}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Premium lock prompt (floating card vs nested sheet) ── */}
            <div className="flex flex-col gap-0.5 mt-1">
              {(['floating-card', 'nested-bottom-sheet'] as const).map((mode) => {
                const isActive = premiumLockPromptPresentation === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onPremiumLockPromptPresentationChange?.(mode)}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'min-w-[22px] h-[20px] rounded-md flex items-center justify-center shrink-0 px-1',
                        isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}
                      style={{ fontSize: '9px', fontWeight: 700 }}
                    >
                      {mode === 'floating-card' ? '▢' : '▭'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>
                        {mode === 'floating-card'
                          ? 'Premium prompt: Floating card'
                          : 'Premium prompt: Nested bottom sheet'}
                      </span>
                      <span className="text-muted-foreground block truncate" style={{ fontSize: '9px' }}>
                        {mode === 'floating-card'
                          ? 'Red-bordered card over the right pane (current)'
                          : 'Extra dim + sheet on top of the filter sheet; no red frame'}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border/60 my-2 mx-2" />

            <button
              type="button"
              onClick={() => onUseInboxSimulationChange?.(!useInboxSimulation)}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors',
                useInboxSimulation ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
              )}
              aria-pressed={useInboxSimulation}
            >
              <span
                className={cn(
                  'min-w-[22px] h-[20px] rounded-md flex items-center justify-center shrink-0 px-1',
                  useInboxSimulation ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                )}
                style={{ fontSize: '9px', fontWeight: 700 }}
              >
                500
              </span>
              <div className="flex-1 min-w-0">
                <span style={{ fontSize: '11px', fontWeight: 600 }}>High-appeal males (500 inbox)</span>
                <span className="text-muted-foreground block truncate" style={{ fontSize: '9px' }}>
                  Replace inbox with a realistic 500-profile simulation for testing filters
                </span>
              </div>
              <div
                className={cn(
                  'w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0',
                  useInboxSimulation ? 'bg-primary border-primary' : 'border-border'
                )}
                aria-hidden
              >
                {useInboxSimulation && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
