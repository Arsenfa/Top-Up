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
          <label htmlFor={id} className="text-sm font-medium text-text-secondary">
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
            className={`w-full px-4 py-3 bg-bg-primary border rounded-xl text-sm text-text-primary transition-colors duration-200 outline-none
              ${icon ? "pl-11" : ""}
              ${rightIcon ? "pr-11" : ""}
              ${error ? "border-danger focus:border-danger" : "border-border-color focus:border-accent"}
              disabled:opacity-50 disabled:cursor-not-allowed
              placeholder:text-text-muted
              autofill:bg-bg-primary autofill:text-text-primary
              autofill:shadow-[inset_0_0_0_30px_#0A0B0D] autofill:text-fill-text-primary
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
