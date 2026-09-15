"use client";

import * as React from "react";
import { BookOpen, Search, Filter, Upload, Sparkles } from "lucide-react";

export default function ContentLibraryPage() {
    return (
        <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 lg:p-8" style={{ background: "var(--background)" }}>

            {/* ── Header ── */}
            <div className="mb-4">
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2"
                    style={{ background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.25)", color: "#f472b6" }}
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>MEDIA</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--foreground-color)" }}>
                    Content{" "}
                    <span style={{ background: "linear-gradient(135deg,#ec4899,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Library
                    </span>
                </h1>
                <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
                    Manage all your videos, images and media assets.
                </p>
            </div>

            {/* ── Search & Filter bar ── */}
            <div className="flex gap-3 mb-4">
                <div
                    className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5"
                    style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}
                >
                    <Search className="h-4 w-4 shrink-0" style={{ color: "var(--foreground-muted)" }} />
                    <input
                        placeholder="Search content..."
                        className="flex-1 text-sm outline-none bg-transparent"
                        style={{ color: "var(--foreground-color)" }}
                    />
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95"
                    style={{
                        background: "rgba(236,72,153,0.1)",
                        border: "1px solid rgba(236,72,153,0.2)",
                        color: "#f472b6",
                    }}
                >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* ── Empty state ── */}
            <div
                className="flex flex-col items-center justify-center flex-1 rounded-2xl py-20"
                style={{
                    background: "var(--surface)",
                    border: "2px dashed rgba(236,72,153,0.2)",
                }}
            >
                <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
                    style={{
                        background: "linear-gradient(135deg, #ec4899, #a78bfa)",
                        boxShadow: "0 8px 28px rgba(236,72,153,0.35)",
                    }}
                >
                    <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-lg font-black mb-2" style={{ color: "var(--foreground-color)" }}>Your library is empty</h2>
                <p className="text-sm text-center max-w-sm mb-6 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                    Upload your first video or image to get started building your content library.
                </p>
                <button
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
                    style={{
                        background: "linear-gradient(135deg, #ec4899, #a78bfa)",
                        boxShadow: "0 4px 18px rgba(236,72,153,0.4)",
                    }}
                >
                    <Upload className="h-4 w-4" />
                    <span>Upload Content</span>
                </button>
            </div>
        </div>
    );
}

