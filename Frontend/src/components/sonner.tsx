"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      style={{ fontFamily: "inherit", overflowWrap: "anywhere" }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "bg-white text-black border-black border-2 font-heading shadow-shadow rounded-base text-[13px] flex items-center gap-2.5 p-4 w-[386px] [&:has(button)]:justify-between dark:bg-slate-950 dark:text-slate-50 dark:border-slate-800",
          description: "!font-medium !text-black",
          actionButton:
            "font-base border-2 text-[12px] h-6 px-2 bg-black text-white border-black hover:bg-white hover:text-black rounded-base shrink-0 dark:border-slate-800",
          cancelButton:
            "font-base border-2 text-[12px] h-6 px-2 bg-secondary-background text-slate-950 border-slate-200 rounded-base shrink-0 dark:text-slate-50 dark:border-slate-800",
          error: "bg-white text-black",
          loading:
            "[&[data-sonner-toast]_[data-icon]]:flex [&[data-sonner-toast]_[data-icon]]:size-4 [&[data-sonner-toast]_[data-icon]]:relative [&[data-sonner-toast]_[data-icon]]:justify-start [&[data-sonner-toast]_[data-icon]]:items-center [&[data-sonner-toast]_[data-icon]]:flex-shrink-0",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
