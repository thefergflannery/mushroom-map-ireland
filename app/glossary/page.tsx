'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// This would come from the database in the real implementation
// For now, we'll use a client component with sample data
const glossaryTerms = [
  {
    id: '1',
    termGa: 'Beacán',
    meaning: 'Mushroom (general term)',
    category: 'Mushroom Names',
    variants: ['Beacáin', 'Beacánach'],
    regions: ['National'],
    sources: ['Dinneen\'s Dictionary'],
  },
  {
    id: '2',
    termGa: 'Caipín',
    meaning: 'Cap (of a mushroom)',
    category: 'Mushroom Terms',
    variants: ['Caipíní'],
    regions: ['National'],
    sources: [],
  },
  {
    id: '3',
    termGa: 'Cos',
    meaning: 'Stem/Stalk',
    category: 'Mushroom Terms',
    variants: [],
    regions: ['National'],
    sources: [],
  },
  {
    id: '4',
    termGa: 'Liopaí',
    meaning: 'Gills (under cap)',
    category: 'Mushroom Terms',
    variants: [],
    regions: ['National'],
    sources: [],
  },
  {
    id: '5',
    termGa: 'Pucaí',
    meaning: 'Fairy mushrooms/rings',
    category: 'Folklore',
    variants: ['Fáinne na bPúcaí'],
    regions: ['Munster', 'Connacht'],
    sources: ['Oral Tradition'],
  },
  {
    id: '6',
    termGa: 'Bolgán Béice',
    meaning: 'Puffball (literally "little bag of bellowing")',
    category: 'Nicknames',
    variants: [],
    regions: ['Connacht'],
    sources: [],
  },
  {
    id: '7',
    termGa: 'Caipín an Bháis',
    meaning: 'Death Cap',
    category: 'Mushroom Names',
    variants: [],
    regions: ['National'],
    sources: [],
  },
  {
    id: '8',
    termGa: 'Spóir',
    meaning: 'Spore',
    category: 'Mushroom Terms',
    variants: [],
    regions: ['National'],
    sources: [],
  },
];

const categories = ['All', 'Mushroom Names', 'Mushroom Terms', 'Folklore', 'Nicknames'];

export default function GlossaryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      term.termGa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              Traditional and regional Irish terms for mushrooms and fungi, reflecting centuries of local knowledge and folklore.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="section-sm bg-white border-b">
        <div className="container-modern max-w-6xl">
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search terms or meanings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-forest-700 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-forest-700 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mt-6 text-slate-600">
            Showing <span className="font-bold text-forest-900">{filteredTerms.length}</span> {filteredTerms.length === 1 ? 'term' : 'terms'}
          </div>
        </div>
      </section>

      {/* Glossary Grid */}
      <section className="section bg-slate-50">
        <div className="container-modern max-w-6xl">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No terms found</h3>
              <p className="text-slate-600">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTerms.map((term) => (
                <Card key={term.id} className="card-modern hover:shadow-xl transition-all group">
                  <CardContent className="p-6">
                    {/* Category Badge */}
                    <div className="mb-4">
                      <Badge className="bg-forest-100 text-forest-800 border-forest-200 font-semibold">
                        {term.category}
                      </Badge>
                    </div>

                    {/* Irish Term */}
                    <h3 className="text-3xl font-bold text-forest-900 mb-3 group-hover:text-forest-700 transition-colors">
                      {term.termGa}
                    </h3>

                    {/* English Meaning */}
                    <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                      {term.meaning}
                    </p>

                    {/* Variants */}
                    {term.variants.length > 0 && (
                      <div className="mb-3 pb-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 mb-2">Variants:</p>
                        <div className="flex flex-wrap gap-2">
                          {term.variants.map((variant, idx) => (
                            <span key={idx} className="text-sm text-slate-600 bg-slate-50 px-3 py-1 rounded-full">
                              {variant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regions */}
                    {term.regions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-slate-900 mb-2">Regions:</p>
                        <div className="flex flex-wrap gap-2">
                          {term.regions.map((region, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                              {region}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sources */}
                    {term.sources.length > 0 && (
                      <div className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                        <strong className="text-slate-700">Sources:</strong> {term.sources.join(', ')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="section-sm bg-forest-900 text-white">
        <div className="container-modern max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">About This Glossary</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-3">Living Language</h3>
              <p className="text-white/90 leading-relaxed">
                This glossary preserves traditional Irish language terms for mushrooms, many of which vary by region and reflect centuries of local knowledge.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-4">🗣️</div>
              <h3 className="text-xl font-bold mb-3">Contribute</h3>
              <p className="text-white/90 leading-relaxed">
                Know additional terms or regional variations? We welcome contributions from fluent speakers and local communities.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-amber-500/20 border-2 border-amber-400/30 rounded-2xl">
            <p className="text-white/95 leading-relaxed">
              <strong className="text-white">Note:</strong> Many Irish terms reflect folk taxonomy and may not correspond exactly to modern scientific classifications. They represent cultural and historical perspectives on fungi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
