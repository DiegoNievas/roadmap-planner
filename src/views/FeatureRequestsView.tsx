import { useState, useMemo } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { Search, ChevronDown, CheckCircle2, Clock, XCircle, Trash2, ExternalLink } from 'lucide-react';
import type { FeatureRequest, FeatureRequestStatus, Priority } from '../types';
import { cn } from '../lib/utils';

export default function FeatureRequestsView() {
  const { data, updateFeatureRequest, deleteFeatureRequest } = useRoadmap();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);

  const filteredRequests = useMemo(() => {
    let requests = data.featureRequests || [];
    
    if (search) {
      const q = search.toLowerCase();
      requests = requests.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) ||
        r.submitterName.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      requests = requests.filter(r => r.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      requests = requests.filter(r => r.priority === priorityFilter);
    }

    return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data.featureRequests, search, statusFilter, priorityFilter]);

  const handleStatusChange = async (fr: FeatureRequest, newStatus: FeatureRequestStatus) => {
    try {
      await updateFeatureRequest({ ...fr, status: newStatus });
      if (selectedRequest?.id === fr.id) {
        setSelectedRequest({ ...fr, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteFeatureRequest(id);
        setSelectedRequest(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Feature Requests</h1>
          <p className="text-muted" style={{ color: 'var(--text-muted)' }}>
            Review and triage internal feature suggestions from AMS stakeholders.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid md:grid-cols-4 gap-4 bg-card border p-4 rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search requests, submitters..."
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="under-review">Under Review</option>
          <option value="backlog">Backlog</option>
          <option value="accepted">Accepted</option>
          <option value="planned">Planned</option>
          <option value="delivered">Delivered</option>
          <option value="rejected">Rejected</option>
        </select>
        <select 
          className="bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Table & List */}
        <div className={cn("bg-card border rounded-2xl overflow-hidden", selectedRequest ? "lg:col-span-7" : "lg:col-span-12")} style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/30 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted" style={{ color: 'var(--text-muted)' }}>Title</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted" style={{ color: 'var(--text-muted)' }}>Submitter</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Priority</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted" style={{ color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-muted" style={{ color: 'var(--text-muted)' }}>No requests found</td>
                  </tr>
                ) : (
                  filteredRequests.map(fr => (
                    <tr 
                      key={fr.id} 
                      onClick={() => setSelectedRequest(fr)}
                      className={cn("hover:bg-slate-800/20 cursor-pointer transition-colors group", selectedRequest?.id === fr.id && "bg-indigo-500/10")}
                    >
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">{fr.title}</span>
                          <span className="text-[10px] text-muted line-clamp-1" style={{ color: 'var(--text-muted)' }}>{fr.type}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-white uppercase tracking-tight">{fr.submitterName}</span>
                          <span className="text-[10px] text-muted" style={{ color: 'var(--text-muted)' }}>{fr.team}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <PriorityBadge priority={fr.priority} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={fr.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Detail View */}
        {selectedRequest && (
          <div className="lg:col-span-5 space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-card border rounded-2xl p-6 h-fit sticky top-6 shadow-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedRequest.title}</h2>
                  <p className="text-xs text-muted" style={{ color: 'var(--text-muted)' }}>Submitted on {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-1 hover:bg-slate-800 rounded-md transition-colors text-muted">
                  <ChevronDown className="rotate-90" size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Status</span>
                    <select 
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      value={selectedRequest.status}
                      onChange={e => handleStatusChange(selectedRequest, e.target.value as FeatureRequestStatus)}
                    >
                      <option value="new">New</option>
                      <option value="under-review">Under Review</option>
                      <option value="backlog">Backlog</option>
                      <option value="accepted">Accepted</option>
                      <option value="planned">Planned</option>
                      <option value="delivered">Delivered</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Priority</span>
                    <PriorityBadge priority={selectedRequest.priority} />
                  </div>
                </div>

                <DetailItem label="Description" value={selectedRequest.description} />
                <DetailItem label="Business Justification" value={selectedRequest.businessJustification} />
                <DetailItem label="Expected Benefit" value={selectedRequest.expectedBenefit} />
                
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Submitter" value={selectedRequest.submitterName} subValue={selectedRequest.submitterEmail} />
                  <DetailItem label="Team / Function" value={selectedRequest.team} />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  {selectedRequest.supportingLink && (
                    <a 
                      href={selectedRequest.supportingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                      <ExternalLink size={14} /> Supporting Link
                    </a>
                  )}
                  <button 
                    onClick={() => handleDelete(selectedRequest.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 ml-auto"
                  >
                    <Trash2 size={14} /> Delete Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value, subValue }: { label: string, value: string, subValue?: string }) {
  return (
    <div className="space-y-1">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted" style={{ color: 'var(--text-muted)' }}>{label}</h4>
      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{value || 'N/A'}</p>
      {subValue && <p className="text-xs text-muted" style={{ color: 'var(--text-muted)' }}>{subValue}</p>}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, { color: string, bg: string, label: string }> = {
    critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    high: { label: 'High', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
    medium: { label: 'Medium', color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
    low: { label: 'Low', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  };
  const s = styles[priority];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

function StatusBadge({ status }: { status: FeatureRequestStatus }) {
  const styles: Record<FeatureRequestStatus, { label: string, icon: any, color: string, bg: string }> = {
    new: { label: 'New', icon: Clock, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
    'under-review': { label: 'Reviewing', icon: Search, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    backlog: { label: 'Backlog', icon: Clock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    accepted: { label: 'Accepted', icon: CheckCircle2, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    planned: { label: 'Planned', icon: Clock, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    delivered: { label: 'Delivered', icon: CheckCircle2, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    rejected: { label: 'Rejected', icon: XCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  };
  const s = styles[status];
  const Icon = s.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight" style={{ color: s.color, background: s.bg }}>
      <Icon size={10} />
      {s.label}
    </span>
  );
}
