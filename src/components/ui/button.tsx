import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    // Base styles
    [
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)]",
        "text-sm font-medium transition-all duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        "select-none cursor-pointer",
    ],
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.98]",
                secondary:
                    "bg-surface text-foreground border border-border hover:bg-surface-elevated active:scale-[0.98]",
                outline:
                    "border border-border bg-transparent text-foreground hover:bg-surface active:scale-[0.98]",
                ghost:
                    "bg-transparent text-foreground hover:bg-surface active:scale-[0.98]",
                destructive:
                    "bg-error text-white hover:bg-red-700 active:scale-[0.98]",
                link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
            },
            size: {
                sm: "h-8 px-3 text-xs",
                md: "h-10 px-4 text-sm",
                lg: "h-12 px-6 text-base",
                icon: "h-10 w-10 p-0",
                "icon-sm": "h-8 w-8 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            isLoading = false,
            loadingText,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                disabled={disabled ?? isLoading}
                aria-busy={isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                        <span>{loadingText ?? children}</span>
                    </>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
