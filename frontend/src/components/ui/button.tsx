import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"

import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sound-hover sound-click hover:brightness-110 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 pixel-borders shadow-glow-quest shadow-button",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 pixel-borders shadow-glow-boss shadow-button",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground pixel-borders shadow-button",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 pixel-borders shadow-glow-achievement shadow-button",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-hover",
        link: "text-primary underline-offset-4 hover:underline transition-hover",
        pixel: "bg-primary text-white font-pixel text-xs pixel-borders hover:bg-primary/90 shadow-button",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-lg font-heading",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// Separate component for motion to avoid type conflicts with standard buttons
export const MotionButton = React.forwardRef<HTMLButtonElement, HTMLMotionProps<"button"> & VariantProps<typeof buttonVariants>>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      />
    )
  }
)
MotionButton.displayName = "MotionButton"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
