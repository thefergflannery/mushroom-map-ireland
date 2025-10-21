import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Contact - Mushroom Map Ireland',
  description: 'Get in touch with the Mushroom Map Ireland team',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container-modern py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-section text-forest-900 mb-6">Contact Us</h1>
          <p className="lead text-slate-700 mb-12">
            Get in touch with questions, feedback, or to report issues with the platform.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-2xl text-forest-800">General Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  For general questions about the platform, species identification, or community features:
                </p>
                <p className="text-forest-700 font-semibold">info@beacain.ie</p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-2xl text-forest-800">Technical Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  For technical issues, bugs, or accessibility concerns:
                </p>
                <p className="text-forest-700 font-semibold">support@beacain.ie</p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-2xl text-forest-800">Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  For accessibility issues or feedback:
                </p>
                <p className="text-forest-700 font-semibold">accessibility@beacain.ie</p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-2xl text-forest-800">Research Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  For research partnerships or data collaboration:
                </p>
                <p className="text-forest-700 font-semibold">research@beacain.ie</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link href="/">
              <Button className="btn-primary">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
