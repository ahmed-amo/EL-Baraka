import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "admin-badge",
        className,
      )}
      {...props}
    />
  );
}
