"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"
import { cn } from "@/lib/utils/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  trackColor?: string
  trackBgColor?: string
  discreteSteps?: number // Optional prop for controlling discrete steps
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, trackColor = "bg-black", trackBgColor, discreteSteps = 14, ...props }, ref) => {
  const stepSize = 100 / (discreteSteps - 1)
  // 20 tick marks
  const marks = Array.from({ length: discreteSteps }, (_, index) => ({
    value: index * stepSize,
    label: (index * (100 / (discreteSteps - 1))).toFixed(0), 
  }))
  
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      {/* unfilled track with linear gradient */}
      <SliderPrimitive.Track
        className={cn(
          "relative h-4 w-full grow overflow-hidden border-2 border-black",
          trackBgColor,
          "bg-gradient-to-r from-green-400 via-yellow-300 to-red-500"
        )}
      >
        {/* filled track overlay */}
        <SliderPrimitive.Range className={cn("absolute h-full")} />
      </SliderPrimitive.Track>

      {/* tick marks */}
      <div className="absolute w-full top-0 flex justify-between">
        {marks.map((mark) => (
          <div
            key={mark.value}
            className="h-4 w-0.5 bg-black"
            style={{ left: `${mark.value}%` }}
          />
        ))}
      </div>

      {/* thumb */}
      <SliderPrimitive.Thumb
        className={cn(
          "block h-6 w-6 bg-pink-400 border-black border-2",
          "hover:scale-125 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
      />
    </SliderPrimitive.Root>
  )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
