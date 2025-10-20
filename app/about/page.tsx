import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SafetyBanner } from '@/components/common/safety-banner';

export const metadata: Metadata = {
  title: 'About - Mushroom Map Ireland',
  description: 'Learn about the privacy-first citizen science platform for mapping and identifying Irish mushrooms',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">About Mushroom Map Ireland</h1>

      <SafetyBanner />

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg mb-4">
          Mushroom Map Ireland is a privacy-first citizen science platform dedicated to mapping and identifying
          mushroom species across Ireland. We combine community expertise, AI assistance, and rigorous privacy
          protections to create a valuable resource for mycologists, foragers, and nature enthusiasts.
        </p>
        <p className="text-lg">
          Our goal is to build a comprehensive database of Irish fungi while respecting sensitive species locations
          and protecting the privacy of our contributors.
        </p>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Observe & Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Take a photo of a mushroom you encounter. Upload it to the platform with location information. We
                automatically extract GPS data from your photo and snap it to a privacy grid.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. AI Assistance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our AI analyzes your photo and suggests possible species matches. These are starting points only -
                never rely solely on AI for identification.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Community Consensus</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Expert members and biologists review observations and vote on identifications. Through weighted voting,
                the community reaches consensus on species identification.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Build Knowledge</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Verified observations contribute to our growing database of Irish fungi, helping researchers,
                conservationists, and enthusiasts understand species distribution.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy First */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Privacy-First Design</h2>
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>
                  <strong>Location Masking:</strong> All locations are snapped to a 1km or 10km grid to protect
                  sensitive habitats and prevent over-harvesting.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>
                  <strong>EXIF Stripping:</strong> GPS data is extracted from photos then removed before storage to
                  protect exact locations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>
                  <strong>Sensitive Species:</strong> Rare or endangered species receive extra protection with coarser
                  location grids.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>
                  <strong>User Privacy:</strong> You control what information you share. Profiles show only what you
                  choose to reveal.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is this app free to use?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Yes! Mushroom Map Ireland is completely free and open to all. It&apos;s a community-driven project.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I eat mushrooms identified on this platform?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold text-red-600 dark:text-red-400 mb-2">
                ⚠️ NEVER consume any mushroom based solely on online identification.
              </p>
              <p>
                Many edible mushrooms have deadly lookalikes. Always consult an expert mycologist in person and
                cross-reference with multiple field guides before consuming any wild mushroom.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How accurate are the AI suggestions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                AI suggestions are helpful starting points but are NOT definitive identifications. They should always
                be verified by experienced community members. The consensus voting system ensures accuracy through
                peer review.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Why are exact locations hidden?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We protect locations to prevent over-harvesting of edible species and to safeguard rare or endangered
                fungi. Grid snapping (1km or 10km) provides useful distribution data while maintaining habitat
                security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do I become a trusted identifier?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                As you contribute quality observations and accurate identifications, your reputation increases. Users
                with high reputation and demonstrated expertise may be promoted to Trusted or Biologist roles,
                giving their votes more weight in the consensus system.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What species are included?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our database currently includes 33 Irish mushroom species, from common edibles like Field Mushrooms
                to deadly poisonous species like Death Caps. We&apos;re continuously expanding the database with more
                species. Visit the{' '}
                <Link href="/species" className="text-blue-600 dark:text-blue-400 underline">
                  Species Guide
                </Link>{' '}
                to explore them all.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I contribute to the project?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">Absolutely! Here&apos;s how:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Upload observations with quality photos</li>
                <li>Help identify species posted by others</li>
                <li>Vote on identification proposals</li>
                <li>Add helpful comments and context</li>
                <li>Report issues or suggest improvements</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is my data shared with third parties?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                No. Your observations and data remain on this platform. We don&apos;t sell or share user data. In the
                future, we may offer aggregated, anonymized data exports for scientific research, but only with
                explicit user consent.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Technology & Credits</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4">
              Mushroom Map Ireland is built with modern web technologies to ensure speed, security, and
              accessibility:
            </p>
            <ul className="space-y-2 mb-6">
              <li>
                <strong>Next.js 15:</strong> React framework for server-side rendering
              </li>
              <li>
                <strong>Neon Database:</strong> Serverless PostgreSQL for scalable data storage
              </li>
              <li>
                <strong>MapLibre GL JS:</strong> Interactive privacy-safe mapping
              </li>
              <li>
                <strong>Vercel Blob:</strong> Image storage with automatic optimization
              </li>
              <li>
                <strong>OpenAI GPT-4o Vision:</strong> AI-powered species suggestions
              </li>
              <li>
                <strong>NextAuth v5:</strong> Secure authentication
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Species data sourced from the Fungal Diversity Database and verified by Irish mycologists.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Get Started */}
      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg">
            <Link href="/observe">Upload an Observation</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/species">Browse Species Guide</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/glossary">Irish Terminology</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

