export const metadata = {
  title: "Terms of Service – CrossPost AI",
  description: "Terms of Service for CrossPost AI",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: November 11, 2026</p>

      <section className="space-y-8 text-sm leading-7">
        <div>
          <h2 className="text-lg font-semibold mb-2">1. Acceptance</h2>
          <p>
            By using CrossPost AI, you agree to these Terms. If you do not agree,
            do not use the service.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">2. Use of Service</h2>
          <p>
            CrossPost AI is a social media management tool. You are responsible for all
            content you publish through the platform. You must comply with the terms of
            each connected social media platform (Instagram, YouTube, LinkedIn).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">3. Prohibited Use</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Spam or automated bulk posting that violates platform policies</li>
            <li>Posting illegal, harmful, or misleading content</li>
            <li>Attempting to reverse-engineer or abuse the platform</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">4. Account Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these
            terms or the policies of connected platforms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">5. Disclaimer</h2>
          <p>
            CrossPost AI is provided &quot;as is&quot;. We are not liable for any loss of data,
            account suspension by third-party platforms, or any indirect damages arising
            from use of the service.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">6. Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a
              href="mailto:rahulkumar9508548671@gmail.com"
              className="text-purple-600 hover:underline"
            >
              rahulkumar9508548671@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
