import React from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ children, className = "", variant = "neutral", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border";

  const variants = {
    neutral: "bg-bg-tertiary border-border-color text-text-secondary",
    primary: "bg-accent/10 border-accent/20 text-accent",
    success: "bg-success/10 border-success/20 text-success",
    warning: "bg-warning/10 border-warning/20 text-warning",
    danger: "bg-danger/10 border-danger/20 text-danger",
    info: "bg-info/10 border-info/20 text-info",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
