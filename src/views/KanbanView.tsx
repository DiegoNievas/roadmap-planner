import { useRoadmap } from '../context/RoadmapContext';
import { STATUSES } from '../types';
import { priorityColor, isDependencyDelayed } from '../lib/utils';
import { AlertTriangle } from 'lucide-react';

export default function KanbanView() {
  const { getFilteredItems, data, setEditingItem, setShowItemForm } = useRoadmap();
  const items = getFilteredItems();

  return (
    <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
      {STATUSES.map((status) => {
        const columnItems = items.filter((i) => i.status === status.value);
        return (
          <div
            key={status.value}
            className="shrink-0 w-[280px] flex flex-col rounded-xl"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            {/* Column header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: status.color }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {status.label}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-auto" style={{ background: status.color + '20', color: status.color }}>
                {columnItems.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {columnItems.map((item) => {
                const product = data.products.find((p) => p.id === item.productId);
                const portfolio = data.portfolios.find((p) => p.id === item.portfolioId);
                const delayed = isDependencyDelayed(item, data.roadmapItems);
                return (
                  <div
                    key={item.id}
                    className="card p-3 cursor-pointer transition-all hover:scale-[1.01]"
                    onClick={() => { setEditingItem(item); setShowItemForm(true); }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-1 h-10 rounded-full shrink-0" style={{ background: item.colorTag }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                          {delayed && <AlertTriangle size={11} className="text-amber-500 shrink-0" />}
                        </div>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {portfolio?.name} · {product?.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`badge ${priorityColor(item.priority)}`}>{item.priority}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                        {item.effortEstimate}
                      </span>
                      {item.quarterLabel && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                          {item.quarterLabel}
                        </span>
                      )}
                    </div>

                    {item.owner && (
                      <div className="mt-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {item.owner}
                      </div>
                    )}
                  </div>
                );
              })}

              {columnItems.length === 0 && (
                <div className="text-center py-8">
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>No items</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
