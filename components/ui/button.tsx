import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva("admin-btn", {
  variants: {
    variant: {
      default: "",
      navy: "",
      outline: "is-outline",
      ghost: "is-ghost",
      danger: "is-danger",
    },
    size: {
      default: "",
      sm: "is-sm",
      lg: "is-lg",
      icon: "is-icon",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
