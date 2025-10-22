import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AccessibilityStatementPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="section bg-white">
        <div className="container-modern">
          <Link href="/" className="inline-block mb-6">
            <Button variant="ghost" className="text-forest-700 hover:bg-forest-50 rounded-full">
              <span className="mr-2">←</span> Back to Home
            </Button>
          </Link>
          
          <h1 className="heading-display text-forest-900 mb-6">
            Accessibility Statement
          </h1>
          
          <div className="prose prose-lg max-w-4xl">
            <p className="text-xl text-slate-600 mb-8">
              Mushroom Map Ireland is committed to ensuring digital accessibility for all users, 
              including those with disabilities. We strive to provide an inclusive experience 
              that meets or exceeds WCAG 2.2 AA standards.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="section bg-white">
        <div className="container-modern">
          <div className="prose prose-lg max-w-4xl">
            
            <h2 className="text-3xl font-bold text-forest-900 mb-4">Our Commitment</h2>
            <p className="text-slate-600 mb-6">
              We are committed to providing a website that is accessible to all users, regardless of 
              their abilities or the technology they use. This includes:
            </p>
            
            <ul className="list-disc pl-6 mb-6 text-slate-600">
              <li>Screen reader compatibility</li>
              <li>Keyboard navigation support</li>
              <li>High contrast and readable text</li>
              <li>Alternative text for images</li>
              <li>Semantic HTML structure</li>
              <li>Clear focus indicators</li>
            </ul>

            <h2 className="text-3xl font-bold text-forest-900 mb-4">Accessibility Features</h2>
            
            <h3 className="text-2xl font-semibold text-forest-800 mb-3">Navigation</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-600">
              <li>Skip links for main content</li>
              <li>Logical heading structure</li>
              <li>Consistent navigation patterns</li>
              <li>Breadcrumb navigation where appropriate</li>
            </ul>

            <h3 className="text-2xl font-semibold text-forest-800 mb-3">Visual Design</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-600">
              <li>High contrast color schemes</li>
              <li>Scalable text and interface elements</li>
              <li>Clear visual hierarchy</li>
              <li>Consistent button and link styling</li>
            </ul>

            <h3 className="text-2xl font-semibold text-forest-800 mb-3">Interactive Elements</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-600">
              <li>Keyboard accessible forms and buttons</li>
              <li>Clear focus indicators</li>
              <li>Descriptive link text</li>
              <li>Error messages and validation feedback</li>
            </ul>

            <h3 className="text-2xl font-semibold text-forest-800 mb-3">Content</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-600">
              <li>Alternative text for all images</li>
              <li>Descriptive headings and labels</li>
              <li>Plain language where possible</li>
              <li>Logical reading order</li>
            </ul>

            <h2 className="text-3xl font-bold text-forest-900 mb-4">Standards Compliance</h2>
            <p className="text-slate-600 mb-6">
              This website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 
              at the AA level. These guidelines help make web content more accessible to people with 
              disabilities and more usable for everyone.
            </p>

            <h2 className="text-3xl font-bold text-forest-900 mb-4">Known Issues</h2>
            <p className="text-slate-600 mb-6">
              We are continuously working to improve the accessibility of our website. If you 
              encounter any accessibility barriers, please contact us using the information below.
            </p>

            <h2 className="text-3xl font-bold text-forest-900 mb-4">Feedback and Contact</h2>
            <p className="text-slate-600 mb-6">
              We welcome your feedback on the accessibility of Mushroom Map Ireland. If you 
              encounter any accessibility barriers or have suggestions for improvement, please 
              contact us:
            </p>
            
            <div className="bg-forest-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-forest-800 mb-3">Contact Information</h3>
              <ul className="text-slate-600 space-y-2">
                <li><strong>Email:</strong> accessibility@mushroommapireland.ie</li>
                <li><strong>Response Time:</strong> We aim to respond within 5 business days</li>
                <li><strong>Alternative Formats:</strong> We can provide information in alternative formats upon request</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-forest-900 mb-4">Testing</h2>
            <p className="text-slate-600 mb-6">
              We regularly test our website using automated accessibility tools and manual testing 
              with assistive technologies including:
            </p>
            
            <ul className="list-disc pl-6 mb-6 text-slate-600">
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Keyboard-only navigation</li>
              <li>Voice control software</li>
              <li>Browser accessibility features</li>
            </ul>

            <h2 className="text-3xl font-bold text-forest-900 mb-4">Updates</h2>
            <p className="text-slate-600 mb-6">
              This accessibility statement was last updated on {new Date().toLocaleDateString('en-IE', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}. We will update this statement as we make improvements to our website's accessibility.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mt-8">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Important Notice</h3>
              <p className="text-amber-700">
                This website is for educational purposes only. Many edible mushroom species have 
                toxic lookalikes. Always consult an expert mycologist in person before consuming 
                any wild mushroom.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}