import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — CrossPost AI",
  description:
    "CrossPost AI Privacy Policy. Learn how we collect, use, store, and protect your personal data, including Google and YouTube API data, when you use CrossPost AI.",
};

const EFFECTIVE_DATE = "September 9, 2026";
const CONTACT_EMAIL = "rahulkumar9508548671@gmail.com";
const APP_NAME = "CrossPost AI";
const APP_URL = "https://crosspost-ai-teal.vercel.app";

export default function PrivacyPolicyPage() {
  return (
    <div style={styles.page}>
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header style={styles.nav}>
        <Link href="/" style={styles.navLogo}>
          <span style={styles.logoIcon}>✦</span>
          {APP_NAME}
        </Link>
        <nav style={styles.navLinks}>
          <Link href="/terms" style={styles.navLink}>Terms of Service</Link>
          <Link href="/login" style={styles.navBtn}>Go to App</Link>
        </nav>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={styles.hero}>
        <p style={styles.heroBadge}>Legal · Privacy Policy</p>
        <h1 style={styles.heroTitle}>Privacy Policy</h1>
        <p style={styles.heroMeta}>
          Effective Date: <strong>{EFFECTIVE_DATE}</strong>
        </p>
        <p style={styles.heroDesc}>
          This Privacy Policy describes how <strong>{APP_NAME}</strong> (&quot;we&quot;,
          &quot;our&quot;, or &quot;us&quot;) collects, uses, stores, and
          shares information about you when you use our platform at{" "}
          <a href={APP_URL} style={styles.link}>{APP_URL}</a> (the
          &quot;Service&quot;). By using {APP_NAME}, you agree to the
          collection and use of information in accordance with this policy.
        </p>
      </section>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main style={styles.main}>

        {/* IMPORTANT NOTICE */}
        <div style={styles.noticeBox}>
          <p style={styles.noticeTitle}>📌 Google API Services — Limited Use Disclosure</p>
          <p style={styles.noticeText}>
            {APP_NAME}&apos;s use of information received from Google APIs adheres to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              Google API Services User Data Policy
            </a>
            , including the <strong>Limited Use</strong> requirements. We only
            use Google user data (including YouTube account data and content) to
            provide the core cross-posting service you explicitly requested. We
            do not use this data to serve advertisements, share it with third
            parties for independent purposes, or allow humans to read your data
            without your consent, except as required by law.
          </p>
        </div>

        {/* 1 — Who We Are */}
        <Section id="s1" title="1. Who We Are">
          <p style={styles.p}>
            {APP_NAME} is a social media cross-posting platform that lets
            creators publish video and text content to multiple platforms
            (YouTube, Instagram, LinkedIn) from a single interface. The
            platform is developed and operated by Rahul Kumar.
          </p>
          <InfoRow label="Operator" value="Rahul Kumar" />
          <InfoRow label="Contact Email" value={CONTACT_EMAIL} isEmail />
          <InfoRow label="Platform URL" value={APP_URL} isLink />
        </Section>

        {/* 2 — What Data We Collect */}
        <Section id="s2" title="2. What Data We Collect">
          <p style={styles.p}>
            We collect the following categories of information:
          </p>

          <SubHeading>2.1 Account &amp; Identity Data</SubHeading>
          <DataTable rows={[
            ["Email address", "Account creation, login, OTP verification"],
            ["Password (bcrypt hashed)", "Authentication — never stored in plaintext"],
            ["Display name", "Shown in your profile within the app"],
            ["Profile photo URL", "Populated from Google Sign-In if used"],
          ]} />

          <SubHeading>2.2 Google &amp; YouTube Data</SubHeading>
          <p style={styles.p}>
            When you connect your Google / YouTube account via OAuth 2.0, we
            receive and store the following:
          </p>
          <DataTable rows={[
            ["Google Account ID", "Linking your CrossPost AI account to Google"],
            ["YouTube Channel ID", "Identifying the channel to publish to"],
            ["YouTube Channel Name &amp; Thumbnail", "Displayed on the Accounts page"],
            ["OAuth Access Token (encrypted)", "Authorizing API calls on your behalf"],
            ["OAuth Refresh Token (encrypted)", "Refreshing access without re-login"],
          ]} />
          <p style={styles.subNote}>
            <strong>Scopes requested:</strong>{" "}
            <code style={styles.code}>https://www.googleapis.com/auth/youtube.upload</code>{" "}
            (upload videos),{" "}
            <code style={styles.code}>https://www.googleapis.com/auth/youtube</code>{" "}
            (manage account),{" "}
            <code style={styles.code}>openid</code>,{" "}
            <code style={styles.code}>email</code>,{" "}
            <code style={styles.code}>profile</code>.
          </p>

          <SubHeading>2.3 Instagram Data</SubHeading>
          <DataTable rows={[
            ["Instagram User ID", "Identifying the account for publishing"],
            ["Instagram Username", "Displayed on the Accounts page"],
            ["OAuth Access Token (encrypted)", "Authorizing API calls to Instagram"],
          ]} />

          <SubHeading>2.4 LinkedIn Data</SubHeading>
          <DataTable rows={[
            ["LinkedIn Member ID", "Identifying the profile for publishing"],
            ["LinkedIn Name &amp; Profile Photo", "Displayed on the Accounts page"],
            ["OAuth Access Token (encrypted)", "Authorizing API calls to LinkedIn"],
          ]} />

          <SubHeading>2.5 Content You Create &amp; Upload</SubHeading>
          <DataTable rows={[
            ["Video &amp; image files", "Uploaded by you for cross-posting"],
            ["Post titles, descriptions, hashtags", "Entered manually or AI-generated"],
            ["Scheduled publish times", "Your chosen publish schedule"],
            ["Published post history", "Record of past posts and their statuses"],
          ]} />

          <SubHeading>2.6 Technical &amp; Usage Data</SubHeading>
          <DataTable rows={[
            ["IP address", "Rate limiting, abuse prevention, security logs"],
            ["Request timestamps", "Audit logs and debugging"],
            ["Browser / device type", "User-Agent header from HTTP requests"],
          ]} />
        </Section>

        {/* 3 — How We Use Your Data */}
        <Section id="s3" title="3. How We Use Your Data">
          <p style={styles.p}>We use the data we collect <strong>only</strong> for the following purposes:</p>
          <ul style={styles.ul}>
            <li style={styles.li}>Authenticating you and maintaining your login session</li>
            <li style={styles.li}>Publishing your content to YouTube, Instagram, and LinkedIn on your behalf</li>
            <li style={styles.li}>Generating AI-powered titles, descriptions, and hashtags via Google Gemini AI</li>
            <li style={styles.li}>Displaying your connected accounts and post history within the app</li>
            <li style={styles.li}>Sending email OTP codes for account verification and security</li>
            <li style={styles.li}>Detecting and preventing fraudulent, abusive, or unauthorized activity</li>
            <li style={styles.li}>Improving the reliability and performance of the service</li>
          </ul>
          <div style={styles.doNotBox}>
            <p style={styles.doNotTitle}>We do NOT:</p>
            <ul style={styles.ul}>
              <li style={styles.li}>Sell, rent, or trade your personal data to any third party</li>
              <li style={styles.li}>Use your data or content for advertising purposes</li>
              <li style={styles.li}>Train AI or machine-learning models on your personal content</li>
              <li style={styles.li}>Share your Google/YouTube data with unauthorized third parties</li>
              <li style={styles.li}>Allow humans to read your Google user data without your consent, except as required by law</li>
              <li style={styles.li}>Use Google user data for any purpose not described in this policy</li>
            </ul>
          </div>
        </Section>

        {/* 4 — Google / YouTube Specific */}
        <Section id="s4" title="4. Google and YouTube API Data — Specific Disclosures">
          <p style={styles.p}>
            {APP_NAME} integrates with YouTube via the{" "}
            <a href="https://developers.google.com/youtube/v3" target="_blank" rel="noopener noreferrer" style={styles.link}>
              YouTube Data API v3
            </a>
            . The following specific disclosures apply to data obtained from
            Google API Services:
          </p>

          <SubHeading>4.1 Data Access Scope</SubHeading>
          <p style={styles.p}>
            We only request the minimum OAuth scopes necessary to deliver the
            service. We request{" "}
            <code style={styles.code}>youtube.upload</code> to upload your
            videos, and <code style={styles.code}>youtube</code> to read your
            channel information. We do not request access to your Gmail,
            Google Drive, Google Contacts, or any other Google service.
          </p>

          <SubHeading>4.2 How We Use YouTube Data</SubHeading>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <strong>Video upload:</strong> We call{" "}
              <code style={styles.code}>videos.insert</code> to upload your
              video to your YouTube channel with the title, description, tags,
              and privacy settings you specify.
            </li>
            <li style={styles.li}>
              <strong>Channel info:</strong> We call{" "}
              <code style={styles.code}>channels.list</code> once at connection
              time to fetch your channel name and thumbnail for display in the
              app.
            </li>
          </ul>

          <SubHeading>4.3 YouTube Data Storage</SubHeading>
          <p style={styles.p}>
            Your YouTube OAuth tokens are encrypted at rest using AES-256-GCM
            encryption before being stored in our database. They are decrypted
            only in memory, only when needed for an active API call, and never
            logged or written to disk in plaintext.
          </p>

          <SubHeading>4.4 Revoking YouTube Access</SubHeading>
          <p style={styles.p}>
            You can revoke {APP_NAME}&apos;s access to your YouTube account at
            any time by:
          </p>
          <ul style={styles.ul}>
            <li style={styles.li}>
              Clicking &quot;Disconnect&quot; on the YouTube card in the{" "}
              <strong>Accounts</strong> page within {APP_NAME} — this
              immediately deletes your stored tokens.
            </li>
            <li style={styles.li}>
              Visiting{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Google Account Permissions
              </a>{" "}
              and removing {APP_NAME} from the list.
            </li>
          </ul>

          <SubHeading>4.5 YouTube Terms Compliance</SubHeading>
          <p style={styles.p}>
            By connecting your YouTube account, your use of YouTube features is
            also subject to the{" "}
            <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={styles.link}>
              YouTube Terms of Service
            </a>{" "}
            and the{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Google Privacy Policy
            </a>
            . CrossPost AI&apos;s use of Google API data complies with the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              Google API Services User Data Policy
            </a>
            .
          </p>
        </Section>

        {/* 5 — Instagram */}
        <Section id="s5" title="5. Instagram (Meta) Data">
          <p style={styles.p}>
            {APP_NAME} integrates with Instagram via the{" "}
            <a href="https://developers.facebook.com/docs/instagram-api" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Instagram Graph API
            </a>
            . We use your Instagram Business or Creator account to:
          </p>
          <ul style={styles.ul}>
            <li style={styles.li}>Publish photos, videos, and reels to your Instagram profile on your behalf</li>
            <li style={styles.li}>Read your Instagram username and account ID for display in the app</li>
          </ul>
          <p style={styles.p}>
            You can revoke access at any time via{" "}
            <a href="https://www.instagram.com/accounts/manage_access/" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Instagram App Settings
            </a>{" "}
            or by disconnecting the account in {APP_NAME}. This integration
            complies with the{" "}
            <a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Meta Platform Terms
            </a>
            .
          </p>
        </Section>

        {/* 6 — LinkedIn */}
        <Section id="s6" title="6. LinkedIn Data">
          <p style={styles.p}>
            {APP_NAME} integrates with LinkedIn via the{" "}
            <a href="https://learn.microsoft.com/en-us/linkedin/" target="_blank" rel="noopener noreferrer" style={styles.link}>
              LinkedIn REST API
            </a>
            . We use your LinkedIn account to:
          </p>
          <ul style={styles.ul}>
            <li style={styles.li}>Publish text posts, images, and videos to your LinkedIn feed on your behalf</li>
            <li style={styles.li}>Read your LinkedIn member ID, full name, and profile photo for display in the app</li>
          </ul>
          <p style={styles.p}>
            You can revoke access at any time via{" "}
            <a href="https://www.linkedin.com/psettings/permitted-services" target="_blank" rel="noopener noreferrer" style={styles.link}>
              LinkedIn Permitted Services
            </a>{" "}
            or by disconnecting the account in {APP_NAME}. This integration
            complies with the{" "}
            <a href="https://www.linkedin.com/legal/l/api-terms-of-use" target="_blank" rel="noopener noreferrer" style={styles.link}>
              LinkedIn API Terms of Use
            </a>
            .
          </p>
        </Section>

        {/* 7 — Data Storage & Security */}
        <Section id="s7" title="7. Data Storage and Security">
          <p style={styles.p}>
            We take the security of your data seriously and implement the
            following technical measures:
          </p>
          <DataTable rows={[
            ["Database", "PostgreSQL on Neon (US East-2), TLS in transit, encrypted at rest"],
            ["OAuth Tokens", "AES-256-GCM encrypted before storage; decrypted only in-memory"],
            ["Passwords", "Hashed with bcrypt (cost factor 12); never stored in plaintext"],
            ["Media Files", "Stored on Cloudinary CDN with HTTPS-only access"],
            ["API Transport", "All endpoints served over HTTPS/TLS 1.2+"],
            ["Rate Limiting", "General: 100 req/min; Auth: 20 req/15min; AI: 10 req/min"],
          ]} />
          <p style={styles.p}>
            Despite these measures, no system is 100% secure. We encourage you
            to use a strong, unique password and to disconnect any accounts you
            no longer wish to use.
          </p>
        </Section>

        {/* 8 — Data Retention */}
        <Section id="s8" title="8. Data Retention">
          <p style={styles.p}>
            We retain your data only for as long as necessary to provide the
            service or as required by law:
          </p>
          <DataTable rows={[
            ["Account data (email, name)", "Until account deletion; purged within 30 days"],
            ["OAuth access & refresh tokens", "Until platform disconnection or account deletion — immediate"],
            ["Post records & history", "12 months from creation, then automatically purged"],
            ["Uploaded media files (Cloudinary)", "Deleted within 48 hours of post creation or on manual deletion"],
            ["Security logs (IP, timestamps)", "90 days, then automatically deleted"],
          ]} />
          <p style={styles.p}>
            To delete your account and all associated data, email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={styles.link}>{CONTACT_EMAIL}</a>{" "}
            with the subject line &quot;Account Deletion Request&quot;.
          </p>
        </Section>

        {/* 9 — Data Sharing */}
        <Section id="s9" title="9. Data Sharing and Third-Party Services">
          <p style={styles.p}>
            We do not sell or rent your personal data. We share data with the
            following third-party services only to the extent necessary to
            operate {APP_NAME}:
          </p>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Service</th>
                <th style={styles.th}>Purpose</th>
                <th style={styles.th}>Data Shared</th>
                <th style={styles.th}>Privacy Policy</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Google / YouTube", "OAuth & video publishing", "Channel ID, OAuth tokens, video files", "https://policies.google.com/privacy"],
                ["Meta / Instagram", "OAuth & content publishing", "Account ID, OAuth tokens, media files", "https://www.facebook.com/policy.php"],
                ["LinkedIn", "OAuth & content publishing", "Member ID, OAuth tokens, media files", "https://www.linkedin.com/legal/privacy-policy"],
                ["Neon (PostgreSQL)", "Database hosting", "All structured user data", "https://neon.tech/privacy-policy"],
                ["Cloudinary", "Media storage & CDN", "Uploaded video and image files", "https://cloudinary.com/privacy"],
                ["Google Gemini AI", "AI content generation", "Your video thumbnail/description prompt", "https://policies.google.com/privacy"],
                ["Render", "Backend API hosting", "All API request data (server-side)", "https://render.com/privacy"],
                ["Vercel", "Frontend hosting", "HTTP request data", "https://vercel.com/legal/privacy-policy"],
              ].map(([service, purpose, data, url]) => (
                <tr key={service}>
                  <td style={styles.td}><strong>{service}</strong></td>
                  <td style={styles.td}>{purpose}</td>
                  <td style={styles.td}>{data}</td>
                  <td style={styles.td}>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      Policy ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={styles.p}>
            We may also disclose your information if required by law, court
            order, or governmental authority, or to protect the rights,
            property, or safety of {APP_NAME}, our users, or the public.
          </p>
        </Section>

        {/* 10 — Cookies */}
        <Section id="s10" title="10. Cookies and Local Storage">
          <p style={styles.p}>
            {APP_NAME} uses the following browser storage mechanisms:
          </p>
          <DataTable rows={[
            ["Session cookie (next-auth.session-token)", "Maintains your login session — expires in 7 days"],
            ["CSRF token cookie (next-auth.csrf-token)", "Prevents cross-site request forgery attacks"],
            ["localStorage (theme preference)", "Remembers your dark/light mode preference"],
          ]} />
          <p style={styles.p}>
            We do not use tracking cookies, advertising cookies, or third-party
            analytics cookies. You can clear cookies at any time through your
            browser settings, which will log you out of the app.
          </p>
        </Section>

        {/* 11 — Your Rights */}
        <Section id="s11" title="11. Your Rights and Choices">
          <p style={styles.p}>
            Depending on your location, you may have the following rights
            regarding your personal data:
          </p>
          <DataTable rows={[
            ["Right to Access", "Request a copy of the personal data we hold about you"],
            ["Right to Correction", "Request correction of inaccurate or incomplete data"],
            ["Right to Deletion", "Request deletion of your account and all associated data"],
            ["Right to Portability", "Request an export of your post history in JSON format"],
            ["Right to Withdraw Consent", "Disconnect any platform at any time — we delete tokens immediately"],
            ["Right to Object", "Object to processing of your personal data in certain circumstances"],
          ]} />
          <p style={styles.p}>
            To exercise any of these rights, contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={styles.link}>{CONTACT_EMAIL}</a>. We
            will respond within 30 days.
          </p>
          <p style={styles.p}>
            For Google/YouTube data specifically, you can also revoke our
            access directly via{" "}
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Google Account Permissions
            </a>
            .
          </p>
        </Section>

        {/* 12 — Children */}
        <Section id="s12" title="12. Children's Privacy">
          <p style={styles.p}>
            {APP_NAME} is not directed at children under the age of 13 (or
            16 in certain jurisdictions). We do not knowingly collect personal
            information from children. If you believe we have inadvertently
            collected data from a child, please contact us immediately at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={styles.link}>{CONTACT_EMAIL}</a>{" "}
            and we will delete that information promptly.
          </p>
        </Section>

        {/* 13 — International Transfers */}
        <Section id="s13" title="13. International Data Transfers">
          <p style={styles.p}>
            {APP_NAME}&apos;s infrastructure is hosted in the United States
            (Neon — US East-2, Render — US region, Vercel — global CDN). If
            you access the service from outside the United States, your
            information will be transferred to and processed in the US. By
            using the service, you consent to this transfer.
          </p>
          <p style={styles.p}>
            We ensure that all transfers comply with applicable data protection
            laws and that our service providers offer adequate protection for
            your personal data.
          </p>
        </Section>

        {/* 14 — Changes */}
        <Section id="s14" title="14. Changes to This Privacy Policy">
          <p style={styles.p}>
            We may update this Privacy Policy from time to time. When we make
            significant changes, we will:
          </p>
          <ul style={styles.ul}>
            <li style={styles.li}>Update the &quot;Effective Date&quot; at the top of this page</li>
            <li style={styles.li}>Send an email notification to your registered email address</li>
            <li style={styles.li}>Display an in-app notification on your next login</li>
          </ul>
          <p style={styles.p}>
            We encourage you to review this page periodically. Your continued
            use of {APP_NAME} after changes are posted constitutes acceptance
            of the updated policy.
          </p>
        </Section>

        {/* 15 — Contact */}
        <Section id="s15" title="15. Contact Us">
          <p style={styles.p}>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please contact us:
          </p>
          <div style={styles.contactCard}>
            <p style={styles.contactRow}><strong>Product:</strong> {APP_NAME}</p>
            <p style={styles.contactRow}><strong>Operator:</strong> Rahul Kumar</p>
            <p style={styles.contactRow}>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={styles.link}>{CONTACT_EMAIL}</a>
            </p>
            <p style={styles.contactRow}>
              <strong>Website:</strong>{" "}
              <a href={APP_URL} target="_blank" rel="noopener noreferrer" style={styles.link}>{APP_URL}</a>
            </p>
            <p style={styles.contactRow}><strong>Response Time:</strong> Within 30 days</p>
          </div>
          <p style={{ ...styles.p, marginTop: "1rem" }}>
            For Google-specific data concerns, you may also contact Google
            directly via the{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Google Privacy Policy
            </a>
            .
          </p>
        </Section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <p style={styles.footerText}>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div style={styles.footerLinks}>
            <Link href="/privacy-policy" style={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" style={styles.footerLink}>Terms of Service</Link>
            <a href={`mailto:${CONTACT_EMAIL}`} style={styles.footerLink}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 style={styles.subHeading}>{children}</h3>;
}

function InfoRow({
  label,
  value,
  isEmail,
  isLink,
}: {
  label: string;
  value: string;
  isEmail?: boolean;
  isLink?: boolean;
}) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>
        {isEmail ? (
          <a href={`mailto:${value}`} style={styles.link}>{value}</a>
        ) : isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" style={styles.link}>{value}</a>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

function DataTable({ rows }: { rows: string[][] }) {
  return (
    <table style={styles.dataTable}>
      <thead>
        <tr>
          <th style={{ ...styles.th, width: "40%" }}>Data Point</th>
          <th style={styles.th}>Purpose / Use</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, desc], i) => (
          <tr key={i}>
            <td style={{ ...styles.td, fontWeight: 600, color: "#c5c0d8" }}
              dangerouslySetInnerHTML={{ __html: label }}
            />
            <td style={styles.td}>{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#07050f",
    color: "#d8d4ec",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    lineHeight: 1.7,
  },
  /* Nav */
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    borderBottom: "1px solid rgba(108,92,231,0.2)",
    background: "rgba(7,5,15,0.95)",
    backdropFilter: "blur(12px)",
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#fff",
    textDecoration: "none",
  },
  logoIcon: { color: "#6c5ce7", fontSize: "1.2rem" },
  navLinks: { display: "flex", alignItems: "center", gap: "1.5rem" },
  navLink: { color: "#a09ab8", textDecoration: "none", fontSize: "0.9rem" },
  navBtn: {
    background: "#6c5ce7",
    color: "#fff",
    padding: "0.45rem 1.1rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  /* Hero */
  hero: {
    padding: "4rem 2rem 3rem",
    textAlign: "center" as const,
    background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(108,92,231,0.18) 0%, transparent 70%)",
    borderBottom: "1px solid rgba(108,92,231,0.12)",
  },
  heroBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#6c5ce7",
    marginBottom: "0.75rem",
  },
  heroTitle: {
    fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 0.75rem",
  },
  heroMeta: { color: "#a09ab8", fontSize: "0.9rem", marginBottom: "1rem" },
  heroDesc: { maxWidth: 680, margin: "0 auto", color: "#b8b3cc", fontSize: "0.97rem" },
  /* Main */
  main: { maxWidth: 860, margin: "0 auto", padding: "3rem 2rem 5rem" },
  /* Notice box */
  noticeBox: {
    background: "rgba(108,92,231,0.1)",
    border: "1px solid rgba(108,92,231,0.4)",
    borderRadius: 12,
    padding: "1.4rem 1.6rem",
    marginBottom: "2.5rem",
  },
  noticeTitle: { fontWeight: 700, color: "#a29bfe", marginBottom: "0.6rem", fontSize: "0.95rem" },
  noticeText: { color: "#c5c0d8", fontSize: "0.9rem", lineHeight: 1.75, margin: 0 },
  /* Section */
  section: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(108,92,231,0.15)",
    borderRadius: 14,
    padding: "2rem",
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 1.2rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid rgba(108,92,231,0.2)",
  },
  subHeading: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#a29bfe",
    margin: "1.4rem 0 0.6rem",
  },
  p: { color: "#b8b3cc", fontSize: "0.93rem", lineHeight: 1.78, margin: "0 0 0.85rem" },
  ul: { paddingLeft: "1.4rem", margin: "0 0 0.9rem" },
  li: { color: "#b8b3cc", fontSize: "0.93rem", lineHeight: 1.7, marginBottom: "0.3rem" },
  subNote: {
    background: "rgba(108,92,231,0.08)",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    fontSize: "0.85rem",
    color: "#c5c0d8",
    marginTop: "0.5rem",
    lineHeight: 1.8,
  },
  code: {
    background: "rgba(162,155,254,0.15)",
    color: "#a29bfe",
    padding: "0.1rem 0.35rem",
    borderRadius: 4,
    fontSize: "0.8rem",
    fontFamily: "monospace",
  },
  link: { color: "#a29bfe", textDecoration: "underline", textUnderlineOffset: 3 },
  doNotBox: {
    background: "rgba(214,48,49,0.06)",
    border: "1px solid rgba(214,48,49,0.2)",
    borderRadius: 10,
    padding: "1rem 1.2rem",
    marginTop: "1rem",
  },
  doNotTitle: { fontWeight: 700, color: "#ff7675", fontSize: "0.9rem", marginBottom: "0.5rem" },
  /* Info row */
  infoRow: {
    display: "flex",
    gap: "1rem",
    padding: "0.6rem 0",
    borderBottom: "1px solid rgba(108,92,231,0.1)",
    fontSize: "0.9rem",
    alignItems: "flex-start",
  },
  infoLabel: { color: "#a09ab8", minWidth: 150, fontWeight: 600 },
  infoValue: { color: "#c5c0d8" },
  /* Tables */
  dataTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginTop: "0.5rem",
    marginBottom: "1rem",
    fontSize: "0.88rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginTop: "0.5rem",
    marginBottom: "1rem",
    fontSize: "0.85rem",
  },
  th: {
    background: "rgba(108,92,231,0.12)",
    color: "#a29bfe",
    fontWeight: 600,
    textAlign: "left" as const,
    padding: "0.6rem 0.9rem",
    borderBottom: "1px solid rgba(108,92,231,0.25)",
  },
  td: {
    padding: "0.6rem 0.9rem",
    borderBottom: "1px solid rgba(108,92,231,0.08)",
    color: "#b8b3cc",
    verticalAlign: "top" as const,
  },
  /* Contact */
  contactCard: {
    background: "rgba(108,92,231,0.07)",
    border: "1px solid rgba(108,92,231,0.22)",
    borderRadius: 12,
    padding: "1.2rem 1.5rem",
  },
  contactRow: { margin: "0.3rem 0", fontSize: "0.93rem", color: "#c5c0d8" },
  /* Footer */
  footer: {
    borderTop: "1px solid rgba(108,92,231,0.2)",
    padding: "2rem",
  },
  footerInner: {
    maxWidth: 860,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "1rem",
  },
  footerText: { color: "#6b6585", fontSize: "0.85rem", margin: 0 },
  footerLinks: { display: "flex", gap: "1.5rem" },
  footerLink: { color: "#6b6585", textDecoration: "none", fontSize: "0.85rem" },
};
