export const metadata = {
    title: "Privacy Policy – CrossPost AI",
    description: "Privacy Policy for CrossPost AI",
};

export default function PrivacyPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-10">Last updated: November 11, 2026</p>

            <section className="space-y-8 text-sm leading-7">
                <div>
                    <h2 className="text-lg font-semibold mb-2">1. What We Collect</h2>
                    <p>
                        CrossPost AI collects the minimum information needed to provide the service:
                    </p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Your name and email address (via Google Sign-In)</li>
                        <li>Social media account tokens (Instagram, YouTube, LinkedIn) — stored encrypted</li>
                        <li>Content you create or upload through the platform</li>
                        <li>Basic usage data (pages visited, features used)</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">2. How We Use Your Data</h2>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>To publish content to your connected social media accounts on your behalf</li>
                        <li>To generate AI-assisted captions, hashtags, and content ideas</li>
                        <li>To show you analytics from your connected platforms</li>
                        <li>To send transactional emails (OTP, notifications)</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">3. Instagram Data</h2>
                    <p>
                        When you connect your Instagram account, we request access to publish content,
                        read your profile, and manage comments and messages for automation features.
                        We only act on your explicit instructions. We do not sell or share your
                        Instagram data with any third party.
                    </p>
                    <p className="mt-2">
                        You can disconnect your Instagram account at any time from the Connected
                        Accounts page. This immediately revokes our access.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">4. Data Storage & Security</h2>
                    <p>
                        All OAuth tokens are encrypted at rest using AES-256. Your data is stored
                        on secured PostgreSQL databases hosted on Neon. We use HTTPS for all
                        data in transit.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">5. Third-Party Services</h2>
                    <p>We use the following third-party services:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li><strong>Google</strong> — authentication</li>
                        <li><strong>Meta (Instagram)</strong> — content publishing and messaging</li>
                        <li><strong>YouTube (Google)</strong> — video publishing</li>
                        <li><strong>LinkedIn</strong> — content publishing</li>
                        <li><strong>Cloudinary</strong> — media storage and processing</li>
                        <li><strong>Google Gemini / Mistral</strong> — AI content generation</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">6. Data Retention</h2>
                    <p>
                        We retain your data for as long as your account is active. You can request
                        deletion of your account and all associated data at any time by contacting us.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">7. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Access the data we hold about you</li>
                        <li>Request correction or deletion of your data</li>
                        <li>Disconnect any social media account at any time</li>
                        <li>Export your data</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">8. Contact</h2>
                    <p>
                        For any privacy-related questions or data requests, contact us at:{" "}
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
