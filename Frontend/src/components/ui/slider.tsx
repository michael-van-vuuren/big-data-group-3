"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  trackColor?: string
  trackBgColor?: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, trackColor = "bg-black", trackBgColor, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    {/* unfilled track with linear gradient */}
    <SliderPrimitive.Track
      className={cn(
        "relative h-3 w-full grow overflow-hidden border-2 border-black",
        trackBgColor,
        "bg-gradient-to-r from-green-400 via-yellow-300 to-red-500"
      )}
    >
      {/* filled track overlay */}
      <SliderPrimitive.Range className={cn("absolute h-full")} />
    </SliderPrimitive.Track>

    {/* thumb */}
    <SliderPrimitive.Thumb
      className={cn(
        "block h-4 w-4 bg-pink-400 border-black border-2",
        "hover:scale-125 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50"
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
