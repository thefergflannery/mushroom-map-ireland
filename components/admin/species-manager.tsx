'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SpeciesManagerProps {
  species: any[];
}

export function SpeciesManager({ species: initialSpecies }: SpeciesManagerProps) {
  const [species, setSpecies] = useState(initialSpecies);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filteredSpecies = species.filter(s =>
    s.latinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.commonEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const edibilityColors = {
    CHOICE: 'bg-forest-700 text-white',
    EDIBLE: 'bg-forest-600 text-white',
    CAUTION: 'bg-amber-500 text-white',
    TOXIC: 'bg-orange-600 text-white',
    DEADLY: 'bg-red-700 text-white',
    UNKNOWN: 'bg-slate-500 text-white',
  };

  const startEdit = (sp: any) => {
    setEditingId(sp.id);
    setEditForm({ ...sp });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editForm) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('slug', editForm.slug);

      const response = await fetch('/api/species/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const { url } = await response.json();
      setEditForm({ ...editForm, heroImageUrl: url });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setEditForm({ ...editForm, heroImageUrl: null });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;

    try {
      const response = await fetch(`/api/species/${editForm.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error('Failed to update species');

      const { data } = await response.json();
      setSpecies(species.map(s => s.id === editingId ? data : s));
      setEditingId(null);
      setEditForm(null);
      alert('Species updated successfully!');
    } catch (error) {
      console.error('Error updating species:', error);
      alert('Failed to update species');
    }
  };

  const handleToggleHidden = async (sp: any) => {
    try {
      const response = await fetch(`/api/species/${sp.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sp, hidden: !sp.hidden }),
      });

      if (!response.ok) throw new Error('Failed to toggle species visibility');

      const { data } = await response.json();
      setSpecies(species.map(s => s.id === sp.id ? data : s));
      alert(`Species ${sp.hidden ? 'shown' : 'hidden'} successfully!`);
    } catch (error) {
      console.error('Error toggling species visibility:', error);
      alert('Failed to toggle species visibility');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-forest-900">Species Management</h2>
        <Button className="bg-forest-700 hover:bg-forest-800">
          + Add New Species
        </Button>
      </div>

      <Card className="card-modern">
        <CardContent className="p-6">
          <input
            type="text"
            placeholder="Search species by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
          />
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingId && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Species</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Latin Name</label>
                <input
                  type="text"
                  value={editForm.latinName}
                  onChange={(e) => setEditForm({...editForm, latinName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Common English Name</label>
                <input
                  type="text"
                  value={editForm.commonEn}
                  onChange={(e) => setEditForm({...editForm, commonEn: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Common Irish Name</label>
                <input
                  type="text"
                  value={editForm.commonGa || ''}
                  onChange={(e) => setEditForm({...editForm, commonGa: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Edibility</label>
                <select
                  value={editForm.edibility}
                  onChange={(e) => setEditForm({...editForm, edibility: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="CHOICE">Choice Edible</option>
                  <option value="EDIBLE">Edible</option>
                  <option value="CAUTION">Caution</option>
                  <option value="TOXIC">Toxic</option>
                  <option value="DEADLY">Deadly</option>
                  <option value="UNKNOWN">Unknown</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Season</label>
                <input
                  type="text"
                  value={editForm.season || ''}
                  onChange={(e) => setEditForm({...editForm, season: e.target.value})}
                  placeholder="e.g., August-November"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Habitat</label>
                <textarea
                  value={editForm.habitat || ''}
                  onChange={(e) => setEditForm({...editForm, habitat: e.target.value})}
                  placeholder="e.g., Under birch and pine trees"
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Key Traits</label>
                <textarea
                  value={editForm.keyTraits || ''}
                  onChange={(e) => setEditForm({...editForm, keyTraits: e.target.value})}
                  placeholder="e.g., Red cap with white spots"
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Species Image</label>
                
                {editForm.heroImageUrl ? (
                  <div className="space-y-2">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={editForm.heroImageUrl}
                        alt="Species preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                          }}
                          disabled={isUploading}
                        >
                          {isUploading ? 'Uploading...' : 'Replace Image'}
                        </Button>
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={removeImage}
                        disabled={isUploading}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                      <p className="text-slate-600 mb-3">No image uploaded</p>
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                          }}
                          disabled={isUploading}
                        >
                          {isUploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">
                      Or enter a URL manually:
                    </p>
                    <input
                      type="url"
                      value={editForm.heroImageUrl || ''}
                      onChange={(e) => setEditForm({...editForm, heroImageUrl: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sensitive"
                  checked={editForm.sensitive || false}
                  onChange={(e) => setEditForm({...editForm, sensitive: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="sensitive" className="text-sm font-medium">
                  Mark as sensitive/rare species (extra location privacy)
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={saveEdit} className="bg-forest-700 hover:bg-forest-800 flex-1">
                  Save Changes
                </Button>
                <Button onClick={cancelEdit} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpecies.map((sp) => (
          <Card key={sp.id} className="card-modern">
            <CardContent className="p-6">
              <div className="mb-3">
                <Badge className={`${edibilityColors[sp.edibility]} font-semibold`}>
                  {sp.edibility}
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold text-forest-900 mb-1 italic">{sp.latinName}</h3>
              <p className="text-lg text-slate-700 mb-1">{sp.commonEn}</p>
              {sp.commonGa && (
                <p className="text-sm text-slate-600 mb-3">{sp.commonGa}</p>
              )}

              <div className="text-sm text-slate-600 mb-4">
                {sp._count.identifications} identifications
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Link href={`/species/${sp.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => startEdit(sp)}
                >
                  Edit
                </Button>
                <Button 
                  variant={sp.hidden ? "default" : "destructive"} 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleToggleHidden(sp)}
                >
                  {sp.hidden ? 'Show' : 'Hide'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

