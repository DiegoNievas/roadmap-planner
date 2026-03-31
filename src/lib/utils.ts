import { addDays, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';
import type { RoadmapItem } from '../types';

/** Merge class names, filtering falsy values */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Check if a dependency chain could delay a milestone */
export function isDependencyDelayed(
  item: RoadmapItem,
  allItems: RoadmapItem[]
): boolean {
  if (item.dependencies.length === 0) return false;
  return item.dependencies.some((depId) => {
    const dep = allItems.find((i) => i.id === depId);
    if (!dep) return false;
    // Dependency is delayed if it's not delivered and its end date is after the item's start date
    if (dep.status !== 'delivered' && dep.endDate) {
      return isAfter(parseISO(dep.endDate), parseISO(item.startDate));
    }
    return dep.status === 'blocked';
  });
}

/** Get items due in the next N days */
export function getUpcomingMilestones(items: RoadmapItem[], days: number): RoadmapItem[] {
  const today = new Date();
  const cutoff = addDays(today, days);
  return items
    .filter((i) => {
      const date = i.milestoneDate || i.endDate;
      if (!date) return false;
      const d = parseISO(date);
      return isAfter(d, today) && isBefore(d, cutoff);
    })
    .sort((a, b) => {
      const da = parseISO(a.milestoneDate || a.endDate);
      const db = parseISO(b.milestoneDate || b.endDate);
      return differenceInDays(da, db);
    });
}

/** Format a priority badge color for Tailwind */
export function priorityColor(p: string): string {
  switch (p) {
    case 'critical': return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'high': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    case 'medium': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
    case 'low': return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
  }
}

/** Format a status badge color for Tailwind */
export function statusColor(s: string): string {
  switch (s) {
    case 'idea': return 'bg-violet-500/15 text-violet-400 border-violet-500/30';
    case 'planned': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'in-progress': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
    case 'blocked': return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'delivered': return 'bg-green-500/15 text-green-400 border-green-500/30';
    case 'deferred': return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
  }
}

export function statusLabel(s: string): string {
  return s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
