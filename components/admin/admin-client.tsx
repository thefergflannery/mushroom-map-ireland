'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlossaryManager } from '@/components/admin/glossary-manager';
import { SpeciesManager } from '@/components/admin/species-manager';
import { ModerationQueue } from '@/components/admin/moderation-queue';
import { UserManager } from '@/components/admin/user-manager';

interface AdminClientProps {
  user: any;
  data: {
    glossaryTerms: any[];
    species: any[];
    pendingObservations: any[];
    users: any[];
  };
}

type TabType = 'overview' | 'glossary' | 'species' | 'moderation' | 'users';

export function AdminClient({ user, data }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: '📊' },
    { id: 'glossary' as TabType, label: 'Glossary', icon: '📚' },
    { id: 'species' as TabType, label: 'Species', icon: '🍄' },
    { id: 'moderation' as TabType, label: 'Moderation', icon: '⚖️', count: data.pendingObservations.length },
    { id: 'users' as TabType, label: 'Users', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 -mt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-forest-900 to-forest-700 text-white py-12">
        <div className="container-modern">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-white/80">Manage content and moderate submissions</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                ← Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b sticky top-20 z-40">
        <div className="container-modern">
          <div className="flex gap-2 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-forest-700 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
                {tab.count && tab.count > 0 && (
                  <Badge className="bg-red-500 text-white ml-2">{tab.count}</Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container-modern">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-600">Glossary Terms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-forest-900">{data.glossaryTerms.length}</div>
                  </CardContent>
                </Card>

                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-600">Species</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-forest-900">{data.species.length}</div>
                  </CardContent>
                </Card>

                <Card className="card-modern border-amber-200 bg-amber-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-amber-900">Pending Moderation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-amber-900">{data.pendingObservations.length}</div>
                  </CardContent>
                </Card>

                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-600">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-forest-900">{data.users.length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setActiveTab('glossary')}
                      className="bg-forest-700 hover:bg-forest-800 h-auto py-6 flex-col gap-2"
                    >
                      <span className="text-3xl">📚</span>
                      <span>Add Glossary Term</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('species')}
                      className="bg-forest-700 hover:bg-forest-800 h-auto py-6 flex-col gap-2"
                    >
                      <span className="text-3xl">🍄</span>
                      <span>Add Species</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('moderation')}
                      className="bg-amber-600 hover:bg-amber-700 h-auto py-6 flex-col gap-2"
                    >
                      <span className="text-3xl">⚖️</span>
                      <span>Review Submissions ({data.pendingObservations.length})</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.pendingObservations.slice(0, 5).map((obs) => (
                      <div key={obs.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={obs.photoUrl}
                            alt="Observation"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            Observation by @{obs.user.handle}
                          </p>
                          <p className="text-sm text-slate-600">
                            {obs._count.identifications} ID{obs._count.identifications !== 1 ? 's' : ''} • {obs._count.comments} comment{obs._count.comments !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Link href={`/observation/${obs.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'glossary' && <GlossaryManager terms={data.glossaryTerms} />}
          {activeTab === 'species' && <SpeciesManager species={data.species} />}
          {activeTab === 'moderation' && <ModerationQueue observations={data.pendingObservations} />}
          {activeTab === 'users' && <UserManager users={data.users} />}
        </div>
      </section>
    </div>
  );
}

