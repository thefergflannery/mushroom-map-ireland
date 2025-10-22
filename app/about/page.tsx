import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SafetyBanner } from '@/components/common/safety-banner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faRobot, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'About - Mushroom Map Ireland',
  description: 'Learn about the citizen science platform for mapping and identifying Irish mushrooms',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 -mt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero1.jpg"
            alt="Irish mushrooms"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-900/90 via-forest-800/85 to-earth-900/80"></div>
        </div>

        <div className="relative h-full container-modern flex items-center">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              About Beacáin
            </h1>
            <p className="text-2xl text-white/90 leading-relaxed">
              A citizen science platform dedicated to mapping and identifying mushroom species across Ireland.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-white">
        <section className="section-sm">
          <div className="container-modern max-w-4xl">
            <SafetyBanner />
          </div>
        </section>

        {/* Mission */}
        <section className="section-sm bg-slate-50">
          <div className="container-modern max-w-4xl">
            <h2 className="text-4xl font-bold text-forest-900 mb-6">Our Mission</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-700 leading-relaxed mb-6">
                Mushroom Map Ireland combines community expertise, AI assistance, and rigorous privacy
                protections to create a valuable resource for mycologists, foragers, and nature enthusiasts.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our goal is to build a comprehensive database of Irish fungi while respecting sensitive species locations
                and protecting the privacy of our contributors.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section bg-white">
          <div className="container-modern max-w-6xl">
            <h2 className="text-4xl font-bold text-forest-900 mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="card-modern">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faCamera} className="text-3xl text-forest-700" />
                  </div>
                  <CardTitle className="text-2xl">Observe & Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    Take a photo of a mushroom you encounter. Upload it to the platform with location information. We
                    automatically extract GPS data from your photo and snap it to a privacy grid.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faRobot} className="text-3xl text-forest-700" />
                  </div>
                  <CardTitle className="text-2xl">AI Assistance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    Our AI analyzes your photo and suggests possible species matches. These are starting points only -
                    never rely solely on AI for identification.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faUsers} className="text-3xl text-forest-700" />
                  </div>
                  <CardTitle className="text-2xl">Community Consensus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    Expert members and biologists review observations and vote on identifications. Through weighted voting,
                    the community reaches consensus on species identification.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faChartLine} className="text-3xl text-forest-700" />
                  </div>
                  <CardTitle className="text-2xl">Build Knowledge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    Verified observations contribute to our growing database of Irish fungi, helping researchers,
                    conservationists, and enthusiasts understand species distribution.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-sm bg-slate-50">
          <div className="container-modern max-w-4xl">
            <h2 className="text-4xl font-bold text-forest-900 mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-xl text-forest-900">Is this app free to use?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">Yes! Mushroom Map Ireland is completely free and open to all. It's a community-driven project.</p>
                </CardContent>
              </Card>

              <Card className="card-modern border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-xl text-forest-900">Can I eat mushrooms identified on this platform?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-red-700 mb-3 text-lg">
                    ⚠️ NEVER consume any mushroom based solely on online identification.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Many edible mushrooms have deadly lookalikes. Always consult an expert mycologist in person and
                    cross-reference with multiple field guides before consuming any wild mushroom.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-xl text-forest-900">How accurate are the AI suggestions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    AI suggestions are helpful starting points but are NOT definitive identifications. They should always
                    be verified by experienced community members. The consensus voting system ensures accuracy through
                    peer review.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-xl text-forest-900">Why are exact locations hidden?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    We protect locations to prevent over-harvesting of edible species and to safeguard rare or endangered
                    fungi. Grid snapping (1km or 10km) provides useful distribution data while maintaining habitat
                    security.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-xl text-forest-900">What species are included?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    Our database currently includes 33 Irish mushroom species, from common edibles like Field Mushrooms
                    to deadly poisonous species like Death Caps. We're continuously expanding the database with more
                    species. Visit the{' '}
                    <Link href="/species" className="text-forest-700 font-semibold hover:underline">
                      Species Guide
                    </Link>{' '}
                    to explore them all.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-xl text-forest-900">Can I contribute to the project?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">Absolutely! Here's how:</p>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-forest-700 font-bold">✓</span>
                      <span>Upload observations with quality photos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-forest-700 font-bold">✓</span>
                      <span>Help identify species posted by others</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-forest-700 font-bold">✓</span>
                      <span>Vote on identification proposals</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-forest-700 font-bold">✓</span>
                      <span>Add helpful comments and context</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className="section bg-forest-900 text-white">
          <div className="container-modern max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join our community of mycologists, foragers, and nature enthusiasts mapping Ireland's fungal diversity.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/observe">
                <Button size="lg" className="bg-forest-300 text-forest-900 hover:bg-forest-200 rounded-full px-8 text-lg">
                  Upload an Observation
                </Button>
              </Link>
              <Link href="/species">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 text-lg">
                  Browse Species Guide
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
