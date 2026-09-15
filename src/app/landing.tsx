"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const CONTACT_EMAIL = "rahulkumar9508548671@gmail.com";

/* ── Hooks ───────────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(end: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let v = 0;
    const step = end / (1400 / 16);
    const t = setInterval(() => {
      v = Math.min(v + step, end);
      setVal(Math.round(v));
      if (v >= end) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [active, end]);
  return val;
}

function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function StatCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { ref, inView } = useInView(0.4);
  const val = useCounter(end, inView);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "28px 16px" }}>
      <div style={{ fontSize: "clamp(30px,3.5vw,44px)", fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg,#ec4899,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {val.toLocaleString()}{suffix}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#8e8aaf", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────────────── */
function YT({ size = 22 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" fill="#FF0000" width={size} height={size}><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 16.17 24 12 24 12a31.5 31.5 0 0 0-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" /></svg>;
}
function IG({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <defs><linearGradient id="ig-ft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#833ab4" /><stop offset="50%" stopColor="#fd1d1d" /><stop offset="100%" stopColor="#fcb045" /></linearGradient></defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-ft)" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
    </svg>
  );
}
function LI({ size = 22 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size}><rect width="24" height="24" rx="4" fill="#0A66C2" /><path d="M7.5 9.5h-3v9h3v-9zm-1.5-1a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5zm12.5 1h-2.6c-.6 0-1.4.5-1.4 1.5V18.5h3v-5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V18.5h3v-6c0-2.2-1.8-2-2.5-2h-2.5z" fill="white" /></svg>;
}
function TK({ size = 20 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" fill="white" width={size} height={size}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.17a8.18 8.18 0 0 0 4.78 1.52V7.26a4.85 4.85 0 0 1-1.01-.57z" /></svg>;
}
function XI({ size = 20 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" fill="white" width={size} height={size}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}
function SparkleI({ size = 22 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
}
function CalI({ size = 22 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function BarI({ size = 22 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
}
function LinkI({ size = 22 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
}
function ShieldI({ size = 22 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function Check() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12" /></svg>; }
function Arr() { return <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>; }
function SunI() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>; }
function MoonI() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>; }
function HamI() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>; }
function CloseI() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }
function PlayI() { return <svg viewBox="0 0 24 24" fill="white" width="26" height="26"><polygon points="5,3 19,12 5,21" /></svg>; }
function UploadI() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="44" height="44"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>; }
function ClockI() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>; }
function Bar2I() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>; }
function StarI() { return <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>; }
function ZapI({ s = 16 }: { s?: number }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>; }
function ChevI({ open }: { open: boolean }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .3s" }}><polyline points="6 9 12 15 18 9" /></svg>; }
function HeartI() { return <svg viewBox="0 0 24 24" fill="#ec4899" width="13" height="13"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>; }
function InfI() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" /></svg>; }

/* ── Data ────────────────────────────────────────────────────────── */
const NAV = [
  { label: "Home", id: "home" },
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Testimonials", id: "testimonials" },
  { label: "FAQ", id: "faq" },
];

const FEATS = [
  { num: "01", color: "#FF0000", bg: "rgba(255,0,0,.15)", Icon: YT, title: "YouTube Upload", desc: "Upload directly to YouTube with AI-optimized title, description, and tags. Supports large files via resumable uploads.", link: "Upload Smarter" },
  { num: "02", color: "#E1306C", bg: "rgba(225,48,108,.15)", Icon: IG, title: "Instagram Publishing", desc: "Post Reels and videos to Instagram Business accounts via the official Instagram Graph API.", link: "Grow on Instagram" },
  { num: "03", color: "#0A66C2", bg: "rgba(10,102,194,.15)", Icon: LI, title: "LinkedIn Posting", desc: "Share video posts to LinkedIn profiles and company pages via the REST API.", link: "Build Your Network" },
  { num: "04", color: "#a78bfa", bg: "rgba(167,139,250,.15)", Icon: SparkleI, title: "AI Content Generation", desc: "Mistral AI generates platform-optimized titles, descriptions, and hashtags based on your content.", link: "Let AI Do the Work" },
  { num: "05", color: "#10b981", bg: "rgba(16,185,129,.15)", Icon: CalI, title: "Content Scheduling", desc: "Schedule posts for the perfect time on each platform independently — with flexible control.", link: "Plan Ahead" },
  { num: "06", color: "#3b82f6", bg: "rgba(59,130,246,.15)", Icon: BarI, title: "Analytics Dashboard", desc: "Track views, likes, comments, and growth across all platforms from one unified dashboard.", link: "See Real Growth" },
  { num: "07", color: "#ec4899", bg: "rgba(236,72,153,.15)", Icon: LinkI, title: "Multi-Account Connect", desc: "Connect YouTube, Instagram, and LinkedIn in seconds using secure OAuth 2.0. Zero passwords stored.", link: "Manage All Accounts" },
  { num: "08", color: "#6c63ff", bg: "rgba(108,99,255,.15)", Icon: ShieldI, title: "Bank-Grade Security", desc: "AES-256-GCM encrypted tokens, bcrypt passwords, HTTPS/TLS everywhere. Your data is never sold.", link: "Your Data, Your Control" },
];


const REVIEWS = [
  { name: "Sarah Chen", role: "Content Creator · 280K followers", av: "SC", col: "#6c63ff", q: "CrossPost AI literally saves me 4+ hours every week. I upload once and it handles everything — the AI captions are shockingly good.", stars: 5 },
  { name: "Marcus Rivera", role: "Digital Marketer · Agency Owner", av: "MR", col: "#10b981", q: "We manage 12 client accounts and CrossPost AI is our secret weapon. The scheduling and analytics are exactly what we needed.", stars: 5 },
  { name: "Priya Kapoor", role: "Fitness Coach · YouTube 95K", av: "PK", col: "#f59e0b", q: "From 3 hours of copy-pasting to a 1-click publish. My engagement went up 40% because the AI actually optimises for each platform.", stars: 5 },
];

const FAQS = [
  { q: "Which platforms do you support?", a: "CrossPost AI supports YouTube, Instagram (Reels & Feed), and LinkedIn (profiles & company pages). More platforms are coming soon." },
  { q: "How does the AI content generation work?", a: "We use Mistral AI to generate platform-native titles, descriptions, and hashtags. Each platform gets unique, algorithm-optimised copy — not just copy-paste." },
  { q: "Is my video stored on your servers?", a: "Videos are temporarily processed and stored securely on Cloudinary CDN. We never sell your data or share it with third parties." },
  { q: "Can I schedule posts in advance?", a: "Yes! With the Pro and Team plans you can schedule posts to each platform independently at the best time for your audience." },
  { q: "What happens if a platform API fails?", a: "CrossPost AI has automatic retry logic with exponential backoff. You will be notified if a post fails and can re-publish with one click." },
  { q: "Can I cancel anytime?", a: "Absolutely. No lock-in contracts. Cancel your subscription at any time from your account settings — no questions asked." },
];

/* ════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const [dark, setDark] = useState(true);
  const [nav, setNav] = useState("Home");
  const [faq, setFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  // Desktop hero video refs
  const vid1Ref = useRef<HTMLVideoElement>(null);
  const vid2Ref = useRef<HTMLVideoElement>(null);
  const [v1Muted, setV1Muted] = useState(true);
  const [v2Muted, setV2Muted] = useState(true);
  const [v1Playing, setV1Playing] = useState(true);
  const [v2Playing, setV2Playing] = useState(true);
  // Scroll-triggered video showcase refs
  const sVid1Ref = useRef<HTMLVideoElement>(null);
  const sVid2Ref = useRef<HTMLVideoElement>(null);
  const [sv1Playing, setSv1Playing] = useState(false);
  const [sv2Playing, setSv2Playing] = useState(false);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const [videoMuted, setVideoMuted] = useState(false);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  // Double-click timer for stop
  const dblTapTimer1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dblTapTimer2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const togglePlay = (ref: React.RefObject<HTMLVideoElement | null>, setPlaying: (p: boolean) => void) => {
    if (!ref.current) return;
    if (ref.current.paused) { ref.current.play(); setPlaying(true); }
    else { ref.current.pause(); setPlaying(false); }
  };
  const toggleMute = (ref: React.RefObject<HTMLVideoElement | null>, muted: boolean, setMuted: (m: boolean) => void) => {
    if (!ref.current) return;
    ref.current.muted = !muted;
    setMuted(!muted);
  };

  // Click = play/pause; double-click = stop (pause + reset)
  const handleVideoClick = (
    ref: React.RefObject<HTMLVideoElement | null>,
    setPlaying: (p: boolean) => void,
    timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  ) => {
    if (timerRef.current) {
      // Second tap within 300ms = double-click → STOP
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; setPlaying(false); }
    } else {
      // First tap → wait to see if double-click
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        togglePlay(ref, setPlaying);
      }, 280);
    }
  };

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // IntersectionObserver: play video1 when section scrolls into view
  useEffect(() => {
    const section = videoSectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Always start with video1
          setActiveVideo(1);
          setSv1Playing(false);
          setSv2Playing(false);
          if (sVid1Ref.current) {
            sVid1Ref.current.currentTime = 0;
            sVid1Ref.current.muted = videoMuted;
            sVid1Ref.current.play().then(() => setSv1Playing(true)).catch(() => { });
          }
          if (sVid2Ref.current) {
            sVid2Ref.current.pause();
            sVid2Ref.current.currentTime = 0;
          }
        } else {
          sVid1Ref.current?.pause(); setSv1Playing(false);
          sVid2Ref.current?.pause(); setSv2Playing(false);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(section);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Sync mute state to active video elements
  useEffect(() => {
    if (sVid1Ref.current) sVid1Ref.current.muted = videoMuted;
    if (sVid2Ref.current) sVid2Ref.current.muted = videoMuted;
  }, [videoMuted]);

  const go = (id: string) => {
    setMob(false);
    if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // On server & first paint use dark=true values; after mount use live state
  const isDark = mounted ? dark : true;

  const bg = isDark ? "#0e0c1a" : "#ffffff";
  const bgAlt = isDark ? "#100d20" : "#f8f7ff";
  const surf = isDark ? "#16122e" : "#ffffff";
  const surfEl = isDark ? "#1e1a38" : "#f9fafb";
  const bdr = isDark ? "rgba(255,255,255,.08)" : "#e5e7eb";
  const tx = isDark ? "#f0eeff" : "#111827";
  const mu = isDark ? "#8e8aaf" : "#6b7280";
  const sub = isDark ? "#c0bbdc" : "#374151";
  const nBg = scrolled ? (isDark ? "rgba(12,14,26,.95)" : "rgba(255,255,255,.95)") : "transparent";

  const pill = (label: string, color: string, colorBg: string, colorBrd: string) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: colorBg, border: `1px solid ${colorBrd}`, borderRadius: 100, padding: "6px 16px", fontSize: 11, color, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" as const, marginBottom: 20 }}>
      {label}
    </div>
  );

  return (
    <div id="home" data-theme={isDark ? "dark" : "light"} suppressHydrationWarning className="lp-root" style={{ fontFamily: "'Inter','Segoe UI',Arial,sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style suppressHydrationWarning>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        .lp-root{background:#0e0c1a;color:#f0eeff;transition:background .3s,color .3s}
        .lp-root[data-theme="light"]{background:#ffffff;color:#111827}
        @keyframes up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fl{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-9px) rotate(-2deg)}}
        @keyframes fr{0%,100%{transform:translateY(0) rotate(2deg)}50%{transform:translateY(-9px) rotate(2deg)}}
        @keyframes prg{from{width:0}to{width:80%}}
        @keyframes ring{0%{transform:scale(.9);opacity:.5}70%{transform:scale(1.2);opacity:0}100%{opacity:0}}
        @keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(236,72,153,.4)}50%{box-shadow:0 0 0 12px rgba(236,72,153,0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes btn-glow{0%,100%{box-shadow:0 8px 32px rgba(236,72,153,.5),0 0 0 0 rgba(236,72,153,.25)}50%{box-shadow:0 14px 48px rgba(236,72,153,.75),0 0 0 6px rgba(236,72,153,0)}}
        .nb{background:none;border:none;cursor:pointer;font-family:inherit}
        .nv{transition:all .2s;border-radius:8px;padding:7px 14px;white-space:nowrap}
        .nv:hover,.nv.act{background:rgba(236,72,153,.12);color:#f472b6!important}
        .bp{transition:transform .2s,box-shadow .2s!important}
        .bp:hover{transform:translateY(-3px) scale(1.02)!important;box-shadow:0 18px 52px rgba(236,72,153,.65)!important}
        .sign-in-btn{
          background:linear-gradient(135deg,#ec4899 0%,#a78bfa 40%,#f472b6 70%,#ec4899 100%)!important;
          background-size:200% auto!important;
          animation:shimmer 3s linear infinite,btn-glow 2.5s ease-in-out infinite!important;
        }
        .sign-in-btn:hover{animation:shimmer .9s linear infinite,btn-glow 1.2s ease-in-out infinite!important;transform:translateY(-3px) scale(1.04)!important}
        .bs{transition:all .2s!important}
        .bs:hover{background:rgba(236,72,153,.08)!important;border-color:#f472b6!important;color:#f472b6!important}
        .fc{transition:all .25s!important}
        .fc:hover{transform:translateY(-5px)!important;box-shadow:0 20px 60px rgba(0,0,0,.35)!important}
        .phone-l{animation:fl 4s ease-in-out infinite}
        .phone-r{animation:fr 4s ease-in-out .5s infinite}
        .bar-anim{animation:prg 1.8s ease .4s both}
        /* Mobile-first responsive */
        @media(max-width:900px){
          .dn{display:none!important}
          .mob{display:flex!important}
          .hp{display:none!important}
          .hero-center{padding:0 4px!important}
          .sign-in-btn{padding:14px 32px!important;font-size:16px!important;border-radius:16px!important;width:100%;justify-content:center!important}
          .mob-vid-section{display:flex!important}
        }
        @media(min-width:901px){.mob{display:none!important}.mob-vid-section{display:none!important}}
        /* Video card tap feedback */
        .vid-card{position:relative;overflow:hidden;border-radius:22px;background:#111;border:2px solid rgba(255,255,255,.1);box-shadow:0 20px 60px rgba(0,0,0,.7);cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none}
        .vid-card:active{transform:scale(0.98)}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(236,72,153,.28);border-radius:99px}
        /* Sign-in button pulse on mobile */
        @media(max-width:900px){.sign-in-btn{animation:pulse-glow 2.5s ease-in-out infinite}}
      `}</style>

      {/* NAVBAR */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: nBg, borderBottom: scrolled ? `1px solid ${bdr}` : "1px solid transparent", backdropFilter: scrolled ? "blur(20px)" : "none", transition: "all .3s" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ position: "relative", width: 36, height: 36, borderRadius: 10, overflow: "hidden", boxShadow: "0 0 0 2px rgba(236,72,153,.3),0 4px 14px rgba(236,72,153,.2)" }}>
              <Image src="/logo.png" alt="CrossPost AI" fill sizes="36px" style={{ objectFit: "cover" }} priority />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, color: tx }}>
                CrossPost <span style={{ background: "linear-gradient(135deg,#ec4899,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
              </div>
              <div style={{ fontSize: 10, color: mu, marginTop: 2 }}>Create Once. Post Everywhere.</div>
            </div>
          </Link>

          <nav className="dn" style={{ display: "flex", alignItems: "center", gap: 2, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {NAV.map(l => (
              <button key={l.label} onClick={() => { go(l.id); setNav(l.label); }} className={`nb nv${nav === l.label ? " act" : ""}`}
                style={{ color: nav === l.label ? "#f472b6" : mu, fontSize: 14, fontWeight: nav === l.label ? 600 : 500, textDecoration: nav === l.label ? "underline" : "none", textDecorationColor: "#ec4899", textUnderlineOffset: "4px" }}>
                {l.label}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button onClick={() => setDark(d => !d)} className="nb" style={{ background: surfEl, border: `1px solid ${bdr}`, borderRadius: 10, padding: "7px 10px", color: tx, display: "flex", alignItems: "center", transition: "all .2s" }}>
              {isDark ? <SunI /> : <MoonI />}
            </button>
            <Link href="/login" className="bp sign-in-btn" style={{ textDecoration: "none", color: "#fff", fontSize: 14, fontWeight: 700, padding: "10px 22px", borderRadius: 12, background: "linear-gradient(135deg,#ec4899,#a78bfa)", boxShadow: "0 4px 20px rgba(236,72,153,.45)", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Sign In →
            </Link>
            <button className="nb mob" onClick={() => setMob(o => !o)} style={{ color: tx, padding: 6, display: "none", alignItems: "center" }}>
              {mob ? <CloseI /> : <HamI />}
            </button>
          </div>
        </div>
        {mob && (
          <div style={{ background: surf, borderTop: `1px solid ${bdr}`, padding: "8px 0 4px" }}>
            {NAV.map(l => (
              <button key={l.label} onClick={() => { go(l.id); setNav(l.label); }} className="nb" style={{ display: "block", width: "100%", textAlign: "left", color: nav === l.label ? "#f472b6" : tx, fontSize: 15, fontWeight: nav === l.label ? 700 : 500, padding: "13px 24px", borderBottom: `1px solid ${bdr}` }}>{l.label}</button>
            ))}
            <div style={{ padding: "16px 20px 20px" }}>
              <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#fff", textDecoration: "none", fontSize: 16, fontWeight: 800, padding: "14px", borderRadius: 14, background: "linear-gradient(135deg,#ec4899,#a78bfa)", boxShadow: "0 8px 28px rgba(236,72,153,.45)", letterSpacing: "0.01em" }}>Sign In →</Link>
            </div>
          </div>
        )}
      </header>

      <main style={{ paddingTop: 68 }}>

        {/* HERO */}
        <section style={{ position: "relative", minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", overflow: "hidden", padding: "40px clamp(16px,4vw,40px) 80px" }}>
          <div aria-hidden style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse,rgba(236,72,153,.12) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: 0, left: "-5%", width: "50%", height: 320, background: "radial-gradient(ellipse,rgba(140,50,120,.5) 0%,rgba(100,30,100,.25) 40%,transparent 70%)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: 0, right: "-5%", width: "50%", height: 320, background: "radial-gradient(ellipse,rgba(90,40,160,.45) 0%,rgba(60,20,130,.2) 40%,transparent 70%)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px,${isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.025)"} 1px,transparent 0)`, backgroundSize: "28px 28px", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, position: "relative" }}>

            {/* Left Phone — Video 1 */}
            <div className="hp" style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 11, color: mu, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", writingMode: "vertical-lr", transform: "rotate(180deg)" }}>Upload Once Save Hours</div>
              <div className="phone-l" style={{ width: 205, borderRadius: 26, background: "#111", border: "2px solid rgba(255,255,255,.1)", boxShadow: "0 28px 80px rgba(0,0,0,.6)", overflow: "hidden", position: "relative" }}>
                {/* Platform badge */}
                <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,.72)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "5px 9px" }}>
                  <YT size={16} /><div><div style={{ fontSize: 10, fontWeight: 700, color: "#fff", lineHeight: 1 }}>YouTube</div><div style={{ fontSize: 8, color: "#10b981", fontWeight: 600, marginTop: 1.5 }}>Auto-optimized</div></div>
                </div>
                {/* Mute toggle */}
                <button onClick={() => toggleMute(vid1Ref, v1Muted, setV1Muted)} className="nb" style={{ position: "absolute", top: 10, right: 10, zIndex: 10, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,.65)", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title={v1Muted ? "Unmute" : "Mute"}>
                  {v1Muted
                    ? <svg viewBox="0 0 24 24" fill="white" width="12" height="12"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97V10.18l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                    : <svg viewBox="0 0 24 24" fill="white" width="12" height="12"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  }
                </button>
                {/* Actual video */}
                <div style={{ position: "relative", height: 320, background: "#000", cursor: "pointer" }} onClick={() => togglePlay(vid1Ref, setV1Playing)}>
                  <video
                    ref={vid1Ref}
                    src="/video1.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onPlay={() => setV1Playing(true)}
                    onPause={() => setV1Playing(false)}
                  />
                  {/* Play/pause overlay */}
                  {!v1Playing && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.35)" }}>
                      <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,.18)", border: "2px solid rgba(255,255,255,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}><PlayI /></div>
                    </div>
                  )}
                </div>
                <div style={{ background: "#0e0e0e", padding: "7px 11px 5px" }}>
                  <div style={{ fontSize: 9, color: "#555", marginBottom: 4 }}>video1.mp4 · Playing</div>
                  <div style={{ height: 2, background: "#1a1a1a" }}><div style={{ height: "100%", width: "100%", background: "#FF0000", animation: "prg 0s linear" }} /></div>
                </div>
              </div>
            </div>

            {/* Center */}
            <div className="hero-center" style={{ flex: "1 1 auto", textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: isDark ? "rgba(236,72,153,.12)" : "#fff0f6", border: `1px solid ${isDark ? "rgba(236,72,153,.28)" : "#fbcfe8"}`, borderRadius: 100, padding: "7px 18px", fontSize: 12, color: "#f472b6", fontWeight: 700, letterSpacing: ".05em", marginBottom: 24, animation: "up .5s ease both" }}>
                <ZapI s={14} /> AI-Powered Social Media Cross-Posting
              </div>
              <h1 style={{ fontSize: "clamp(36px,5.5vw,74px)", fontWeight: 900, lineHeight: .95, letterSpacing: "-0.045em", marginBottom: 20, color: tx }}>
                <span style={{ display: "block", animation: "up .6s ease .1s both" }}>One Post.</span>
                <span style={{ display: "block", background: "linear-gradient(135deg,#ec4899,#f472b6,#fb7185)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "underline", textDecorationColor: "rgba(236,72,153,.4)", textUnderlineOffset: "6px", animation: "up .6s ease .22s both" }}>Every Platform.</span>
              </h1>
              <p style={{ fontSize: "clamp(14px,1.8vw,16px)", color: mu, maxWidth: 490, margin: "0 auto 28px", lineHeight: 1.78, animation: "up .6s ease .34s both" }}>
                Upload your video once. CrossPost AI publishes it to <strong style={{ color: sub }}>YouTube</strong>, <strong style={{ color: sub }}>Instagram</strong>, and <strong style={{ color: sub }}>LinkedIn</strong> simultaneously — with AI-generated titles, descriptions, and hashtags tailored for each platform.
              </p>
              {/* Primary CTA — Sign In */}
              <div style={{ marginBottom: 28, animation: "up .6s ease .46s both" }}>
                <Link href="/login" className="bp sign-in-btn" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#ec4899,#a78bfa)", color: "#fff", textDecoration: "none", padding: "clamp(14px,2vw,18px) clamp(32px,4vw,52px)", borderRadius: 16, fontSize: "clamp(15px,1.8vw,18px)", fontWeight: 800, boxShadow: "0 8px 32px rgba(236,72,153,.48)" }}>
                  Sign In &amp; Start Posting <Arr />
                </Link>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, animation: "up .6s ease .7s both" }}>
                {[
                  { bg: "rgba(255,0,0,.14)", brd: "rgba(255,0,0,.22)", I: <YT /> },
                  { bg: "rgba(225,48,108,.14)", brd: "rgba(225,48,108,.22)", I: <IG /> },
                  { bg: "rgba(10,102,194,.14)", brd: "rgba(10,102,194,.22)", I: <LI /> },
                ].map((p, i) => (
                  <div key={i} style={{ width: 44, height: 44, borderRadius: 12, background: p.bg, border: `1px solid ${p.brd}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>{p.I}</div>
                ))}
              </div>
            </div>

            {/* Right Phone — Video 2 */}
            <div className="hp" style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div className="phone-r" style={{ width: 205, borderRadius: 26, background: "#111", border: "2px solid rgba(255,255,255,.1)", boxShadow: "0 28px 80px rgba(0,0,0,.6)", overflow: "hidden", position: "relative" }}>
                {/* Platform badge */}
                <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,.72)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "5px 9px" }}>
                  <IG size={16} /><div><div style={{ fontSize: 10, fontWeight: 700, color: "#fff", lineHeight: 1 }}>Instagram</div><div style={{ fontSize: 8, color: "#10b981", fontWeight: 600, marginTop: 1.5 }}>Auto-optimized</div></div>
                </div>
                {/* Mute toggle */}
                <button onClick={() => toggleMute(vid2Ref, v2Muted, setV2Muted)} className="nb" style={{ position: "absolute", top: 10, right: 10, zIndex: 10, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,.65)", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title={v2Muted ? "Unmute" : "Mute"}>
                  {v2Muted
                    ? <svg viewBox="0 0 24 24" fill="white" width="12" height="12"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97V10.18l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                    : <svg viewBox="0 0 24 24" fill="white" width="12" height="12"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  }
                </button>
                {/* Actual video */}
                <div style={{ position: "relative", height: 320, background: "#000", cursor: "pointer" }} onClick={() => togglePlay(vid2Ref, setV2Playing)}>
                  <video
                    ref={vid2Ref}
                    src="/video2.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onPlay={() => setV2Playing(true)}
                    onPause={() => setV2Playing(false)}
                  />
                  {/* Play/pause overlay */}
                  {!v2Playing && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.35)" }}>
                      <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,.18)", border: "2px solid rgba(255,255,255,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}><PlayI /></div>
                    </div>
                  )}
                </div>
                <div style={{ background: "#0e0e0e", padding: "7px 11px 5px" }}>
                  <div style={{ height: 2, background: "#1a1a1a" }}><div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg,#833ab4,#fd1d1d,#fcb045)" }} /></div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: mu, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", writingMode: "vertical-lr" }}>Multiple Platforms</div>
            </div>
          </div>

          {/* Stat pills */}
          <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            {[{ icon: <Bar2I />, main: "10K+", label: "Creators Trust Us" }, { icon: <ClockI />, main: "Save 10+ Hours", label: "Every Week" }].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)", border: `1px solid ${bdr}`, borderRadius: 12, padding: "10px 18px", backdropFilter: "blur(12px)", whiteSpace: "nowrap" }}>
                <span style={{ color: "#a78bfa" }}>{s.icon}</span>
                <div><div style={{ fontSize: 14, fontWeight: 800, color: tx, lineHeight: 1 }}>{s.main}</div><div style={{ fontSize: 10.5, color: mu, marginTop: 2 }}>{s.label}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            VIDEO SHOWCASE — Scroll to play, one by one
        ══════════════════════════════════════════════ */}
        <section
          ref={videoSectionRef}
          style={{
            background: isDark ? "#06040f" : "#f0eeff",
            borderTop: `1px solid ${bdr}`,
            padding: "clamp(52px,8vw,96px) clamp(16px,5vw,40px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient glows */}
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%,rgba(236,72,153,.08) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: 0, left: "20%", width: 400, height: 300, background: "radial-gradient(ellipse,rgba(167,139,250,.07) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 460, margin: "0 auto", position: "relative" }}>

            {/* Section label */}
            <FadeUp style={{ textAlign: "center", marginBottom: "clamp(24px,4vw,40px)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: isDark ? "rgba(236,72,153,.1)" : "#fff0f6", border: `1px solid ${isDark ? "rgba(236,72,153,.25)" : "#fbcfe8"}`, borderRadius: 100, padding: "6px 18px", fontSize: 11, color: "#f472b6", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" as const, marginBottom: 14 }}>
                🎬 See It In Action
              </div>
              <h2 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, letterSpacing: "-0.04em", color: tx, lineHeight: 1.1, marginBottom: 10 }}>
                Watch CrossPost AI{" "}
                <span style={{ background: "linear-gradient(135deg,#ec4899,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Work
                </span>
              </h2>
              <p style={{ fontSize: 13, color: mu }}>Scroll to autoplay · Video 1 ends → Video 2 auto-starts</p>
            </FadeUp>

            {/* Progress tabs — which video is active */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "center" }}>
              {([1, 2] as const).map(n => (
                <button
                  key={n}
                  className="nb"
                  onClick={() => {
                    setActiveVideo(n);
                    if (n === 1) {
                      sVid2Ref.current?.pause();
                      setSv2Playing(false);
                      if (sVid1Ref.current) {
                        sVid1Ref.current.currentTime = 0;
                        sVid1Ref.current.muted = videoMuted;
                        sVid1Ref.current.play().then(() => setSv1Playing(true)).catch(() => { });
                      }
                    } else {
                      sVid1Ref.current?.pause();
                      setSv1Playing(false);
                      if (sVid2Ref.current) {
                        sVid2Ref.current.currentTime = 0;
                        sVid2Ref.current.muted = videoMuted;
                        sVid2Ref.current.play().then(() => setSv2Playing(true)).catch(() => { });
                      }
                    }
                  }}
                  style={{
                    flex: 1, maxWidth: 180, padding: "10px 16px", borderRadius: 12, cursor: "pointer",
                    border: `1.5px solid ${activeVideo === n ? (n === 1 ? "rgba(255,0,0,.45)" : "rgba(225,48,108,.45)") : bdr}`,
                    background: activeVideo === n
                      ? (n === 1 ? "rgba(255,0,0,.08)" : "rgba(225,48,108,.08)")
                      : "transparent",
                    transition: "all .3s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    {n === 1 ? <YT size={14} /> : <IG size={14} />}
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontSize: 11, fontWeight: 800, color: activeVideo === n ? tx : mu, lineHeight: 1 }}>
                        {n === 1 ? "YouTube" : "Instagram"}
                      </p>
                      <p style={{ fontSize: 9, color: mu, marginTop: 2 }}>
                        {n === 1 ? "Upload & Generate" : "Publish & Reach"}
                      </p>
                    </div>
                    {activeVideo === n && (
                      <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: n === 1 ? "#FF0000" : "#E1306C", boxShadow: `0 0 6px ${n === 1 ? "#FF0000" : "#E1306C"}` }} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* ── Video 1 ── */}
            <div style={{ display: activeVideo === 1 ? "block" : "none" }}>
              <div
                style={{
                  position: "relative", borderRadius: 24, overflow: "hidden", background: "#000",
                  border: `2px solid ${sv1Playing ? "rgba(255,0,0,.55)" : bdr}`,
                  boxShadow: sv1Playing ? "0 0 0 4px rgba(255,0,0,.12), 0 24px 70px rgba(0,0,0,.75)" : "0 12px 48px rgba(0,0,0,.5)",
                  transition: "border-color .4s, box-shadow .4s",
                }}
              >
                {/* Platform badge */}
                <div style={{ position: "absolute", top: 14, left: 14, zIndex: 10, display: "flex", alignItems: "center", gap: 7, background: "rgba(0,0,0,.8)", backdropFilter: "blur(12px)", borderRadius: 10, padding: "7px 12px" }}>
                  <YT size={15} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", lineHeight: 1 }}>YouTube</div>
                    <div style={{ fontSize: 9, color: "#10b981", fontWeight: 600, marginTop: 2 }}>AI-optimized</div>
                  </div>
                </div>

                {/* Top-right controls: unmute + stop */}
                <div style={{ position: "absolute", top: 14, right: 14, zIndex: 10, display: "flex", gap: 8 }}>
                  {/* Unmute/Mute button */}
                  <button
                    onClick={() => setVideoMuted(m => !m)}
                    title={videoMuted ? "Unmute" : "Mute"}
                    style={{ width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${videoMuted ? "rgba(255,100,100,.6)" : "rgba(255,255,255,.3)"}`, cursor: "pointer", background: videoMuted ? "rgba(255,50,50,.25)" : "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
                  >
                    {videoMuted
                      ? <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97V10.18l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                      : <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                    }
                  </button>
                  {/* Play/Pause */}
                  <button
                    onClick={() => {
                      if (!sVid1Ref.current) return;
                      if (sVid1Ref.current.paused) { sVid1Ref.current.play().then(() => setSv1Playing(true)).catch(() => { }); }
                      else { sVid1Ref.current.pause(); setSv1Playing(false); }
                    }}
                    title={sv1Playing ? "Pause" : "Play"}
                    style={{ width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer", background: "rgba(255,255,255,.18)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {sv1Playing
                      ? <svg viewBox="0 0 24 24" fill="white" width="12" height="12"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                      : <svg viewBox="0 0 24 24" fill="white" width="13" height="13"><polygon points="5,3 19,12 5,21" /></svg>
                    }
                  </button>
                </div>

                {/* Paused overlay */}
                {!sv1Playing && (
                  <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "rgba(0,0,0,.52)" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,.14)", border: "2.5px solid rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(12px)" }}>
                      <svg viewBox="0 0 24 24" fill="white" width="30" height="30"><polygon points="5,3 19,12 5,21" /></svg>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>Tap to play</p>
                  </div>
                )}

                {/* Unmuted badge */}
                {!videoMuted && sv1Playing && (
                  <div style={{ position: "absolute", bottom: 60, left: 14, zIndex: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,.2)", border: "1px solid rgba(16,185,129,.4)", borderRadius: 8, padding: "4px 10px" }}>
                    <svg viewBox="0 0 24 24" fill="#10b981" width="10" height="10"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                    <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700 }}>Audio On</span>
                  </div>
                )}

                <video
                  ref={sVid1Ref}
                  src="/video1.mp4"
                  muted={videoMuted}
                  playsInline
                  style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", display: "block" }}
                  onPlay={() => setSv1Playing(true)}
                  onPause={() => setSv1Playing(false)}
                  onEnded={() => {
                    // Auto-advance to video 2
                    setSv1Playing(false);
                    setActiveVideo(2);
                    if (sVid2Ref.current) {
                      sVid2Ref.current.currentTime = 0;
                      sVid2Ref.current.muted = videoMuted;
                      sVid2Ref.current.play().then(() => setSv2Playing(true)).catch(() => { });
                    }
                  }}
                  onClick={() => {
                    if (!sVid1Ref.current) return;
                    if (sVid1Ref.current.paused) { sVid1Ref.current.play().then(() => setSv1Playing(true)).catch(() => { }); }
                    else { sVid1Ref.current.pause(); setSv1Playing(false); }
                  }}
                />

                {/* Bottom progress bar */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 16px 14px", background: "linear-gradient(to top,rgba(0,0,0,.9),transparent)" }}>
                  <div style={{ height: 3, background: "rgba(255,255,255,.15)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "#FF0000", borderRadius: 99, width: sv1Playing ? "100%" : "0%", transition: sv1Playing ? "width 30s linear" : "none" }} />
                  </div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,.45)", textAlign: "center", marginTop: 6 }}>
                    {sv1Playing ? "▶ Playing — ends automatically" : "Tap to play"}
                  </p>
                </div>
              </div>

              {/* Video 1 context */}
              <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 16, background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)", border: `1px solid ${bdr}` }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: tx, marginBottom: 4 }}>Step 1 — Upload &amp; AI Generate</p>
                <p style={{ fontSize: 12, color: mu, lineHeight: 1.6 }}>Upload your video once. AI instantly creates platform-optimized titles, descriptions &amp; hashtags for YouTube, Instagram and LinkedIn.</p>
              </div>
            </div>

            {/* ── Video 2 ── */}
            <div style={{ display: activeVideo === 2 ? "block" : "none" }}>
              <div
                style={{
                  position: "relative", borderRadius: 24, overflow: "hidden", background: "#000",
                  border: `2px solid ${sv2Playing ? "rgba(225,48,108,.55)" : bdr}`,
                  boxShadow: sv2Playing ? "0 0 0 4px rgba(225,48,108,.12), 0 24px 70px rgba(0,0,0,.75)" : "0 12px 48px rgba(0,0,0,.5)",
                  transition: "border-color .4s, box-shadow .4s",
                }}
              >
                {/* Platform badge */}
                <div style={{ position: "absolute", top: 14, left: 14, zIndex: 10, display: "flex", alignItems: "center", gap: 7, background: "rgba(0,0,0,.8)", backdropFilter: "blur(12px)", borderRadius: 10, padding: "7px 12px" }}>
                  <IG size={15} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", lineHeight: 1 }}>Instagram</div>
                    <div style={{ fontSize: 9, color: "#10b981", fontWeight: 600, marginTop: 2 }}>AI-optimized</div>
                  </div>
                </div>

                {/* Top-right controls */}
                <div style={{ position: "absolute", top: 14, right: 14, zIndex: 10, display: "flex", gap: 8 }}>
                  {/* Unmute/Mute */}
                  <button
                    onClick={() => setVideoMuted(m => !m)}
                    title={videoMuted ? "Unmute" : "Mute"}
                    style={{ width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${videoMuted ? "rgba(255,100,100,.6)" : "rgba(255,255,255,.3)"}`, cursor: "pointer", background: videoMuted ? "rgba(255,50,50,.25)" : "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
                  >
                    {videoMuted
                      ? <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97V10.18l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                      : <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                    }
                  </button>
                  {/* Play/Pause */}
                  <button
                    onClick={() => {
                      if (!sVid2Ref.current) return;
                      if (sVid2Ref.current.paused) { sVid2Ref.current.play().then(() => setSv2Playing(true)).catch(() => { }); }
                      else { sVid2Ref.current.pause(); setSv2Playing(false); }
                    }}
                    title={sv2Playing ? "Pause" : "Play"}
                    style={{ width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer", background: "rgba(255,255,255,.18)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {sv2Playing
                      ? <svg viewBox="0 0 24 24" fill="white" width="12" height="12"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                      : <svg viewBox="0 0 24 24" fill="white" width="13" height="13"><polygon points="5,3 19,12 5,21" /></svg>
                    }
                  </button>
                </div>

                {/* Paused overlay */}
                {!sv2Playing && (
                  <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "rgba(0,0,0,.52)" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,.14)", border: "2.5px solid rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(12px)" }}>
                      <svg viewBox="0 0 24 24" fill="white" width="30" height="30"><polygon points="5,3 19,12 5,21" /></svg>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>Tap to play</p>
                  </div>
                )}

                {/* Unmuted badge */}
                {!videoMuted && sv2Playing && (
                  <div style={{ position: "absolute", bottom: 60, left: 14, zIndex: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,.2)", border: "1px solid rgba(16,185,129,.4)", borderRadius: 8, padding: "4px 10px" }}>
                    <svg viewBox="0 0 24 24" fill="#10b981" width="10" height="10"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                    <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700 }}>Audio On</span>
                  </div>
                )}

                <video
                  ref={sVid2Ref}
                  src="/video2.mp4"
                  muted={videoMuted}
                  playsInline
                  style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", display: "block" }}
                  onPlay={() => setSv2Playing(true)}
                  onPause={() => setSv2Playing(false)}
                  onEnded={() => {
                    setSv2Playing(false);
                    // Loop back to video 1
                    setActiveVideo(1);
                    if (sVid1Ref.current) {
                      sVid1Ref.current.currentTime = 0;
                      sVid1Ref.current.muted = videoMuted;
                      sVid1Ref.current.play().then(() => setSv1Playing(true)).catch(() => { });
                    }
                  }}
                  onClick={() => {
                    if (!sVid2Ref.current) return;
                    if (sVid2Ref.current.paused) { sVid2Ref.current.play().then(() => setSv2Playing(true)).catch(() => { }); }
                    else { sVid2Ref.current.pause(); setSv2Playing(false); }
                  }}
                />

                {/* Bottom progress bar */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 16px 14px", background: "linear-gradient(to top,rgba(0,0,0,.9),transparent)" }}>
                  <div style={{ height: 3, background: "rgba(255,255,255,.15)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "linear-gradient(90deg,#833ab4,#fd1d1d,#fcb045)", borderRadius: 99, width: sv2Playing ? "100%" : "0%", transition: sv2Playing ? "width 30s linear" : "none" }} />
                  </div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,.45)", textAlign: "center", marginTop: 6 }}>
                    {sv2Playing ? "▶ Playing — loops back to Video 1" : "Tap to play"}
                  </p>
                </div>
              </div>

              {/* Video 2 context */}
              <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 16, background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)", border: `1px solid ${bdr}` }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: tx, marginBottom: 4 }}>Step 2 — Publish Everywhere</p>
                <p style={{ fontSize: 12, color: mu, lineHeight: 1.6 }}>One click publishes to YouTube, Instagram &amp; LinkedIn simultaneously — with platform-specific captions, hashtags and format.</p>
              </div>
            </div>

            {/* Sign In CTA */}
            <FadeUp style={{ textAlign: "center", marginTop: "clamp(32px,5vw,48px)" }}>
              <Link href="/login" className="bp sign-in-btn" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#fff", fontSize: "clamp(15px,1.8vw,17px)", fontWeight: 800, padding: "clamp(14px,2vw,16px) clamp(32px,4vw,48px)", borderRadius: 16, background: "linear-gradient(135deg,#ec4899,#a78bfa)", boxShadow: "0 8px 32px rgba(236,72,153,.5)", backgroundSize: "200% auto" }}>
                Sign In &amp; Start Posting <Arr />
              </Link>
              <p style={{ marginTop: 10, fontSize: 12, color: mu }}>Free &amp; ongoing · No credit card</p>
            </FadeUp>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            HOW IT WORKS — Clean text-only section
        ══════════════════════════════════════════════ */}
        <section id="how-it-works" style={{ background: bg, borderTop: `1px solid ${bdr}`, padding: "clamp(72px,9vw,108px) clamp(16px,5vw,40px)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", bottom: -40, left: "-5%", width: "42%", height: 300, background: "radial-gradient(ellipse,rgba(180,60,120,.2) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: -40, right: "-5%", width: "42%", height: 300, background: "radial-gradient(ellipse,rgba(100,50,210,.18) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>

            <FadeUp style={{ textAlign: "center", marginBottom: "clamp(40px,6vw,64px)" }}>
              {pill("Simple by Design", "#a78bfa", isDark ? "rgba(167,139,250,.12)" : "#f5f3ff", isDark ? "rgba(167,139,250,.25)" : "#d4bbff")}
              <h2 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "-0.04em", color: tx, lineHeight: 1.05, marginBottom: 14 }}>
                How <span style={{ background: "linear-gradient(135deg,#ec4899,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CrossPost AI</span> Works
              </h2>
              <p style={{ color: mu, fontSize: "clamp(14px,1.8vw,16px)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>Three simple steps. Upload once. Reach everywhere.</p>
              <div style={{ width: 56, height: 3, background: "linear-gradient(90deg,#ec4899,#a78bfa)", borderRadius: 99, margin: "16px auto 0" }} />
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: "clamp(16px,2.5vw,24px)" }}>

              {/* Step 1 */}
              <FadeUp delay={0}>
                <div className="fc" style={{ background: surf, border: `1.5px solid ${bdr}`, borderRadius: 20, padding: "clamp(20px,3vw,28px)", height: "100%", boxShadow: isDark ? "0 4px 32px rgba(0,0,0,.25)" : "0 4px 24px rgba(0,0,0,.06)" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#ec4899,#f472b6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 6px 20px rgba(236,72,153,.35)" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#ec4899", letterSpacing: ".16em", textTransform: "uppercase" }}>STEP 01</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: tx, marginBottom: 10, letterSpacing: "-0.02em" }}>Upload Your Video</h3>
                  <p style={{ fontSize: 14, color: mu, lineHeight: 1.75 }}>Drop in any video (MP4, MOV, AVI). It gets securely stored on Cloudinary CDN and queued for processing across all platforms instantly.</p>
                  <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
                    {["MP4", "MOV", "AVI"].map(f => <span key={f} style={{ fontSize: 11, fontWeight: 700, color: mu, background: surfEl, border: `1px solid ${bdr}`, borderRadius: 8, padding: "4px 10px" }}>{f}</span>)}
                  </div>
                </div>
              </FadeUp>

              {/* Step 2 */}
              <FadeUp delay={120}>
                <div className="fc" style={{ background: surf, border: `1.5px solid ${bdr}`, borderRadius: 20, padding: "clamp(20px,3vw,28px)", height: "100%", boxShadow: isDark ? "0 4px 32px rgba(0,0,0,.25)" : "0 4px 24px rgba(0,0,0,.06)" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#a78bfa,#6c63ff)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 6px 20px rgba(167,139,250,.35)" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#a78bfa", letterSpacing: ".16em", textTransform: "uppercase" }}>STEP 02</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: tx, marginBottom: 10, letterSpacing: "-0.02em" }}>AI Writes Your Content</h3>
                  <p style={{ fontSize: 14, color: mu, lineHeight: 1.75 }}>Gemini AI reads your video caption and automatically generates platform-specific titles, descriptions, and trending hashtags — tailored for each channel's algorithm.</p>
                  <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[{ c: "#ec4899", t: "YouTube SEO title" }, { c: "#a78bfa", t: "Instagram caption" }, { c: "#3b82f6", t: "LinkedIn post copy" }].map(item => (
                      <div key={item.t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: mu }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.c, flexShrink: 0 }} />
                        {item.t}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* Step 3 */}
              <FadeUp delay={240}>
                <div className="fc" style={{ background: surf, border: `1.5px solid ${bdr}`, borderRadius: 20, padding: "clamp(20px,3vw,28px)", height: "100%", boxShadow: isDark ? "0 4px 32px rgba(0,0,0,.25)" : "0 4px 24px rgba(0,0,0,.06)" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 6px 20px rgba(16,185,129,.35)" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#10b981", letterSpacing: ".16em", textTransform: "uppercase" }}>STEP 03</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: tx, marginBottom: 10, letterSpacing: "-0.02em" }}>Publish Everywhere</h3>
                  <p style={{ fontSize: 14, color: mu, lineHeight: 1.75 }}>One click sends your post live to all connected platforms simultaneously. Or schedule each platform at its own optimal time — you stay in full control.</p>
                  <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[{ I: <YT size={14} />, label: "YouTube" }, { I: <IG size={14} />, label: "Instagram" }, { I: <LI size={14} />, label: "LinkedIn" }].map(p => (
                      <div key={p.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: surfEl, border: `1px solid ${bdr}`, borderRadius: 10, padding: "8px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{p.I}<span style={{ fontSize: 12, fontWeight: 600, color: sub }}>{p.label}</span></div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.2)", borderRadius: 6, padding: "2px 8px" }}>
                          <Check /><span style={{ fontSize: 10, fontWeight: 700, color: "#10b981" }}>Ready</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>

            <FadeUp style={{ textAlign: "center", marginTop: "clamp(40px,5vw,56px)" }}>
              <div style={{ background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)", border: `1px solid ${bdr}`, borderRadius: 100, padding: "12px 28px", display: "inline-flex", alignItems: "center", gap: 10 }}>
                <InfI />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: sub, letterSpacing: ".08em", textTransform: "uppercase" }}>Same Video. More Reach. Bigger Opportunities.</span>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ background: bgAlt, borderTop: `1px solid ${bdr}`, padding: "clamp(72px,9vw,108px) clamp(16px,5vw,40px)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", bottom: -60, left: -60, width: 500, height: 400, background: "radial-gradient(ellipse,rgba(210,90,40,.38) 0%,rgba(160,55,30,.18) 40%,transparent 70%)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: -60, right: -60, width: 500, height: 400, background: "radial-gradient(ellipse,rgba(100,55,210,.38) 0%,rgba(70,30,170,.18) 40%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
            <FadeUp style={{ textAlign: "center", marginBottom: "clamp(48px,6vw,72px)" }}>
              {pill("🚀 Full Feature Set", "#f472b6", isDark ? "rgba(236,72,153,.12)" : "#fff0f6", isDark ? "rgba(236,72,153,.25)" : "#fbcfe8")}
              <h2 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "-0.04em", color: tx, lineHeight: 1.05, marginBottom: 14 }}>
                Everything You Need to <span style={{ background: "linear-gradient(135deg,#ec4899,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Cross-Post</span>
              </h2>
              <p style={{ color: mu, fontSize: "clamp(15px,1.8vw,17px)", lineHeight: 1.7 }}>Powerful tools. One seamless workflow. Reach everywhere.</p>
              <div style={{ width: 56, height: 3, background: "linear-gradient(90deg,#ec4899,#a78bfa)", borderRadius: 99, margin: "16px auto 0" }} />
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: "clamp(12px,2vw,20px)" }}>
              {FEATS.map((f, i) => (
                <FadeUp key={f.title} delay={(i % 4) * 60 + Math.floor(i / 4) * 80}>
                  <div className="fc" style={{ background: surf, border: `1.5px solid ${bdr}`, borderRadius: 20, padding: "clamp(20px,3vw,28px)", height: "100%", boxShadow: isDark ? "0 4px 24px rgba(0,0,0,.2)" : "0 4px 24px rgba(0,0,0,.05)", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", color: f.color }}>
                        <f.Icon size={20} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.1)", fontVariantNumeric: "tabular-nums" }}>{f.num}</span>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: tx, marginBottom: 8, letterSpacing: "-0.02em" }}>{f.title}</h3>
                    <p style={{ fontSize: 13.5, color: mu, lineHeight: 1.72, flex: 1, marginBottom: 16 }}>{f.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: f.color, cursor: "pointer" }}>
                      {f.link}
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, transition: "transform .2s" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.15)")} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}><Arr /></div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp style={{ marginTop: 40, textAlign: "center" }}>
              <div style={{ background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)", border: `1px solid ${bdr}`, borderRadius: 100, padding: "12px 28px", display: "inline-flex", alignItems: "center", gap: 10 }}>
                <HeartI />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: sub, letterSpacing: ".08em", textTransform: "uppercase" }}>Same Content. More Platforms. Bigger Opportunities.</span>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* PRICING REMOVED — App is currently free for all users */}

        {/* TESTIMONIALS */}
        <section id="testimonials" style={{ background: bgAlt, borderTop: `1px solid ${bdr}`, padding: "clamp(72px,9vw,108px) clamp(16px,5vw,40px)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeUp style={{ textAlign: "center", marginBottom: "clamp(48px,6vw,72px)" }}>
              {pill("Social Proof", "#f472b6", isDark ? "rgba(236,72,153,.12)" : "#fff0f6", isDark ? "rgba(236,72,153,.25)" : "#fbcfe8")}
              <h2 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "-0.04em", color: tx, marginBottom: 14 }}>Loved by Creators</h2>
              <p style={{ color: mu, fontSize: "clamp(15px,1.8vw,17px)", lineHeight: 1.7 }}>Thousands of creators trust CrossPost AI to grow their audience daily.</p>
            </FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "clamp(16px,3vw,24px)" }}>
              {REVIEWS.map((t, i) => (
                <FadeUp key={t.name} delay={i * 100}>
                  <div className="fc" style={{ background: surf, border: `1.5px solid ${bdr}`, borderRadius: 24, padding: "clamp(24px,3.5vw,36px)", height: "100%", boxShadow: isDark ? "0 4px 24px rgba(0,0,0,.2)" : "0 4px 24px rgba(0,0,0,.06)" }}>
                    <div style={{ display: "flex", gap: 3, marginBottom: 16, color: "#f59e0b" }}>{Array.from({ length: t.stars }).map((_, s) => <StarI key={s} />)}</div>
                    <p style={{ color: sub, fontSize: 15, lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>&ldquo;{t.q}&rdquo;</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${t.col},${t.col}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>{t.av}</div>
                      <div><div style={{ fontSize: 14, fontWeight: 700, color: tx }}>{t.name}</div><div style={{ fontSize: 12, color: mu, marginTop: 2 }}>{t.role}</div></div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ background: bg, borderTop: `1px solid ${bdr}`, padding: "clamp(72px,9vw,108px) clamp(16px,5vw,40px)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <FadeUp style={{ textAlign: "center", marginBottom: "clamp(48px,6vw,72px)" }}>
              {pill("Got Questions?", "#a78bfa", isDark ? "rgba(167,139,250,.12)" : "#f5f3ff", isDark ? "rgba(167,139,250,.25)" : "#d4bbff")}
              <h2 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "-0.04em", color: tx, marginBottom: 14 }}>Frequently Asked</h2>
              <p style={{ color: mu, fontSize: "clamp(15px,1.8vw,17px)", lineHeight: 1.7 }}>Everything you need to know about CrossPost AI.</p>
            </FadeUp>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FAQS.map((item, i) => (
                <FadeUp key={i} delay={i * 55}>
                  <div style={{ background: surf, border: `1.5px solid ${faq === i ? "rgba(236,72,153,.35)" : bdr}`, borderRadius: 16, overflow: "hidden", transition: "border-color .25s" }}>
                    <button onClick={() => setFaq(faq === i ? null : i)} className="nb" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 24px", color: tx, textAlign: "left" }}>
                      <span style={{ fontSize: "clamp(14px,1.8vw,16px)", fontWeight: 700, lineHeight: 1.4 }}>{item.q}</span>
                      <span style={{ flexShrink: 0, color: faq === i ? "#f472b6" : mu }}><ChevI open={faq === i} /></span>
                    </button>
                    {faq === i && <div style={{ padding: "0 24px 20px", paddingTop: 16, fontSize: 14.5, color: mu, lineHeight: 1.75, borderTop: `1px solid ${bdr}`, animation: "up .22s ease both" }}>{item.a}</div>}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>


      </main>

      {/* FOOTER */}
      <footer style={{ position: "relative", overflow: "hidden", background: isDark ? "#09071a" : "#1a1a2e" }}>
        <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top,rgba(80,20,110,.35),transparent)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -60, left: "-8%", width: "55%", height: 400, background: "radial-gradient(ellipse,rgba(190,45,145,.6) 0%,rgba(130,30,110,.3) 40%,transparent 70%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -60, right: "-8%", width: "55%", height: 400, background: "radial-gradient(ellipse,rgba(100,55,220,.55) 0%,rgba(70,30,170,.28) 40%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(40px,5vw,60px) clamp(16px,5vw,40px)", position: "relative" }}>
          {/* Top */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 28, marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,.07)", paddingBottom: 28 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <Image src="/logo.png" alt="CrossPost AI" fill sizes="46px" style={{ objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, color: "#fff" }}>
                  CrossPost <span style={{ background: "linear-gradient(135deg,#ec4899,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>Create Once. Post Everywhere.</div>
              </div>
            </div>

            {/* Social */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.38)", marginBottom: 12 }}>Follow Our Journey</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { I: <YT size={18} />, bg: "rgba(255,0,0,.15)", brd: "rgba(255,0,0,.22)" },
                  { I: <IG size={18} />, bg: "rgba(225,48,108,.15)", brd: "rgba(225,48,108,.22)" },
                  { I: <LI size={18} />, bg: "rgba(10,102,194,.15)", brd: "rgba(10,102,194,.22)" },
                  { I: <XI size={18} />, bg: "rgba(255,255,255,.07)", brd: "rgba(255,255,255,.13)" },
                ].map((s, i) => (
                  <div key={i} style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, border: `1px solid ${s.brd}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>{s.I}</div>
                ))}
              </div>
            </div>

            {/* Links + CTA */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
              {([["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms"], ["Contact", `mailto:${CONTACT_EMAIL}`]] as [string, string][]).map(([label, href]) => (
                <Link key={label} href={href} style={{ color: "rgba(255,255,255,.45)", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color .2s" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "#f472b6")} onMouseLeave={e => ((e.target as HTMLElement).style.color = "rgba(255,255,255,.45)")}>{label}</Link>
              ))}
              <Link href="/login" className="bp" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#fff", fontSize: 14, fontWeight: 700, padding: "10px 22px", borderRadius: 10, background: "linear-gradient(135deg,#ec4899,#a78bfa)", boxShadow: "0 4px 20px rgba(236,72,153,.35)" }}>
                Sign In →
              </Link>
            </div>
          </div>

          {/* Bottom */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
            <div>
              <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12.5, lineHeight: 1.7 }}>
                Operated by Rahul Kumar{" "}<a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#a78bfa", textDecoration: "none" }}>{CONTACT_EMAIL}</a>
              </p>
              <p style={{ color: "rgba(255,255,255,.28)", fontSize: 12, marginTop: 4, lineHeight: 1.65 }}>
                Use of YouTube features is subject to the{" "}
                <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,.38)", textDecoration: "none" }}>YouTube Terms of Service</a>
                {" "}and{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,.38)", textDecoration: "none" }}>Google Privacy Policy</a>.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(255,255,255,.32)", fontSize: 12.5 }}>&copy; 2026 CrossPost AI &middot; Not affiliated with Google, Meta, or LinkedIn.</p>
              <p style={{ color: "rgba(255,255,255,.28)", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                <HeartI /> Built for Creators, by Creators.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

