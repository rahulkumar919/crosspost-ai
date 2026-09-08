"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";
import Image from "next/image";
import { Loader2, Sparkles, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    { icon: Sparkles, label: "AI-Powered Captions" },
    { icon: Globe, label: "Cross-Platform Publishing" },
    { icon: Zap, label: "Real-Time Status" },
];

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginPageInner />
        </Suspense>
    );
}

function LoginPageInner() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/accounts";
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const err = searchParams.get("error");
        if (err === "OAuthAccountNotLinked") {
            setError("This email is already linked to a different sign-in method.");
        } else if (err) {
            setError("Sign-in failed. Please try again.");
        }
    }, [searchParams]);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        await signIn("google", { callbackUrl });
    };

    return (
        <div className="flex min-h-dvh" style={{ background: "#F5F3FF" }}>

            {/* ── Left branding panel ─────────────────────────────────── */}
            <div
                className="hidden lg:flex lg:w-[50%] flex-col justify-between relative overflow-hidden"
                style={{ background: "linear-gradient(145deg, #0D0A2E 0%, #1a1040 50%, #0f0c35 100%)" }}
                aria-hidden="true"
            >
                {/* Ambient blobs */}
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(108,92,231,0.25)" }} />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full blur-3xl" style={{ background: "rgba(162,155,254,0.12)" }} />

                {/* Top logo */}
                <div className="relative px-10 pt-10">
                    <div className="flex items-center gap-3">
                        <div
                            className="relative h-9 w-9 rounded-xl overflow-hidden shrink-0"
                            style={{ boxShadow: "0 0 16px rgba(108,92,231,0.6)" }}
                        >
                            <Image src="/logo.png" alt="CrossPost AI" fill sizes="36px" className="object-cover" priority />
                        </div>
                        <span className="text-white font-black text-lg tracking-tight">
                            CrossPost <span style={{ color: "#a29bfe" }}>AI</span>
                        </span>
                    </div>
                </div>

                {/* Center hero */}
                <div className="relative px-10 py-8">
                    <div
                        className="relative h-[220px] w-[220px] mx-auto mb-8 rounded-3xl overflow-hidden"
                        style={{ boxShadow: "0 0 60px rgba(108,92,231,0.5), 0 0 120px rgba(108,92,231,0.2)" }}
                    >
                        <Image src="/logo.png" alt="CrossPost AI Logo" fill sizes="220px" className="object-cover" priority />
                    </div>

                    <div className="text-center">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                            style={{ background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)" }}
                        >
                            <Sparkles className="h-3.5 w-3.5" style={{ color: "#a29bfe" }} />
                            <span className="text-xs font-semibold" style={{ color: "#a29bfe" }}>AI-powered publishing</span>
                        </div>

                        <h1 className="text-3xl font-black text-white leading-tight mb-4">
                            Publish once,<br />
                            <span style={{ color: "#a29bfe" }}>reach everywhere.</span>
                        </h1>
                        <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
                            Create content once and let CrossPost AI adapt and publish it perfectly across all your platforms.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {features.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                            >
                                <Icon className="h-3.5 w-3.5" style={{ color: "#a29bfe" }} />
                                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative px-10 pb-8 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                    © 2026 CrossPost AI — All rights reserved
                </p>
            </div>

            {/* ── Right sign-in panel ──────────────────────────────────── */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">

                {/* Mobile logo */}
                <div className="mb-10 flex flex-col items-center gap-3 lg:hidden">
                    <div
                        className="relative h-20 w-20 rounded-3xl overflow-hidden"
                        style={{ boxShadow: "0 0 30px rgba(108,92,231,0.5)" }}
                    >
                        <Image src="/logo.png" alt="CrossPost AI" fill sizes="80px" className="object-cover" priority />
                    </div>
                    <span className="text-xl font-black text-gray-900">
                        CrossPost <span style={{ color: "#6C5CE7" }}>AI</span>
                    </span>
                </div>

                <div className="w-full max-w-sm">
                    {/* Heading */}
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-black text-gray-900">Welcome back 👋</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to your CrossPost AI dashboard
                        </p>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3">
                            <span className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            </span>
                            <p role="alert" className="text-xs text-red-600 leading-relaxed">{error}</p>
                        </div>
                    )}

                    {/* Google Sign-In Button */}
                    <button
                        type="button"
                        id="google-signin-btn"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className={cn(
                            "flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4",
                            "text-sm font-bold text-gray-800 bg-white",
                            "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400",
                            "disabled:opacity-60 disabled:pointer-events-none"
                        )}
                        style={{
                            border: "1.5px solid rgba(108,92,231,0.2)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                        ) : (
                            <GoogleIcon className="h-5 w-5" />
                        )}
                        <span>{isLoading ? "Redirecting to Google…" : "Continue with Google"}</span>
                    </button>

                    {/* Divider hint */}
                    <p className="mt-6 text-center text-xs text-gray-400">
                        Secure sign-in powered by Google OAuth 2.0
                    </p>

                    {/* Terms */}
                    <p className="mt-8 text-center text-xs text-gray-400">
                        By signing in, you agree to our{" "}
                        <span className="text-purple-500 font-semibold cursor-pointer hover:underline">Terms of Service</span>
                        {" "}and{" "}
                        <span className="text-purple-500 font-semibold cursor-pointer hover:underline">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
