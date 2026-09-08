import * as React from "react";
import { BookOpen, Search, Filter, Upload } from "lucide-react";

export default function ContentLibraryPage() {
    return (
        <div className="flex flex-col flex-1 min-h-0 p-6" style={{ background: "#F5F3FF" }}>
            <div className="mb-6">
                <p className="text-sm font-medium mb-1" style={{ color: "#6C5CE7" }}>Media</p>
                <h1 className="text-2xl font-black text-gray-900">
                    Content <span style={{ color: "#6C5CE7" }}>Library</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage all your videos, images and media assets.</p>
            </div>

            <div className="flex gap-3 mb-6">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-gray-100">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input placeholder="Search content..." className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-100">
                    <Filter className="h-4 w-4" /> Filter
                </button>
            </div>

            <div
                className="flex flex-col items-center justify-center flex-1 rounded-2xl bg-white py-20"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "2px dashed rgba(108,92,231,0.25)" }}
            >
                <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
                    style={{ background: "linear-gradient(135deg, #6C5CE7, #a29bfe)", boxShadow: "0 8px 24px rgba(108,92,231,0.35)" }}
                >
                    <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-lg font-black text-gray-900 mb-2">Your library is empty</h2>
                <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                    Upload your first video or image to get started.
                </p>
                <button
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #6C5CE7, #a29bfe)", boxShadow: "0 4px 14px rgba(108,92,231,0.4)" }}
                >
                    <Upload className="h-4 w-4" /> Upload Content
                </button>
            </div>
        </div>
    );
}
