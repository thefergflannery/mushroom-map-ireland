import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy - Mushroom Map Ireland',
  description: 'Privacy policy for Mushroom Map Ireland platform',
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: October 20, 2025</p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Mushroom Map Ireland ("we", "our", or "us") is committed to protecting your privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard your information when you use our
                platform.
              </p>
              <p>
                We take your privacy seriously and have designed our platform with privacy-first principles. Location
                data is automatically masked, and we never sell your personal information to third parties.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4 className="font-semibold mt-4">Account Information</h4>
              <ul>
                <li>Email address</li>
                <li>Display name/handle (optional)</li>
                <li>Profile picture (optional, via Google OAuth)</li>
              </ul>

              <h4 className="font-semibold mt-4">Observation Data</h4>
              <ul>
                <li>Photos of mushrooms you upload</li>
                <li>Location data (automatically grid-snapped to 1km or 10km for privacy)</li>
                <li>Date and time of observations</li>
                <li>Notes and descriptions you provide</li>
                <li>EXIF GPS data (extracted then immediately removed from stored images)</li>
              </ul>

              <h4 className="font-semibold mt-4">Interaction Data</h4>
              <ul>
                <li>Identifications you propose</li>
                <li>Votes you cast</li>
                <li>Comments you post</li>
                <li>Reputation score (calculated from community interactions)</li>
              </ul>

              <h4 className="font-semibold mt-4">Technical Data</h4>
              <ul>
                <li>IP address (for rate limiting and security)</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Usage analytics (page views, session duration)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>We use your information to:</p>
              <ul>
                <li>Provide and maintain the platform</li>
                <li>Create and manage your account</li>
                <li>Display your observations on the public map</li>
                <li>Enable community identification and voting features</li>
                <li>Calculate reputation and consensus scores</li>
                <li>Prevent abuse and ensure platform security</li>
                <li>Improve our services and user experience</li>
                <li>Send important service updates (with your consent)</li>
                <li>Contribute to scientific research (aggregated, anonymized data only)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Location Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="font-medium text-green-700">
                We take location privacy very seriously. Here's how we protect your exact locations:
              </p>
              <ul>
                <li>
                  <strong>Grid Snapping:</strong> All observation locations are automatically snapped to a 1km or 10km
                  grid, preventing exact location disclosure
                </li>
                <li>
                  <strong>EXIF Removal:</strong> GPS coordinates are extracted from photos for your convenience, then
                  immediately removed before storage
                </li>
                <li>
                  <strong>Sensitive Species:</strong> Rare or endangered species receive extra protection with coarser
                  grids
                </li>
                <li>
                  <strong>No Satellite View:</strong> We use OpenStreetMap style only, preventing aerial identification
                  of exact spots
                </li>
                <li>
                  <strong>User Control:</strong> You can choose your privacy level (exact, 1km, or 10km) for each
                  observation
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4 className="font-semibold mt-4">Public Information</h4>
              <p>The following information is publicly visible:</p>
              <ul>
                <li>Your display name/handle</li>
                <li>Profile picture</li>
                <li>Observations you submit (with privacy-masked locations)</li>
                <li>Identifications and votes you make</li>
                <li>Comments you post</li>
                <li>Reputation score and badges</li>
              </ul>

              <h4 className="font-semibold mt-4">Third-Party Services</h4>
              <p>We use the following third-party services:</p>
              <ul>
                <li>
                  <strong>Google OAuth:</strong> For authentication (email and profile data only)
                </li>
                <li>
                  <strong>Vercel:</strong> For hosting and CDN services
                </li>
                <li>
                  <strong>Neon Database:</strong> For secure data storage
                </li>
                <li>
                  <strong>OpenAI:</strong> For AI identification suggestions (images only, no personal data)
                </li>
              </ul>

              <h4 className="font-semibold mt-4">Legal Requirements</h4>
              <p>
                We may disclose your information if required by law, court order, or to protect our rights and safety.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ul>
                <li>
                  <strong>Account Data:</strong> Retained until you delete your account
                </li>
                <li>
                  <strong>Observations:</strong> Retained indefinitely for scientific value (you can delete your own)
                </li>
                <li>
                  <strong>Votes and Comments:</strong> Retained for platform integrity
                </li>
                <li>
                  <strong>Technical Logs:</strong> Retained for 90 days for security purposes
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and associated data</li>
                <li>Export your data (coming soon)</li>
                <li>Opt-out of email notifications</li>
                <li>Object to data processing</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
              <p>
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@mushroommap.ie" className="text-blue-600 hover:underline">
                  privacy@mushroommap.ie
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>We use minimal cookies for:</p>
              <ul>
                <li>Authentication (session cookies, required)</li>
                <li>Security and rate limiting</li>
                <li>Remembering your preferences</li>
              </ul>
              <p>We do not use advertising cookies or tracking pixels.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Our platform is not directed at children under 13. We do not knowingly collect personal information
                from children. If you believe a child has provided us with personal information, please contact us.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new policy on this page and updating the "Last updated" date.
              </p>
              <p>Significant changes will be announced via email or a prominent notice on the platform.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>If you have questions about this Privacy Policy, please contact us:</p>
              <ul>
                <li>
                  Email:{' '}
                  <a href="mailto:privacy@mushroommap.ie" className="text-blue-600 hover:underline">
                    privacy@mushroommap.ie
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

        <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">🔒 Privacy is Our Priority</h3>
          <p className="text-sm text-gray-700 mb-4">
            We built this platform with privacy at its core. Your exact locations are never revealed, your data is never
            sold, and you maintain control over your contributions.
          </p>
          <Link href="/about">
            <Button variant="outline">Learn More About Our Mission</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

