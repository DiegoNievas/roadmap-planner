import { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { priorityColor, statusColor, statusLabel, isDependencyDelayed } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { Pencil, Copy, Trash2, AlertTriangle, ArrowUpDown } from 'lucide-react';

type SortKey = 'title' | 'startDate' | 'priority' | 'status' | 'product';
type SortDir = 'asc' | 'desc';

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export default function TableView() {
  const { getFilteredItems, data, setEditingItem, setShowItemForm, deleteRoadmapItem, duplicateRoadmapItem } = useRoadmap();
  const items = getFilteredItems();

  const [sortKey, setSortKey] = useState<SortKey>('startDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...items].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case 'title': cmp = a.title.localeCompare(b.title); break;
      case 'startDate': cmp = a.startDate.localeCompare(b.startDate); break;
      case 'priority': cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]; break;
      case 'status': cmp = a.status.localeCompare(b.status); break;
      case 'product': {
        const pa = data.products.find((p) => p.id === a.productId)?.name || '';
        const pb = data.products.find((p) => p.id === b.productId)?.name || '';
        cmp = pa.localeCompare(pb);
        break;
      }
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="text-left px-3 py-2.5 text-xs font-medium cursor-pointer select-none whitespace-nowrap"
      style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}
      onClick={() => toggleSort(k)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown size={11} style={{ opacity: sortKey === k ? 1 : 0.3 }} />
      </span>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg-secondary)' }}>
            <SortHeader label="Title" k="title" />
            <SortHeader label="Product" k="product" />
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Type</th>
            <SortHeader label="Priority" k="priority" />
            <SortHeader label="Status" k="status" />
            <SortHeader label="Start" k="startDate" />
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>End</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Quarter</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Owner</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Effort</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Conf.</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => {
            const product = data.products.find((p) => p.id === item.productId);
            const delayed = isDependencyDelayed(item, data.roadmapItems);
            return (
              <tr
                key={item.id}
                className="transition-colors cursor-pointer"
                style={{ borderBottom: '1px solid var(--border-color)' }}
                onClick={() => { setEditingItem(item); setShowItemForm(true); }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-3 py-2.5 max-w-[200px]">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full shrink-0" style={{ background: item.colorTag }} />
                    <span className="truncate font-medium" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                    {delayed && <AlertTriangle size={12} className="text-amber-500 shrink-0" />}
                  </div>
                </td>
                <td className="px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>{product?.name}</td>
                <td className="px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>{item.type}</td>
                <td className="px-3 py-2.5"><span className={`badge ${priorityColor(item.priority)}`}>{item.priority}</span></td>
                <td className="px-3 py-2.5"><span className={`badge ${statusColor(item.status)}`}>{statusLabel(item.status)}</span></td>
                <td className="px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>{format(parseISO(item.startDate), 'dd MMM yy')}</td>
                <td className="px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>{format(parseISO(item.endDate), 'dd MMM yy')}</td>
                <td className="px-3 py-2.5" style={{ color: 'var(--text-muted)' }}>{item.quarterLabel}</td>
                <td className="px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>{item.owner}</td>
                <td className="px-3 py-2.5" style={{ color: 'var(--text-muted)' }}>{item.effortEstimate}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${item.confidenceLevel === 'high' ? 'bg-green-500' : item.confidenceLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="p-1 rounded cursor-pointer transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onClick={() => { setEditingItem(item); setShowItemForm(true); }}
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      className="p-1 rounded cursor-pointer transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onClick={() => duplicateRoadmapItem(item.id)}
                      title="Duplicate"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      className="p-1 rounded cursor-pointer transition-colors text-red-400"
                      onClick={() => { if (confirm('Delete this item?')) deleteRoadmapItem(item.id); }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {sorted.length === 0 && (
            <tr>
              <td colSpan={12} className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
                No items match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
