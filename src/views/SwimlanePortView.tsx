import { useMemo } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { priorityColor, statusColor, statusLabel, isDependencyDelayed } from '../lib/utils';
import { AlertTriangle } from 'lucide-react';

export default function SwimlanePortView() {
  const { getFilteredItems, data, setEditingItem, setShowItemForm } = useRoadmap();
  const items = getFilteredItems();

  const lanes = useMemo(() => {
    const map = new Map<string, typeof items>();
    items.forEach((item) => {
      if (!map.has(item.portfolioId)) map.set(item.portfolioId, []);
      map.get(item.portfolioId)!.push(item);
    });
    return Array.from(map.entries()).map(([portfolioId, laneItems]) => ({
      portfolio: data.portfolios.find((p) => p.id === portfolioId),
      items: laneItems.sort((a, b) => a.startDate.localeCompare(b.startDate)),
    }));
  }, [items, data.portfolios]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No items match your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lanes.map(({ portfolio, items: laneItems }) => (
        <div key={portfolio?.id || 'unknown'} className="card overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
            <div className="w-3 h-3 rounded" style={{ background: portfolio?.color || '#888' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{portfolio?.name || 'Unknown'}</span>
            <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              {laneItems.length}
            </span>
          </div>

          <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {laneItems.map((item) => {
              const product = data.products.find((p) => p.id === item.productId);
              const delayed = isDependencyDelayed(item, data.roadmapItems);
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-lg cursor-pointer transition-colors"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                  onClick={() => { setEditingItem(item); setShowItemForm(true); }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-1 h-8 rounded-full shrink-0" style={{ background: item.colorTag }} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                        {delayed && <AlertTriangle size={11} className="text-amber-500 shrink-0" />}
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {product?.name} · {item.startDate} → {item.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className={`badge ${priorityColor(item.priority)}`}>{item.priority}</span>
                    <span className={`badge ${statusColor(item.status)}`}>{statusLabel(item.status)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
