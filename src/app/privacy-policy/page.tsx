import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "CrossPost AI Privacy Policy — how we collect, use, and protect your data when you connect YouTube, Instagram, and LinkedIn.",
};

const LAST_UPDATED = "September 9, 2026";
const CONTACT_EMAIL = "rahulkumar9508548671@gmail.com";
const APP_NAME = "CrossPost AI";
const APP_URL = "https://crosspost-ai-teal.vercel.app";

export default function PrivacyPolicyPage() {
  return (
    <div className="privacy-page">
      {/* ── Nav Bar ── */}
      <header className="privacy-nav">
        <Link href="/" className="privacy-nav-logo">
          <span className="logo-icon">✦</span>
          {APP_NAME}
        </Link>
        <nav className="privacy-nav-links">
          <Link href="/terms">Terms of Service</Link>
          <Link href="/login" className="btn-nav">
            Back to App
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="privacy-hero">
        <div className="privacy-hero-inner">
          <div className="privacy-badge">Privacy Policy</div>
          <h1 className="privacy-hero-title">
            Your privacy is our <span className="gradient-text">priority</span>
          </h1>
          <p className="privacy-hero-sub">
            Last updated: <strong>{LAST_UPDATED}</strong>
          </p>
          <p className="privacy-hero-desc">
            This Privacy Policy explains how {APP_NAME} collects, uses, and
            protects your personal information when you use our platform to
            publish content to YouTube, Instagram, and LinkedIn.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <main className="privacy-content">
        <div className="privacy-toc">
          <h2 className="toc-title">Table of Contents</h2>
          <ol className="toc-list">
            {[
              "Information We Collect",
              "How We Use Your Information",
              "Google / YouTube Data",
              "Instagram Data",
              "LinkedIn Data",
              "Data Storage & Security",
              "Data Retention",
              "Third-Party Services",
              "Your Rights",
              "Children's Privacy",
              "Changes to This Policy",
              "Contact Us",
            ].map((item, i) => (
              <li key={i}>
                <a href={`#section-${i + 1}`}>
                  {i + 1}. {item}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="privacy-sections">
          {/* 1 */}
          <section id="section-1" className="policy-section">
            <h2>1. Information We Collect</h2>
            <p>We collect the following categories of information:</p>
            <h3>1.1 Account Information</h3>
            <ul>
              <li>Email address and password (hashed with bcrypt)</li>
              <li>Display name and profile photo (if provided via Google Sign-In)</li>
            </ul>
            <h3>1.2 Connected Platform Data</h3>
            <p>
              When you connect a social media account (YouTube, Instagram,
              LinkedIn), we receive and securely store:
            </p>
            <ul>
              <li>OAuth access and refresh tokens (AES-256-GCM encrypted at rest)</li>
              <li>Platform user ID and display name</li>
              <li>Platform username / channel name</li>
              <li>Profile photo URL</li>
            </ul>
            <h3>1.3 Content You Create</h3>
            <ul>
              <li>Videos, images, and other media files you upload for publishing</li>
              <li>Titles, descriptions, tags, and hashtags you write or generate via AI</li>
              <li>Scheduled publish times</li>
            </ul>
            <h3>1.4 Usage Data</h3>
            <ul>
              <li>Pages visited within the app</li>
              <li>API request logs (IP address, timestamp, endpoint) for security purposes</li>
            </ul>
          </section>

          {/* 2 */}
          <section id="section-2" className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Authenticate you and maintain your session</li>
              <li>Publish your content to the platforms you have connected</li>
              <li>
                Generate AI-powered titles, descriptions, and hashtags using
                your uploaded content
              </li>
              <li>Send email OTP codes for account verification</li>
              <li>Display a history of your published and scheduled posts</li>
              <li>Detect and prevent fraudulent or abusive activity</li>
            </ul>
            <div className="policy-highlight">
              <strong>We do NOT:</strong> sell your data to third parties, use
              your content for advertising, or train AI models on your personal
              content.
            </div>
          </section>

          {/* 3 */}
          <section id="section-3" className="policy-section">
            <h2>3. Google / YouTube Data</h2>
            <p>
              {APP_NAME} uses the YouTube API Services to upload videos and
              manage your YouTube channel on your behalf. By connecting your
              YouTube account, you authorize us to:
            </p>
            <ul>
              <li>Upload videos to your YouTube channel</li>
              <li>Set video titles, descriptions, tags, and privacy settings</li>
              <li>Read your channel ID and display name</li>
            </ul>
            <p>
              Your use of YouTube features within {APP_NAME} is also subject to
              the{" "}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Privacy Policy
              </a>
              .
            </p>
            <p>
              You can revoke {APP_NAME}&apos;s access to your Google account at
              any time by visiting{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Account Permissions
              </a>
              .
            </p>
            <div className="policy-highlight policy-highlight--info">
              <strong>Scopes requested:</strong>
              <br />
              <code>https://www.googleapis.com/auth/youtube.upload</code> —
              Upload videos
              <br />
              <code>https://www.googleapis.com/auth/youtube</code> — Manage
              your YouTube account
              <br />
              <code>email, profile, openid</code> — Basic Google identity
            </div>
          </section>

          {/* 4 */}
          <section id="section-4" className="policy-section">
            <h2>4. Instagram Data</h2>
            <p>
              When you connect Instagram (via Meta), we access your Instagram
              Business or Creator account to:
            </p>
            <ul>
              <li>Publish photos, videos, and reels to your profile</li>
              <li>Read your Instagram user ID and username</li>
            </ul>
            <p>
              This integration complies with the{" "}
              <a
                href="https://developers.facebook.com/terms/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meta Platform Terms
              </a>
              . You can revoke access via your{" "}
              <a
                href="https://www.instagram.com/accounts/manage_access/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram App Settings
              </a>
              .
            </p>
          </section>

          {/* 5 */}
          <section id="section-5" className="policy-section">
            <h2>5. LinkedIn Data</h2>
            <p>
              When you connect LinkedIn, we access your profile to:
            </p>
            <ul>
              <li>Publish text posts, articles, images, and videos to your feed</li>
              <li>Read your LinkedIn member ID, name, and profile picture</li>
            </ul>
            <p>
              This integration complies with the{" "}
              <a
                href="https://www.linkedin.com/legal/l/api-terms-of-use"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn API Terms of Use
              </a>
              . You can revoke access via{" "}
              <a
                href="https://www.linkedin.com/psettings/permitted-services"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Permitted Services
              </a>
              .
            </p>
          </section>

          {/* 6 */}
          <section id="section-6" className="policy-section">
            <h2>6. Data Storage &amp; Security</h2>
            <ul>
              <li>
                <strong>Database:</strong> PostgreSQL hosted on{" "}
                <a href="https://neon.tech" target="_blank" rel="noopener noreferrer">
                  Neon
                </a>{" "}
                (US East region) with TLS in transit and AES-256-GCM encryption
                for sensitive tokens.
              </li>
              <li>
                <strong>Media files:</strong> Uploaded to{" "}
                <a
                  href="https://cloudinary.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cloudinary
                </a>
                , a secure cloud storage provider.
              </li>
              <li>
                <strong>OAuth tokens:</strong> Encrypted at rest using
                AES-256-GCM before being stored in the database. Decrypted
                only in memory when needed for API calls.
              </li>
              <li>
                <strong>Passwords:</strong> Never stored in plaintext. Hashed
                using bcrypt with a cost factor of 12.
              </li>
              <li>
                <strong>Transport:</strong> All communication uses HTTPS/TLS.
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section id="section-7" className="policy-section">
            <h2>7. Data Retention</h2>
            <ul>
              <li>
                <strong>Account data:</strong> Retained while your account is
                active. Deleted within 30 days of account deletion.
              </li>
              <li>
                <strong>OAuth tokens:</strong> Deleted immediately when you
                disconnect a platform or delete your account.
              </li>
              <li>
                <strong>Published post records:</strong> Retained for 12 months
                then purged, unless you delete them earlier.
              </li>
              <li>
                <strong>Media files:</strong> Removed from Cloudinary within 48
                hours of post creation or on manual deletion.
              </li>
            </ul>
          </section>

          {/* 8 */}
          <section id="section-8" className="policy-section">
            <h2>8. Third-Party Services</h2>
            <p>We use the following third-party services to operate {APP_NAME}:</p>
            <div className="third-party-table">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Purpose</th>
                    <th>Privacy Policy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Google / YouTube</td>
                    <td>OAuth authentication &amp; video publishing</td>
                    <td>
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Meta / Instagram</td>
                    <td>OAuth authentication &amp; content publishing</td>
                    <td>
                      <a href="https://www.facebook.com/policy.php" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>LinkedIn</td>
                    <td>OAuth authentication &amp; content publishing</td>
                    <td>
                      <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Neon</td>
                    <td>PostgreSQL database hosting</td>
                    <td>
                      <a href="https://neon.tech/privacy-policy" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Cloudinary</td>
                    <td>Media storage &amp; delivery</td>
                    <td>
                      <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Google Gemini AI</td>
                    <td>AI content generation</td>
                    <td>
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Render</td>
                    <td>Backend API hosting</td>
                    <td>
                      <a href="https://render.com/privacy" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 9 */}
          <section id="section-9" className="policy-section">
            <h2>9. Your Rights</h2>
            <p>You have the following rights regarding your data:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request a copy of the data we hold
                about you.
              </li>
              <li>
                <strong>Correction:</strong> Update inaccurate personal data.
              </li>
              <li>
                <strong>Deletion:</strong> Delete your account and all
                associated data by emailing us or using the in-app delete
                option.
              </li>
              <li>
                <strong>Revoke OAuth access:</strong> Disconnect any platform
                at any time from the Accounts page. You can also revoke
                directly from the platform (Google, Meta, LinkedIn).
              </li>
              <li>
                <strong>Data portability:</strong> Request an export of your
                post history and account data.
              </li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>

          {/* 10 */}
          <section id="section-10" className="policy-section">
            <h2>10. Children's Privacy</h2>
            <p>
              {APP_NAME} is not directed at children under the age of 13. We do
              not knowingly collect personal information from children under 13.
              If we become aware that a child under 13 has provided us with
              personal information, we will delete it immediately.
            </p>
          </section>

          {/* 11 */}
          <section id="section-11" className="policy-section">
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will update the &quot;Last updated&quot; date at the top of
              this page. For significant changes, we will notify you via email
              or an in-app notification.
            </p>
            <p>
              Continued use of {APP_NAME} after changes constitutes acceptance
              of the updated policy.
            </p>
          </section>

          {/* 12 */}
          <section id="section-12" className="policy-section">
            <h2>12. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests about this Privacy
              Policy, please contact us:
            </p>
            <div className="contact-card">
              <p>
                <strong>{APP_NAME}</strong>
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
              <p>
                Website:{" "}
                <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                  {APP_URL}
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="privacy-footer">
        <p>
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <div className="footer-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </div>
      </footer>

      <style>{`
        /* ── Layout ── */
        .privacy-page {
          min-height: 100vh;
          background: #0a0812;
          color: #e8e6f8;
          font-family: var(--font-sans, 'Inter', sans-serif);
        }

        /* ── Nav ── */
        .privacy-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 2rem;
          border-bottom: 1px solid rgba(108,92,231,0.2);
          background: rgba(10,8,18,0.9);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .privacy-nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
        }
        .logo-icon {
          color: #6c5ce7;
          font-size: 1.2rem;
        }
        .privacy-nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .privacy-nav-links a {
          color: #a09ab8;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .privacy-nav-links a:hover { color: #fff; }
        .btn-nav {
          background: #6c5ce7 !important;
          color: #fff !important;
          padding: 0.5rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
        }

        /* ── Hero ── */
        .privacy-hero {
          padding: 5rem 2rem 3rem;
          text-align: center;
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(108,92,231,0.15) 0%, transparent 70%);
        }
        .privacy-hero-inner { max-width: 680px; margin: 0 auto; }
        .privacy-badge {
          display: inline-block;
          background: rgba(108,92,231,0.2);
          border: 1px solid rgba(108,92,231,0.4);
          color: #a29bfe;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          margin-bottom: 1.5rem;
        }
        .privacy-hero-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          color: #fff;
          margin: 0 0 0.75rem;
          line-height: 1.15;
        }
        .gradient-text {
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .privacy-hero-sub {
          color: #a09ab8;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        .privacy-hero-desc {
          color: #c5c0d8;
          line-height: 1.7;
          font-size: 1rem;
        }

        /* ── Content ── */
        .privacy-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 3rem 2rem 5rem;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 3rem;
          align-items: start;
        }

        /* ── TOC ── */
        .privacy-toc {
          position: sticky;
          top: 5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(108,92,231,0.2);
          border-radius: 14px;
          padding: 1.5rem;
        }
        .toc-title {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6c5ce7;
          margin: 0 0 1rem;
        }
        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .toc-list li { counter-increment: none; }
        .toc-list a {
          color: #a09ab8;
          text-decoration: none;
          font-size: 0.82rem;
          line-height: 1.4;
          display: block;
          padding: 0.2rem 0;
          transition: color 0.2s;
        }
        .toc-list a:hover { color: #a29bfe; }

        /* ── Sections ── */
        .privacy-sections { display: flex; flex-direction: column; gap: 2.5rem; }
        .policy-section {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(108,92,231,0.15);
          border-radius: 16px;
          padding: 2rem;
        }
        .policy-section h2 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(108,92,231,0.2);
        }
        .policy-section h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #c5c0d8;
          margin: 1.25rem 0 0.5rem;
        }
        .policy-section p {
          color: #b8b3cc;
          line-height: 1.75;
          margin: 0 0 0.9rem;
          font-size: 0.95rem;
        }
        .policy-section ul, .policy-section ol {
          padding-left: 1.4rem;
          margin: 0 0 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .policy-section li {
          color: #b8b3cc;
          font-size: 0.95rem;
          line-height: 1.65;
        }
        .policy-section a {
          color: #a29bfe;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .policy-section a:hover { color: #fff; }
        .policy-section code {
          background: rgba(108,92,231,0.15);
          color: #a29bfe;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.82rem;
          font-family: monospace;
        }

        /* ── Highlight box ── */
        .policy-highlight {
          background: rgba(108,92,231,0.1);
          border-left: 3px solid #6c5ce7;
          border-radius: 0 8px 8px 0;
          padding: 1rem 1.2rem;
          font-size: 0.9rem;
          color: #c5c0d8;
          line-height: 1.7;
          margin-top: 1rem;
        }
        .policy-highlight--info {
          background: rgba(9,132,227,0.08);
          border-left-color: #0984e3;
        }

        /* ── Table ── */
        .third-party-table { overflow-x: auto; margin-top: 0.5rem; }
        .third-party-table table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }
        .third-party-table th {
          background: rgba(108,92,231,0.15);
          color: #a29bfe;
          font-weight: 600;
          text-align: left;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(108,92,231,0.3);
        }
        .third-party-table td {
          padding: 0.7rem 1rem;
          border-bottom: 1px solid rgba(108,92,231,0.1);
          color: #b8b3cc;
        }
        .third-party-table tr:last-child td { border-bottom: none; }
        .third-party-table a { color: #a29bfe; }

        /* ── Contact card ── */
        .contact-card {
          background: rgba(108,92,231,0.08);
          border: 1px solid rgba(108,92,231,0.25);
          border-radius: 12px;
          padding: 1.2rem 1.5rem;
          margin-top: 1rem;
        }
        .contact-card p { margin: 0.25rem 0; color: #c5c0d8; font-size: 0.95rem; }
        .contact-card a { color: #a29bfe; }

        /* ── Footer ── */
        .privacy-footer {
          border-top: 1px solid rgba(108,92,231,0.2);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          color: #6b6585;
          font-size: 0.85rem;
        }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links a { color: #6b6585; text-decoration: none; }
        .footer-links a:hover { color: #a29bfe; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .privacy-content {
            grid-template-columns: 1fr;
          }
          .privacy-toc { position: static; }
          .privacy-nav-links a:not(.btn-nav) { display: none; }
        }
      `}</style>
    </div>
  );
}
