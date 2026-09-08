import * as React from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChipProps {
    label: string;
    onRemove?: () => void;
    className?: string;
}

export function Chip({ label, onRemove, className }: ChipProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1",
                "rounded-full text-xs font-medium",
                "bg-surface-elevated border border-border text-foreground",
                "transition-colors duration-100",
                className
            )}
        >
            #{label}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Remove hashtag ${label}`}
                    className={cn(
                        "rounded-full p-0.5 -mr-0.5",
                        "text-muted hover:text-foreground hover:bg-border",
                        "transition-colors duration-100",
                        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                    )}
                >
                    <X className="h-3 w-3" aria-hidden="true" />
                </button>
            )}
        </span>
    );
}

interface AddChipProps {
    onAdd: (tag: string) => void;
    className?: string;
}

export function AddChip({ onAdd, className }: AddChipProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleAdd = () => {
        const tag = value.trim().replace(/^#/, "");
        if (tag) onAdd(tag);
        setValue("");
        setIsEditing(false);
    };

    React.useEffect(() => {
        if (isEditing) inputRef.current?.focus();
    }, [isEditing]);

    if (isEditing) {
        return (
            <span className={cn("inline-flex items-center", className)}>
                <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleAdd(); }
                        if (e.key === "Escape") { setValue(""); setIsEditing(false); }
                    }}
                    onBlur={handleAdd}
                    placeholder="tag"
                    className={cn(
                        "h-7 w-24 rounded-full px-2.5 text-xs",
                        "border border-primary bg-surface text-foreground",
                        "focus:outline-none focus:ring-1 focus:ring-primary"
                    )}
                    maxLength={30}
                />
            </span>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="Add hashtag"
            className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1",
                "rounded-full text-xs font-medium",
                "border border-dashed border-border text-foreground-muted",
                "hover:border-primary hover:text-primary",
                "transition-colors duration-100",
                "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                className
            )}
        >
            <Plus className="h-3 w-3" aria-hidden="true" />
            Add tag
        </button>
    );
}
