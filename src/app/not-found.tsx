import Link from "next/link";
import { Layers, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <div className="relative flex flex-col items-center gap-6">
                {/* Logo */}
                <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-xl)] bg-primary shadow-lg shadow-primary/30">
                    <Layers className="h-7 w-7 text-white" aria-hidden="true" />
                </div>

                {/* 404 */}
                <div>
                    <p className="text-8xl font-black text-foreground/10 select-none leading-none">
                        404
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-foreground">
                        Page not found
                    </h1>
                    <p className="mt-2 text-sm text-foreground-muted max-w-xs mx-auto">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* CTA */}
                <Link
                    href="/accounts"
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
