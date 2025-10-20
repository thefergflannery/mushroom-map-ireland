'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadForm } from '@/components/observe/upload-form';
import { LocationPicker } from '@/components/observe/location-picker';
import { AISuggestions } from '@/components/observe/ai-suggestions';
import { SafetyBanner } from '@/components/common/safety-banner';

export default function ObservePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoKey, setPhotoKey] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [privacyLevel, setPrivacyLevel] = useState<'EXACT' | 'GRID_1KM' | 'GRID_10KM'>('GRID_1KM');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [exifDetected, setExifDetected] = useState(false);

  const handleImageUploaded = (url: string, key: string, exif: any) => {
    setPhotoUrl(url);
    setPhotoKey(key);
    
    // Auto-populate location from EXIF if available
    if (exif?.lat && exif?.lng) {
      // Validate coordinates are in Ireland bounds
      if (exif.lat >= 51 && exif.lat <= 56 && exif.lng >= -11 && exif.lng <= -5) {
        setLocation({ lat: exif.lat, lng: exif.lng });
        setExifDetected(true);
        toast.success(`GPS location detected from photo! (${exif.lat.toFixed(4)}, ${exif.lng.toFixed(4)})`);
      } else {
        toast('GPS data found but location is outside Ireland', { icon: '⚠️' });
      }
    }
    
    toast.success('Photo uploaded successfully!');
    setStep(2);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleSubmit = async () => {
    if (!photoUrl || !location) {
      toast.error('Please complete all required steps');
      return;
    }

    setSubmitting(true);
    setError('');

    const loadingToast = toast.loading('Submitting observation...');

    try {
      const response = await fetch('/api/observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoUrl,
          photoKey,
          lat: location.lat,
          lng: location.lng,
          privacyLevel,
          notes: notes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create observation');
      }

      const data = await response.json();
      
      toast.success('Observation created successfully!', { id: loadingToast });
      
      // Redirect to the new observation
      router.push(`/observation/${data.data.id}`);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to submit observation. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
      setError(errorMessage);
      console.error('Submit error:', err);
      setSubmitting(false);
    }
  };

  const canProceedToStep3 = photoUrl && location;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">← Cancel</Button>
          </Link>
          <h1 className="text-2xl font-bold text-forest-700">Add Observation</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-forest-600 text-white' : 'bg-gray-200 text-gray-600'} font-semibold`}>
              {photoUrl ? '✓' : '1'}
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-forest-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-forest-600 text-white' : 'bg-gray-200 text-gray-600'} font-semibold`}>
              {location ? '✓' : '2'}
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-forest-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-forest-600 text-white' : 'bg-gray-200 text-gray-600'} font-semibold`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Upload Photo */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">📸</span>
                Step 1: Upload Photo
              </CardTitle>
              <CardDescription>
                Take or upload a clear photo of the mushroom showing key identification features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadForm onImageUploaded={handleImageUploaded} />
            </CardContent>
          </Card>
        )}

        {/* Step 2: Mark Location */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">📍</span>
                Step 2: Mark Location
              </CardTitle>
              <CardDescription>
                Click on the map or use your device location (privacy-protected)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exifDetected && location && (
                <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-sm">
                  <p className="font-medium text-green-900 mb-1">📍 Location detected from photo</p>
                  <p className="text-green-700">
                    GPS coordinates found in image metadata: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    You can adjust the location on the map if needed
                  </p>
                </div>
              )}
              
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={location || undefined}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!location}
                  className="flex-1 bg-forest-600 hover:bg-forest-700"
                >
                  Continue →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Privacy & Notes */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">✍️</span>
                Step 3: Privacy & Details
              </CardTitle>
              <CardDescription>
                Choose your privacy level and add optional notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Privacy Level */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Privacy Level</label>
                <div className="space-y-2">
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${privacyLevel === 'GRID_1KM' ? 'border-forest-600 bg-forest-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="privacy"
                      value="GRID_1KM"
                      checked={privacyLevel === 'GRID_1KM'}
                      onChange={(e) => setPrivacyLevel(e.target.value as any)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">1km Grid (Recommended)</p>
                      <p className="text-sm text-gray-600">
                        Location shown within 1km grid square
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${privacyLevel === 'GRID_10KM' ? 'border-forest-600 bg-forest-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="privacy"
                      value="GRID_10KM"
                      checked={privacyLevel === 'GRID_10KM'}
                      onChange={(e) => setPrivacyLevel(e.target.value as any)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">10km Grid (More Private)</p>
                      <p className="text-sm text-gray-600">
                        Location shown within 10km grid square
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${privacyLevel === 'EXACT' ? 'border-forest-600 bg-forest-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="privacy"
                      value="EXACT"
                      checked={privacyLevel === 'EXACT'}
                      onChange={(e) => setPrivacyLevel(e.target.value as any)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Exact Location</p>
                      <p className="text-sm text-gray-600">
                        Show precise coordinates (not recommended for sensitive species)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                  placeholder="Describe the habitat, nearby trees, smell, size, or any other details that might help with identification..."
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500">{notes.length} / 2000 characters</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Actions */}
              {/* Optional AI Suggestions */}
              {photoUrl && (
                <div className="pt-4 border-t">
                  <AISuggestions imageUrl={photoUrl} />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={submitting}
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceedToStep3 || submitting}
                  className="flex-1 bg-forest-600 hover:bg-forest-700"
                  size="lg"
                >
                  {submitting ? 'Submitting...' : 'Submit Observation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety */}
        <div className="mt-6">
          <SafetyBanner />
        </div>

        {/* Guidelines */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Photography Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Take multiple photos from different angles</li>
              <li>Include the cap top, underside (gills/pores), and stem</li>
              <li>Show the base of the mushroom and surrounding habitat</li>
              <li>Use natural lighting when possible</li>
              <li>Include a size reference if available</li>
              <li>Avoid picking the mushroom unless necessary</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
