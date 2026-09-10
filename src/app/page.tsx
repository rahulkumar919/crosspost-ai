import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CrossPost AI — One Post, Every Platform",
  description:
    "CrossPost AI lets creators upload one video and automatically publish it to YouTube, Instagram, and LinkedIn simultaneously. AI-powered titles, descriptions, and hashtags included.",
  keywords: ["cross-posting", "social media automation", "YouTube upload", "Instagram publish", "LinkedIn posting", "AI content", "video publishing"],
};

const APP_URL = "https://crosspost-ai-teal.vercel.app";
const CONTACT_EMAIL = "rahulkumar9508548671@gmail.com";

export default function LandingPage() {
  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: "#0f0f23", color: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif", minHeight: "100vh" }}>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "0 40px" }}>
        <nav style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px", fontWeight: "900", background: "linear-gradient(135deg, #a78bfa, #6c63ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ✦ CrossPost AI
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Link href="/privacy-policy" style={{ color: "#a0a0c0", textDecoration: "none", fontSize: "14px", padding: "8px 12px" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: "#a0a0c0", textDecoration: "none", fontSize: "14px", padding: "8px 12px" }}>Terms</Link>
            <Link href="/login" style={{ color: "#ffffff", textDecoration: "none", backgroundColor: "rgba(108,99,255,0.2)", border: "1px solid #6c63ff", padding: "8px 20px", borderRadius: "8px", fontSize: "14px" }}>
              Sign In
            </Link>
            <Link href="/login" style={{ color: "#ffffff", textDecoration: "none", backgroundColor: "#6c63ff", padding: "8px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "bold" }}>
              Get Started Free
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section style={{ textAlign: "center", padding: "80px 40px 60px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "inline-block", backgroundColor: "rgba(108,99,255,0.15)", border: "1px solid rgba(108,99,255,0.4)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#a78bfa", marginBottom: "24px" }}>
          🚀 AI-Powered Social Media Cross-Posting
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "900", lineHeight: "1.1", marginBottom: "24px", background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 60%, #6c63ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          One Post.<br />Every Platform.
        </h1>
        <p style={{ fontSize: "18px", color: "#a0a0c0", maxWidth: "600px", margin: "0 auto 40px", lineHeight: "1.7" }}>
          CrossPost AI lets you upload your video once and automatically publish it to
          YouTube, Instagram, and LinkedIn simultaneously — with AI-generated titles,
          descriptions, and hashtags optimized for each platform.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login" style={{ display: "inline-block", backgroundColor: "#6c63ff", color: "#ffffff", textDecoration: "none", padding: "14px 32px", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", boxShadow: "0 0 30px rgba(108,99,255,0.4)" }}>
            Start Posting for Free →
          </Link>
          <Link href="/privacy-policy" style={{ display: "inline-block", backgroundColor: "transparent", color: "#a0a0c0", textDecoration: "none", padding: "14px 32px", borderRadius: "10px", fontSize: "16px", border: "1px solid rgba(255,255,255,0.15)" }}>
            Privacy Policy
          </Link>
        </div>

        {/* Platform badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "48px", flexWrap: "wrap" }}>
          {[
            { name: "YouTube", color: "#FF0000", emoji: "▶" },
            { name: "Instagram", color: "#E1306C", emoji: "📷" },
            { name: "LinkedIn", color: "#0077B5", emoji: "in" },
          ].map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 20px" }}>
              <span style={{ fontSize: "18px" }}>{p.emoji}</span>
              <span style={{ fontSize: "15px", fontWeight: "bold" }}>{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "800", marginBottom: "12px" }}>How CrossPost AI Works</h2>
          <p style={{ textAlign: "center", color: "#a0a0c0", fontSize: "16px", marginBottom: "60px", maxWidth: "500px", margin: "0 auto 60px" }}>
            Three simple steps to publish your content everywhere at once.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              {
                step: "01",
                title: "Upload Your Video",
                desc: "Upload your video file (MP4, MOV, AVI) directly in CrossPost AI. Our system securely stores it on Cloudinary CDN and processes it for each platform.",
                color: "#6c63ff",
              },
              {
                step: "02",
                title: "AI Generates Your Content",
                desc: "CrossPost AI uses Google Gemini AI to automatically generate platform-optimized titles, descriptions, and hashtags for YouTube, Instagram, and LinkedIn.",
                color: "#a78bfa",
              },
              {
                step: "03",
                title: "Publish Everywhere Instantly",
                desc: "With one click, CrossPost AI publishes your video to all connected platforms simultaneously. Schedule posts for the perfect time, or publish immediately.",
                color: "#34d399",
              },
            ].map((item) => (
              <div key={item.step} style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "32px" }}>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: item.color, marginBottom: "12px", letterSpacing: "2px" }}>STEP {item.step}</div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", margin: "0 0 12px" }}>{item.title}</h3>
                <p style={{ color: "#a0a0c0", fontSize: "15px", lineHeight: "1.7", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "800", marginBottom: "60px" }}>Everything You Need to Cross-Post</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {[
              { icon: "🎬", title: "YouTube Upload", desc: "Upload videos directly to your YouTube channel with title, description, tags, and privacy settings. Supports resumable uploads for large files." },
              { icon: "📸", title: "Instagram Publishing", desc: "Post photos, videos, and Reels to your Instagram Business or Creator account via the Instagram Graph API." },
              { icon: "💼", title: "LinkedIn Posting", desc: "Share videos and text posts to your LinkedIn professional profile and company pages via the LinkedIn REST API." },
              { icon: "🤖", title: "AI Content Generation", desc: "Google Gemini AI generates optimized titles, descriptions, and hashtags for each platform based on your content." },
              { icon: "📅", title: "Content Scheduling", desc: "Schedule your posts for the optimal time on each platform. Set different publish times for YouTube, Instagram, and LinkedIn." },
              { icon: "📊", title: "Analytics Dashboard", desc: "Track views, likes, comments, and subscribers across YouTube, Instagram, and LinkedIn from one unified dashboard." },
              { icon: "🔗", title: "Connect Multiple Accounts", desc: "Connect your YouTube, Instagram, and LinkedIn accounts in seconds using secure OAuth 2.0 authorization. No passwords stored." },
              { icon: "🔒", title: "Bank-Grade Security", desc: "OAuth tokens encrypted with AES-256-GCM. Passwords hashed with bcrypt. All API calls over HTTPS/TLS. Your data is never sold." },
            ].map((f) => (
              <div key={f.title} style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "24px" }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "8px", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ color: "#a0a0c0", fontSize: "14px", lineHeight: "1.65", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Data & Privacy Section ─────────────────────────────────── */}
      <section style={{ backgroundColor: "rgba(108,99,255,0.05)", border: "1px solid rgba(108,99,255,0.15)", borderRadius: "16px", maxWidth: "900px", margin: "0 auto 80px", padding: "48px 40px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "16px", textAlign: "center" }}>Your Data, Your Control</h2>
        <p style={{ color: "#a0a0c0", textAlign: "center", fontSize: "15px", marginBottom: "32px", lineHeight: "1.7" }}>
          CrossPost AI requests permission to access your social media accounts only to publish the content you choose.
          We encrypt all OAuth tokens with AES-256-GCM, never sell your data, and you can revoke access at any time.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            "✅ No data sold to third parties",
            "✅ AES-256-GCM encrypted tokens",
            "✅ Revoke access any time",
            "✅ Delete your data on request",
            "✅ No advertising cookies",
            "✅ Google API Limited Use compliant",
          ].map((item) => (
            <div key={item} style={{ fontSize: "14px", color: "#d0d0ff", padding: "4px 0" }}>{item}</div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <Link href="/privacy-policy" style={{ display: "inline-block", backgroundColor: "rgba(108,99,255,0.2)", color: "#a78bfa", textDecoration: "none", padding: "12px 28px", borderRadius: "8px", border: "1px solid rgba(108,99,255,0.4)", fontSize: "15px", fontWeight: "bold" }}>
            Read Our Full Privacy Policy →
          </Link>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section style={{ textAlign: "center", padding: "60px 40px 80px" }}>
        <h2 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "16px" }}>Ready to Post Everywhere at Once?</h2>
        <p style={{ color: "#a0a0c0", fontSize: "16px", marginBottom: "32px" }}>
          Sign up free. Connect your YouTube, Instagram, and LinkedIn. Start cross-posting in minutes.
        </p>
        <Link href="/login" style={{ display: "inline-block", backgroundColor: "#6c63ff", color: "#ffffff", textDecoration: "none", padding: "16px 40px", borderRadius: "12px", fontSize: "18px", fontWeight: "bold", boxShadow: "0 0 40px rgba(108,99,255,0.5)" }}>
          Get Started for Free →
        </Link>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "40px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "16px", background: "linear-gradient(135deg, #a78bfa, #6c63ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            ✦ CrossPost AI
          </p>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "12px" }}>
            Operated by Rahul Kumar · Contact:{" "}
            <a href={"mailto:" + CONTACT_EMAIL} style={{ color: "#6c63ff" }}>{CONTACT_EMAIL}</a>
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginBottom: "16px" }}>
            <Link href="/privacy-policy" style={{ color: "#6c63ff", textDecoration: "none", fontSize: "14px" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: "#6c63ff", textDecoration: "none", fontSize: "14px" }}>Terms of Service</Link>
            <a href={"mailto:" + CONTACT_EMAIL} style={{ color: "#6c63ff", textDecoration: "none", fontSize: "14px" }}>Contact Us</a>
          </div>
          <p style={{ color: "#444", fontSize: "12px", marginBottom: "8px" }}>
            CrossPost AI is not affiliated with, endorsed by, or sponsored by Google LLC, Meta Platforms Inc., or LinkedIn Corporation.
          </p>
          <p style={{ color: "#444", fontSize: "12px" }}>
            Use of YouTube features is subject to the{" "}
            <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#555" }}>YouTube Terms of Service</a>
            {" "}and{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#555" }}>Google Privacy Policy</a>.
          </p>
          <p style={{ color: "#333", fontSize: "12px", marginTop: "12px" }}>
            © {new Date().getFullYear()} CrossPost AI · <a href={APP_URL} style={{ color: "#444" }}>{APP_URL}</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
