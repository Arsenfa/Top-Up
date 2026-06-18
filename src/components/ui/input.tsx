import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, icon, rightIcon, id, type = "text", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-text-secondary pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            type={type}
            className={`w-full px-4 py-3 bg-bg-secondary border rounded-xl text-sm text-text-primary transition-all duration-200 outline-none
              ${icon ? "pl-11" : ""} 
              ${rightIcon ? "pr-11" : ""} 
              ${error ? "border-danger focus:ring-2 focus:ring-danger/20" : "border-border-color focus:border-accent focus:ring-2 focus:ring-accent/20"}
              disabled:opacity-50 disabled:cursor-not-allowed
              placeholder:text-text-secondary/50
              ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-text-secondary flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-secondary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
