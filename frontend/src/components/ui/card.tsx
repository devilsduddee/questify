import * as React from "react"

import { cn } from "@/utils/cn"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "scroll" | "boss" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground overflow-hidden relative",
      variant === "default" && "pixel-borders shadow-card border-border",
      variant === "scroll" && "bg-[#2D1B13] border-secondary shadow-glow-achievement pixel-borders",
      variant === "boss" && "border-destructive bg-destructive/10 shadow-glow-boss pixel-borders",
      className
    )}
    {...props}
  >
    {/* Decorative corners for scroll variant */}
    {variant === "scroll" && (
      <>
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />
      </>
    )}
    {/* Decorative corners for boss variant */}
    {variant === "boss" && (
      <>
        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-destructive opacity-80" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-destructive opacity-80" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-destructive opacity-80" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-destructive opacity-80" />
      </>
    )}
    {props.children}
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-md md:p-lg", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-title-card font-semibold leading-none tracking-tight font-heading text-secondary text-glow",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-md md:p-lg pt-0 md:pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"


export { Card, CardHeader, CardTitle, CardDescription, CardContent }
