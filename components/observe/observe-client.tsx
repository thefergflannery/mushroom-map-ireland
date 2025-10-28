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

interface ObserveClientProps {
  user: any;
}

export function ObserveClient({ user }: ObserveClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoKey, setPhotoKey] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [privacyLevel, setPrivacyLevel] = useState<'EXACT' | 'GRID_1KM' | 'GRID_10KM'>('GRID_1KM');
  const [notes, setNotes] = useState('');
  const [observedAt, setObservedAt] = useState<string>('');
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
          observedAt: observedAt ? new Date(observedAt).toISOString() : undefined,
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
    <div className="min-h-screen bg-slate-50">
      {/* Modern Header */}
      <header className="border-b bg-white">
        <div className="container-modern py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-slate-600">
                <span className="mr-2">←</span> Cancel
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-forest-900">Add Observation</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="container-modern py-12 max-w-5xl">
        <SafetyBanner />

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-forest-700' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-forest-700 text-white' : 'bg-slate-200 text-slate-500'}`}>
              1
            </div>
            <span className="hidden sm:inline font-medium">Upload Photo</span>
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-forest-700' : 'bg-slate-200'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-forest-700' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-forest-700 text-white' : 'bg-slate-200 text-slate-500'}`}>
              2
            </div>
            <span className="hidden sm:inline font-medium">Set Location</span>
          </div>
          <div className={`h-1 w-16 ${step >= 3 ? 'bg-forest-700' : 'bg-slate-200'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-forest-700' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-forest-700 text-white' : 'bg-slate-200 text-slate-500'}`}>
              3
            </div>
            <span className="hidden sm:inline font-medium">Add Details</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Upload */}
            {step === 1 && (
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-2xl">Upload Your Photo</CardTitle>
                  <CardDescription className="text-base">
                    Take a clear photo showing key identification features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UploadForm onImageUploaded={handleImageUploaded} />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <>
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="text-2xl">Set Location</CardTitle>
                    <CardDescription className="text-base">
                      {exifDetected ? 'GPS detected from photo - adjust if needed' : 'Click on the map or use your current location'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LocationPicker
                      onLocationSelect={handleLocationSelect}
                      initialLocation={location}
                    />
                    
                    {location && (
                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Privacy Level</label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => setPrivacyLevel('EXACT')}
                              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                privacyLevel === 'EXACT'
                                  ? 'border-forest-700 bg-forest-50 text-forest-900'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              Exact
                            </button>
                            <button
                              onClick={() => setPrivacyLevel('GRID_1KM')}
                              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                privacyLevel === 'GRID_1KM'
                                  ? 'border-forest-700 bg-forest-50 text-forest-900'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              1km Grid
                            </button>
                            <button
                              onClick={() => setPrivacyLevel('GRID_10KM')}
                              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                privacyLevel === 'GRID_10KM'
                                  ? 'border-forest-700 bg-forest-50 text-forest-900'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              10km Grid
                            </button>
                          </div>
                          <p className="text-xs text-slate-600 mt-2">
                            Location masking protects sensitive habitats and prevents over-harvesting
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            onClick={() => setStep(3)}
                            className="bg-forest-700 hover:bg-forest-800 rounded-full px-8"
                          >
                            Continue to Details →
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <>
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="text-2xl">Add Details & Notes</CardTitle>
                    <CardDescription className="text-base">
                      Optional information to help with identification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* AI Suggestions */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">AI Suggestions</h3>
                      <AISuggestions imageUrl={photoUrl} />
                    </div>

                    {/* Date Observed */}
                    <div>
                      <label htmlFor="observedAt" className="block text-sm font-medium mb-2">
                        Date Observed
                      </label>
                      <input
                        type="date"
                        id="observedAt"
                        value={observedAt}
                        onChange={(e) => setObservedAt(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        When did you find this mushroom? (Optional - defaults to today)
                      </p>
                    </div>

                    {/* Notes */}
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Habitat details, size, smell, or any other observations..."
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-700 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 justify-end pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        disabled={submitting}
                        className="rounded-full px-6"
                      >
                        ← Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-forest-700 hover:bg-forest-800 rounded-full px-8"
                      >
                        {submitting ? 'Submitting...' : 'Submit Observation'}
                      </Button>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {photoUrl && (
                <Card className="card-modern overflow-hidden">
                  <div className="relative h-64">
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Preview</h3>
                    {location && (
                      <p className="text-sm text-slate-600">
                        📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </p>
                    )}
                    {exifDetected && (
                      <p className="text-xs text-forest-700 mt-2">
                        ✓ GPS auto-detected from photo
                      </p>
                    )}
                  </div>
                </Card>
              )}

              {/* Help Card */}
              <Card className="bg-forest-50 border-forest-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 text-forest-900">Tips for Good Photos</h3>
                  <ul className="space-y-2 text-sm text-forest-800">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Include top view and underside if possible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Show stem and gills/pores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Include something for scale</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Photo in natural lighting</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

