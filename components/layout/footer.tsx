import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400" role="contentinfo">
      <div className="container-modern py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🍄</span>
              <span className="text-2xl font-bold text-white">Beacáin</span>
            </div>
            <p className="text-sm leading-relaxed">
              Ireland's citizen science platform for mushroom identification and mapping.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/map" className="hover:text-white transition-colors">Map</Link></li>
              <li><Link href="/species" className="hover:text-white transition-colors">Species Guide</Link></li>
              <li><Link href="/glossary" className="hover:text-white transition-colors">Irish Glossary</Link></li>
              <li><Link href="/observe" className="hover:text-white transition-colors">Add Observation</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Community</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/auth/signin" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Legal & Info</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility Statement</Link></li>
              <li><span className="text-slate-500">Version 1.2.0</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-center gap-2 text-sm">
            <p>
              © 2025 Beacáin • Open Source
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
