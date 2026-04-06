import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export interface FloatingLabelSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  required?: boolean;
  className?: string;
}

const FloatingLabelSelect = ({
  label,
  value,
  options,
  onChange,
  required,
  className,
}: FloatingLabelSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasValue = value.length > 0;
  const displayLabel = required ? `${label} *` : label;

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center border border-input bg-transparent px-5 text-sm ring-offset-background transition-all',
          'h-12 rounded-[16px]',
          open
            ? 'ring-2 ring-ring ring-offset-2 border-primary'
            : 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
      >
        <span
          className={cn(
            'flex-1 text-left truncate',
            hasValue ? 'text-foreground' : 'text-transparent'
          )}
          style={{ fontSize: '14px' }}
        >
          {hasValue ? value : displayLabel}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground shrink-0 ml-2 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Floating label */}
      <span
        className={cn(
          'absolute left-5 z-10 origin-[0] pointer-events-none text-sm text-muted-foreground transition-all duration-200',
          hasValue || open
            ? 'left-[14px] top-0 -translate-y-1/2 scale-90 px-2 bg-background'
            : 'top-1/2 -translate-y-1/2 scale-100',
          open && 'text-primary'
        )}
      >
        {displayLabel}
      </span>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-popover border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto scrollbar-hide"
            style={{ transformOrigin: 'top' }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-accent/50 transition-colors flex items-center justify-between text-sm"
              >
                <span
                  className={
                    value === opt
                      ? 'text-primary font-medium'
                      : 'text-foreground'
                  }
                >
                  {opt}
                </span>
                {value === opt && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

FloatingLabelSelect.displayName = 'FloatingLabelSelect';

export { FloatingLabelSelect };