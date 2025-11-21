import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-slate-900",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-blue-400",
        outline:
          "border border-slate-600 text-white hover:bg-slate-800/60 focus-visible:ring-blue-400",
        ghost:
          "text-blue-300 hover:bg-slate-800/60 focus-visible:ring-blue-400",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-5 py-2.5 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export function AButton({ asChild, className, variant, size, ...props }) {
  const Comp = asChild ? "span" : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export default AButton;
