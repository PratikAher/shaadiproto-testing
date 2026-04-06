import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const selectChipVariants = cva(
  "inline-flex items-center rounded-full border transition-colors cursor-pointer select-none whitespace-nowrap",
  {
    variants: {
      selected: {
        true: "border-primary bg-primary/10 text-primary font-medium hover:bg-primary/20",
        false: "border-border bg-background text-foreground font-normal hover:bg-muted",
      },
      size: {
        sm: "h-8 text-xs px-3 gap-2",
        md: "h-9 text-sm px-4 gap-2.5",
      },
    },
    defaultVariants: {
      selected: false,
      size: "md",
    },
  }
);

export interface SelectChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof selectChipVariants> {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

const SelectChip = React.forwardRef<HTMLDivElement, SelectChipProps>(
  ({ className, selected = false, size, label, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(selectChipVariants({ selected, size }), className)}
        onClick={onClick}
        {...props}
      >
        {/* Radio/Check indicator */}
        <span
          className={cn(
            "shrink-0 flex items-center justify-center rounded-full border-2 transition-colors",
            size === "sm" ? "w-4 h-4" : "w-[18px] h-[18px]",
            selected
              ? "border-primary bg-primary"
              : "border-muted-foreground/40 bg-transparent"
          )}
        >
          {selected && (
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"}
            >
              <path
                d="M2.5 6L5 8.5L9.5 3.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span>{label}</span>
      </div>
    );
  }
);
SelectChip.displayName = "SelectChip";

export { SelectChip, selectChipVariants };
