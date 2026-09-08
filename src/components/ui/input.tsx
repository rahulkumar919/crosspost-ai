import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    description?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, label, description, id, ...props }, ref) => {
        const inputId = id ?? React.useId();

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-foreground"
                    >
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    type={type}
                    ref={ref}
                    aria-describedby={
                        error
                            ? `${inputId}-error`
                            : description
                                ? `${inputId}-desc`
                                : undefined
                    }
                    aria-invalid={!!error}
                    className={cn(
                        "h-10 w-full rounded-[var(--radius-md)] border border-border",
                        "bg-background px-3 py-2 text-sm text-foreground",
                        "placeholder:text-muted",
                        "transition-colors duration-150",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-error focus:ring-error",
                        className
                    )}
                    {...props}
                />
                {description && !error && (
                    <p id={`${inputId}-desc`} className="text-xs text-foreground-muted">
                        {description}
                    </p>
                )}
                {error && (
                    <p id={`${inputId}-error`} role="alert" className="text-xs text-error">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
    description?: string;
    showCharCount?: boolean;
    maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        { className, error, label, description, id, showCharCount, maxLength, value, ...props },
        ref
    ) => {
        const inputId = id ?? React.useId();
        const charCount =
            typeof value === "string" ? value.length : 0;

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-foreground"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    id={inputId}
                    ref={ref}
                    maxLength={maxLength}
                    value={value}
                    aria-describedby={
                        error
                            ? `${inputId}-error`
                            : description
                                ? `${inputId}-desc`
                                : undefined
                    }
                    aria-invalid={!!error}
                    className={cn(
                        "w-full rounded-[var(--radius-md)] border border-border",
                        "bg-background px-3 py-2 text-sm text-foreground",
                        "placeholder:text-muted resize-none",
                        "transition-colors duration-150",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-error focus:ring-error",
                        className
                    )}
                    {...props}
                />
                <div className="flex justify-between items-center">
                    {description && !error && (
                        <p id={`${inputId}-desc`} className="text-xs text-foreground-muted">
                            {description}
                        </p>
                    )}
                    {error && (
                        <p id={`${inputId}-error`} role="alert" className="text-xs text-error">
                            {error}
                        </p>
                    )}
                    {showCharCount && maxLength && (
                        <p
                            className={cn(
                                "text-xs ml-auto",
                                charCount >= maxLength * 0.9
                                    ? "text-warning"
                                    : "text-foreground-muted"
                            )}
                        >
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
