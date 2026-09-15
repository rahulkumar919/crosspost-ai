import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — CrossPost AI",
  description:
    "CrossPost AI Privacy Policy. Learn exactly how we collect, use, store, protect, and delete your personal data including Google, YouTube, Instagram, and LinkedIn API data.",
};

const EFFECTIVE_DATE = "September 10, 2026";
const LAST_UPDATED = "September 10, 2026";
const CONTACT_EMAIL = "rahulkumar9508548671@gmail.com";
const APP_NAME = "CrossPost AI";
const APP_URL = "https://crosspost-ai-teal.vercel.app";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: "#ffffff", color: "#111827", fontFamily: "Georgia, serif", lineHeight: "1.7" }}>
      {/* Sticky white navbar matching landing page */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #f3f4f6", boxShadow: "0 1px 12px rgba(0,0,0,0.06)", padding: "0 clamp(16px,4vw,40px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 17, fontWeight: 900, background: "linear-gradient(135deg,#6c63ff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em", fontFamily: "Arial, sans-serif" }}>
              CrossPost AI
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/terms" style={{ color: "#6b7280", textDecoration: "none", fontFamily: "Arial, sans-serif", fontSize: "14px", fontWeight: 500 }}>Terms of Service</Link>
            <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontFamily: "Arial, sans-serif", fontSize: "14px", fontWeight: 500 }}>Home</Link>
            <Link href="/login" style={{ color: "#ffffff", textDecoration: "none", backgroundColor: "#6c63ff", padding: "9px 20px", borderRadius: "10px", fontFamily: "Arial, sans-serif", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 14px rgba(108,99,255,.35)" }}>Go to App</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 32px 80px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#0f0f23", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>Privacy Policy</h1>
        <p style={{ color: "#666", marginBottom: "32px", fontFamily: "Arial, sans-serif", fontSize: "14px" }}>
          <strong>Effective Date:</strong> {EFFECTIVE_DATE} | <strong>Last Updated:</strong> {LAST_UPDATED} | <strong>Contact:</strong>{" "}
          <a href={"mailto:" + CONTACT_EMAIL} style={{ color: "#6c63ff" }}>{CONTACT_EMAIL}</a>
        </p>

        <div style={{ backgroundColor: "#fffbf0", border: "2px solid #f59e0b", borderRadius: "8px", padding: "20px 24px", marginBottom: "40px" }}>
          <h2 style={{ color: "#92400e", fontFamily: "Arial, sans-serif", fontSize: "16px", margin: "0 0 8px" }}>Google API Services — Limited Use Disclosure</h2>
          <p style={{ margin: 0, fontSize: "15px" }}>
            {APP_NAME} use of information received from Google APIs, including the YouTube Data API v3, adheres strictly to the Google API Services User Data Policy, including its Limited Use requirements. We use Google user data exclusively to provide the cross-posting features you explicitly requested. We do not use Google user data for advertising, we do not share it with third parties for their independent use, and we do not allow any human to read your Google user data without your explicit consent, except as required by applicable law.
          </p>
        </div>

        <section id="s1" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f0f23", fontFamily: "Arial, sans-serif", borderBottom: "2px solid #6c63ff", paddingBottom: "8px", marginBottom: "16px" }}>1. Who We Are</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "16px" }}>
            CrossPost AI is a social media cross-posting platform that enables creators and businesses to upload video and text content once and automatically publish it to YouTube, Instagram, and LinkedIn from one interface. Operated by <strong>Rahul Kumar</strong>. Contact: <a href={"mailto:" + CONTACT_EMAIL} style={{ color: "#6c63ff" }}>{CONTACT_EMAIL}</a>. Platform: <a href={APP_URL} style={{ color: "#6c63ff" }}>{APP_URL}</a>.
          </p>
        </section>

        <section id="s2" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f0f23", fontFamily: "Arial, sans-serif", borderBottom: "2px solid #6c63ff", paddingBottom: "8px", marginBottom: "16px" }}>2. What Data We Collect</h2>
          <h3 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>2.1 Account Information</h3>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Email address</strong> — for account creation, login, and OTP verification</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Password</strong> — stored as a bcrypt hash (cost factor 12); never stored in plaintext</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Display name</strong> — shown in your profile within the app</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Profile photo URL</strong> — from your Google profile if you sign in with Google</li>
          </ul>
          <h3 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>2.2 Google and YouTube Data</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "12px" }}>
            When you connect your YouTube channel, we receive and encrypt before storing:
          </p>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Google Account email</strong> — links your CrossPost AI account to your Google identity</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>YouTube Channel ID</strong> — identifies the channel for publishing</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>YouTube Channel Name and Thumbnail</strong> — displayed on the Accounts page</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>OAuth Access Token (AES-256-GCM encrypted)</strong> — authorizes YouTube API calls; valid ~1 hour</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>OAuth Refresh Token (AES-256-GCM encrypted)</strong> — allows automatic token renewal without re-authorization</li>
          </ul>
          <p style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "8px" }}>OAuth Scopes Requested from Google:</p>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "14px", lineHeight: "1.75", marginBottom: "8px" }}><code style={{ backgroundColor: "#f0f0f8", padding: "2px 6px", borderRadius: "3px", fontFamily: "monospace" }}>https://www.googleapis.com/auth/youtube.upload</code> — to upload video files to your YouTube channel using the videos.insert API method</li>
            <li style={{ fontSize: "14px", lineHeight: "1.75", marginBottom: "8px" }}><code style={{ backgroundColor: "#f0f0f8", padding: "2px 6px", borderRadius: "3px", fontFamily: "monospace" }}>https://www.googleapis.com/auth/youtube.readonly</code> — to read your channel name, ID, thumbnail, and video upload status using the channels.list and videos.list methods</li>
            <li style={{ fontSize: "14px", lineHeight: "1.75", marginBottom: "8px" }}><code style={{ backgroundColor: "#f0f0f8", padding: "2px 6px", borderRadius: "3px", fontFamily: "monospace" }}>https://www.googleapis.com/auth/userinfo.email</code> — to read your Google account email to link your CrossPost AI account to your Google identity</li>
            <li style={{ fontSize: "14px", lineHeight: "1.75", marginBottom: "8px" }}><code style={{ backgroundColor: "#f0f0f8", padding: "2px 6px", borderRadius: "3px", fontFamily: "monospace" }}>https://www.googleapis.com/auth/userinfo.profile</code> — to read your name and profile photo for display in the app</li>
          </ul>
          <p style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "16px" }}>
            We do NOT request access to Gmail, Google Drive, Google Contacts, Google Calendar, or any Google service beyond those listed above.
          </p>
          <h3 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>2.3 Instagram Data</h3>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Instagram User ID, Username, and encrypted OAuth Access Token</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Scopes: instagram_basic, instagram_content_publish, pages_read_engagement</li>
          </ul>
          <h3 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>2.4 LinkedIn Data</h3>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>LinkedIn Member URN, Full Name, Profile Photo URL, and encrypted OAuth Access Token</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Scopes: openid, profile, email, w_member_social</li>
          </ul>
          <h3 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>2.5 Content You Upload</h3>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Video and image files — temporarily stored on Cloudinary CDN; auto-deleted after 7 days</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Post titles, descriptions, hashtags, and scheduled publish times</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Published post records including platform-specific URLs and status</li>
          </ul>
        </section>

        <section id="s3" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f0f23", fontFamily: "Arial, sans-serif", borderBottom: "2px solid #6c63ff", paddingBottom: "8px", marginBottom: "16px" }}>3. How We Use Your Data</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "12px" }}>We use collected data only for these purposes:</p>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Authentication and maintaining your login session</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Publishing your content to YouTube, Instagram, and LinkedIn on your behalf using only the OAuth tokens you explicitly granted</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Generating AI-optimized titles, descriptions, and hashtags via Google Gemini AI</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Displaying connected accounts, post history, and analytics within the app</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Sending one-time passcodes (OTP) for email verification and secure login</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}>Preventing fraudulent or unauthorized activity through rate limiting</li>
          </ul>
          <div style={{ backgroundColor: "#fff0f0", border: "1px solid #ffcccc", borderRadius: "8px", padding: "16px 24px" }}>
            <p style={{ margin: "0 0 8px", fontWeight: "bold", color: "#cc0000", fontFamily: "Arial, sans-serif" }}>We Do NOT:</p>
            <ul style={{ paddingLeft: "24px", margin: "0" }}>
              <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "6px" }}>Sell, rent, or trade your personal data to any third party</li>
              <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "6px" }}>Use your data or content for advertising purposes</li>
              <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "6px" }}>Train AI models using your personal information or uploaded content</li>
              <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "6px" }}>Share your Google or YouTube data with unauthorized third parties</li>
              <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "6px" }}>Allow any human to read your Google user data without your explicit consent</li>
              <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "6px" }}>Use Google API data for any purpose not described in this policy</li>
            </ul>
          </div>
        </section>

        <section id="s4" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f0f23", fontFamily: "Arial, sans-serif", borderBottom: "2px solid #6c63ff", paddingBottom: "8px", marginBottom: "16px" }}>4. Google and YouTube API Data — Full Disclosure</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "16px" }}>
            CrossPost AI integrates with the YouTube Data API v3. The following YouTube Data API v3 methods are called on your behalf:
          </p>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>channels.list?part=snippet&amp;mine=true</strong> — called once at account connection to read channel name, ID, and thumbnail</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>videos.insert (resumable upload)</strong> — called each time you publish a video, uploading your file with your specified title, description, and tags</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>channels.list?part=statistics</strong> — called when you view your Analytics page to show subscriber count, views, and video count</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>videos.list?part=statistics</strong> — called to show view, like, and comment counts for individual uploaded videos</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Token refresh (oauth2.googleapis.com/token)</strong> — called automatically when your access token is within 5 minutes of expiry</li>
          </ul>
          <h3 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>4.1 YouTube Token Storage</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "16px" }}>
            All YouTube OAuth tokens are encrypted using AES-256-GCM (with a unique random 96-bit initialization vector per token) before being written to our PostgreSQL database. Tokens are decrypted only in server memory, only when needed for an active API call, and are never logged or written to disk in plaintext. Your YouTube tokens are never sent to your browser.
          </p>
          <h3 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>4.2 YouTube Data Retention</h3>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>While connected:</strong> Tokens are stored and refreshed automatically</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Upon disconnection:</strong> All YouTube tokens and channel metadata are permanently deleted from our database within seconds of clicking Disconnect</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Upon account deletion:</strong> All YouTube data is permanently deleted within 30 days of your deletion request</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Expired tokens:</strong> Tokens in EXPIRED state are automatically deleted after 90 days</li>
          </ul>
          <h3 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>4.3 How to Revoke YouTube Access</h3>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Within CrossPost AI:</strong> Accounts page → click Disconnect on the YouTube card → tokens are deleted immediately</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Via Google:</strong> Visit <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: "#6c63ff" }}>myaccount.google.com/permissions</a> → find CrossPost AI → click Remove Access</li>
          </ul>
          <h3 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>4.4 Applicable Terms</h3>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#6c63ff" }}>YouTube Terms of Service</a></li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#6c63ff" }}>Google Privacy Policy</a></li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#6c63ff" }}>Google API Services User Data Policy</a></li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><a href="https://developers.google.com/youtube/terms/api-services-terms-of-service" target="_blank" rel="noopener noreferrer" style={{ color: "#6c63ff" }}>YouTube API Services Terms of Service</a></li>
          </ul>
        </section>

        <section id="s5" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f0f23", fontFamily: "Arial, sans-serif", borderBottom: "2px solid #6c63ff", paddingBottom: "8px", marginBottom: "16px" }}>5. Data Storage and Security</h2>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>OAuth tokens:</strong> AES-256-GCM encrypted at rest; decrypted only in server memory for active API calls; never logged</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Passwords:</strong> bcrypt-hashed (cost factor 12); never stored or transmitted in plaintext</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Database (PostgreSQL on Neon):</strong> TLS-encrypted connections; AES-256 encrypted at rest; US East data center</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Media files:</strong> Cloudinary CDN with HTTPS-only access; auto-deleted after 7 days</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>API transport:</strong> All endpoints served over HTTPS/TLS 1.2+</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Session tokens:</strong> httpOnly cookies not accessible to JavaScript; signed JWTs with short expiry</li>
          </ul>
        </section>

        <section id="s6" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f0f23", fontFamily: "Arial, sans-serif", borderBottom: "2px solid #6c63ff", paddingBottom: "8px", marginBottom: "16px" }}>6. Data Retention and Deletion</h2>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Account data:</strong> Retained until you request account deletion via email to {CONTACT_EMAIL}</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>YouTube/Instagram/LinkedIn OAuth tokens:</strong> Deleted immediately when you disconnect the account in CrossPost AI, or within 30 days of account deletion request</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Uploaded media files:</strong> Auto-deleted after publishing or after 7 days maximum</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Server logs (IP, timestamps):</strong> Maximum 30 days; automatically purged</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>OTP codes:</strong> Expire automatically after 10 minutes</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Expired OAuth tokens:</strong> Automatically purged after 90 days in EXPIRED state</li>
          </ul>
          <p style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "16px" }}>
            To delete your account and all associated data, email <a href={"mailto:" + CONTACT_EMAIL} style={{ color: "#6c63ff" }}>{CONTACT_EMAIL}</a> with subject "Account Deletion Request" from your registered email. Deletion is completed within 30 days.
          </p>
        </section>

        <section id="s7" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f0f23", fontFamily: "Arial, sans-serif", borderBottom: "2px solid #6c63ff", paddingBottom: "8px", marginBottom: "16px" }}>7. Your Rights</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "12px" }}>
            You have the following rights regarding your personal data. Contact <a href={"mailto:" + CONTACT_EMAIL} style={{ color: "#6c63ff" }}>{CONTACT_EMAIL}</a> to exercise any right. We respond within 30 days.
          </p>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Right of Access:</strong> Request a copy of your personal data</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Right to Erasure:</strong> Request permanent deletion of all your data</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Right to Data Portability:</strong> Request a machine-readable export of your data</li>
            <li style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "8px" }}><strong>Right to Withdraw Consent:</strong> Disconnect any platform or delete your account at any time</li>
          </ul>
        </section>

        <section id="s8" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f0f23", fontFamily: "Arial, sans-serif", borderBottom: "2px solid #6c63ff", paddingBottom: "8px", marginBottom: "16px" }}>8. Contact Us</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.75", marginBottom: "12px" }}>
            For privacy inquiries, data requests, or account deletion:<br />
            <strong>Email:</strong> <a href={"mailto:" + CONTACT_EMAIL} style={{ color: "#6c63ff" }}>{CONTACT_EMAIL}</a><br />
            <strong>Platform:</strong> <a href={APP_URL} style={{ color: "#6c63ff" }}>{APP_URL}</a><br />
            <strong>Operator:</strong> Rahul Kumar<br />
            <strong>Response time:</strong> Within 5 business days for inquiries; 30 days for deletion requests.
          </p>
          <p style={{ fontSize: "15px", lineHeight: "1.75" }}>
            For Google/YouTube data access or deletion you may also use Google built-in tools at{" "}
            <a href="https://myaccount.google.com/data-and-privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#6c63ff" }}>myaccount.google.com/data-and-privacy</a>.
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #e0e0e0", marginBottom: "24px" }} />
        <p style={{ color: "#888", fontSize: "13px", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
          {APP_NAME} is not affiliated with, endorsed by, or sponsored by Google LLC, Meta Platforms Inc., or LinkedIn Corporation.
          Use of YouTube, Instagram, and LinkedIn features is subject to their respective terms of service.
        </p>
        <p style={{ color: "#888", fontSize: "13px", fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: "8px" }}>
          <Link href="/terms" style={{ color: "#6c63ff" }}>Terms of Service</Link> | <a href={"mailto:" + CONTACT_EMAIL} style={{ color: "#6c63ff" }}>{CONTACT_EMAIL}</a>
        </p>
      </main>
    </div>
  );
}
