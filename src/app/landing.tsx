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
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity .7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform .7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function StatCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { ref, inView } = useInView(0.4);
  const val = useCounter(end, inView);
  return (
    <div className="neuro-card" style={{ textAlign: "center", padding: "32px 24px", borderRadius: 24 }}>
      <div style={{ fontSize: "clamp(32px,4vw,50px)", fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg,#f472b6 0%,#c084fc 50%,#818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em" }}>
        {val.toLocaleString()}{suffix}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--tx-muted)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

/* ── Platform & UI Icons ─────────────────────────────────────────── */
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
function XI({ size = 20 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
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
function PlayI() { return <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><polygon points="6,4 20,12 6,20" /></svg>; }
function ClockI() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>; }
function Bar2I() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>; }
function StarI() { return <svg viewBox="0 0 24 24" fill="#fbbf24" width="14" height="14"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>; }
function ZapI({ s = 16 }: { s?: number }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>; }
function ChevI({ open }: { open: boolean }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .3s cubic-bezier(0.16,1,0.3,1)" }}><polyline points="6 9 12 15 18 9" /></svg>; }
function HeartI() { return <svg viewBox="0 0 24 24" fill="#ec4899" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>; }

/* ── Content Data ────────────────────────────────────────────────── */
const NAV = [
  { label: "Home", id: "home" },
  { label: "Preview", id: "showcase" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Features", id: "features" },
  { label: "Testimonials", id: "testimonials" },
  { label: "FAQ", id: "faq" },
];

const FEATS = [
  { num: "01", color: "#FF0000", glow: "rgba(255,0,0,.25)", bg: "rgba(255,0,0,.1)", Icon: YT, title: "YouTube Auto-Upload", desc: "Upload high-res videos to YouTube with automated AI title, description & tag generation. Full resumable chunking.", link: "Upload Smarter" },
  { num: "02", color: "#E1306C", glow: "rgba(225,48,108,.25)", bg: "rgba(225,48,108,.1)", Icon: IG, title: "Instagram Reels & Feed", desc: "Publish directly to Instagram Creator and Business accounts with official Meta Graph API integrations.", link: "Grow on Instagram" },
  { num: "03", color: "#0A66C2", glow: "rgba(10,102,194,.25)", bg: "rgba(10,102,194,.1)", Icon: LI, title: "LinkedIn Video Posting", desc: "Share native video content to your LinkedIn profile and corporate pages with viral, executive hooks.", link: "Build Your Network" },
  { num: "04", color: "#a78bfa", glow: "rgba(167,139,250,.25)", bg: "rgba(167,139,250,.1)", Icon: SparkleI, title: "Multimodal AI Copywriting", desc: "Tailors captions specifically for each algorithm — viral tags for Reels, SEO descriptions for YouTube.", link: "Let AI Optimize" },
  { num: "05", color: "#10b981", glow: "rgba(16,185,129,.25)", bg: "rgba(16,185,129,.1)", Icon: CalI, title: "Autonomous Scheduling", desc: "Schedule individual publish windows for each platform. Let your content hit peak timezone engagement.", link: "Plan Strategy" },
  { num: "06", color: "#38bdf8", glow: "rgba(56,189,248,.25)", bg: "rgba(56,189,248,.1)", Icon: BarI, title: "Omnichannel Analytics", desc: "Unified telemetry tracking views, retention, impressions and subscriber growth across every destination.", link: "Track Growth" },
  { num: "07", color: "#f472b6", glow: "rgba(244,114,182,.25)", bg: "rgba(244,114,182,.1)", Icon: LinkI, title: "Instant Multi-OAuth", desc: "Connect unlimited YouTube channels, Instagram profiles and LinkedIn pages in one-click OAuth 2.0.", link: "Connect Now" },
  { num: "08", color: "#818cf8", glow: "rgba(129,140,248,.25)", bg: "rgba(129,140,248,.1)", Icon: ShieldI, title: "Bank-Grade Encryption", desc: "AES-256-GCM hardware encryption for all access tokens. Zero credential storage, SOC-2 compliant practices.", link: "Security Details" },
];

const REVIEWS = [
  { name: "Sarah Chen", role: "Content Creator · 280K followers", av: "SC", col: "#818cf8", q: "CrossPost AI literally saves me 5+ hours every week. I drop in one video, and the tailored hooks and hashtags for each platform are better than what my agency produced.", stars: 5 },
  { name: "Marcus Rivera", role: "Digital Agency Director", av: "MR", col: "#10b981", q: "We manage 14 creator brands. CrossPost AI's unified scheduling and zero-friction pipeline made us 4x faster at executing omnichannel viral drops.", stars: 5 },
  { name: "Priya Kapoor", role: "Tech Educator · 120K YouTube", av: "PK", col: "#f59e0b", q: "From 3 tedious hours of manual uploading and writing descriptions to a 30-second workflow. My reach across LinkedIn and Reels skyrocketed by 65%.", stars: 5 },
];

const FAQS = [
  { q: "Which platforms are supported right now?", a: "CrossPost AI supports direct video publishing to YouTube (Shorts & Standard), Instagram (Reels & Feed), and LinkedIn (Personal profiles & Organization pages). More networks are being added continuously." },
  { q: "How does the AI optimize differently for each platform?", a: "Our proprietary AI engine analyzes your video topic and produces distinct assets: highly searchable keyword-dense titles and chapters for YouTube, punchy visual hooks and trending hashtags for Instagram, and insightful professional commentary for LinkedIn." },
  { q: "What happens if a network API experiences downtime?", a: "Our queue manager operates on exponential backoff retry logic. If an API temporarily rate limits or throttles, CrossPost AI automatically handles retries and notifies you if manual review is needed." },
];

/* ════════════════════════════════════════════════════════════════════
   $100M LUXURY NEUMORPHIC LANDING PAGE
═══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const [dark, setDark] = useState(false);
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

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // IntersectionObserver: start video1 when showcase enters viewport
  useEffect(() => {
    const section = videoSectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
  }, [mounted, videoMuted]);

  useEffect(() => {
    if (sVid1Ref.current) sVid1Ref.current.muted = videoMuted;
    if (sVid2Ref.current) sVid2Ref.current.muted = videoMuted;
  }, [videoMuted]);

  const go = (id: string) => {
    setMob(false);
    if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isDark = mounted ? dark : false;

  return (
    <div
      id="home"
      data-theme={isDark ? "dark" : "light"}
      suppressHydrationWarning
      className="lp-root"
      style={{
        fontFamily: "var(--font-sans), 'Inter', system-ui, sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style suppressHydrationWarning>{`
        :root, .lp-root[data-theme="light"] {
          --canvas: #FFFFFF;
          --canvas-alt: #F8FAFD;
          --canvas-elevated: #FFFFFF;
          --neuro-surf: #FFFFFF;
          --neuro-surf-hover: #FAFBFF;
          --neuro-outset: 0 16px 36px -10px rgba(15, 23, 42, 0.08), 0 4px 16px -2px rgba(15, 23, 42, 0.03), 0 0 0 1px rgba(15, 23, 42, 0.06), inset 0 1px 1px rgba(255, 255, 255, 1);
          --neuro-inset: inset 2px 2px 6px rgba(15, 23, 42, 0.05), inset -2px -2px 6px rgba(255, 255, 255, 0.9), 0 0 0 1px rgba(15, 23, 42, 0.05);
          --neuro-pill: 0 4px 14px -2px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1);
          --tx-main: #0B0A1C;
          --tx-sub: #334155;
          --tx-muted: #64748B;
          --bdr-subtle: rgba(15, 23, 42, 0.07);
          --bdr-specular: rgba(255, 255, 255, 1);
          --glow-ambient: radial-gradient(circle at 50% 0%, rgba(236,72,153,0.06) 0%, transparent 60%);
        }

        .lp-root[data-theme="dark"] {
          --canvas: #07070F;
          --canvas-alt: #0D0C1A;
          --canvas-elevated: #131126;
          --neuro-surf: linear-gradient(145deg, #120F24, #0A0817);
          --neuro-surf-hover: linear-gradient(145deg, #181432, #0D0A1E);
          --neuro-outset: 8px 8px 20px rgba(0,0,0,0.65), -5px -5px 15px rgba(255,255,255,0.03), inset 0 1px 1px rgba(255,255,255,0.12);
          --neuro-inset: inset 3px 3px 8px rgba(0,0,0,0.7), inset -2px -2px 6px rgba(255,255,255,0.04);
          --neuro-pill: 4px 4px 12px rgba(0,0,0,0.5), -2px -2px 8px rgba(255,255,255,0.04), inset 0 1px 1px rgba(255,255,255,0.15);
          --tx-main: #FFFFFF;
          --tx-sub: #CBD5E1;
          --tx-muted: #8E8AAF;
          --bdr-subtle: rgba(255,255,255,0.08);
          --bdr-specular: rgba(255,255,255,0.16);
          --glow-ambient: radial-gradient(circle at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 60%);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .lp-root {
          background-color: var(--canvas);
          color: var(--tx-main);
          transition: background-color .4s ease, color .4s ease;
        }

        /* ── Neumorphic Elements ── */
        .neuro-card {
          background: var(--neuro-surf);
          box-shadow: var(--neuro-outset);
          border: 1px solid var(--bdr-subtle);
          border-top: 1px solid var(--bdr-specular);
          transition: all .35s cubic-bezier(0.16,1,0.3,1);
        }
        .neuro-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(236,72,153,0.35);
        }
        .lp-root[data-theme="dark"] .neuro-card:hover {
          box-shadow: 14px 14px 32px rgba(0,0,0,0.7), -6px -6px 20px rgba(255,255,255,0.04), inset 0 1px 2px rgba(255,255,255,0.2);
          border-color: rgba(236,72,153,0.3);
        }

        .neuro-inset-box {
          background: var(--canvas-alt);
          box-shadow: var(--neuro-inset);
          border: 1px solid var(--bdr-subtle);
        }

        .neuro-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: var(--neuro-surf);
          box-shadow: var(--neuro-pill);
          border: 1px solid var(--bdr-subtle);
          border-top: 1px solid var(--bdr-specular);
          border-radius: 9999px;
          padding: 8px 20px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .neuro-btn-press {
          background: var(--neuro-surf);
          box-shadow: var(--neuro-pill);
          border: 1px solid var(--bdr-subtle);
          border-top: 1px solid var(--bdr-specular);
          border-radius: 14px;
          cursor: pointer;
          transition: all .25s ease;
        }
        .neuro-btn-press:hover {
          transform: translateY(-2px);
          background: var(--neuro-surf-hover);
        }
        .neuro-btn-press:active {
          transform: translateY(1px);
          box-shadow: var(--neuro-inset);
        }

        /* ── Primary $100M Hero CTA Button ── */
        .cta-radiant {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%);
          background-size: 220% auto;
          color: #FFFFFF !important;
          font-weight: 800;
          letter-spacing: -0.01em;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.35);
          box-shadow: 
            0 12px 36px -6px rgba(236,72,153,0.55),
            0 4px 16px rgba(139,92,246,0.4),
            inset 0 1px 2px rgba(255,255,255,0.45);
          text-decoration: none;
          transition: all .35s cubic-bezier(0.16,1,0.3,1);
          animation: cta-pulse 3s infinite alternate;
        }
        .cta-radiant:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 
            0 20px 48px -4px rgba(236,72,153,0.7),
            0 8px 24px rgba(139,92,246,0.55),
            inset 0 1px 2px rgba(255,255,255,0.6);
        }
        .cta-radiant:active {
          transform: translateY(1px) scale(0.99);
          box-shadow: 0 6px 18px rgba(236,72,153,0.5);
        }

        @keyframes cta-pulse {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        /* ── Floats for Phones ── */
        @keyframes float-l {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(-1deg); }
        }
        @keyframes float-r {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        .phone-l { animation: float-l 5.5s ease-in-out infinite; }
        .phone-r { animation: float-r 5.5s ease-in-out .7s infinite; }

        /* ── Nav Link Transitions ── */
        .nav-item {
          color: var(--tx-muted);
          font-size: 14px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 12px;
          text-decoration: none;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all .25s ease;
        }
        .nav-item:hover, .nav-item.act {
          color: var(--tx-main);
          background: var(--neuro-surf);
          box-shadow: var(--neuro-pill);
          border-color: var(--bdr-subtle);
        }

        /* ── Clean Scrollbars ── */
        ::-webkit-scrollbar { width: 7px; }
        ::-webkit-scrollbar-track { background: var(--canvas); }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(236,72,153,0.5); }

        /* ── Responsive adjustments ── */
        @media(max-width: 980px) {
          .desktop-phone { display: none !important; }
          .desktop-nav { display: none !important; }
          .mob-btn { display: flex !important; }
        }
        @media(min-width: 981px) {
          .mob-btn { display: none !important; }
        }
      `}</style>

      {/* ── FLOATING BLURRED HEADER ───────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 16,
          left: 0,
          right: 0,
          zIndex: 200,
          padding: "0 clamp(16px, 4vw, 36px)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 22px",
            borderRadius: 22,
            background: scrolled
              ? (isDark ? "rgba(10, 8, 23, 0.82)" : "rgba(255, 255, 255, 0.82)")
              : (isDark ? "rgba(14, 12, 28, 0.65)" : "rgba(255, 255, 255, 0.65)"),
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--bdr-subtle)",
            borderTop: "1px solid var(--bdr-specular)",
            boxShadow: scrolled
              ? (isDark ? "0 20px 40px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)" : "0 15px 35px -10px rgba(148,163,184,0.3)")
              : "none",
            pointerEvents: "auto",
            transition: "all .3s ease",
          }}
        >
          {/* Brand Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div
              style={{
                position: "relative",
                width: 36,
                height: 36,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 0 0 1.5px rgba(236,72,153,0.4), 0 6px 16px rgba(236,72,153,0.3)",
              }}
            >
              <Image src="/logo.png" alt="CrossPost AI" fill sizes="36px" style={{ objectFit: "cover" }} priority />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.03em", color: "var(--tx-main)", lineHeight: 1 }}>
                CrossPost <span style={{ background: "linear-gradient(135deg, #ec4899, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
              </div>
              <div style={{ fontSize: 9.5, color: "var(--tx-muted)", fontWeight: 600, letterSpacing: ".06em", marginTop: 2, textTransform: "uppercase" }}>
                Omnichannel Creator OS
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => { go(item.id); setNav(item.label); }}
                className={`nav-item ${nav === item.label ? "act" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions & Theme toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setDark(!dark)}
              className="neuro-btn-press"
              style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tx-main)" }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <SunI /> : <MoonI />}
            </button>

            <Link
              href="/login"
              className="cta-radiant"
              style={{ padding: "9px 24px", fontSize: 14, borderRadius: 14 }}
            >
              Sign In <Arr />
            </Link>

            <button
              className="mob-btn neuro-btn-press"
              onClick={() => setMob(!mob)}
              style={{ width: 40, height: 40, display: "none", alignItems: "center", justifyContent: "center", color: "var(--tx-main)" }}
            >
              {mob ? <CloseI /> : <HamI />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mob && (
          <div
            className="neuro-card"
            style={{
              maxWidth: 1240,
              margin: "10px auto 0",
              borderRadius: 22,
              padding: "16px 20px",
              pointerEvents: "auto",
            }}
          >
            {NAV.map((l) => (
              <button
                key={l.label}
                onClick={() => { go(l.id); setNav(l.label); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: nav === l.label ? "#f472b6" : "var(--tx-main)",
                  background: "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                {l.label}
              </button>
            ))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--bdr-subtle)" }}>
              <Link
                href="/login"
                className="cta-radiant"
                style={{ width: "100%", padding: "14px", borderRadius: 14, fontSize: 15 }}
              >
                Sign In to Studio →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT SECTIONS ─────────────────────────────────── */}
      <main style={{ paddingTop: 100 }}>

        {/* ── 1. HERO SECTION ───────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            minHeight: "calc(100vh - 100px)",
            display: "flex",
            alignItems: "center",
            padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 40px)",
            overflow: "hidden",
          }}
        >
          {/* Ambient Neumorphic Light Orbs */}
          <div aria-hidden style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 900, height: 600, background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.08) 40%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)" }} />
          <div aria-hidden style={{ position: "absolute", bottom: -80, left: "-10%", width: "50%", height: 450, background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 65%)", pointerEvents: "none", filter: "blur(60px)" }} />
          <div aria-hidden style={{ position: "absolute", bottom: -80, right: "-10%", width: "50%", height: 450, background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%)", pointerEvents: "none", filter: "blur(60px)" }} />
          {/* Subtle Grid dots */}
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} 1px, transparent 0)`, backgroundSize: "32px 32px", pointerEvents: "none" }} />

          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
              position: "relative",
              zIndex: 10,
            }}
          >
            {/* Left Phone — Video 1 (YouTube Shorts) */}
            <div className="desktop-phone" style={{ flex: "0 0 215px" }}>
              <div
                className="phone-l neuro-card"
                style={{
                  width: 215,
                  borderRadius: 32,
                  padding: 8,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Screen bezel */}
                <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#000", height: 360 }}>
                  {/* Floating badge */}
                  <div style={{ position: "absolute", top: 12, left: 12, zIndex: 20, display: "flex", alignItems: "center", gap: 7, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", padding: "5px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)" }}>
                    <YT size={16} />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#fff", lineHeight: 1 }}>YouTube</div>
                      <div style={{ fontSize: 8, color: "#10b981", fontWeight: 700, marginTop: 1 }}>AI-Ready</div>
                    </div>
                  </div>

                  {/* Sound Toggle */}
                  <button
                    onClick={() => toggleMute(vid1Ref, v1Muted, setV1Muted)}
                    style={{ position: "absolute", top: 12, right: 12, zIndex: 20, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
                  >
                    {v1Muted ? "🔇" : "🔊"}
                  </button>

                  <div style={{ width: "100%", height: "100%", cursor: "pointer" }} onClick={() => togglePlay(vid1Ref, setV1Playing)}>
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
                    {!v1Playing && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><PlayI /></div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ padding: "8px 10px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--tx-muted)" }}>video1.mp4</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#FF0000" }}>● LIVE</span>
                </div>
              </div>
            </div>

            {/* Center Hero Copy with Neumorphic Spacing */}
            <div style={{ flex: "1 1 auto", textAlign: "center", maxWidth: 660, margin: "0 auto" }}>
              <FadeUp delay={50}>
                <div className="neuro-pill-badge" style={{ marginBottom: 28 }}>
                  <ZapI s={15} />
                  <span style={{ background: "linear-gradient(135deg, #ec4899, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Next-Gen Omnichannel Automation
                  </span>
                </div>
              </FadeUp>

              <FadeUp delay={120}>
                <h1
                  style={{
                    fontSize: "clamp(38px, 6vw, 76px)",
                    fontWeight: 900,
                    lineHeight: 1.02,
                    letterSpacing: "-0.04em",
                    marginBottom: 26,
                    color: "var(--tx-main)",
                  }}
                >
                  Publish Everywhere.
                  <span
                    style={{
                    display: "block",
                    background: "linear-gradient(135deg, #ec4899 0%, #d946ef 40%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 10px 30px rgba(236,72,153,0.3)",
                  }}
                >
                  Zero Extra Effort.
                </span>
                </h1>
              </FadeUp>

              <FadeUp delay={200}>
                <p
                  style={{
                    fontSize: "clamp(15px, 2vw, 18px)",
                    color: "var(--tx-sub)",
                    maxWidth: 540,
                    margin: "0 auto 36px",
                    lineHeight: 1.8,
                  }}
                >
                  Upload your video once. CrossPost AI adapts your copy and simultaneously delivers to <strong style={{ color: "var(--tx-main)" }}>YouTube Shorts</strong>, <strong style={{ color: "var(--tx-main)" }}>Instagram Reels</strong>, and <strong style={{ color: "var(--tx-main)" }}>LinkedIn</strong> with algorithmic precision.
                </p>
              </FadeUp>

              {/* Main Call to Action */}
              <FadeUp delay={280}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <Link
                    href="/login"
                    className="cta-radiant"
                    style={{
                      padding: "clamp(16px, 2.2vw, 20px) clamp(36px, 5vw, 56px)",
                      fontSize: "clamp(16px, 2vw, 19px)",
                      borderRadius: 20,
                    }}
                  >
                    <span>Sign In &amp; Launch Studio</span>
                    <Arr />
                  </Link>
                  <p style={{ fontSize: 12.5, color: "var(--tx-muted)", fontWeight: 600 }}>
                    Instant Setup · No Credit Card Required · Free Access
                  </p>
                </div>
              </FadeUp>

              {/* Platform Badges with Specular Outsets */}
              <FadeUp delay={360}>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 42 }}>
                  {[
                    { label: "YouTube", icon: <YT size={20} />, col: "rgba(255,0,0,0.18)" },
                    { label: "Instagram", icon: <IG size={20} />, col: "rgba(225,48,108,0.18)" },
                    { label: "LinkedIn", icon: <LI size={20} />, col: "rgba(10,102,194,0.18)" },
                  ].map((p, i) => (
                    <div
                      key={i}
                      className="neuro-btn-press"
                      style={{
                        padding: "10px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        borderRadius: 16,
                      }}
                    >
                      {p.icon}
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--tx-main)" }}>{p.label}</span>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Right Phone — Video 2 (Instagram Reels) */}
            <div className="desktop-phone" style={{ flex: "0 0 215px" }}>
              <div
                className="phone-r neuro-card"
                style={{
                  width: 215,
                  borderRadius: 32,
                  padding: 8,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#000", height: 360 }}>
                  <div style={{ position: "absolute", top: 12, left: 12, zIndex: 20, display: "flex", alignItems: "center", gap: 7, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", padding: "5px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)" }}>
                    <IG size={16} />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#fff", lineHeight: 1 }}>Instagram</div>
                      <div style={{ fontSize: 8, color: "#10b981", fontWeight: 700, marginTop: 1 }}>Auto-Sync</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleMute(vid2Ref, v2Muted, setV2Muted)}
                    style={{ position: "absolute", top: 12, right: 12, zIndex: 20, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
                  >
                    {v2Muted ? "🔇" : "🔊"}
                  </button>

                  <div style={{ width: "100%", height: "100%", cursor: "pointer" }} onClick={() => togglePlay(vid2Ref, setV2Playing)}>
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
                    {!v2Playing && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><PlayI /></div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ padding: "8px 10px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--tx-muted)" }}>video2.mp4</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#E1306C" }}>● REELS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. METRIC HIGHLIGHTS STRIP ─────────────────────────────── */}
        <section style={{ padding: "0 clamp(20px, 5vw, 40px) clamp(60px, 8vw, 90px)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            <StatCounter end={12000} suffix="+" label="Videos Distributed" />
            <StatCounter end={450} suffix="K+" label="Collective Views Generated" />
            <StatCounter end={15} suffix="hrs" label="Saved Per Creator / Month" />
          </div>
        </section>

        {/* ── 3. INTERACTIVE VIDEO SHOWCASE ─────────────────────────── */}
        <section
          id="showcase"
          ref={videoSectionRef}
          style={{
            background: "var(--canvas-alt)",
            borderTop: "1px solid var(--bdr-subtle)",
            borderBottom: "1px solid var(--bdr-subtle)",
            padding: "clamp(80px, 10vw, 130px) clamp(20px, 5vw, 40px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Ambient Backing */}
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 20%, rgba(236,72,153,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 620, margin: "0 auto", position: "relative", zIndex: 10 }}>
            <FadeUp style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="neuro-pill-badge" style={{ marginBottom: 16 }}>
                🎬 Cinematic Experience
              </div>
              <h2 style={{ fontSize: "clamp(26px, 4.5vw, 46px)", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--tx-main)", lineHeight: 1.1, marginBottom: 14 }}>
                Watch CrossPost AI{" "}
                <span style={{ background: "linear-gradient(135deg, #ec4899, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  In Real Action
                </span>
              </h2>
              <p style={{ fontSize: 14.5, color: "var(--tx-muted)", lineHeight: 1.6 }}>
                Tap tabs below to preview the automated workflow from raw upload to finished multi-channel drop.
              </p>
            </FadeUp>

            {/* Video Tab Selector */}
            <div style={{ display: "flex", gap: 14, marginBottom: 26, justifyContent: "center" }}>
              {([1, 2] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setActiveVideo(n);
                    if (n === 1) {
                      sVid2Ref.current?.pause(); setSv2Playing(false);
                      if (sVid1Ref.current) {
                        sVid1Ref.current.currentTime = 0;
                        sVid1Ref.current.muted = videoMuted;
                        sVid1Ref.current.play().then(() => setSv1Playing(true)).catch(() => { });
                      }
                    } else {
                      sVid1Ref.current?.pause(); setSv1Playing(false);
                      if (sVid2Ref.current) {
                        sVid2Ref.current.currentTime = 0;
                        sVid2Ref.current.muted = videoMuted;
                        sVid2Ref.current.play().then(() => setSv2Playing(true)).catch(() => { });
                      }
                    }
                  }}
                  className="neuro-btn-press"
                  style={{
                    flex: 1,
                    maxWidth: 220,
                    padding: "14px 20px",
                    border: `1.5px solid ${activeVideo === n ? (n === 1 ? "rgba(255,0,0,0.5)" : "rgba(225,48,108,0.5)") : "var(--bdr-subtle)"}`,
                    background: activeVideo === n ? "var(--canvas-elevated)" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {n === 1 ? <YT size={18} /> : <IG size={18} />}
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--tx-main)" }}>
                        {n === 1 ? "YouTube Demo" : "Instagram Demo"}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--tx-muted)", marginTop: 2 }}>
                        {n === 1 ? "AI Title & Tagging" : "Instant Reel Sync"}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* ── Active Video Showcase Card ── */}
            <div className="neuro-card" style={{ borderRadius: 32, padding: 12, position: "relative" }}>
              {/* Top Controls Overlay */}
              <div style={{ position: "absolute", top: 26, right: 26, zIndex: 30, display: "flex", gap: 10 }}>
                <button
                  onClick={() => setVideoMuted(!videoMuted)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.65)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(12px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {videoMuted ? "🔇" : "🔊"}
                </button>
              </div>

              {/* Video 1 Container */}
              <div style={{ display: activeVideo === 1 ? "block" : "none", position: "relative", borderRadius: 24, overflow: "hidden", background: "#000" }}>
                <video
                  ref={sVid1Ref}
                  src="/video1.mp4"
                  muted={videoMuted}
                  playsInline
                  style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", display: "block" }}
                  onPlay={() => setSv1Playing(true)}
                  onPause={() => setSv1Playing(false)}
                  onEnded={() => {
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
                {!sv1Playing && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)" }}>
                    <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(16px)", border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PlayI />
                    </div>
                  </div>
                )}
              </div>

              {/* Video 2 Container */}
              <div style={{ display: activeVideo === 2 ? "block" : "none", position: "relative", borderRadius: 24, overflow: "hidden", background: "#000" }}>
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
                {!sv2Playing && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)" }}>
                    <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(16px)", border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PlayI />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: "18px 12px 6px" }}>
                <p style={{ fontSize: 13.5, fontWeight: 800, color: "var(--tx-main)" }}>
                  {activeVideo === 1 ? "Step 01 — Intelligent Extraction & Metadata" : "Step 02 — Multi-Channel Viral Dispatch"}
                </p>
                <p style={{ fontSize: 12.5, color: "var(--tx-muted)", lineHeight: 1.6, marginTop: 4 }}>
                  {activeVideo === 1
                    ? "Gemini AI reads your topic and generates high-converting titles, descriptions, and hashtags tailored for YouTube search rank."
                    : "Simultaneously reformats and dispatches directly to Instagram Reels with custom visual tags and optimal audio alignment."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS (3-STEP TACTILE ARCHITECTURE) ───────── */}
        <section id="how-it-works" style={{ padding: "clamp(90px, 11vw, 140px) clamp(20px, 5vw, 40px)", position: "relative" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <FadeUp style={{ textAlign: "center", marginBottom: "clamp(48px, 6vw, 76px)" }}>
              <div className="neuro-pill-badge" style={{ marginBottom: 16 }}>
                ⚡ Architectural Workflow
              </div>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 54px)", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--tx-main)", lineHeight: 1.05, marginBottom: 16 }}>
                Three Steps. <span style={{ background: "linear-gradient(135deg, #ec4899, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Infinite Reach.</span>
              </h2>
              <p style={{ color: "var(--tx-sub)", fontSize: "clamp(15px, 2vw, 17px)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                Engineered to eliminate the copy-paste nightmare of social media management.
              </p>
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 28 }}>
              {/* Step 1 */}
              <FadeUp delay={0}>
                <div className="neuro-card" style={{ borderRadius: 28, padding: "36px 30px", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg, #ec4899, #f43f5e)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 24, boxShadow: "0 8px 24px rgba(236,72,153,0.4)" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="26" height="26"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#ec4899", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>PHASE 01</span>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: "var(--tx-main)", marginBottom: 12, letterSpacing: "-0.03em" }}>Single Source Upload</h3>
                  <p style={{ fontSize: 14.5, color: "var(--tx-muted)", lineHeight: 1.75, flex: 1 }}>
                    Upload standard MP4, MOV, or vertical Reels into our encrypted ingestion pipeline. Automatic edge optimization handles CDN distribution.
                  </p>
                  <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
                    {["Ultra-Fast CDN", "Resumable", "4K Ready"].map((tag) => (
                      <span key={tag} className="neuro-inset-box" style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 8, color: "var(--tx-sub)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* Step 2 */}
              <FadeUp delay={120}>
                <div className="neuro-card" style={{ borderRadius: 28, padding: "36px 30px", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg, #a78bfa, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 24, boxShadow: "0 8px 24px rgba(139,92,246,0.4)" }}>
                    <SparkleI size={28} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#a78bfa", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>PHASE 02</span>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: "var(--tx-main)", marginBottom: 12, letterSpacing: "-0.03em" }}>Algorithmic Adaptation</h3>
                  <p style={{ fontSize: 14.5, color: "var(--tx-muted)", lineHeight: 1.75, flex: 1 }}>
                    Gemini AI synthesizes three independent variations: SEO metadata for YouTube, viral engagement hooks for Instagram, and executive copy for LinkedIn.
                  </p>
                  <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { c: "#FF0000", t: "YouTube SEO Title & Chapters" },
                      { c: "#E1306C", t: "Instagram Viral Hook & Tags" },
                      { c: "#0A66C2", t: "LinkedIn Thought-Leadership Copy" },
                    ].map((row) => (
                      <div key={row.t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--tx-sub)" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: row.c, flexShrink: 0 }} />
                        {row.t}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* Step 3 */}
              <FadeUp delay={240}>
                <div className="neuro-card" style={{ borderRadius: 28, padding: "36px 30px", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 24, boxShadow: "0 8px 24px rgba(16,185,129,0.4)" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="26" height="26"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#10b981", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>PHASE 03</span>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: "var(--tx-main)", marginBottom: 12, letterSpacing: "-0.03em" }}>One-Click Multicast</h3>
                  <p style={{ fontSize: 14.5, color: "var(--tx-muted)", lineHeight: 1.75, flex: 1 }}>
                    Hit dispatch to broadcast instantly across all platforms simultaneously, or assign scheduled release triggers to capture audience peaks.
                  </p>
                  <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[{ I: <YT size={14} />, label: "YouTube Connected" }, { I: <IG size={14} />, label: "Instagram Connected" }, { I: <LI size={14} />, label: "LinkedIn Connected" }].map((ch) => (
                      <div key={ch.label} className="neuro-inset-box" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderRadius: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{ch.I}<span style={{ fontSize: 12, fontWeight: 700, color: "var(--tx-sub)" }}>{ch.label}</span></div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#10b981", fontSize: 10, fontWeight: 800 }}>
                          <Check /> <span>READY</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── 5. FULL PLATFORM FEATURES ─────────────────────────────── */}
        <section id="features" style={{ background: "var(--canvas-alt)", borderTop: "1px solid var(--bdr-subtle)", padding: "clamp(90px, 11vw, 140px) clamp(20px, 5vw, 40px)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <FadeUp style={{ textAlign: "center", marginBottom: "clamp(50px, 6vw, 80px)" }}>
              <div className="neuro-pill-badge" style={{ marginBottom: 16 }}>
                💎 Enterprise Arsenal
              </div>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 54px)", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--tx-main)", lineHeight: 1.05, marginBottom: 16 }}>
                Everything You Need to <span style={{ background: "linear-gradient(135deg, #ec4899, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dominate</span>
              </h2>
              <p style={{ color: "var(--tx-sub)", fontSize: "clamp(15px, 2vw, 17px)", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
                Built to scale seamlessly from solo creators to global multi-brand media companies.
              </p>
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {FEATS.map((f, i) => (
                <FadeUp key={f.title} delay={(i % 4) * 60 + Math.floor(i / 4) * 80}>
                  <div className="neuro-card" style={{ borderRadius: 24, padding: "28px 24px", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: f.bg, border: `1px solid ${f.color}33`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, boxShadow: `0 6px 18px ${f.glow}` }}>
                        <f.Icon size={22} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 900, color: "var(--tx-muted)", opacity: 0.5, fontVariantNumeric: "tabular-nums" }}>
                        {f.num}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: "var(--tx-main)", marginBottom: 10, letterSpacing: "-0.02em" }}>
                      {f.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "var(--tx-muted)", lineHeight: 1.7, flex: 1, marginBottom: 20 }}>
                      {f.desc}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: f.color, cursor: "pointer" }}>
                      <span>{f.link}</span>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: f.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Arr />
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. SOCIAL PROOF / CREATOR ENDORSEMENTS ────────────────── */}
        <section id="testimonials" style={{ padding: "clamp(90px, 11vw, 140px) clamp(20px, 5vw, 40px)", position: "relative" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeUp style={{ textAlign: "center", marginBottom: "clamp(48px, 6vw, 76px)" }}>
              <div className="neuro-pill-badge" style={{ marginBottom: 16 }}>
                ⭐ Verified Creator Impact
              </div>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 54px)", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--tx-main)", marginBottom: 14 }}>
                Loved by High-Growth Creators
              </h2>
              <p style={{ color: "var(--tx-sub)", fontSize: "clamp(15px, 2vw, 17px)" }}>
                See how top creators save hundreds of hours while expanding their multi-platform reach.
              </p>
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 26 }}>
              {REVIEWS.map((t, i) => (
                <FadeUp key={t.name} delay={i * 120}>
                  <div className="neuro-card" style={{ borderRadius: 28, padding: "32px 28px", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
                      {Array.from({ length: t.stars }).map((_, s) => <StarI key={s} />)}
                    </div>
                    <p style={{ color: "var(--tx-sub)", fontSize: 15, lineHeight: 1.8, marginBottom: 28, fontStyle: "italic", flex: 1 }}>
                      &ldquo;{t.q}&rdquo;
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg, ${t.col}, #6366f1)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff", boxShadow: `0 6px 18px ${t.col}40` }}>
                        {t.av}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--tx-main)" }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: "var(--tx-muted)", marginTop: 2 }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. FREQUENTLY ASKED QUESTIONS ─────────────────────────── */}
        <section id="faq" style={{ background: "var(--canvas-alt)", borderTop: "1px solid var(--bdr-subtle)", padding: "clamp(90px, 11vw, 140px) clamp(20px, 5vw, 40px)" }}>
          <div style={{ maxWidth: 840, margin: "0 auto" }}>
            <FadeUp style={{ textAlign: "center", marginBottom: "clamp(48px, 6vw, 76px)" }}>
              <div className="neuro-pill-badge" style={{ marginBottom: 16 }}>
                💡 Clear Answers
              </div>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 54px)", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--tx-main)", marginBottom: 14 }}>
                Frequently Asked
              </h2>
              <p style={{ color: "var(--tx-sub)", fontSize: "clamp(15px, 2vw, 17px)" }}>
                Everything you need to know about the platform, APIs, and security.
              </p>
            </FadeUp>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {FAQS.map((item, i) => (
                <FadeUp key={i} delay={i * 60}>
                  <div
                    className="neuro-card"
                    style={{
                      borderRadius: 20,
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => setFaq(faq === i ? null : i)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 20,
                        padding: "22px 28px",
                        color: "var(--tx-main)",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: "clamp(15px, 2vw, 17px)", fontWeight: 800, lineHeight: 1.4 }}>
                        {item.q}
                      </span>
                      <span style={{ color: faq === i ? "#f472b6" : "var(--tx-muted)" }}>
                        <ChevI open={faq === i} />
                      </span>
                    </button>
                    {faq === i && (
                      <div
                        style={{
                          padding: "0 28px 24px",
                          fontSize: 15,
                          color: "var(--tx-sub)",
                          lineHeight: 1.8,
                          borderTop: "1px solid var(--bdr-subtle)",
                          paddingTop: 18,
                        }}
                      >
                        {item.a}
                      </div>
                    )}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. PRE-FOOTER INVITATION CTA ──────────────────────────── */}
        <section style={{ padding: "clamp(80px, 10vw, 120px) clamp(20px, 5vw, 40px)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(236,72,153,0.2) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)", pointerEvents: "none", filter: "blur(60px)" }} />
          
          <div className="neuro-card" style={{ maxWidth: 960, margin: "0 auto", borderRadius: 36, padding: "clamp(48px, 7vw, 76px) clamp(24px, 5vw, 56px)", textAlign: "center", position: "relative", zIndex: 10 }}>
            <h2 style={{ fontSize: "clamp(30px, 5.5vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--tx-main)", lineHeight: 1.08, marginBottom: 18 }}>
              Ready to Expand Your Reach <span style={{ background: "linear-gradient(135deg, #ec4899, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>10x?</span>
            </h2>
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--tx-sub)", maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.75 }}>
              Join creators who spend less time uploading and more time creating great work.
            </p>
            <Link
              href="/login"
              className="cta-radiant"
              style={{
                padding: "18px 48px",
                fontSize: 18,
                borderRadius: 18,
              }}
            >
              Get Started Free →
            </Link>
          </div>
        </section>

      </main>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer style={{ background: isDark ? "#06050C" : "#0F0D1E", color: "#fff", borderTop: "1px solid var(--bdr-subtle)", position: "relative" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(50px, 6vw, 70px) clamp(20px, 5vw, 40px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 32, marginBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 36 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", overflow: "hidden", position: "relative" }}>
                <Image src="/logo.png" alt="CrossPost AI" fill sizes="44px" style={{ objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
                  CrossPost <span style={{ background: "linear-gradient(135deg, #ec4899, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Create Once. Post Everywhere.</div>
              </div>
            </div>

            {/* Social channels */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { I: <YT size={18} />, bg: "rgba(255,0,0,0.15)", brd: "rgba(255,0,0,0.3)" },
                { I: <IG size={18} />, bg: "rgba(225,48,108,0.15)", brd: "rgba(225,48,108,0.3)" },
                { I: <LI size={18} />, bg: "rgba(10,102,194,0.15)", brd: "rgba(10,102,194,0.3)" },
                { I: <XI size={18} />, bg: "rgba(255,255,255,0.08)", brd: "rgba(255,255,255,0.18)" },
              ].map((s, i) => (
                <div key={i} style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, border: `1px solid ${s.brd}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  {s.I}
                </div>
              ))}
            </div>

            {/* Links */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
              {[["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms"], ["Contact", `mailto:${CONTACT_EMAIL}`]].map(([label, href]) => (
                <Link key={label} href={href} style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                  {label}
                </Link>
              ))}
              <Link href="/login" className="cta-radiant" style={{ padding: "10px 22px", borderRadius: 12, fontSize: 14 }}>
                Sign In →
              </Link>
            </div>
          </div>

          {/* Legal Disclaimers & Credits */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.7 }}>
                Operated by Rahul Kumar &middot; <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#a78bfa", textDecoration: "none" }}>{CONTACT_EMAIL}</a>
              </p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4 }}>
                Use of YouTube features is subject to the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>YouTube Terms of Service</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Google Privacy Policy</a>.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5 }}>
                &copy; 2026 CrossPost AI. Not affiliated with Google, Meta, or LinkedIn.
              </p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                <HeartI /> Built for Creators, by Creators.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
