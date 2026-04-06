import React from 'react';
import { Tag } from 'lucide-react';
import { SelectChip } from './SelectChip';

export const SelectChipShowcase = () => {
  return (
    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Tag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">Select Chips</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Selection chips with a check indicator, used in onboarding and form flows.
        </p>
      </div>

      {/* Size 1 (32px) */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase text-muted-foreground">Size 1 (32px)</span>
        <div className="flex flex-wrap gap-3">
          <SelectChip size="sm" label="Myself" />
          <SelectChip size="sm" label="My Son" selected />
        </div>
      </div>

      {/* Size 2 (36px) */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase text-muted-foreground">Size 2 (36px)</span>
        <div className="flex flex-wrap gap-3">
          <SelectChip size="md" label="My Daughter" />
          <SelectChip size="md" label="My Sister" selected />
        </div>
      </div>
    </div>
  );
};
