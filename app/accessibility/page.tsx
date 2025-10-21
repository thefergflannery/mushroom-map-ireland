import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Accessibility Statement - Mushroom Map Ireland',
  description: 'Our commitment to digital accessibility and WCAG 2.2 AA compliance',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/hero1.jpg"
            alt="Accessible nature photography showing diverse users exploring mushrooms"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-900/85 via-forest-800/75 to-earth-900/70"></div>
        </div>
        <div className="relative container-modern text-center">
          <h1 className="heading-display text-white mb-4">Accessibility Statement</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Committed to making mushroom identification accessible to everyone
          </p>
        </div>
      </section>

      <main className="container-modern py-16">
        {/* Introduction */}
        <section className="mb-16">
          <h2 className="heading-section text-forest-900 mb-6">Our Commitment</h2>
          <p className="lead text-slate-700 mb-6">
            Mushroom Map Ireland is committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
          <p className="text-lg text-slate-600">
            This website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at the AA level, 
            which explains how to make web content more accessible for people with disabilities and user-friendly for everyone.
          </p>
        </section>

        {/* Standards Compliance */}
        <section className="mb-16">
          <h2 className="heading-section text-forest-900 mb-6">Standards Compliance</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-2xl text-forest-800 flex items-center gap-3">
                  <span className="text-3xl">♿</span>
                  WCAG 2.2 AA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  We strive to meet the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA standards. 
                  These guidelines help make web content more accessible to people with disabilities.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Perceivable: Information and UI components are presentable in ways users can perceive</li>
                  <li>• Operable: UI components and navigation are operable by all users</li>
                  <li>• Understandable: Information and UI operation are understandable</li>
                  <li>• Robust: Content can be interpreted reliably by a wide variety of assistive technologies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-2xl text-forest-800 flex items-center gap-3">
                  <span className="text-3xl">🌍</span>
                  International Standards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  Our accessibility efforts align with international standards and best practices.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Section 508 (US Federal accessibility standards)</li>
                  <li>• EN 301 549 (European accessibility standard)</li>
                  <li>• Irish Web Content Accessibility Guidelines</li>
                  <li>• W3C Web Accessibility Initiative (WAI) guidelines</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="mb-16">
          <h2 className="heading-section text-forest-900 mb-6 text-center">Accessibility Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                  <span className="text-2xl">⌨️</span>
                  Keyboard Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-sm">
                  All interactive elements can be accessed using only a keyboard. Use Tab to navigate forward, 
                  Shift+Tab to navigate backward, and Enter or Space to activate buttons and links.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  Screen Reader Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-sm">
                  Our site is compatible with screen readers and other assistive technologies. 
                  We use semantic HTML and ARIA labels to provide meaningful information.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  Color Contrast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-sm">
                  All text meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text). 
                  Color is not the only means of conveying information.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  Responsive Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-sm">
                  The site works on all devices and screen sizes. Content reflows appropriately 
                  and remains accessible on mobile, tablet, and desktop devices.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                  <span className="text-2xl">🖼️</span>
                  Alternative Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-sm">
                  All images include descriptive alternative text. Decorative images are marked 
                  as such to avoid confusion for screen reader users.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Focus Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-sm">
                  Clear focus indicators help users understand where they are on the page. 
                  Focus is managed appropriately in dynamic content and modal dialogs.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Known Issues */}
        <section className="mb-16">
          <h2 className="heading-section text-forest-900 mb-6">Known Issues & Improvements</h2>
          <Card className="card-modern">
            <CardContent className="pt-6">
              <p className="text-slate-700 mb-4">
                We are continuously working to improve accessibility. Here are areas we're currently addressing:
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠️</span>
                  <span>
                    <strong>Map Component:</strong> We're working to improve keyboard navigation and screen reader 
                    support for the interactive map component.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠️</span>
                  <span>
                    <strong>Image Upload:</strong> The drag-and-drop interface could be more accessible. 
                    We're adding alternative methods for file selection.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠️</span>
                  <span>
                    <strong>Form Validation:</strong> Error messages could be more prominent and better 
                    associated with form fields for screen reader users.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Testing & Feedback */}
        <section className="mb-16">
          <h2 className="heading-section text-forest-900 mb-6">Testing & Feedback</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-2xl text-forest-800">How We Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  We use a combination of automated and manual testing to ensure accessibility:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Automated accessibility testing tools (axe-core, WAVE)</li>
                  <li>• Manual testing with keyboard-only navigation</li>
                  <li>• Screen reader testing (NVDA, JAWS, VoiceOver)</li>
                  <li>• Color contrast analysis tools</li>
                  <li>• User testing with people with disabilities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-2xl text-forest-800">Report Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  If you encounter accessibility barriers, please let us know:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Email: accessibility@beacain.ie</li>
                  <li>• Include the page URL and description of the issue</li>
                  <li>• Tell us what assistive technology you're using</li>
                  <li>• We'll respond within 5 business days</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact & Resources */}
        <section className="mb-16">
          <h2 className="heading-section text-forest-900 mb-6">Contact & Resources</h2>
          <Card className="card-modern">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-forest-800 mb-4">Get Help</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• <Link href="/about" className="text-forest-700 hover:underline">About Us</Link> - Learn more about our mission</li>
                    <li>• <Link href="/contact" className="text-forest-700 hover:underline">Contact Support</Link> - Get technical help</li>
                    <li>• <Link href="/glossary" className="text-forest-700 hover:underline">Glossary</Link> - Understand mushroom terminology</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-forest-800 mb-4">Accessibility Resources</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• <a href="https://www.w3.org/WAI/WCAG21/quickref/" className="text-forest-700 hover:underline" target="_blank" rel="noopener noreferrer">WCAG Quick Reference</a></li>
                    <li>• <a href="https://webaim.org/" className="text-forest-700 hover:underline" target="_blank" rel="noopener noreferrer">WebAIM Resources</a></li>
                    <li>• <a href="https://www.abilitynet.org.uk/" className="text-forest-700 hover:underline" target="_blank" rel="noopener noreferrer">AbilityNet</a></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Last Updated */}
        <section className="text-center">
          <p className="text-slate-500 text-sm">
            This accessibility statement was last updated on {new Date().toLocaleDateString('en-IE', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}.
          </p>
        </section>
      </main>
    </div>
  );
}
