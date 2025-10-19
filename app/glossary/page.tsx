import Link from 'next/link';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">← Back to Map</Button>
          </Link>
          <h1 className="text-2xl font-bold">Irish Mushroom Glossary</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Foclóir na mBeacán</h2>
          <p className="text-muted-foreground">
            Traditional and regional Irish terms for mushrooms and fungi. These terms reflect Ireland's rich
            mycological heritage and local knowledge.
          </p>
        </div>

        <div className="space-y-4">
          {terms.map((term) => (
            <Card key={term.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-forest-700">{term.termGa}</CardTitle>
                    <CardDescription className="text-base mt-1">{term.meaning}</CardDescription>
                  </div>
                  {term.audioUrl && (
                    <Button size="sm" variant="outline">
                      🔊 Listen
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {term.variants.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">
                      <strong>Variants:</strong> {term.variants.join(', ')}
                    </p>
                  </div>
                )}
                {term.regions.length > 0 && (
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">Regions:</span>
                    {term.regions.map((region) => (
                      <Badge key={region} variant="secondary">
                        {region}
                      </Badge>
                    ))}
                  </div>
                )}
                {term.sources.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Sources:</strong> {term.sources.join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>About This Glossary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              This glossary preserves traditional Irish language terms for mushrooms, many of which vary by region and
              reflect centuries of local knowledge.
            </p>
            <p>
              If you know of additional terms or regional variations, please contribute through our community platform.
            </p>
            <p className="text-muted-foreground">
              <strong>Note:</strong> Many Irish terms reflect folk taxonomy and may not correspond exactly to modern
              scientific classifications.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Help us preserve Irish mycological heritage by contributing terms and recordings.
          </p>
          <Button>Suggest a Term</Button>
        </div>
      </main>
    </div>
  );
}

