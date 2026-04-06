import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm disabled:bg-primary-disabled disabled:text-primary-disabled-foreground disabled:shadow-none",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm disabled:bg-primary-disabled disabled:text-primary-disabled-foreground disabled:shadow-none",
        outline: "border border-input bg-background hover:bg-[rgba(10,164,184,0.10)] disabled:bg-secondary-disabled disabled:text-secondary-disabled-foreground disabled:border-secondary-disabled",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:bg-secondary-disabled disabled:text-secondary-disabled-foreground",
        ghost: "hover:bg-accent disabled:text-secondary-disabled-foreground",
        link: "underline-offset-4 hover:underline text-primary disabled:text-secondary-disabled-foreground",
      },
      size: {
        // Large: 48px height, 24px padding, 18px font
        lg: "h-12 px-6 text-lg",
        
        // Default: 44px height, 22px padding, 18px font
        default: "h-11 px-[22px] text-lg",
        
        // Medium: 40px height, 20px padding, 16px font (NEW)
        md: "h-10 px-5 text-base",
        
        // Small: 36px height, 18px padding, 14px font
        sm: "h-9 px-[18px] text-sm",
        
        // Icon: Square buttons matching heights
        icon: "h-11 w-11 p-0", // Default icon size matches default button height
        "icon-sm": "h-9 w-9 p-0",
        "icon-md": "h-10 w-10 p-0",
        "icon-lg": "h-12 w-12 p-0",
      },
      shape: {
        pill: "rounded-full",
        square: "rounded-md",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "pill",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };