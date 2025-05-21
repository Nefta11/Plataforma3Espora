import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-opacity duration-200">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "block w-full rounded-xl border-gray-200 shadow-sm transition-all duration-200",
              "placeholder:text-gray-400 text-gray-900",
              "focus:border-gray-300 focus:ring-4 focus:ring-gray-100",
              icon && "pl-11",
              error && "border-red-200 focus:border-red-300 focus:ring-red-50 animate-shake",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <div className="flex items-center gap-1 mt-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";