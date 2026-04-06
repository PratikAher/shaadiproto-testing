import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../Button';
import { CrownFilledIcon } from '../icons';
import type { SortOption, InboxFilterState } from './InboxSubHeader';
import { FILTER_LABELS, EMPTY_FILTERS } from './InboxSubHeader';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface InboxFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InboxFilterState;
  onFiltersChange: (filters: InboxFilterState) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  matchCount: number;
  isCurrentUserPremium: boolean;
  onPremiumUpgrade?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter & Sort definitions
// ─────────────────────────────────────────────────────────────────────────────

interface FilterDef {
  key: keyof InboxFilterState;
  label: string;
  isPremium: boolean;
}

const INBOX_FILTERS: FilterDef[] = [
  { key: 'premiumUsers', label: 'Premium Users', isPremium: true },
  { key: 'income', label: 'Income', isPremium: false },
  { key: 'onlineNow', label: 'Online Profiles', isPremium: true },
  { key: 'withPhotos', label: 'Photos', isPremium: true },
  { key: 'verified', label: 'Verified', isPremium: true },
  { key: 'location', label: 'Location', isPremium: true },
  { key: 'religion', label: 'Religion', isPremium: false },
  { key: 'career', label: 'Career', isPremium: false },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Checkbox component
// ─────────────────────────────────────────────────────────────────────────────

const Checkbox = ({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={cn(
      "w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors shrink-0",
      checked
        ? "bg-[#0AA4B8] border-[#0AA4B8]"
        : "bg-white border-[#c4c4c4]",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    {checked && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// Radio component
// ─────────────────────────────────────────────────────────────────────────────

const Radio = ({ selected, onSelect }: { selected: boolean; onSelect: () => void }) => (
  <button
    onClick={onSelect}
    className={cn(
      "w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
      selected ? "border-[#0AA4B8]" : "border-[#c4c4c4]"
    )}
  >
    {selected && <div className="w-[10px] h-[10px] rounded-full bg-[#0AA4B8]" />}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export const InboxFilterSheet = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  sortOption,
  onSortChange,
  matchCount,
  isCurrentUserPremium,
  onPremiumUpgrade,
}: InboxFilterSheetProps) => {
  const activeCount = Object.values(filters).filter(Boolean).length;

  const handleFilterToggle = (key: keyof InboxFilterState, isPremium: boolean) => {
    // If premium filter and user is not premium, trigger upgrade
    if (isPremium && !isCurrentUserPremium) {
      onPremiumUpgrade?.();
      return;
    }
    onFiltersChange({ ...filters, [key]: !filters[key] });
  };

  const handleClearAll = () => {
    onFiltersChange(EMPTY_FILTERS);
    onSortChange('recommended');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 z-[51]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[52] overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.9 }}
          >
            {/* Handle + Header */}
            <div className="flex flex-col items-center pt-2 pb-0">
              {/* Drag handle */}
              <div className="w-9 h-1 rounded-full bg-[#d9d9d9] mb-3" />

              {/* Header row */}
              <div className="flex items-center justify-between w-full px-4 pb-3">
                <h2
                  className="text-[18px] font-bold text-[#41404D]"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  Sort & Filter
                </h2>
                <div className="flex items-center gap-3">
                  {activeCount > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-[13px] font-medium text-[#0AA4B8]"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-full bg-[#f1f1f2] flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-[#72727D]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#e8e8eb] mx-4" />

            {/* Two-column layout */}
            <div className="flex px-4 pt-4 pb-3 gap-6">
              {/* Left Column: Filters */}
              <div className="flex-1">
                <p
                  className="text-[11px] font-bold text-[#95959D] tracking-wider mb-3"
                  style={{ fontFamily: "'Roboto', sans-serif", letterSpacing: '0.06em' }}
                >
                  FILTERS
                </p>
                <div className="flex flex-col gap-0.5">
                  {INBOX_FILTERS.map((filter) => {
                    const isLocked = filter.isPremium && !isCurrentUserPremium;
                    const isActive = filters[filter.key];
                    return (
                      <button
                        key={filter.key}
                        onClick={() => handleFilterToggle(filter.key, filter.isPremium)}
                        className={cn(
                          "flex items-center gap-2.5 py-2 px-1 rounded-lg transition-colors text-left",
                          isActive && !isLocked ? "bg-[#0AA4B8]/5" : "hover:bg-[#f5f5f5]"
                        )}
                      >
                        {isLocked ? (
                          <div className="w-[18px] h-[18px] rounded-[4px] border-2 border-[#e0e0e0] bg-[#f5f5f5] flex items-center justify-center shrink-0">
                            <CrownFilledIcon className="w-3 h-3 text-[#ff5a60]" />
                          </div>
                        ) : (
                          <Checkbox
                            checked={isActive}
                            onChange={() => {}}
                          />
                        )}
                        <span
                          className={cn(
                            "text-[14px]",
                            isLocked ? "text-[#95959D]" : "text-[#41404D]"
                          )}
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          {filter.label}
                        </span>
                        {isLocked && (
                          <CrownFilledIcon className="w-3.5 h-3.5 text-[#ff5a60] ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vertical divider */}
              <div className="w-px bg-[#e8e8eb] self-stretch" />

              {/* Right Column: Sort By */}
              <div className="flex-1">
                <p
                  className="text-[11px] font-bold text-[#95959D] tracking-wider mb-3"
                  style={{ fontFamily: "'Roboto', sans-serif", letterSpacing: '0.06em' }}
                >
                  SORT BY
                </p>
                <div className="flex flex-col gap-0.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onSortChange(opt.value)}
                      className={cn(
                        "flex items-center gap-2.5 py-2 px-1 rounded-lg transition-colors text-left",
                        sortOption === opt.value ? "bg-[#0AA4B8]/5" : "hover:bg-[#f5f5f5]"
                      )}
                    >
                      <Radio
                        selected={sortOption === opt.value}
                        onSelect={() => {}}
                      />
                      <span
                        className={cn(
                          "text-[14px]",
                          sortOption === opt.value ? "text-[#0AA4B8] font-medium" : "text-[#41404D]"
                        )}
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="px-4 pb-6 pt-2">
              <Button
                variant="default"
                size="default"
                shape="pill"
                className="w-full gap-2"
                onClick={onClose}
              >
                See {matchCount} {matchCount === 1 ? 'Match' : 'Matches'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
