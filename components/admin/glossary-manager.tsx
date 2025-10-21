'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

interface GlossaryManagerProps {
  terms: any[];
}

export function GlossaryManager({ terms: initialTerms }: GlossaryManagerProps) {
  const [terms, setTerms] = useState(initialTerms);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    termGa: '',
    meaning: '',
    category: 'Mushroom Names',
    variants: '',
    regions: '',
    sources: '',
    audioUrl: '',
  });

  const categories = ['Mushroom Names', 'Mushroom Terms', 'Folklore', 'Nicknames'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      variants: formData.variants.split(',').map(v => v.trim()).filter(Boolean),
      regions: formData.regions.split(',').map(r => r.trim()).filter(Boolean),
      sources: formData.sources.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const url = editingId ? `/api/glossary/${editingId}` : '/api/glossary';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save term');

      const result = await response.json();
      
      if (editingId) {
        setTerms(terms.map(t => t.id === editingId ? result.data : t));
        toast.success('Term updated successfully');
      } else {
        setTerms([result.data, ...terms]);
        toast.success('Term added successfully');
      }

      resetForm();
    } catch (error) {
      toast.error('Failed to save term');
      console.error(error);
    }
  };

  const handleEdit = (term: any) => {
    setEditingId(term.id);
    setFormData({
      termGa: term.termGa,
      meaning: term.meaning,
      category: term.category || 'Mushroom Names',
      variants: term.variants.join(', '),
      regions: term.regions.join(', '),
      sources: term.sources.join(', '),
      audioUrl: term.audioUrl || '',
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this term?')) return;

    try {
      const response = await fetch(`/api/glossary/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete term');

      setTerms(terms.filter(t => t.id !== id));
      toast.success('Term deleted successfully');
    } catch (error) {
      toast.error('Failed to delete term');
      console.error(error);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      termGa: '',
      meaning: '',
      category: 'Mushroom Names',
      variants: '',
      regions: '',
      sources: '',
      audioUrl: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-forest-900">Glossary Management</h2>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-forest-700 hover:bg-forest-800"
        >
          {isAdding ? 'Cancel' : '+ Add New Term'}
        </Button>
      </div>

      {isAdding && (
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Term' : 'Add New Term'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Irish Term *</label>
                  <input
                    type="text"
                    value={formData.termGa}
                    onChange={(e) => setFormData({ ...formData, termGa: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-700"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">English Meaning *</label>
                <input
                  type="text"
                  value={formData.meaning}
                  onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Variants (comma-separated)</label>
                <input
                  type="text"
                  value={formData.variants}
                  onChange={(e) => setFormData({ ...formData, variants: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-700"
                  placeholder="Beacáin, Beacánach"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Regions (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.regions}
                    onChange={(e) => setFormData({ ...formData, regions: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-700"
                    placeholder="Munster, Connacht"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sources (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.sources}
                    onChange={(e) => setFormData({ ...formData, sources: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-700"
                    placeholder="Dinneen's Dictionary, Oral Tradition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Audio URL (optional)</label>
                <input
                  type="url"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-700"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-forest-700 hover:bg-forest-800">
                  {editingId ? 'Update Term' : 'Add Term'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {terms.map((term) => (
          <Card key={term.id} className="card-modern">
            <CardContent className="p-6">
              <div className="mb-3">
                <Badge className="bg-forest-100 text-forest-800 border-forest-200">
                  {term.category || 'Uncategorized'}
                </Badge>
              </div>
              
              <h3 className="text-2xl font-bold text-forest-900 mb-2">{term.termGa}</h3>
              <p className="text-slate-700 mb-4">{term.meaning}</p>

              {term.variants.length > 0 && (
                <p className="text-sm text-slate-600 mb-2">
                  <strong>Variants:</strong> {term.variants.join(', ')}
                </p>
              )}

              {term.regions.length > 0 && (
                <p className="text-sm text-slate-600 mb-4">
                  <strong>Regions:</strong> {term.regions.join(', ')}
                </p>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleEdit(term)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(term.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

