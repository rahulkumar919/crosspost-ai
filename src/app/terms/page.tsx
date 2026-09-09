import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "CrossPost AI Terms of Service — the rules governing your use of our platform.",
};

const LAST_UPDATED = "September 9, 2026";
const CONTACT_EMAIL = "rahulkumar9508548671@gmail.com";
const APP_NAME = "CrossPost AI";
const APP_URL = "https://crosspost-ai-teal.vercel.app";

export default function TermsPage() {
  return (
    <div className="terms-page">
      {/* ── Nav ── */}
      <header className="terms-nav">
        <Link href="/" className="terms-nav-logo">
          <span className="logo-icon">✦</span>
          {APP_NAME}
        </Link>
        <nav className="terms-nav-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/login" className="btn-nav">
            Back to App
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="terms-hero">
        <div className="terms-hero-inner">
          <div className="terms-badge">Terms of Service</div>
          <h1 className="terms-hero-title">
            Rules &amp; <span className="gradient-text">Responsibilities</span>
          </h1>
          <p className="terms-hero-sub">
            Last updated: <strong>{LAST_UPDATED}</strong>
          </p>
          <p className="terms-hero-desc">
            By using {APP_NAME}, you agree to these Terms of Service. Please
            read them carefully before using the platform.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <main className="terms-content">
        <div className="terms-toc">
          <h2 className="toc-title">Table of Contents</h2>
          <ol className="toc-list">
            {[
              "Acceptance of Terms",
              "Description of Service",
              "Eligibility",
              "User Accounts",
              "Acceptable Use",
              "Content Ownership",
              "Third-Party Platforms",
              "AI-Generated Content",
              "Disclaimers",
              "Limitation of Liability",
              "Termination",
              "Changes to Terms",
              "Contact Us",
            ].map((item, i) => (
              <li key={i}>
                <a href={`#t-section-${i + 1}`}>
                  {i + 1}. {item}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="terms-sections">
          <section id="t-section-1" className="policy-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using {APP_NAME} at{" "}
              <a href={APP_URL}>{APP_URL}</a>, you agree to be bound by these
              Terms of Service. If you do not agree, you may not use the
              service.
            </p>
          </section>

          <section id="t-section-2" className="policy-section">
            <h2>2. Description of Service</h2>
            <p>
              {APP_NAME} is a content cross-posting platform that allows users
              to upload media and publish it simultaneously to multiple social
              media platforms including YouTube, Instagram, and LinkedIn.
              Additional features include AI-powered content generation and
              post scheduling.
            </p>
          </section>

          <section id="t-section-3" className="policy-section">
            <h2>3. Eligibility</h2>
            <ul>
              <li>You must be at least 13 years of age to use {APP_NAME}.</li>
              <li>
                You must have the legal right to use the third-party platform
                accounts you connect (YouTube, Instagram, LinkedIn).
              </li>
              <li>
                If you are using the service on behalf of an organization, you
                represent that you have the authority to bind that organization
                to these terms.
              </li>
            </ul>
          </section>

          <section id="t-section-4" className="policy-section">
            <h2>4. User Accounts</h2>
            <ul>
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
              <li>
                You are responsible for all activity that occurs under your
                account.
              </li>
              <li>
                You must notify us immediately at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you
                suspect unauthorized access to your account.
              </li>
              <li>
                We reserve the right to suspend or terminate accounts that
                violate these terms.
              </li>
            </ul>
          </section>

          <section id="t-section-5" className="policy-section">
            <h2>5. Acceptable Use</h2>
            <p>You agree NOT to use {APP_NAME} to:</p>
            <ul>
              <li>
                Publish content that violates the terms of service of any
                connected platform (YouTube, Instagram, LinkedIn)
              </li>
              <li>
                Upload, publish, or distribute illegal, defamatory, harassing,
                abusive, hateful, or obscene content
              </li>
              <li>Infringe on any intellectual property rights</li>
              <li>
                Attempt to reverse-engineer, hack, or disrupt the service
              </li>
              <li>
                Use automated bots or scripts to abuse the API beyond normal
                usage
              </li>
              <li>
                Circumvent any rate limits or security measures
              </li>
              <li>
                Impersonate any person or entity
              </li>
            </ul>
            <div className="policy-highlight">
              Violations may result in immediate account termination and
              reporting to the relevant platform or authorities.
            </div>
          </section>

          <section id="t-section-6" className="policy-section">
            <h2>6. Content Ownership</h2>
            <ul>
              <li>
                <strong>Your content:</strong> You retain full ownership of all
                content you upload and publish through {APP_NAME}.
              </li>
              <li>
                <strong>License to operate:</strong> You grant {APP_NAME} a
                limited, non-exclusive license to store, process, and transmit
                your content solely for the purpose of delivering the service.
              </li>
              <li>
                We do not claim ownership of your content and will not use it
                for any purpose beyond operating the service.
              </li>
              <li>
                You are solely responsible for ensuring you have the rights to
                any content you publish through the platform.
              </li>
            </ul>
          </section>

          <section id="t-section-7" className="policy-section">
            <h2>7. Third-Party Platforms</h2>
            <p>
              {APP_NAME} connects to third-party platforms (YouTube, Instagram,
              LinkedIn) using their official APIs. By connecting these accounts:
            </p>
            <ul>
              <li>
                You authorize {APP_NAME} to act on your behalf on those
                platforms within the permissions you grant.
              </li>
              <li>
                You remain responsible for complying with each platform&apos;s
                own terms of service.
              </li>
              <li>
                We are not responsible for any actions taken by third-party
                platforms, including content removal, account suspension, or API
                changes.
              </li>
            </ul>
            <p>
              {APP_NAME}&apos;s use of YouTube API Services is subject to the{" "}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube Terms of Service
              </a>
              .
            </p>
          </section>

          <section id="t-section-8" className="policy-section">
            <h2>8. AI-Generated Content</h2>
            <ul>
              <li>
                {APP_NAME} provides AI-generated titles, descriptions, and
                hashtags as suggestions only.
              </li>
              <li>
                You are solely responsible for reviewing and approving any
                AI-generated content before publishing.
              </li>
              <li>
                We make no guarantees about the accuracy, quality, or
                appropriateness of AI-generated content.
              </li>
            </ul>
          </section>

          <section id="t-section-9" className="policy-section">
            <h2>9. Disclaimers</h2>
            <p>
              {APP_NAME} is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied.
            </p>
            <ul>
              <li>
                We do not warrant that the service will be uninterrupted,
                error-free, or available at all times.
              </li>
              <li>
                We are not responsible for failed or delayed posts due to
                third-party platform downtime or API rate limits.
              </li>
              <li>
                We reserve the right to modify, suspend, or discontinue the
                service at any time.
              </li>
            </ul>
          </section>

          <section id="t-section-10" className="policy-section">
            <h2>10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {APP_NAME} and its
              operators shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including but not
              limited to:
            </p>
            <ul>
              <li>Loss of data or content</li>
              <li>Lost profits or revenue</li>
              <li>Damage to reputation</li>
              <li>
                Damages resulting from third-party platform actions
              </li>
            </ul>
          </section>

          <section id="t-section-11" className="policy-section">
            <h2>11. Termination</h2>
            <p>
              Either party may terminate the relationship at any time:
            </p>
            <ul>
              <li>
                <strong>You:</strong> Delete your account from within the app
                or by emailing us.
              </li>
              <li>
                <strong>Us:</strong> We may suspend or terminate your account
                for violations of these terms, with or without notice.
              </li>
            </ul>
            <p>
              Upon termination, your data will be deleted according to our{" "}
              <Link href="/privacy-policy#section-7">Data Retention Policy</Link>.
            </p>
          </section>

          <section id="t-section-12" className="policy-section">
            <h2>12. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. We will
              notify you of significant changes via email or in-app
              notification. Continued use of the service after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section id="t-section-13" className="policy-section">
            <h2>13. Contact Us</h2>
            <p>For any questions about these Terms of Service:</p>
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
      <footer className="terms-footer">
        <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <div className="footer-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </div>
      </footer>

      <style>{`
        .terms-page {
          min-height: 100vh;
          background: #0a0812;
          color: #e8e6f8;
          font-family: var(--font-sans, 'Inter', sans-serif);
        }
        .terms-nav {
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
        .terms-nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
        }
        .logo-icon { color: #6c5ce7; font-size: 1.2rem; }
        .terms-nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .terms-nav-links a {
          color: #a09ab8;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .terms-nav-links a:hover { color: #fff; }
        .btn-nav {
          background: #6c5ce7 !important;
          color: #fff !important;
          padding: 0.5rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
        }
        .terms-hero {
          padding: 5rem 2rem 3rem;
          text-align: center;
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(108,92,231,0.15) 0%, transparent 70%);
        }
        .terms-hero-inner { max-width: 680px; margin: 0 auto; }
        .terms-badge {
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
        .terms-hero-title {
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
        .terms-hero-sub { color: #a09ab8; margin-bottom: 1rem; font-size: 0.95rem; }
        .terms-hero-desc { color: #c5c0d8; line-height: 1.7; font-size: 1rem; }
        .terms-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 3rem 2rem 5rem;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 3rem;
          align-items: start;
        }
        .terms-toc {
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
        .terms-sections { display: flex; flex-direction: column; gap: 2.5rem; }
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
        .policy-section p {
          color: #b8b3cc;
          line-height: 1.75;
          margin: 0 0 0.9rem;
          font-size: 0.95rem;
        }
        .policy-section ul {
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
        .policy-section a { color: #a29bfe; text-decoration: underline; text-underline-offset: 3px; }
        .policy-section a:hover { color: #fff; }
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
        .contact-card {
          background: rgba(108,92,231,0.08);
          border: 1px solid rgba(108,92,231,0.25);
          border-radius: 12px;
          padding: 1.2rem 1.5rem;
          margin-top: 1rem;
        }
        .contact-card p { margin: 0.25rem 0; color: #c5c0d8; font-size: 0.95rem; }
        .contact-card a { color: #a29bfe; }
        .terms-footer {
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
        @media (max-width: 768px) {
          .terms-content { grid-template-columns: 1fr; }
          .terms-toc { position: static; }
          .terms-nav-links a:not(.btn-nav) { display: none; }
        }
      `}</style>
    </div>
  );
}
