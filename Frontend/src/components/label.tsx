// components/ui/label.tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils/utils"

// Label component that wraps Radix's LabelPrimitive
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn("text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  )
})
Label.displayName = "Label"

export { Label }
