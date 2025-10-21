import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';

async function getGlossaryTerms() {
  return await prisma.glossary.findMany({
    orderBy: { termGa: 'asc' },
  });
}

export default async function GlossaryPage() {
  const terms = await getGlossaryTerms();

  return (
    <div className="min-h-screen bg-slate-50 -mt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero1.jpg"
            alt="Irish landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-900/90 via-forest-800/85 to-earth-900/80"></div>
        </div>

        <div className="relative h-full container-modern flex items-center">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-4">
              Foclóir na mBeacán
            </h1>
            <p className="text-2xl text-white/90 leading-relaxed">
              Irish Mushroom Glossary
            </p>
            <p className="text-lg text-white/80 mt-4 max-w-2xl">
              Traditional and regional Irish terms for mushrooms and fungi, reflecting centuries of local knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container-modern max-w-5xl">
          <div className="space-y-6">
            {terms.map((term) => (
              <Card key={term.id} className="card-modern hover:shadow-lg transition-shadow">
                <div className="p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-forest-900 mb-2">{term.termGa}</h3>
                      <p className="text-xl text-slate-700">{term.meaning}</p>
                    </div>
                    {term.audioUrl && (
                      <Button size="sm" variant="outline" className="rounded-full">
                        🔊 Listen
                      </Button>
                    )}
                  </div>

                  {term.variants.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-600">
                        <strong className="text-slate-900">Variants:</strong> {term.variants.join(', ')}
                      </p>
                    </div>
                  )}

                  {term.regions.length > 0 && (
                    <div className="mb-4 flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900">Regions:</span>
                      {term.regions.map((region) => (
                        <Badge key={region} variant="secondary" className="bg-forest-100 text-forest-800 border-forest-200">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {term.sources.length > 0 && (
                    <div className="text-sm text-slate-500 border-t border-slate-100 pt-4 mt-4">
                      <strong className="text-slate-700">Sources:</strong> {term.sources.join(', ')}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Info Card */}
          <Card className="mt-12 bg-forest-50 border-forest-200">
            <CardHeader>
              <CardTitle className="text-2xl text-forest-900">About This Glossary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <p className="leading-relaxed">
                This glossary preserves traditional Irish language terms for mushrooms, many of which vary by region and
                reflect centuries of local knowledge.
              </p>
              <p className="leading-relaxed">
                If you know of additional terms or regional variations, please contribute through our community platform.
              </p>
              <p className="text-sm text-slate-600 bg-white/50 p-4 rounded-lg">
                <strong className="text-slate-900">Note:</strong> Many Irish terms reflect folk taxonomy and may not correspond exactly to modern
                scientific classifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
