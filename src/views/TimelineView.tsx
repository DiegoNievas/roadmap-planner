import { useMemo } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { format, parseISO, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, eachMonthOfInterval, eachQuarterOfInterval, differenceInDays, addMonths } from 'date-fns';
import { isDependencyDelayed } from '../lib/utils';
import { AlertTriangle } from 'lucide-react';

export default function TimelineView() {
  const { getFilteredItems, data, timelineScale, setEditingItem, setShowItemForm } = useRoadmap();
  const items = getFilteredItems();

  // Calculate timeline bounds
  const { periods, totalDays, startDate: timelineStart } = useMemo(() => {
    if (items.length === 0) {
      const now = new Date();
      const start = startOfQuarter(now);
      const end = endOfQuarter(addMonths(now, 12));
      return {
        periods: eachQuarterOfInterval({ start, end }).map((d) => ({
          start: startOfQuarter(d),
          end: endOfQuarter(d),
          label: `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`,
        })),
        totalDays: differenceInDays(end, start),
        startDate: start,
      };
    }

    const allDates = items.flatMap((i) => [parseISO(i.startDate), parseISO(i.endDate)]);
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

    let start: Date, end: Date;
    let periods: { start: Date; end: Date; label: string }[];

    switch (timelineScale) {
      case 'month': {
        start = startOfMonth(addMonths(minDate, -1));
        end = endOfMonth(addMonths(maxDate, 1));
        periods = eachMonthOfInterval({ start, end }).map((d) => ({
          start: startOfMonth(d),
          end: endOfMonth(d),
          label: format(d, 'MMM yyyy'),
        }));
        break;
      }
      case 'year': {
        start = startOfYear(minDate);
        end = endOfYear(maxDate);
        periods = [minDate, maxDate]
          .map((d) => d.getFullYear())
          .filter((y, i, arr) => arr.indexOf(y) === i)
          .flatMap((y) => {
            const s = startOfYear(new Date(y, 0, 1));
            const e = endOfYear(new Date(y, 0, 1));
            return [{ start: s, end: e, label: String(y) }];
          });
        // Ensure all years in range
        const startY = start.getFullYear();
        const endY = end.getFullYear();
        periods = [];
        for (let y = startY; y <= endY; y++) {
          periods.push({
            start: startOfYear(new Date(y, 0, 1)),
            end: endOfYear(new Date(y, 0, 1)),
            label: String(y),
          });
        }
        break;
      }
      default: { // quarter
        start = startOfQuarter(addMonths(minDate, -3));
        end = endOfQuarter(addMonths(maxDate, 3));
        periods = eachQuarterOfInterval({ start, end }).map((d) => ({
          start: startOfQuarter(d),
          end: endOfQuarter(d),
          label: `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`,
        }));
        break;
      }
    }

    return {
      periods,
      totalDays: differenceInDays(end, start),
      startDate: start,
    };
  }, [items, timelineScale]);

  const getBarStyle = (item: typeof items[0]) => {
    const itemStart = parseISO(item.startDate);
    const itemEnd = parseISO(item.endDate);
    const offsetDays = Math.max(0, differenceInDays(itemStart, timelineStart));
    const durationDays = Math.max(1, differenceInDays(itemEnd, itemStart));
    const left = (offsetDays / totalDays) * 100;
    const width = (durationDays / totalDays) * 100;
    return { left: `${left}%`, width: `${Math.max(width, 1)}%` };
  };

  const getMilestonePos = (dateStr: string) => {
    const d = parseISO(dateStr);
    const offset = differenceInDays(d, timelineStart);
    return `${(offset / totalDays) * 100}%`;
  };

  // Group by product
  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    items.forEach((item) => {
      const key = item.productId;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return Array.from(map.entries()).map(([productId, items]) => ({
      product: data.products.find((p) => p.id === productId),
      items: items.sort((a, b) => a.startDate.localeCompare(b.startDate)),
    }));
  }, [items, data.products]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No roadmap items match your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Period headers */}
      <div className="sticky top-0 z-10 flex" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="shrink-0 w-[200px] px-3 py-2 text-xs font-medium" style={{ color: 'var(--text-muted)', borderRight: '1px solid var(--border-color)' }}>
          Product / Item
        </div>
        <div className="flex-1 flex relative">
          {periods.map((p, i) => {
            const pDays = differenceInDays(p.end, p.start);
            const pWidth = (pDays / totalDays) * 100;
            return (
              <div
                key={i}
                className="text-center py-2 text-xs font-medium shrink-0"
                style={{
                  width: `${pWidth}%`,
                  color: 'var(--text-muted)',
                  borderRight: '1px solid var(--border-color)',
                }}
              >
                {p.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rows */}
      {grouped.map(({ product, items: groupItems }) => (
        <div key={product?.id || 'unknown'}>
          {/* Product header */}
          <div className="flex" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="shrink-0 w-[200px] px-3 py-2 flex items-center gap-2" style={{ borderRight: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
              <div className="w-2.5 h-2.5 rounded" style={{ background: product?.color || '#888' }} />
              <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {product?.name || 'Unknown'}
              </span>
            </div>
            <div className="flex-1" style={{ background: 'var(--bg-secondary)' }} />
          </div>

          {/* Item rows */}
          {groupItems.map((item) => {
            const delayed = isDependencyDelayed(item, data.roadmapItems);
            const barStyle = getBarStyle(item);
            return (
              <div
                key={item.id}
                className="flex group"
                style={{ borderBottom: '1px solid var(--border-color)' }}
              >
                <div
                  className="shrink-0 w-[200px] px-3 py-2.5 flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ borderRight: '1px solid var(--border-color)' }}
                  onClick={() => { setEditingItem(item); setShowItemForm(true); }}
                >
                  <span className="text-xs truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{item.title}</span>
                  {delayed && <AlertTriangle size={12} className="text-amber-500 shrink-0" />}
                </div>
                <div className="flex-1 relative py-1.5">
                  {/* Period grid lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {periods.map((p, i) => {
                      const pDays = differenceInDays(p.end, p.start);
                      const pWidth = (pDays / totalDays) * 100;
                      return <div key={i} className="shrink-0 h-full" style={{ width: `${pWidth}%`, borderRight: '1px solid var(--border-color)' }} />;
                    })}
                  </div>

                  {/* Bar */}
                  <div
                    className="timeline-bar absolute top-1.5 flex items-center px-2 text-[10px] text-white font-medium truncate"
                    style={{
                      ...barStyle,
                      background: item.colorTag,
                      opacity: item.status === 'deferred' ? 0.4 : item.status === 'delivered' ? 0.7 : 1,
                      border: delayed ? '2px solid #f59e0b' : 'none',
                    }}
                    title={`${item.title}\n${item.startDate} → ${item.endDate}`}
                    onClick={() => { setEditingItem(item); setShowItemForm(true); }}
                  >
                    <span className="truncate">{item.title}</span>
                  </div>

                  {/* Milestone diamond */}
                  {item.milestoneDate && (
                    <div
                      className="milestone-marker absolute"
                      style={{
                        left: getMilestonePos(item.milestoneDate),
                        top: '0px',
                        background: '#f97316',
                        borderColor: '#f97316',
                      }}
                      title={`Milestone: ${format(parseISO(item.milestoneDate), 'dd MMM yyyy')}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
