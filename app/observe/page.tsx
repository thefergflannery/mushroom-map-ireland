import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ObservePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/observe');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">← Cancel</Button>
          </Link>
          <h1 className="text-2xl font-bold">Add Observation</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Find</CardTitle>
            <CardDescription>
              Share your mushroom observation with the community. Your photo and location will help build Ireland's
              fungal map.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Upload Photo */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-forest-100 text-forest-700 text-sm">
                  1
                </span>
                Upload Photo
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-forest-500 transition-colors cursor-pointer">
                <div className="space-y-2">
                  <div className="text-4xl">📷</div>
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: Take clear photos showing the cap, gills/pores, stem, and habitat context.
              </p>
            </div>

            {/* Step 2: Location */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-forest-100 text-forest-700 text-sm">
                  2
                </span>
                Mark Location
              </h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-muted-foreground mb-3">
                  Click on the map or use your current location
                </p>
                <div className="h-64 bg-gray-200 rounded flex items-center justify-center text-muted-foreground">
                  Map placeholder (MapLibre would go here)
                </div>
              </div>

              {/* Privacy level selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Privacy Level</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="privacy" value="GRID_1KM" defaultChecked />
                    <div>
                      <p className="font-medium text-sm">1km Grid (Recommended)</p>
                      <p className="text-xs text-muted-foreground">
                        Location shown within 1km grid square
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="privacy" value="GRID_10KM" />
                    <div>
                      <p className="font-medium text-sm">10km Grid</p>
                      <p className="text-xs text-muted-foreground">
                        Location shown within 10km grid square (more private)
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="privacy" value="EXACT" />
                    <div>
                      <p className="font-medium text-sm">Exact Location</p>
                      <p className="text-xs text-muted-foreground">
                        Show precise coordinates (not recommended for sensitive species)
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Notes */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-forest-100 text-forest-700 text-sm">
                  3
                </span>
                Add Notes (Optional)
              </h3>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-y"
                placeholder="Describe the habitat, nearby trees, smell, or any other details that might help with identification..."
              />
            </div>

            {/* Step 4: AI Suggestion */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base">🤖 Get AI Suggestions</CardTitle>
                <CardDescription>
                  Optional: Let AI analyze your photo and suggest possible identifications. Remember, AI is assistive,
                  not authoritative - community consensus determines the final ID.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Analyze with AI
                </Button>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-3 pt-4 border-t">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button className="flex-1" size="lg">
                Submit Observation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Photography Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Take multiple photos from different angles</li>
              <li>Include the cap top, underside (gills/pores), and stem</li>
              <li>Show the base of the mushroom and surrounding habitat</li>
              <li>Use natural lighting when possible</li>
              <li>Include a size reference if available (coin, finger, etc.)</li>
              <li>Avoid picking the mushroom unless necessary for ID</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

