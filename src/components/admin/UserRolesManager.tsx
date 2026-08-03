import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Shield,
  FileEdit,
  UserCheck,
  User,
  Users,
  Search,
  Plus,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  UserPlus,
  Sliders,
  Lock,
  Eye,
  Trash2,
  CheckCircle2,
  Ban
} from 'lucide-react';
import { PlatformUser, UserRole, RolePermissions } from '../../types';

interface UserRolesManagerProps {
  currentAdminEmail?: string | null;
}

const DEFAULT_USERS: PlatformUser[] = [
  {
    uid: 'u_admin_1',
    email: 'AustinGrA7X@gmail.com',
    displayName: 'Austin (Grand Master Admin)',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'admin',
    permissions: { canManageNews: true, canManageLore: true, canModerateContent: true, canManageUsers: true, canManageSidebar: true },
    lastActive: new Date().toISOString(),
    joinedDate: '2026-01-01',
    status: 'active',
  },
  {
    uid: 'u_editor_1',
    email: 'impa@hyrulecourt.gov',
    displayName: 'Impa (Royal Chief Editor)',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    role: 'editor',
    permissions: { canManageNews: true, canManageLore: true, canModerateContent: false, canManageUsers: false, canManageSidebar: true },
    lastActive: new Date(Date.now() - 86400000 * 2).toISOString(),
    joinedDate: '2026-02-14',
    status: 'active',
  },
  {
    uid: 'u_mod_1',
    email: 'daruk@goroncity.org',
    displayName: 'Daruk (Chief Moderator)',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'moderator',
    permissions: { canManageNews: false, canManageLore: false, canModerateContent: true, canManageUsers: false, canManageSidebar: false },
    lastActive: new Date(Date.now() - 3600000 * 4).toISOString(),
    joinedDate: '2026-03-01',
    status: 'active',
  },
  {
    uid: 'u_editor_2',
    email: 'purah@sheikahlab.tech',
    displayName: 'Purah (Lead Tech Journalist)',
    photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    role: 'editor',
    permissions: { canManageNews: true, canManageLore: true, canModerateContent: false, canManageUsers: false, canManageSidebar: true },
    lastActive: new Date(Date.now() - 3600000 * 12).toISOString(),
    joinedDate: '2026-03-15',
    status: 'active',
  },
  {
    uid: 'u_user_1',
    email: 'beedle@terrytown.shop',
    displayName: 'Wandering Merchant Beedle',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'user',
    permissions: { canManageNews: false, canManageLore: false, canModerateContent: false, canManageUsers: false, canManageSidebar: false },
    lastActive: new Date(Date.now() - 86400000 * 5).toISOString(),
    joinedDate: '2026-04-10',
    status: 'active',
  }
];

function getDefaultPermissionsForRole(role: UserRole): RolePermissions {
  switch (role) {
    case 'admin':
      return {
        canManageNews: true,
        canManageLore: true,
        canModerateContent: true,
        canManageUsers: true,
        canManageSidebar: true,
      };
    case 'editor':
      return {
        canManageNews: true,
        canManageLore: true,
        canModerateContent: false,
        canManageUsers: false,
        canManageSidebar: true,
      };
    case 'moderator':
      return {
        canManageNews: false,
        canManageLore: false,
        canModerateContent: true,
        canManageUsers: false,
        canManageSidebar: false,
      };
    case 'user':
    default:
      return {
        canManageNews: false,
        canManageLore: false,
        canModerateContent: false,
        canManageUsers: false,
        canManageSidebar: false,
      };
  }
}

export const UserRolesManager: React.FC<UserRolesManagerProps> = ({ currentAdminEmail }) => {
  const [users, setUsers] = useState<PlatformUser[]>(DEFAULT_USERS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal / Form state for Editing Granular Permissions
  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null);
  const [tempPermissions, setTempPermissions] = useState<RolePermissions>({
    canManageNews: false,
    canManageLore: false,
    canModerateContent: false,
    canManageUsers: false,
    canManageSidebar: false,
  });
  const [tempRole, setTempRole] = useState<UserRole>('user');
  const [tempStatus, setTempStatus] = useState<'active' | 'suspended'>('active');
  const [savingUserUid, setSavingUserUid] = useState<string | null>(null);

  // Modal for Adding / Inviting New Staff Member
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [newRole, setNewRole] = useState<UserRole>('editor');
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response while fetching user roster.');
      }
      const data: PlatformUser[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
      }
    } catch (err: any) {
      console.warn('Using active local administrative user state:', err?.message || err);
      setUsers(prev => (prev && prev.length > 0 ? prev : DEFAULT_USERS));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChangeInline = async (user: PlatformUser, newAssignedRole: UserRole) => {
    setSavingUserUid(user.uid);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/users/${user.uid}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newAssignedRole }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('API response invalid');
      }
      const updated: PlatformUser = await res.json();
      setUsers(prev => prev.map(u => u.uid === user.uid ? updated : u));
      setSuccess(`Role for ${user.displayName} updated to ${newAssignedRole.toUpperCase()}`);
    } catch (err: any) {
      // Graceful fallback to local state mutation
      const fallbackPermissions = getDefaultPermissionsForRole(newAssignedRole);
      const updatedLocal: PlatformUser = {
        ...user,
        role: newAssignedRole,
        permissions: fallbackPermissions,
        lastActive: new Date().toISOString(),
      };
      setUsers(prev => prev.map(u => u.uid === user.uid ? updatedLocal : u));
      setSuccess(`Role for ${user.displayName} updated to ${newAssignedRole.toUpperCase()} (Local State)`);
    } finally {
      setSavingUserUid(null);
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  const openPermissionModal = (user: PlatformUser) => {
    setEditingUser(user);
    setTempRole(user.role);
    setTempPermissions({ ...user.permissions });
    setTempStatus(user.status);
  };

  const handleSavePermissionsModal = async () => {
    if (!editingUser) return;
    setSavingUserUid(editingUser.uid);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/users/${editingUser.uid}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: tempRole,
          permissions: tempPermissions,
          status: tempStatus,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('API response invalid');
      }
      const updated: PlatformUser = await res.json();
      setUsers(prev => prev.map(u => u.uid === editingUser.uid ? updated : u));
      setSuccess(`Permissions and role successfully updated for ${editingUser.displayName}!`);
    } catch (err: any) {
      // Graceful fallback to local state mutation
      const updatedLocal: PlatformUser = {
        ...editingUser,
        role: tempRole,
        permissions: tempPermissions,
        status: tempStatus,
        lastActive: new Date().toISOString(),
      };
      setUsers(prev => prev.map(u => u.uid === editingUser.uid ? updatedLocal : u));
      setSuccess(`Permissions updated for ${editingUser.displayName} (Local State)!`);
    } finally {
      setSavingUserUid(null);
      setEditingUser(null);
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newDisplayName) {
      setError('Please provide both Email and Display Name.');
      return;
    }

    setIsCreatingUser(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          displayName: newDisplayName,
          role: newRole,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('API response invalid');
      }
      const created: PlatformUser = await res.json();
      setUsers(prev => [created, ...prev.filter(u => u.uid !== created.uid)]);
      setSuccess(`User ${created.displayName} (${created.role.toUpperCase()}) added to the Royal Roster!`);
    } catch (err: any) {
      // Graceful fallback to local state mutation
      const newLocalUser: PlatformUser = {
        uid: `u_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        email: newEmail,
        displayName: newDisplayName,
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newDisplayName)}`,
        role: newRole,
        permissions: getDefaultPermissionsForRole(newRole),
        lastActive: new Date().toISOString(),
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setUsers(prev => [newLocalUser, ...prev.filter(u => u.email.toLowerCase() !== newEmail.toLowerCase())]);
      setSuccess(`User ${newLocalUser.displayName} (${newLocalUser.role.toUpperCase()}) added to roster (Local State)!`);
    } finally {
      setIsCreatingUser(false);
      setIsAddModalOpen(false);
      setNewEmail('');
      setNewDisplayName('');
      setNewRole('editor');
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  const handleDeleteUser = async (user: PlatformUser) => {
    if (!window.confirm(`Are you sure you want to remove ${user.displayName} (${user.email}) from the platform roster?`)) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await fetch(`/api/users/${user.uid}`, { method: 'DELETE' });
    } catch (err: any) {
      // Ignore network errors and continue with local removal
    } finally {
      setUsers(prev => prev.filter(u => u.uid !== user.uid));
      setSuccess(`User ${user.displayName} removed from roster.`);
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  // Filter Users
  const filteredUsers = users.filter(u => {
    const matchesQuery = 
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.uid.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesQuery && matchesRole && matchesStatus;
  });

  // Metrics
  const adminCount = users.filter(u => u.role === 'admin').length;
  const editorCount = users.filter(u => u.role === 'editor').length;
  const moderatorCount = users.filter(u => u.role === 'moderator').length;
  const userCount = users.filter(u => u.role === 'user').length;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-serif font-bold uppercase tracking-wider bg-purple-900/10 text-purple-900 border border-purple-300">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" /> Admin
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-serif font-bold uppercase tracking-wider bg-blue-900/10 text-blue-900 border border-blue-300">
            <FileEdit className="w-3.5 h-3.5 text-blue-700" /> Editor
          </span>
        );
      case 'moderator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-serif font-bold uppercase tracking-wider bg-emerald-900/10 text-emerald-900 border border-emerald-300">
            <Shield className="w-3.5 h-3.5 text-emerald-700" /> Moderator
          </span>
        );
      case 'user':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-serif font-bold uppercase tracking-wider bg-amber-900/10 text-amber-900 border border-amber-300">
            <User className="w-3.5 h-3.5 text-amber-700" /> Traveler
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 border-2 border-zelda-gold rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-zelda-gold" />
              <span className="font-serif text-xs uppercase tracking-widest text-zelda-gold font-bold">
                Royal Knight Roster & Access Control
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-extrabold text-[#F4EFE1]">
              User Permissions & Role Assignment
            </h3>
            <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
              Assign and manage permissions across the platform. Control who can publish news, manage ancient lore, moderate user submissions, or configure administrative settings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-zelda-gold hover:bg-yellow-600 text-white rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff Member
          </button>
        </div>

        {/* Metrics Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 text-purple-300 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-mono block">ADMINS</span>
              <span className="text-sm font-serif font-extrabold text-purple-200">{adminCount} Users</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-300 rounded-lg">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-mono block">EDITORS</span>
              <span className="text-sm font-serif font-extrabold text-blue-200">{editorCount} Users</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-mono block">MODERATORS</span>
              <span className="text-sm font-serif font-extrabold text-emerald-200">{moderatorCount} Users</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-mono block">TRAVELERS</span>
              <span className="text-sm font-serif font-extrabold text-amber-200">{userCount} Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-zelda-border-sand rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or UID..."
            className="w-full pl-9 pr-3 py-1.5 bg-zelda-sand-bg border border-zelda-border-sand rounded-lg text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-serif uppercase tracking-wider text-gray-500 font-bold">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-zelda-sand-bg border border-zelda-border-sand rounded-lg px-2.5 py-1.5 text-xs text-zelda-charcoal font-serif focus:outline-none focus:border-zelda-gold"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="moderator">Moderator</option>
            <option value="user">Traveler (User)</option>
          </select>

          <span className="text-[11px] font-serif uppercase tracking-wider text-gray-500 font-bold ml-2">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zelda-sand-bg border border-zelda-border-sand rounded-lg px-2.5 py-1.5 text-xs text-zelda-charcoal font-serif focus:outline-none focus:border-zelda-gold"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          <button
            type="button"
            onClick={fetchUsers}
            className="p-1.5 border border-zelda-border-sand hover:bg-zelda-beige-card rounded-lg text-gray-600 transition-colors ml-auto cursor-pointer"
            title="Refresh Roster"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* User Roster Table */}
      <div className="bg-white border border-zelda-border-sand rounded-2xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-xs font-serif flex flex-col items-center gap-3">
            <span className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-zelda-gold border-t-transparent" />
            <span>Consulting Royal Hyrule User Records...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs font-serif space-y-2">
            <Users className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="font-bold text-sm">No users found matching filter criteria.</p>
            <p className="text-[11px] text-gray-400">Try adjusting your search keywords or role filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zelda-sand-bg border-b border-zelda-border-sand font-serif uppercase tracking-wider text-[10px] text-zelda-charcoal/80 font-bold">
                <tr>
                  <th className="py-3 px-4">User Member</th>
                  <th className="py-3 px-4">Role & Privilege</th>
                  <th className="py-3 px-4">Active Permissions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zelda-border-sand/40">
                {filteredUsers.map((u) => {
                  const isCurrentAdmin = currentAdminEmail && u.email.toLowerCase() === currentAdminEmail.toLowerCase();

                  return (
                    <tr key={u.uid} className="hover:bg-amber-50/40 transition-colors">
                      {/* User Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={u.displayName}
                            className="w-9 h-9 rounded-full object-cover border border-zelda-border-sand flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-zelda-charcoal flex items-center gap-1.5">
                              {u.displayName}
                              {isCurrentAdmin && (
                                <span className="bg-purple-100 text-purple-800 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role Dropdown */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            disabled={savingUserUid === u.uid}
                            onChange={(e) => handleRoleChangeInline(u, e.target.value as UserRole)}
                            className="bg-white border border-zelda-border-sand rounded-lg px-2 py-1 text-xs font-serif font-bold text-zelda-charcoal focus:outline-none focus:border-zelda-gold cursor-pointer disabled:opacity-50"
                          >
                            <option value="admin">👑 Admin</option>
                            <option value="editor">✍️ Editor</option>
                            <option value="moderator">🛡️ Moderator</option>
                            <option value="user">🗡️ Traveler (User)</option>
                          </select>

                          {savingUserUid === u.uid && (
                            <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-zelda-gold border-t-transparent" />
                          )}
                        </div>
                      </td>

                      {/* Quick Permissions Chips */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {u.permissions.canManageNews && (
                            <span className="text-[9px] bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-mono" title="Can manage news articles">
                              News
                            </span>
                          )}
                          {u.permissions.canManageLore && (
                            <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-mono" title="Can manage lore database">
                              Lore
                            </span>
                          )}
                          {u.permissions.canModerateContent && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-mono" title="Can moderate submissions">
                              Mod
                            </span>
                          )}
                          {u.permissions.canManageUsers && (
                            <span className="text-[9px] bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded font-mono" title="Can edit user permissions">
                              Users
                            </span>
                          )}
                          {u.permissions.canManageSidebar && (
                            <span className="text-[9px] bg-slate-50 text-slate-800 border border-slate-200 px-1.5 py-0.5 rounded font-mono" title="Can edit sidebar widgets">
                              Sidebar
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {u.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full border border-red-300">
                            <Ban className="w-3 h-3 text-red-600" /> Suspended
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openPermissionModal(u)}
                            className="p-1.5 bg-zelda-sand-bg hover:bg-amber-100 text-zelda-charcoal rounded-lg border border-zelda-border-sand transition-colors cursor-pointer text-xs flex items-center gap-1"
                            title="Edit Custom Granular Permissions"
                          >
                            <Sliders className="w-3.5 h-3.5 text-zelda-gold" />
                            <span className="hidden sm:inline font-serif text-[11px]">Configure</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            disabled={isCurrentAdmin}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Remove User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* GRANULAR PERMISSIONS MODAL */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-zelda-gold rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center justify-between border-b border-zelda-border-sand pb-3">
                <div className="flex items-center gap-3">
                  <Sliders className="w-5 h-5 text-zelda-gold" />
                  <div>
                    <h4 className="font-serif font-extrabold text-base text-zelda-charcoal">
                      Edit User Permissions
                    </h4>
                    <p className="text-xs text-gray-500">{editingUser.displayName} ({editingUser.email})</p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal font-bold mb-1">
                  Assign Assigned Role
                </label>
                <select
                  value={tempRole}
                  onChange={(e) => {
                    const newR = e.target.value as UserRole;
                    setTempRole(newR);
                    // Sync default permissions when role is selected in modal
                    if (newR === 'admin') {
                      setTempPermissions({ canManageNews: true, canManageLore: true, canModerateContent: true, canManageUsers: true, canManageSidebar: true });
                    } else if (newR === 'editor') {
                      setTempPermissions({ canManageNews: true, canManageLore: true, canModerateContent: false, canManageUsers: false, canManageSidebar: true });
                    } else if (newR === 'moderator') {
                      setTempPermissions({ canManageNews: false, canManageLore: false, canModerateContent: true, canManageUsers: false, canManageSidebar: false });
                    } else {
                      setTempPermissions({ canManageNews: false, canManageLore: false, canModerateContent: false, canManageUsers: false, canManageSidebar: false });
                    }
                  }}
                  className="w-full bg-zelda-sand-bg border border-zelda-border-sand rounded-xl p-2.5 text-sm text-zelda-charcoal font-serif font-bold focus:outline-none focus:border-zelda-gold"
                >
                  <option value="admin">👑 Admin (Full System Privileges)</option>
                  <option value="editor">✍️ Editor (News, Lore & Content Publishing)</option>
                  <option value="moderator">🛡️ Moderator (Community & Submission Control)</option>
                  <option value="user">🗡️ Traveler (Standard Community Member)</option>
                </select>
              </div>

              {/* Individual Permission Toggles */}
              <div className="space-y-3 pt-2">
                <span className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal font-bold">
                  Granular Privilege Toggles
                </span>

                <div className="space-y-2 bg-zelda-sand-bg border border-zelda-border-sand rounded-xl p-3">
                  <label className="flex items-center justify-between text-xs font-medium text-zelda-charcoal cursor-pointer p-1 hover:bg-white/60 rounded">
                    <div>
                      <span className="font-bold block">📰 Manage News & Chronicles</span>
                      <span className="text-[11px] text-gray-500">Create, edit, or remove articles and RSS generated news</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={tempPermissions.canManageNews}
                      onChange={(e) => setTempPermissions(prev => ({ ...prev, canManageNews: e.target.checked }))}
                      className="w-4 h-4 accent-zelda-gold rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-medium text-zelda-charcoal cursor-pointer p-1 hover:bg-white/60 rounded">
                    <div>
                      <span className="font-bold block">📜 Manage Ancient Lore Archives</span>
                      <span className="text-[11px] text-gray-500">Create or update game timeline entries and artifact lore</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={tempPermissions.canManageLore}
                      onChange={(e) => setTempPermissions(prev => ({ ...prev, canManageLore: e.target.checked }))}
                      className="w-4 h-4 accent-zelda-gold rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-medium text-zelda-charcoal cursor-pointer p-1 hover:bg-white/60 rounded">
                    <div>
                      <span className="font-bold block">🛡️ Moderate Submissions & Comments</span>
                      <span className="text-[11px] text-gray-500">Approve or remove fan art, videos, and community comments</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={tempPermissions.canModerateContent}
                      onChange={(e) => setTempPermissions(prev => ({ ...prev, canModerateContent: e.target.checked }))}
                      className="w-4 h-4 accent-zelda-gold rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-medium text-zelda-charcoal cursor-pointer p-1 hover:bg-white/60 rounded">
                    <div>
                      <span className="font-bold block">👑 User Permissions & Role Control</span>
                      <span className="text-[11px] text-gray-500">Grant or revoke admin/editor/moderator access for members</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={tempPermissions.canManageUsers}
                      onChange={(e) => setTempPermissions(prev => ({ ...prev, canManageUsers: e.target.checked }))}
                      className="w-4 h-4 accent-zelda-gold rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-medium text-zelda-charcoal cursor-pointer p-1 hover:bg-white/60 rounded">
                    <div>
                      <span className="font-bold block">🔮 Manage Sidebar & Extra Stuff</span>
                      <span className="text-[11px] text-gray-500">Edit, add, or reorder sidebar blocks and trackers</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={tempPermissions.canManageSidebar}
                      onChange={(e) => setTempPermissions(prev => ({ ...prev, canManageSidebar: e.target.checked }))}
                      className="w-4 h-4 accent-zelda-gold rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal font-bold mb-1">
                  Account Status
                </label>
                <select
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value as 'active' | 'suspended')}
                  className="w-full bg-zelda-sand-bg border border-zelda-border-sand rounded-xl p-2 text-xs text-zelda-charcoal font-serif focus:outline-none focus:border-zelda-gold"
                >
                  <option value="active">🟢 Active Member</option>
                  <option value="suspended">🔴 Suspended Access</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zelda-border-sand">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-zelda-border-sand hover:bg-zelda-sand-bg rounded-xl text-xs font-serif text-zelda-charcoal uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissionsModal}
                  disabled={savingUserUid === editingUser.uid}
                  className="px-5 py-2 bg-zelda-gold hover:bg-yellow-600 text-white rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {savingUserUid === editingUser.uid ? (
                    <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD NEW STAFF MEMBER MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.form
              onSubmit={handleAddUser}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-zelda-gold rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-zelda-border-sand pb-3">
                <div className="flex items-center gap-2 text-zelda-gold">
                  <UserPlus className="w-5 h-5" />
                  <h4 className="font-serif font-extrabold text-base text-zelda-charcoal">
                    Add New Staff Member
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal font-bold mb-1">
                  Display Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="e.g. Princess Zelda or Impa"
                  className="w-full bg-zelda-sand-bg border border-zelda-border-sand rounded-xl p-2.5 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal font-bold mb-1">
                  User Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. zelda@hyrulecastle.gov"
                  className="w-full bg-zelda-sand-bg border border-zelda-border-sand rounded-xl p-2.5 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-zelda-charcoal font-bold mb-1">
                  Initial Assigned Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-zelda-sand-bg border border-zelda-border-sand rounded-xl p-2.5 text-xs text-zelda-charcoal font-serif font-bold focus:outline-none focus:border-zelda-gold"
                >
                  <option value="editor">✍️ Editor (News & Lore Access)</option>
                  <option value="moderator">🛡️ Moderator (Community Moderation)</option>
                  <option value="admin">👑 Admin (Full System Control)</option>
                  <option value="user">🗡️ Traveler (Standard Member)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zelda-border-sand">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-zelda-border-sand hover:bg-zelda-sand-bg rounded-xl text-xs font-serif text-zelda-charcoal uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-5 py-2 bg-zelda-gold hover:bg-yellow-600 text-white rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isCreatingUser ? (
                    <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Add User
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
