"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full font-base data-[panel-group-direction=vertical]:flex-col",
      className,
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      // base
      "relative flex items-center justify-center bg-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-1 dark:bg-slate-800",
      
      // horizontal layout
      "w-1 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",

      // vertical layout
      "data-[panel-group-direction=vertical]:h-0.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",

      "[&[data-panel-group-direction=vertical]>div]:rotate-90",

      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex items-center justify-center w-4 h-8 bg-darkerBlue border-2 border-black">
        <GripVertical className="h-4 w-4 text-white" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)




export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
