import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const chipVariants = cva(
  "inline-flex items-center justify-center rounded-full border transition-colors cursor-pointer select-none whitespace-nowrap leading-none",
  {
    variants: {
      selected: {
        true: "border-primary bg-primary/10 text-primary font-medium hover:bg-primary/20",
        false: "border-border bg-background text-foreground font-normal hover:bg-muted",
      },
      size: {
        xs: "h-5 text-[10px] px-2 gap-1",
        sm: "h-7 text-xs px-3 gap-1.5",
        md: "h-8 text-sm px-3 gap-[5px] pt-px",
      },
    },
    defaultVariants: {
      selected: false,
      size: "md",
    },
  }
);

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof chipVariants> {
  label: string;
  /** Secondary line (e.g. income band under Financial Status). */
  description?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: () => void;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, selected, size, label, description, iconLeft, iconRight, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          chipVariants({ selected, size }),
          description && 'h-auto min-h-8 max-w-[min(100%,280px)] whitespace-normal py-2 items-start justify-start text-left',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {iconLeft && <span className="shrink-0 flex items-center justify-center">{iconLeft}</span>}
        {description ? (
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="leading-tight">{label}</span>
            <span className={cn('text-[10px] font-normal leading-snug', selected ? 'text-[#0AA4B8]/90' : 'text-[#9e9ea8]')}>
              {description}
            </span>
          </span>
        ) : (
          <span>{label}</span>
        )}
        {iconRight && <span className="shrink-0 flex items-center justify-center">{iconRight}</span>}
      </div>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };