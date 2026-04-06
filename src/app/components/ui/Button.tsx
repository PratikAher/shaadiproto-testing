import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const buttonVariants = {
  variant: {
    default: "bg-black text-white hover:bg-black/90",
    destructive: "bg-red-500 text-white hover:bg-red-500/90",
    outline: "border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-900",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80",
    ghost: "hover:bg-neutral-100 text-neutral-900",
    link: "text-neutral-900 underline-offset-4 hover:underline",
  },
  size: {
    default: "h-12 px-6 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-14 rounded-full px-8 text-lg",
    icon: "h-12 w-12",
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const variantStyles = buttonVariants.variant[variant]
    const sizeStyles = buttonVariants.size[size]
    
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[16px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantStyles,
          sizeStyles,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
