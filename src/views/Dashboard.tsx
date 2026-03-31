import { BarChart3, AlertTriangle, CheckCircle2, Clock, Flag, TrendingUp, Zap, Target, DollarSign } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { getUpcomingMilestones, isDependencyDelayed, statusLabel, priorityColor, statusColor } from '../lib/utils';
import { format, parseISO } from 'date-fns';

export default function Dashboard() {
  const { data, setEditingItem, setShowItemForm } = useRoadmap();
  const items = data.roadmapItems;

  // Stats
  const total = items.length;
  const byStatus = (s: string) => items.filter((i) => i.status === s).length;
  const blocked = items.filter((i) => i.status === 'blocked');
  const milestones = getUpcomingMilestones(items, 90);
  const delayedDeps = items.filter((i) => isDependencyDelayed(i, items));
  const topPriorities = items.filter((i) => (i.priority === 'critical' || i.priority === 'high') && i.status !== 'delivered' && i.status !== 'deferred');

  const ctoLeverCounts = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.ctoLever] = (acc[i.ctoLever] || 0) + 1;
    return acc;
  }, {});

  const portfolioCounts = data.portfolios.map((p) => ({
    ...p,
    count: items.filter((i) => i.portfolioId === p.id).length,
    inProgress: items.filter((i) => i.portfolioId === p.id && i.status === 'in-progress').length,
  }));

  const leverIcon = (lever: string) => {
    switch (lever) {
      case 'Operational Excellence': return <Target size={14} />;
      case 'Innovation': return <Zap size={14} />;
      case 'Cost Management': return <DollarSign size={14} />;
      case 'Revenue Acquisition': return <TrendingUp size={14} />;
      default: return <BarChart3 size={14} />;
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Hero stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: total, icon: <BarChart3 size={20} />, color: '#6366f1' },
          { label: 'In Progress', value: byStatus('in-progress'), icon: <Clock size={20} />, color: '#06b6d4' },
          { label: 'Delivered', value: byStatus('delivered'), icon: <CheckCircle2 size={20} />, color: '#22c55e' },
          { label: 'Blocked', value: blocked.length, icon: <AlertTriangle size={20} />, color: '#ef4444' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Priorities */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Zap size={16} style={{ color: 'var(--accent)' }} />
            Top Priorities This Quarter
          </h3>
          <div className="space-y-2">
            {topPriorities.slice(0, 6).map((item) => {
              const product = data.products.find((p) => p.id === item.productId);
              const delayed = isDependencyDelayed(item, items);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                  style={{ background: 'var(--bg-secondary)' }}
                  onClick={() => { setEditingItem(item); setShowItemForm(true); }}
                >
                  <div className="w-1 h-8 rounded-full" style={{ background: item.colorTag }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                      {delayed && <AlertTriangle size={13} className="text-amber-500 shrink-0" />}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{product?.name} · {item.quarterLabel}</span>
                  </div>
                  <span className={`badge ${priorityColor(item.priority)}`}>{item.priority}</span>
                  <span className={`badge ${statusColor(item.status)}`}>{statusLabel(item.status)}</span>
                </div>
              );
            })}
            {topPriorities.length === 0 && (
              <p className="text-xs py-4 text-center" style={{ color: 'var(--text-muted)' }}>No critical/high priority items in progress.</p>
            )}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Flag size={16} style={{ color: '#f97316' }} />
            Milestones (Next 90 Days)
          </h3>
          <div className="space-y-3">
            {milestones.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: item.colorTag }} />
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {format(parseISO(item.milestoneDate || item.endDate), 'dd MMM yyyy')}
                  </div>
                </div>
              </div>
            ))}
            {milestones.length === 0 && <p className="text-xs py-4 text-center" style={{ color: 'var(--text-muted)' }}>No upcoming milestones.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Breakdown */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Portfolio Breakdown</h3>
          <div className="space-y-3">
            {portfolioCounts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded" style={{ background: p.color }} />
                <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{p.inProgress} active</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTO Lever Breakdown */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>CTO Lever Distribution</h3>
          <div className="space-y-3">
            {Object.entries(ctoLeverCounts).map(([lever, count]) => (
              <div key={lever} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {leverIcon(lever)}
                </div>
                <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>{lever}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blocked Items */}
      {blocked.length > 0 && (
        <div className="card p-5" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-red-400">
            <AlertTriangle size={16} />
            Blocked Items ({blocked.length})
          </h3>
          <div className="space-y-2">
            {blocked.map((item) => {
              const product = data.products.find((p) => p.id === item.productId);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
                  style={{ background: 'rgba(239,68,68,0.05)' }}
                  onClick={() => { setEditingItem(item); setShowItemForm(true); }}
                >
                  <div className="w-1 h-6 rounded-full bg-red-500" />
                  <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{product?.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dependency Delays */}
      {delayedDeps.length > 0 && (
        <div className="card p-5" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-amber-400">
            <AlertTriangle size={16} />
            Dependency Risks ({delayedDeps.length})
          </h3>
          <div className="space-y-2">
            {delayedDeps.map((item) => {
              const depNames = item.dependencies
                .map((d) => data.roadmapItems.find((r) => r.id === d)?.title)
                .filter(Boolean);
              return (
                <div key={item.id} className="p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.05)' }}>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Depends on: {depNames.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
