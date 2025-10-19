'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface UploadFormProps {
  onImageUploaded?: (url: string, key: string) => void;
}

export function UploadForm({ onImageUploaded }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setError('');
    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      if (onImageUploaded) {
        onImageUploaded(data.data.url, data.data.key);
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div>
          <label
            htmlFor="photo-upload"
            className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-forest-500 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="space-y-3">
              <div className="text-5xl">📷</div>
              <div>
                <p className="font-medium text-lg">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </div>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Take clear photos showing the cap, gills/pores, stem, and habitat
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-forest-600 hover:bg-forest-700"
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setPreview('');
                setError('');
              }}
            >
              Change Photo
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

