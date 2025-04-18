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
        heart:
          "-ml-3 border-none bg-transparent",
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
  isFavorited?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, color, active = false, activeSm = false, asChild = false, isFavorited, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const dynamicStyle = {
      backgroundColor: color,
    };

    const isHeart = variant === "heart";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, active, activeSm }), className)}
        ref={ref}
        style={dynamicStyle}
        {...props}
      >
        {isHeart ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="#fbc"
            strokeWidth={1.5}
            className={cn(
              "w-9 h-9 transition-colors",
              isFavorited ? "text-rose-500 hover:text-white" : "text-white hover:text-rose-500",
              
            )}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
            2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
            4.5 2.09C13.09 3.81 14.76 3 16.5 3 
            19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
            11.54L12 21.35z"
            />
          </svg>


        ) : (
          props.children
        )}

      </Comp>
    );

  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
