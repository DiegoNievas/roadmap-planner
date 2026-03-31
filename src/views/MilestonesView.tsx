import { useRoadmap } from '../context/RoadmapContext';
import { format, parseISO } from 'date-fns';
import { Flag, AlertTriangle } from 'lucide-react';
import { priorityColor, statusColor, statusLabel, isDependencyDelayed } from '../lib/utils';

export default function MilestonesView() {
  const { getFilteredItems, data, setEditingItem, setShowItemForm } = useRoadmap();
  const items = getFilteredItems()
    .filter((i) => i.milestoneDate)
    .sort((a, b) => (a.milestoneDate || '').localeCompare(b.milestoneDate || ''));

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No milestones found. Add milestone dates to roadmap items to see them here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-0 relative">
      {/* Vertical line */}
      <div className="absolute left-[18px] top-0 bottom-0 w-px" style={{ background: 'var(--border-color)' }} />

      {items.map((item) => {
        const product = data.products.find((p) => p.id === item.productId);
        const portfolio = data.portfolios.find((p) => p.id === item.portfolioId);
        const delayed = isDependencyDelayed(item, data.roadmapItems);
        const mDate = parseISO(item.milestoneDate!);
        const isPast = mDate < new Date();

        return (
          <div key={item.id} className="flex gap-4 py-3 relative">
            {/* Dot */}
            <div className="shrink-0 relative z-10">
              <div
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
                style={{
                  background: isPast ? '#22c55e20' : 'var(--accent-light)',
                  border: `2px solid ${isPast ? '#22c55e' : 'var(--accent)'}`,
                }}
              >
                <Flag size={14} style={{ color: isPast ? '#22c55e' : 'var(--accent)' }} />
              </div>
            </div>

            {/* Content */}
            <div
              className="card flex-1 p-4 cursor-pointer"
              onClick={() => { setEditingItem(item); setShowItemForm(true); }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                <span className="text-xs font-medium" style={{ color: isPast ? '#22c55e' : 'var(--accent)' }}>
                  {format(mDate, 'dd MMM yyyy')}
                </span>
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                {portfolio?.name} · {product?.name}
                {delayed && (
                  <span className="inline-flex items-center gap-1 ml-2 text-amber-500">
                    <AlertTriangle size={11} /> Dependency risk
                  </span>
                )}
              </div>
              <div className="flex gap-1.5">
                <span className={`badge ${priorityColor(item.priority)}`}>{item.priority}</span>
                <span className={`badge ${statusColor(item.status)}`}>{statusLabel(item.status)}</span>
                {item.quarterLabel && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                    {item.quarterLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
