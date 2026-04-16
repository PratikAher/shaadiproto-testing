import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { Chip } from './Chip';
import { FilterIcon } from './icons/index';

export interface FilterItem {
  id: string;
  label: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** If provided, chip acts like an action (doesn't change selection). */
  onClick?: () => void;
}

interface FilterBarProps {
  className?: string;
  filters?: FilterItem[];
  showIcon?: boolean;
  selectedId?: string;
  onSelect?: (id: string) => void;
  onFilterClick?: () => void;
  activeFilterCount?: number;
  /** When true, the filter button is non-interactive and shown in a muted style (e.g. Daily chip on Matches). */
  filterButtonDisabled?: boolean;
}

const DEFAULT_FILTERS = [
  { id: 'new', label: 'New (2)' },
  { id: 'daily', label: 'Daily (14)' },
  { id: 'matches', label: 'My Matches (487)' },
  { id: 'near', label: 'Near Me (12)' },
  { id: 'more', label: 'More Matches (722)' },
];

export const FilterBar = ({
  className,
  filters = DEFAULT_FILTERS,
  showIcon = true,
  selectedId,
  onSelect,
  onFilterClick,
  activeFilterCount = 0,
  filterButtonDisabled = false,
}: FilterBarProps) => {
  const [internalSelected, setInternalSelected] = useState(filters[0]?.id);
  
  const currentSelected = selectedId || internalSelected;
  const filterActiveVisual = !filterButtonDisabled && activeFilterCount > 0;

  const handleSelect = (id: string) => {
    setInternalSelected(id);
    onSelect?.(id);
  };

  // Update selection if filters change and current selection is no longer valid
  React.useEffect(() => {
    if (filters.length > 0) {
      const isSelectedValid = filters.some(f => f.id === currentSelected);
      if (!isSelectedValid) {
        const firstId = filters[0].id;
        setInternalSelected(firstId);
        onSelect?.(firstId);
      }
    }
  }, [filters, currentSelected, onSelect]);

  return (
    <div className={cn("sticky top-0 z-40 bg-background w-full", className)}>
      <div className="relative w-full flex items-center pt-0 pb-2">
        {/* Scrollable Chips Area */}
        <div className={cn(
          "flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 w-full no-scrollbar",
          showIcon ? "pl-[60px]" : ""
        )}>
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              iconLeft={filter.iconLeft}
              iconRight={filter.iconRight}
              selected={currentSelected === filter.id}
              onClick={() => (filter.onClick ? filter.onClick() : handleSelect(filter.id))}
            />
          ))}
        </div>

        {/* Sticky Filter Icon with Gradient Mask */}
        {showIcon && (
          <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-4 w-[58px] bg-gradient-to-r from-background from-90% to-transparent pointer-events-none pb-2">
            <button
              type="button"
              disabled={filterButtonDisabled}
              onClick={onFilterClick}
              aria-label={filterButtonDisabled ? 'Filters unavailable for Daily matches' : 'Open filters'}
              className={cn(
                "h-8 w-8 rounded-full border flex items-center justify-center bg-background pointer-events-auto transition-colors",
                filterButtonDisabled
                  ? "cursor-not-allowed border-muted bg-muted disabled:opacity-100"
                  : filterActiveVisual
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
              )}
            >
              <FilterIcon
                className={cn(
                  "w-4 h-4 translate-y-[0.5px]",
                  filterButtonDisabled
                    ? "text-muted-foreground"
                    : filterActiveVisual
                      ? "text-primary"
                      : "text-foreground"
                )}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
