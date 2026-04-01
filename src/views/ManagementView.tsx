import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Shield, ShieldAlert, User as UserIcon, Loader2 } from 'lucide-react';
import type { UserProfile, UserRole } from '../types';

export default function ManagementView() {
  const { user, isEditor } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      setProfiles(data as UserProfile[]);
    }
    setLoading(false);
  };

  const toggleRole = async (profile: UserProfile) => {
    if (!isEditor) return;
    const newRole: UserRole = profile.role === 'editor' ? 'viewer' : 'editor';
    
    // Safety check: Don't demote yourself if you are the only admin
    if (profile.id === user?.id && profile.role === 'editor') {
      const adminCount = profiles.filter(p => p.role === 'editor').length;
      if (adminCount <= 1) {
        alert("You are the only administrator. You cannot demote yourself.");
        return;
      }
      if (!confirm("Are you sure you want to demote yourself? You will lose access to this page.")) {
        return;
      }
    }

    setUpdating(profile.id);
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    if (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role: ' + error.message);
    } else {
      setProfiles(profiles.map(p => p.id === profile.id ? { ...p, role: newRole } : p));
    }
    setUpdating(null);
  };

  if (!isEditor) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-muted max-w-md" style={{ color: 'var(--text-muted)' }}>
          You do not have the required permissions to access the User Management dashboard. Please contact a Product Manager.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-muted" style={{ color: 'var(--text-muted)' }}>
            Promote Executives to Product Managers or manage platform access.
          </p>
        </div>
        <button 
          onClick={fetchProfiles} 
          className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Refresh List'}
        </button>
      </div>

      <div className="bg-card border rounded-3xl overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted" style={{ color: 'var(--text-muted)' }}>User</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted" style={{ color: 'var(--text-muted)' }}>Current Role</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted" style={{ color: 'var(--text-muted)' }}>Joined</th>
              <th className="px-6 py-4 text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted" style={{ color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {loading && profiles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                    <span className="text-sm text-muted">Loading profiles...</span>
                  </div>
                </td>
              </tr>
            ) : profiles.map((profile) => (
              <tr key={profile.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-white">{profile.email}</div>
                      <div className="text-[10px] text-muted font-mono" style={{ color: 'var(--text-muted)' }}>{profile.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {profile.role === 'editor' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                      <Shield size={12} /> Product Manager
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 text-xs font-bold border border-slate-500/20">
                      <UserIcon size={12} /> Executive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {updating === profile.id ? (
                    <Loader2 className="animate-spin ml-auto text-indigo-500" size={18} />
                  ) : (
                    <button
                      onClick={() => toggleRole(profile)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm transform hover:-translate-y-0.5",
                        profile.role === 'editor' 
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20"
                      )}
                    >
                      {profile.role === 'editor' ? 'Demote to Exec' : 'Promote to PM'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-4">
        <div className="text-amber-500 shrink-0"><Shield size={24} /></div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-500/80">Security Notice</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Promoting a user to <strong>Product Manager</strong> grants them full write access to all roadmaps and feature requests. 
            All changes are logged according to the platform security policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
