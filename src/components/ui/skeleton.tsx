import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle" | "text";
}

export function Skeleton({ className = "", variant = "rectangle", ...props }: SkeletonProps) {
  const baseStyles = "animate-pulse bg-bg-tertiary";

  const variants = {
    rectangle: "rounded-xl",
    circle: "rounded-full",
    text: "h-3.5 w-full rounded-md",
  };

  return <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />;
}
