import { cn } from "cn";
import type { ComponentProps } from "react";
import { Button as ShadcnButton } from "@/components/ui/button";

/**
 * Button — the single source of truth for actionable buttons.
 *
 * Wraps the shadcn/ui Button and exposes the two variants used across the
 * design so styling stays consistent everywhere an action is rendered:
 *   - "primary" → solid lime pill (main calls-to-action, e.g. "View Work")
 *   - "outline" → transparent pill with a subtle border (secondary, e.g. "Resume")
 */
type ButtonProps = Omit<ComponentProps<typeof ShadcnButton>, "variant"> & {
  variant?: "primary" | "outline";
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variant === "primary" ? "default" : "outline"}
      className={cn(
        // Shared pill shape + uppercase mono label to match the design
        "h-auto rounded-full px-7 py-3 font-mono text-xs font-semibold tracking-[0.2em] uppercase",
        variant === "primary" &&
          "bg-lime text-lime-foreground hover:brightness-95 dark:hover:brightness-105",
        variant === "outline" &&
          "border-border bg-transparent text-foreground hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}
