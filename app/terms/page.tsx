import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms of Service - Mushroom Map Ireland',
  description: 'Terms of service for Mushroom Map Ireland platform',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost">← Back to Home</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: October 20, 2025</p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                By accessing and using Mushroom Map Ireland ("the Platform", "we", "us", or "our"), you accept and
                agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the
                Platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <span>⚠️</span>
                2. Critical Safety Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="font-bold text-red-700 text-lg">
                NEVER consume any mushroom based solely on online identification.
              </p>
              <p>
                Many edible mushrooms have deadly poisonous lookalikes. Consuming the wrong mushroom can result in
                serious illness or death. The Platform provides educational information only and is NOT a substitute
                for expert in-person identification.
              </p>
              <p className="font-semibold">By using this Platform, you acknowledge that:</p>
              <ul>
                <li>AI suggestions and community identifications may be incorrect</li>
                <li>You will never consume any wild mushroom without expert verification in person</li>
                <li>You assume all risks associated with mushroom foraging</li>
                <li>We are not liable for any harm resulting from mushroom consumption</li>
                <li>You will consult multiple field guides and expert mycologists before consuming any wild mushroom</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4 className="font-semibold mt-4">Account Creation</h4>
              <ul>
                <li>You must be at least 13 years old to create an account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You are responsible for all activities under your account</li>
                <li>You must notify us immediately of any unauthorized access</li>
              </ul>

              <h4 className="font-semibold mt-4">Account Termination</h4>
              <p>
                We reserve the right to suspend or terminate your account if you violate these terms or engage in
                harmful behavior.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. User Content and Conduct</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4 className="font-semibold mt-4">Content You Submit</h4>
              <p>By submitting content (observations, photos, comments, identifications), you:</p>
              <ul>
                <li>Grant us a worldwide, non-exclusive license to use, display, and distribute your content</li>
                <li>Confirm you own the rights to the content or have permission to share it</li>
                <li>Understand your content will be publicly visible (with privacy protections for location)</li>
                <li>Agree your content may be used for scientific research (anonymized and aggregated)</li>
              </ul>

              <h4 className="font-semibold mt-4">Prohibited Conduct</h4>
              <p>You may not:</p>
              <ul>
                <li>Submit false, misleading, or deliberately incorrect identifications</li>
                <li>Upload photos you do not own or have permission to use</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share exact locations of rare or endangered species outside the Platform</li>
                <li>Use the Platform for commercial purposes without permission</li>
                <li>Attempt to manipulate voting or consensus systems</li>
                <li>Scrape or harvest data without authorization</li>
                <li>Interfere with Platform security or performance</li>
                <li>Impersonate others or misrepresent your expertise</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4 className="font-semibold mt-4">Platform Ownership</h4>
              <p>
                The Platform, including its design, code, features, and branding, is owned by Mushroom Map Ireland and
                protected by copyright and other intellectual property laws.
              </p>

              <h4 className="font-semibold mt-4">User Content</h4>
              <p>
                You retain ownership of your submitted content. However, you grant us the rights described in Section 4
                to operate the Platform.
              </p>

              <h4 className="font-semibold mt-4">Attribution</h4>
              <p>
                If you use data from the Platform (with permission), you must attribute it to "Mushroom Map Ireland"
                and the contributing users.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Scientific Use and Data</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                The Platform is designed to contribute to mycological research and biodiversity monitoring. By
                participating, you agree that:
              </p>
              <ul>
                <li>
                  Your observations may be aggregated (anonymized) and shared with researchers and conservation
                  organizations
                </li>
                <li>Data exports will maintain privacy protections (no exact locations)</li>
                <li>Scientific publications using the data should acknowledge contributors</li>
                <li>You understand observations are citizen science data, not peer-reviewed research</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Privacy and Location Data</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Location privacy is core to our Platform. All observation locations are automatically grid-snapped to
                protect exact locations. See our{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{' '}
                for complete details.
              </p>
              <p className="font-medium">You agree not to:</p>
              <ul>
                <li>Attempt to reverse-engineer exact locations from grid data</li>
                <li>Share precise locations of rare species outside the Platform</li>
                <li>Use location data to over-harvest edible species</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Voting and Reputation System</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>The Platform uses a community consensus system for identifications:</p>
              <ul>
                <li>Votes are weighted based on user reputation and expertise</li>
                <li>Reputation is earned through accurate contributions</li>
                <li>Vote manipulation will result in account suspension</li>
                <li>Consensus identifications should still be verified before any consumption</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Disclaimers and Limitations of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4 className="font-semibold mt-4">Platform Provided "As Is"</h4>
              <p>
                The Platform is provided without warranties of any kind, express or implied. We do not guarantee
                accuracy, reliability, or availability of the service.
              </p>

              <h4 className="font-semibold mt-4">No Medical or Foraging Advice</h4>
              <p>
                The Platform does not provide professional mycological, medical, or foraging advice. Always consult
                qualified experts.
              </p>

              <h4 className="font-semibold mt-4">Limitation of Liability</h4>
              <p className="font-medium">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR
                CONSEQUENTIAL DAMAGES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul>
                <li>Illness or death from mushroom consumption</li>
                <li>Loss of data or service interruptions</li>
                <li>Reliance on incorrect identifications</li>
                <li>Unauthorized access to your account</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                You agree to indemnify and hold harmless Mushroom Map Ireland, its operators, and contributors from any
                claims, damages, or expenses arising from:
              </p>
              <ul>
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Content you submit to the Platform</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We may modify these Terms at any time. Significant changes will be announced via email or prominent
                notice on the Platform. Continued use after changes constitutes acceptance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                These Terms are governed by the laws of Ireland. Any disputes shall be resolved in Irish courts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Contact</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>For questions about these Terms, contact us:</p>
              <ul>
                <li>
                  Email:{' '}
                  <a href="mailto:legal@mushroommap.ie" className="text-blue-600 hover:underline">
                    legal@mushroommap.ie
                  </a>
                </li>
                <li>
                  General:{' '}
                  <a href="mailto:hello@mushroommap.ie" className="text-blue-600 hover:underline">
                    hello@mushroommap.ie
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">📜 Summary</h3>
          <p className="text-sm text-gray-700 mb-4">
            By using Mushroom Map Ireland, you agree to use the Platform responsibly, never consume mushrooms based
            solely on online IDs, respect others, and contribute accurately. We protect your privacy and support
            scientific research.
          </p>
          <div className="flex gap-3">
            <Link href="/privacy">
              <Button variant="outline" size="sm">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="sm">
                About Us
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

