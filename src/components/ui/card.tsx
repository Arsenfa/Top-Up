import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered";
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  variant = "default",
  hoverable = false,
  ...props
}: CardProps) {
  const baseStyles = "rounded-2xl transition-all duration-300 overflow-hidden";
  
  const variants = {
    default: "bg-bg-secondary border border-border-color",
    glass: "glass",
    bordered: "bg-transparent border border-border-color",
  };

  const hoverStyles = hoverable
    ? "hover:translate-y-[-4px] hover:shadow-xl hover:shadow-black/20 hover:border-accent/40"
    : "";

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
    <div className={`p-5 border-b border-border-color/60 flex flex-col gap-1.5 ${className}`} {...props}>
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
    <div className={`p-5 border-t border-border-color/60 bg-black/10 ${className}`} {...props}>
      {children}
    </div>
  );
}
