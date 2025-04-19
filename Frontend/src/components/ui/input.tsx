"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (type === "number") {
        e.currentTarget.blur()
      }
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full border-2 border-black bg-white px-3 py-2 text-sm text-text selection:bg-amber-400 selection:text-mtext focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-gray-400 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800",
          className,
        )}
        onWheel={handleWheel}
        ref={ref}
        {...props}
      />
    )
  },
)

Input.displayName = "Input"

export { Input }
