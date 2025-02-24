"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  trackColor?: string; // accept custom track color for the filled portion
  trackBgColor?: string; // accept custom color for the unfilled background
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, trackColor = "bg-main", trackBgColor = "bg-gray-300", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    {/* unfilled track */}
    <SliderPrimitive.Track
      className={cn(
        "relative h-3 w-full grow overflow-hidden rounded-full border-2 border-slate-200 dark:border-slate-800",
        trackBgColor // apply background color
      )}
    >
      {/* filled track */}
      <SliderPrimitive.Range className={cn("absolute h-full", trackColor)} />
    </SliderPrimitive.Track>

    {/* thumb */}
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-slate-200 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
