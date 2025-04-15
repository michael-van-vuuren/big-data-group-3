import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center text-text justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-main border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
        whiteText:
          "bg-main text-white overflow-clip border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
        round:
          "w-10 h-10 flex items-center justify-center rounded-full border-2 border-border dark:border-darkBorder shadow-lightSm dark:shadow-darkSm hover:translate-x-boxShadowXSm hover:translate-y-boxShadowYSm hover:shadow-none dark:hover:shadow-none",
        noShadow:
          "bg-main border-2 border-border dark:border-darkBorder",
        heroButton:
          "text-white border-2 border-black dark:border-darkBorder hover:opacity-80 transition-translate duration-400 active:opacity-80",
        heroButtonSlide:
          "text-white border-2 border-black dark:border-darkBorder hover:-translate-y-1 transition-translate duration-400 active:opacity-80",
        link:
          "underline-offset-4 text-text dark:text-darkText hover:underline",
        neutral:
          "bg-white dark:bg-darkBg dark:text-darkText border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
        reverse:
          "bg-main border-2 border-border dark:border-darkBorder hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-light dark:hover:shadow-dark",
        logout:
          "bg-main border-2 border-b-8 rounded-none border-border hover:bg-darkerBlue hover:text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-6 w-6",
        logout: "py-4 px-4 mt-2"
      },
      active: {
        true: "translate-x-boxShadowX translate-y-boxShadowY shadow-none dark:shadow-none", // Apply translation instantly
        false: "",
      },
      activeSm: {
        true: "translate-x-boxShadowXSm translate-y-boxShadowYSm shadow-none dark:shadow-none", // Apply translation instantly
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      active: false,
      activeSm: false
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  active?: boolean;
  activeSm?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, color, active = false, activeSm = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const dynamicStyle = {
      backgroundColor: color,
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, active, activeSm, className }))}
        ref={ref}
        style={dynamicStyle}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
