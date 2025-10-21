'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface UserManagerProps {
  users: any[];
}

export function UserManager({ users: initialUsers }: UserManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.handle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleColors = {
    USER: 'bg-slate-100 text-slate-700 border-slate-300',
    TRUSTED: 'bg-blue-100 text-blue-700 border-blue-300',
    BIOLOGIST: 'bg-purple-100 text-purple-700 border-purple-300',
    MODERATOR: 'bg-amber-100 text-amber-700 border-amber-300',
    ADMIN: 'bg-red-100 text-red-700 border-red-300',
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update role');

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update user role');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-forest-900">User Management</h2>
          <p className="text-slate-600 mt-2">{users.length} total users</p>
        </div>
      </div>

      <Card className="card-modern">
        <CardContent className="p-6">
          <input
            type="text"
            placeholder="Search users by handle or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
          />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">@{user.handle}</h3>
                    <Badge className={`${roleColors[user.role]} border font-semibold`}>
                      {user.role}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">{user.email}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    <span>{user._count.observations} observations</span>
                    <span>{user._count.identifications} identifications</span>
                    <span>Reputation: {user.reputation}</span>
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-forest-700"
                  >
                    <option value="USER">User</option>
                    <option value="TRUSTED">Trusted</option>
                    <option value="BIOLOGIST">Biologist</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

