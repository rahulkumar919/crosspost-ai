"use client";

import * as React from "react";
import Link from "next/link";
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
    Clock, Sparkles, Filter, CheckCircle2, AlertTriangle,
    RefreshCw, Film, Image as ImageIcon, X, Trash2, Edit3,
    ExternalLink, Check, Play, Globe, LayoutGrid, CalendarDays
} from "lucide-react";
import { useCalendarEvents, useUpcomingPosts, useScheduleMutations } from "@/hooks/useCalendar";
import { usePostHistory } from "@/hooks/usePostHistory";
import { YoutubeIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/platform-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CalendarEvent, UpcomingPost } from "@/lib/api/calendar.api";

type ViewMode = "MONTH" | "WEEK";

export default function ContentCalendarPage() {
    const [viewMode, setViewMode] = React.useState<ViewMode>("MONTH");
    const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
    const [platformFilter, setPlatformFilter] = React.useState<string>("ALL");
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

    // Queries
    const { data: eventsData, isLoading: isEventsLoading, refetch } = useCalendarEvents({
        platform: platformFilter,
    });
    const { data: upcomingData, isLoading: isUpcomingLoading } = useUpcomingPosts();
    const { scheduleMutation, updateMutation, cancelMutation } = useScheduleMutations();

    // Query library/history items for the media selector
    const { data: historyData } = usePostHistory({
        page: 1,
        limit: 20,
        status: "ALL",
        platform: "ALL",
        search: "",
    });

    const events = eventsData?.events || [];
    const upcoming = upcomingData?.upcoming || [];
    const libraryPosts = historyData?.posts || [];

    // Date Navigation Handlers
    const handlePrev = () => {
        if (viewMode === "MONTH") {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else {
            const prevWeek = new Date(currentDate);
            prevWeek.setDate(currentDate.getDate() - 7);
            setCurrentDate(prevWeek);
        }
    };

    const handleNext = () => {
        if (viewMode === "MONTH") {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        } else {
            const nextWeek = new Date(currentDate);
            nextWeek.setDate(currentDate.getDate() + 7);
            setCurrentDate(nextWeek);
        }
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const openScheduleForDate = (date: Date) => {
        setSelectedDate(date);
        setIsScheduleModalOpen(true);
    };

    const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 lg:p-8" style={{ background: "#F5F3FF" }}>
            {/* ── Top Header ────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-700 text-xs font-bold mb-2">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>CONTENT SCHEDULER & PIPELINE</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        Content <span style={{ color: "#6C5CE7" }}>Calendar</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Plan, schedule, and automate multi-channel publishing with platform-specific timing.
                    </p>
                </div>

                {/* Top Actions */}
                <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-white p-1 rounded-xl border border-purple-100 shadow-sm">
                        <button
                            onClick={() => setViewMode("MONTH")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                viewMode === "MONTH"
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            <span>Month</span>
                        </button>
                        <button
                            onClick={() => setViewMode("WEEK")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                viewMode === "WEEK"
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>Week</span>
                        </button>
                    </div>

                    {/* Schedule Post CTA */}
                    <button
                        onClick={() => openScheduleForDate(new Date())}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all"
                        style={{
                            background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                            boxShadow: "0 4px 14px rgba(108,92,231,0.35)",
                        }}
                    >
                        <Plus className="h-4 w-4" />
                        <span>Schedule Post</span>
                    </button>
                </div>
            </div>

            {/* ── Main Layout: Calendar + Upcoming Sidebar ──────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 flex-1 min-h-0">
                {/* Left: Main Calendar View */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-purple-100 flex flex-col min-h-0">
                    {/* Calendar Control Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100">
                        {/* Month/Week Label + Navigation */}
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg sm:text-xl font-black text-gray-900 mr-2 min-w-[170px]">
                                {monthName}
                            </h2>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handlePrev}
                                    className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleToday}
                                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Platform Filter */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700">
                                <Filter className="h-3.5 w-3.5 text-gray-400" />
                                <select
                                    value={platformFilter}
                                    onChange={(e) => setPlatformFilter(e.target.value)}
                                    className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
                                >
                                    <option value="ALL">All Platforms</option>
                                    <option value="YOUTUBE">YouTube</option>
                                    <option value="INSTAGRAM">Instagram</option>
                                    <option value="LINKEDIN">LinkedIn</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Body */}
                    <div className="flex-1 mt-4 min-h-0">
                        {viewMode === "MONTH" ? (
                            <MonthGridView
                                currentDate={currentDate}
                                events={events}
                                onSelectDate={openScheduleForDate}
                                onSelectEvent={(e) => setSelectedEvent(e)}
                            />
                        ) : (
                            <WeekGridView
                                currentDate={currentDate}
                                events={events}
                                onSelectDate={openScheduleForDate}
                                onSelectEvent={(e) => setSelectedEvent(e)}
                            />
                        )}
                    </div>
                </div>

                {/* Right: Upcoming Posts Sidebar */}
                <div className="flex flex-col gap-4">
                    {/* Upcoming header card */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-purple-100 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-purple-600" />
                                <h3 className="font-black text-sm text-gray-900">Upcoming Posts</h3>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                                {upcoming.length} Scheduled
                            </span>
                        </div>

                        {isUpcomingLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="p-3 rounded-2xl bg-gray-50 animate-pulse space-y-2">
                                        <Skeleton height="h-4" width="w-3/4" />
                                        <Skeleton height="h-3" width="w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : upcoming.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-purple-50/40 rounded-2xl border border-purple-100/50">
                                <Clock className="h-8 w-8 text-purple-300 mb-2" />
                                <p className="text-xs font-bold text-gray-700">No upcoming posts</p>
                                <p className="text-[10px] text-gray-400 mt-1 max-w-[180px]">
                                    Pick a date on the calendar to schedule your next video release.
                                </p>
                                <button
                                    onClick={() => openScheduleForDate(new Date())}
                                    className="mt-3 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold transition-colors"
                                >
                                    Schedule Now +
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
                                {upcoming.map((post) => {
                                    const schedDate = new Date(post.scheduledAt);
                                    const isToday = new Date().toDateString() === schedDate.toDateString();
                                    const formattedTime = schedDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                                    const formattedDate = schedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

                                    return (
                                        <div
                                            key={post.id}
                                            onClick={() => {
                                                const matched = events.find((ev) => ev.postId === post.id);
                                                if (matched) setSelectedEvent(matched);
                                            }}
                                            className="p-3.5 rounded-2xl bg-gray-50 hover:bg-purple-50/70 border border-gray-200/70 hover:border-purple-200 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start gap-2.5">
                                                <div className="h-11 w-11 rounded-xl bg-gray-900 shrink-0 overflow-hidden relative flex items-center justify-center">
                                                    {post.mediaUrl ? (
                                                        <img src={post.mediaUrl} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Film className="h-4 w-4 text-white" />
                                                    )}
                                                    <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/70 text-[8px] font-bold text-white uppercase">
                                                        {post.mediaType === "VIDEO" ? "VID" : "IMG"}
                                                    </span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-black text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                                                        {post.title}
                                                    </p>

                                                    <div className="flex items-center gap-1.5 text-[10px] text-purple-700 font-bold mt-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{isToday ? "Today" : formattedDate} at {formattedTime}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1 mt-1.5">
                                                        {post.targets?.map((t) => (
                                                            <span key={t.id} className="p-0.5 rounded bg-white border border-gray-200 shadow-2xs">
                                                                {t.platform === "YOUTUBE" && <YoutubeIcon className="h-3 w-3 text-red-600" />}
                                                                {t.platform === "INSTAGRAM" && <InstagramIcon className="h-3 w-3 text-pink-600" />}
                                                                {t.platform === "LINKEDIN" && <LinkedinIcon className="h-3 w-3 text-blue-600" />}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modals ─────────────────────────────────────────────────── */}

            {/* Schedule Post Modal */}
            {isScheduleModalOpen && (
                <SchedulePostModal
                    initialDate={selectedDate || new Date()}
                    libraryPosts={libraryPosts}
                    onClose={() => setIsScheduleModalOpen(false)}
                    onSchedule={async (payload) => {
                        await scheduleMutation.mutateAsync(payload);
                        setIsScheduleModalOpen(false);
                    }}
                />
            )}

            {/* Event Inspection & Edit Drawer */}
            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onEdit={() => {
                        setIsEditModalOpen(true);
                    }}
                    onCancel={async (postId) => {
                        if (window.confirm("Cancel this scheduled post?")) {
                            await cancelMutation.mutateAsync(postId);
                            setSelectedEvent(null);
                        }
                    }}
                />
            )}

            {/* Edit Scheduled Post Modal */}
            {isEditModalOpen && selectedEvent && (
                <EditScheduledPostModal
                    event={selectedEvent}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={async (postId, payload) => {
                        await updateMutation.mutateAsync({ id: postId, payload });
                        setIsEditModalOpen(false);
                        setSelectedEvent(null);
                    }}
                />
            )}
        </div>
    );
}

// ─── Month Grid View Component ────────────────────────────────────────────────

function MonthGridView({
    currentDate,
    events,
    onSelectDate,
    onSelectEvent,
}: {
    currentDate: Date;
    events: CalendarEvent[];
    onSelectDate: (date: Date) => void;
    onSelectEvent: (event: CalendarEvent) => void;
}) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const d = new Date(year, month - 1, daysInPrevMonth - i);
        days.push({ date: d, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        days.push({ date: d, isCurrentMonth: true });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({ date: d, isCurrentMonth: false });
    }

    const todayStr = new Date().toDateString();

    return (
        <div className="flex flex-col h-full">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-gray-100 pb-2 text-center text-[11px] font-black text-gray-400 uppercase tracking-wider">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            {/* Calendar Cells Grid */}
            <div className="grid grid-cols-7 grid-rows-5 gap-1.5 flex-1 pt-2 min-h-[480px]">
                {days.map(({ date, isCurrentMonth }, idx) => {
                    const dateKey = date.toDateString();
                    const isToday = dateKey === todayStr;

                    // Filter events occurring on this date
                    const dayEvents = events.filter((e) => {
                        const eventDate = new Date(e.effectiveDate).toDateString();
                        return eventDate === dateKey;
                    });

                    return (
                        <div
                            key={idx}
                            onClick={() => isCurrentMonth && onSelectDate(date)}
                            className={cn(
                                "group rounded-2xl p-1.5 sm:p-2 border flex flex-col justify-between transition-all min-h-[90px] relative cursor-pointer",
                                isCurrentMonth
                                    ? isToday
                                        ? "bg-purple-50/70 border-purple-300 shadow-sm"
                                        : "bg-white border-gray-100 hover:border-purple-200 hover:shadow-xs"
                                    : "bg-gray-50/50 border-transparent opacity-40"
                            )}
                        >
                            {/* Date number + Quick Add Button */}
                            <div className="flex items-center justify-between">
                                <span
                                    className={cn(
                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold",
                                        isToday ? "bg-purple-600 text-white" : isCurrentMonth ? "text-gray-800" : "text-gray-400"
                                    )}
                                >
                                    {date.getDate()}
                                </span>

                                {isCurrentMonth && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectDate(date);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 h-5 w-5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center transition-opacity"
                                        title="Schedule for this date"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                )}
                            </div>

                            {/* Event Pills List */}
                            <div className="space-y-1 my-1 overflow-hidden">
                                {dayEvents.slice(0, 2).map((ev) => {
                                    const isPublished = ev.status === "PUBLISHED";
                                    const isFailed = ev.status === "FAILED";
                                    const isScheduled = ev.status === "SCHEDULED";

                                    return (
                                        <div
                                            key={ev.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectEvent(ev);
                                            }}
                                            className={cn(
                                                "px-1.5 py-0.5 rounded-lg text-[10px] font-bold truncate flex items-center gap-1 cursor-pointer transition-transform hover:scale-[1.02]",
                                                isPublished && "bg-emerald-100 text-emerald-800",
                                                isFailed && "bg-red-100 text-red-800",
                                                isScheduled && "bg-purple-100 text-purple-800",
                                                !isPublished && !isFailed && !isScheduled && "bg-amber-100 text-amber-800"
                                            )}
                                        >
                                            <span className="shrink-0 flex items-center">
                                                {ev.targets.some((t) => t.platform === "YOUTUBE") && <YoutubeIcon className="h-2.5 w-2.5 mr-0.5 text-red-600" />}
                                                {ev.targets.some((t) => t.platform === "INSTAGRAM") && <InstagramIcon className="h-2.5 w-2.5 mr-0.5 text-pink-600" />}
                                                {ev.targets.some((t) => t.platform === "LINKEDIN") && <LinkedinIcon className="h-2.5 w-2.5 mr-0.5 text-blue-600" />}
                                            </span>
                                            <span className="truncate">{ev.title}</span>
                                        </div>
                                    );
                                })}

                                {dayEvents.length > 2 && (
                                    <span className="text-[9px] font-bold text-gray-400 pl-1">
                                        +{dayEvents.length - 2} more
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Week Grid View Component ─────────────────────────────────────────────────

function WeekGridView({
    currentDate,
    events,
    onSelectDate,
    onSelectEvent,
}: {
    currentDate: Date;
    events: CalendarEvent[];
    onSelectDate: (date: Date) => void;
    onSelectEvent: (event: CalendarEvent) => void;
}) {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        weekDays.push(d);
    }

    const todayStr = new Date().toDateString();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 min-h-[500px]">
            {weekDays.map((date, idx) => {
                const dateKey = date.toDateString();
                const isToday = dateKey === todayStr;
                const dayEvents = events.filter((e) => new Date(e.effectiveDate).toDateString() === dateKey);

                return (
                    <div
                        key={idx}
                        className={cn(
                            "rounded-2xl p-3 border flex flex-col justify-between transition-all min-h-[160px]",
                            isToday ? "bg-purple-50/70 border-purple-300 shadow-sm" : "bg-white border-gray-100"
                        )}
                    >
                        {/* Day Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">
                                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                                </p>
                                <p className="text-base font-black text-gray-900 mt-0.5">
                                    {date.getDate()}
                                </p>
                            </div>
                            <button
                                onClick={() => onSelectDate(date)}
                                className="h-6 w-6 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center transition-colors"
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        {/* Events list for day */}
                        <div className="space-y-2 flex-1 overflow-y-auto max-h-72">
                            {dayEvents.length === 0 ? (
                                <p className="text-[10px] text-gray-400 text-center py-4 font-medium">No posts</p>
                            ) : (
                                dayEvents.map((ev) => (
                                    <div
                                        key={ev.id}
                                        onClick={() => onSelectEvent(ev)}
                                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-purple-100/60 border border-gray-200/80 transition-all cursor-pointer group space-y-1.5"
                                    >
                                        <p className="text-xs font-black text-gray-900 line-clamp-1 group-hover:text-purple-700">
                                            {ev.title}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                {ev.targets.map((t) => (
                                                    <span key={t.id}>
                                                        {t.platform === "YOUTUBE" && <YoutubeIcon className="h-3 w-3 text-red-600" />}
                                                        {t.platform === "INSTAGRAM" && <InstagramIcon className="h-3 w-3 text-pink-600" />}
                                                        {t.platform === "LINKEDIN" && <LinkedinIcon className="h-3 w-3 text-blue-600" />}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                                                {new Date(ev.effectiveDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Schedule Post Modal ──────────────────────────────────────────────────────

function SchedulePostModal({
    initialDate,
    libraryPosts,
    onClose,
    onSchedule,
}: {
    initialDate: Date;
    libraryPosts: any[];
    onClose: () => void;
    onSchedule: (payload: any) => Promise<void>;
}) {
    const [selectedLibraryId, setSelectedLibraryId] = React.useState<string>("");
    const [mediaUrl, setMediaUrl] = React.useState<string>("");
    const [mediaType, setMediaType] = React.useState<"VIDEO" | "IMAGE">("VIDEO");
    const [cloudinaryId, setCloudinaryId] = React.useState<string>("manual-upload");
    const [title, setTitle] = React.useState<string>("");
    const [caption, setCaption] = React.useState<string>("");
    const [hashtags, setHashtags] = React.useState<string>("");

    // Date & Time
    const defaultDateStr = initialDate.toISOString().split("T")[0];
    const [scheduleDate, setScheduleDate] = React.useState<string>(defaultDateStr);
    const [scheduleTime, setScheduleTime] = React.useState<string>("17:00");

    // Platform Selection
    const [selectedPlatforms, setSelectedPlatforms] = React.useState<Record<string, boolean>>({
        YOUTUBE: true,
        INSTAGRAM: true,
        LINKEDIN: true,
    });

    // Platform-Specific Times
    const [isPlatformSpecificTiming, setIsPlatformSpecificTiming] = React.useState(false);
    const [platformTimes, setPlatformTimes] = React.useState<Record<string, string>>({
        YOUTUBE: "17:00",
        INSTAGRAM: "18:30",
        LINKEDIN: "09:00",
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Pick library item
    const handleSelectLibraryItem = (post: any) => {
        setSelectedLibraryId(post.id);
        setMediaUrl(post.media_url || "");
        setMediaType(post.media_type || "VIDEO");
        setCloudinaryId(post.id || "library-asset");
        setTitle(post.ai_title || "");
        setCaption(post.raw_caption || "");
    };

    const togglePlatform = (p: string) => {
        setSelectedPlatforms((prev) => ({ ...prev, [p]: !prev[p] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mediaUrl.trim()) {
            alert("Please select media from your library or provide a media URL.");
            return;
        }

        const activePlatforms = Object.entries(selectedPlatforms)
            .filter(([_, active]) => active)
            .map(([p]) => p);

        if (activePlatforms.length === 0) {
            alert("Please select at least one platform.");
            return;
        }

        setIsSubmitting(true);
        try {
            const baseScheduledAt = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();

            const targets = activePlatforms.map((platform) => {
                let targetScheduledAt = baseScheduledAt;
                if (isPlatformSpecificTiming && platformTimes[platform]) {
                    targetScheduledAt = new Date(`${scheduleDate}T${platformTimes[platform]}:00`).toISOString();
                }

                return {
                    platform,
                    finalTitle: title || "Scheduled Content 🔥",
                    finalDescription: caption || "Scheduled via CrossPost AI",
                    finalHashtags: hashtags.split(" ").filter((h) => h.startsWith("#") || h.length > 0),
                    scheduledAt: targetScheduledAt,
                };
            });

            await onSchedule({
                mediaUrl,
                mediaType,
                cloudinaryId,
                rawCaption: caption,
                aiTitle: title,
                aiDescription: caption,
                aiHashtags: hashtags.split(" ").filter((h) => h.length > 0),
                scheduledAt: baseScheduledAt,
                targets,
            });
        } catch (err: any) {
            alert(err.message || "Failed to schedule post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            <Plus className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="font-black text-lg text-gray-900">Schedule New Post</h2>
                            <p className="text-xs text-gray-400">Plan multi-channel delivery in advance</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 flex-1">
                    {/* 1. Select Media from Library */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            1. Select Media Asset from Library / Past Posts
                        </label>
                        {libraryPosts.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-36 overflow-y-auto p-1 border border-gray-200 rounded-2xl">
                                {libraryPosts.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSelectLibraryItem(item)}
                                        className={cn(
                                            "relative rounded-xl overflow-hidden aspect-video bg-gray-900 border cursor-pointer transition-all flex items-center justify-center",
                                            selectedLibraryId === item.id
                                                ? "ring-2 ring-purple-600 border-transparent shadow-sm scale-95"
                                                : "border-gray-200 hover:opacity-80"
                                        )}
                                    >
                                        {item.media_url ? (
                                            item.media_type === "VIDEO" ? (
                                                <div className="h-full w-full relative flex items-center justify-center bg-gray-950">
                                                    <video src={item.media_url} className="h-full w-full object-cover opacity-60" muted playsInline />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Film className="h-5 w-5 text-white/90" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <img src={item.media_url} alt="" className="h-full w-full object-cover" />
                                            )
                                        ) : (
                                            <Film className="h-5 w-5 text-white" />
                                        )}
                                        {selectedLibraryId === item.id && (
                                            <div className="absolute inset-0 bg-purple-600/40 flex items-center justify-center">
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {/* Or Manual Media URL input */}
                        <input
                            type="text"
                            value={mediaUrl}
                            onChange={(e) => {
                                setMediaUrl(e.target.value);
                                setSelectedLibraryId("");
                            }}
                            placeholder="Or paste media URL (e.g. https://res.cloudinary.com/...)"
                            className="mt-2 w-full px-3.5 py-2 rounded-xl text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-500 font-medium"
                            required
                        />
                    </div>

                    {/* 2. Content Details */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            2. Content Details
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Post Title (e.g. 5 AI Tools You Must Know)"
                            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-500"
                            required
                        />
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write your post caption or description..."
                            rows={3}
                            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* 3. Platform Selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            3. Select Publishing Channels
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => togglePlatform("YOUTUBE")}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all",
                                    selectedPlatforms.YOUTUBE ? "bg-red-50 border-red-300 text-red-700" : "bg-gray-50 border-gray-200 text-gray-400"
                                )}
                            >
                                <YoutubeIcon className="h-4 w-4" />
                                <span>YouTube</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => togglePlatform("INSTAGRAM")}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all",
                                    selectedPlatforms.INSTAGRAM ? "bg-pink-50 border-pink-300 text-pink-700" : "bg-gray-50 border-gray-200 text-gray-400"
                                )}
                            >
                                <InstagramIcon className="h-4 w-4" />
                                <span>Instagram</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => togglePlatform("LINKEDIN")}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all",
                                    selectedPlatforms.LINKEDIN ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-400"
                                )}
                            >
                                <LinkedinIcon className="h-4 w-4" />
                                <span>LinkedIn</span>
                            </button>
                        </div>
                    </div>

                    {/* 4. Date + Time & Platform-Specific Scheduling */}
                    <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                4. Date & Time
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold text-purple-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPlatformSpecificTiming}
                                    onChange={(e) => setIsPlatformSpecificTiming(e.target.checked)}
                                    className="rounded text-purple-600 focus:ring-0"
                                />
                                <span>Platform-specific timing</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Publish Date</span>
                                <input
                                    type="date"
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 focus:outline-none focus:border-purple-400 mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Global Time</span>
                                <input
                                    type="time"
                                    value={scheduleTime}
                                    onChange={(e) => setScheduleTime(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 focus:outline-none focus:border-purple-400 mt-1"
                                    required
                                />
                            </div>
                        </div>

                        {/* Platform Specific Times */}
                        {isPlatformSpecificTiming && (
                            <div className="pt-2 border-t border-purple-100/80 space-y-2">
                                <p className="text-[10px] font-bold text-purple-700">Custom Channel Times:</p>
                                {selectedPlatforms.YOUTUBE && (
                                    <div className="flex items-center justify-between gap-3 text-xs">
                                        <span className="flex items-center gap-1.5 font-bold text-gray-700"><YoutubeIcon className="h-3.5 w-3.5 text-red-600" /> YouTube</span>
                                        <input
                                            type="time"
                                            value={platformTimes.YOUTUBE}
                                            onChange={(e) => setPlatformTimes({ ...platformTimes, YOUTUBE: e.target.value })}
                                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-gray-200"
                                        />
                                    </div>
                                )}
                                {selectedPlatforms.INSTAGRAM && (
                                    <div className="flex items-center justify-between gap-3 text-xs">
                                        <span className="flex items-center gap-1.5 font-bold text-gray-700"><InstagramIcon className="h-3.5 w-3.5 text-pink-600" /> Instagram</span>
                                        <input
                                            type="time"
                                            value={platformTimes.INSTAGRAM}
                                            onChange={(e) => setPlatformTimes({ ...platformTimes, INSTAGRAM: e.target.value })}
                                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-gray-200"
                                        />
                                    </div>
                                )}
                                {selectedPlatforms.LINKEDIN && (
                                    <div className="flex items-center justify-between gap-3 text-xs">
                                        <span className="flex items-center gap-1.5 font-bold text-gray-700"><LinkedinIcon className="h-3.5 w-3.5 text-blue-600" /> LinkedIn</span>
                                        <input
                                            type="time"
                                            value={platformTimes.LINKEDIN}
                                            onChange={(e) => setPlatformTimes({ ...platformTimes, LINKEDIN: e.target.value })}
                                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-gray-200"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                            style={{ background: "linear-gradient(135deg, #6C5CE7, #a29bfe)" }}
                        >
                            {isSubmitting ? "Scheduling..." : "Confirm Schedule 🚀"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Event Detail Modal ───────────────────────────────────────────────────────

function EventDetailModal({
    event,
    onClose,
    onEdit,
    onCancel,
}: {
    event: CalendarEvent;
    onClose: () => void;
    onEdit: () => void;
    onCancel: (postId: string) => void;
}) {
    const formattedDate = new Date(event.effectiveDate).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    const isScheduled = event.status === "SCHEDULED";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <h3 className="font-black text-base text-gray-900">Scheduled Event Details</h3>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {event.mediaUrl && (
                        <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                            {event.mediaType === "VIDEO" ? (
                                <video src={event.mediaUrl} controls className="h-full w-full object-contain" />
                            ) : (
                                <img src={event.mediaUrl} alt="" className="h-full w-full object-contain" />
                            )}
                        </div>
                    )}

                    <div>
                        <h4 className="font-black text-base text-gray-900">{event.title}</h4>
                        <p className="text-xs text-purple-700 font-bold mt-1">Scheduled for: {formattedDate}</p>
                        {event.rawCaption && (
                            <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">{event.rawCaption}</p>
                        )}
                    </div>

                    {/* Platform Targets Breakdown */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Channels</p>
                        {event.targets.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200/70 text-xs">
                                <div className="flex items-center gap-2 font-bold text-gray-800">
                                    {t.platform === "YOUTUBE" && <YoutubeIcon className="h-4 w-4 text-red-600" />}
                                    {t.platform === "INSTAGRAM" && <InstagramIcon className="h-4 w-4 text-pink-600" />}
                                    {t.platform === "LINKEDIN" && <LinkedinIcon className="h-4 w-4 text-blue-600" />}
                                    <span>{t.platform}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                                        {t.scheduledAt ? new Date(t.scheduledAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Scheduled"}
                                    </span>
                                    {t.platformPostUrl && (
                                        <a href={t.platformPostUrl} target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-800">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between rounded-b-3xl">
                    {isScheduled ? (
                        <button
                            onClick={() => onCancel(event.postId)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Cancel Schedule</span>
                        </button>
                    ) : <div />}

                    <div className="flex items-center gap-2">
                        {isScheduled && (
                            <button
                                onClick={onEdit}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                            >
                                <Edit3 className="h-3.5 w-3.5" />
                                <span>Edit / Reschedule</span>
                            </button>
                        )}
                        <button onClick={onClose} className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Edit Scheduled Post Modal ────────────────────────────────────────────────

function EditScheduledPostModal({
    event,
    onClose,
    onUpdate,
}: {
    event: CalendarEvent;
    onClose: () => void;
    onUpdate: (postId: string, payload: any) => Promise<void>;
}) {
    const [title, setTitle] = React.useState(event.title);
    const [caption, setCaption] = React.useState(event.rawCaption || "");
    const dateObj = new Date(event.effectiveDate);
    const [date, setDate] = React.useState(dateObj.toISOString().split("T")[0]);
    const [time, setTime] = React.useState(
        dateObj.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
    );
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
            await onUpdate(event.postId, {
                aiTitle: title,
                rawCaption: caption,
                scheduledAt,
            });
        } catch (err: any) {
            alert(err.message || "Failed to update schedule");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-purple-100 flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="font-black text-base text-gray-900">Edit / Reschedule Post</h3>
                    <button onClick={onClose} className="h-8 w-8 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Post Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Caption</label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 border border-gray-200"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Time</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
