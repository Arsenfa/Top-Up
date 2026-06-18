import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered";
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  variant = "default",
  hoverable = false,
  ...props
}: CardProps) {
  const baseStyles = "rounded-2xl transition-colors duration-200 overflow-hidden";

  const variants = {
    default: "bg-bg-secondary border border-border-color",
    bordered: "bg-transparent border border-border-color",
  };

  const hoverStyles = hoverable ? "hover:border-accent/40" : "";

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 border-b border-border-color flex flex-col gap-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 border-t border-border-color bg-bg-tertiary/50 ${className}`} {...props}>
      {children}
    </div>
  );
}
