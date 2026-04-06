import React from 'react';
import { cn } from '../../utils/cn';

export interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, id, ...props }, ref) => {
    // We need an ID for the label association, generate one if not provided (simple version)
    const inputId = id || `floating-input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            "peer flex w-full border border-input bg-transparent px-5 py-2 text-sm ring-offset-background placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            "h-12",
            "rounded-[16px]", // Reduced to 16px
            className
          )}
          placeholder={label} // Placeholder matches label for the peer-placeholder-shown logic
          ref={ref}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-5 top-1/2 -translate-y-1/2 z-10 origin-[0] scale-100 transform cursor-text text-sm text-muted-foreground duration-200",
            // Floating state (Focus or Not Placeholder Shown)
            "peer-focus:left-[14px] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-90 peer-focus:text-primary peer-focus:px-2 peer-focus:bg-background",
            "peer-[:not(:placeholder-shown)]:left-[14px] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:bg-background"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };