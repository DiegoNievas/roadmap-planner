import { Search, X } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { PRIORITIES, STATUSES, ITEM_TYPES, CTO_LEVERS, DEFAULT_FILTERS } from '../types';

export default function FilterBar() {
  const { data, filters, setFilters, timelineScale, setTimelineScale, viewMode } = useRoadmap();

  const owners = [...new Set(data.roadmapItems.map((i) => i.owner))].filter(Boolean);
  const themes = [...new Set(data.roadmapItems.map((i) => i.strategicTheme))].filter(Boolean);

  const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
    if (key === 'search') return (val as string).length > 0;
    return val !== null;
  });

  return (
    <div
      className="flex items-center gap-2 px-6 py-2.5 border-b overflow-x-auto shrink-0"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
    >
      {/* Search */}
      <div className="relative min-w-[180px]">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search…"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="input-field pl-8 py-1.5 text-xs"
        />
      </div>

      {/* Portfolio */}
      <select
        className="input-field py-1.5 text-xs min-w-[120px]"
        value={filters.portfolioId || ''}
        onChange={(e) => setFilters({ ...filters, portfolioId: e.target.value || null })}
      >
        <option value="">All Portfolios</option>
        {data.portfolios.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      {/* Product */}
      <select
        className="input-field py-1.5 text-xs min-w-[120px]"
        value={filters.productId || ''}
        onChange={(e) => setFilters({ ...filters, productId: e.target.value || null })}
      >
        <option value="">All Products</option>
        {data.products
          .filter((p) => !filters.portfolioId || p.portfolioId === filters.portfolioId)
          .map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      {/* Status */}
      <select
        className="input-field py-1.5 text-xs min-w-[100px]"
        value={filters.status || ''}
        onChange={(e) => setFilters({ ...filters, status: (e.target.value || null) as any })}
      >
        <option value="">All Status</option>
        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      {/* Priority */}
      <select
        className="input-field py-1.5 text-xs min-w-[100px]"
        value={filters.priority || ''}
        onChange={(e) => setFilters({ ...filters, priority: (e.target.value || null) as any })}
      >
        <option value="">All Priority</option>
        {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      {/* Type */}
      <select
        className="input-field py-1.5 text-xs min-w-[120px]"
        value={filters.type || ''}
        onChange={(e) => setFilters({ ...filters, type: (e.target.value || null) as any })}
      >
        <option value="">All Types</option>
        {ITEM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>

      {/* CTO Lever */}
      <select
        className="input-field py-1.5 text-xs min-w-[140px]"
        value={filters.ctoLever || ''}
        onChange={(e) => setFilters({ ...filters, ctoLever: (e.target.value || null) as any })}
      >
        <option value="">All CTO Levers</option>
        {CTO_LEVERS.map((l) => <option key={l} value={l}>{l}</option>)}
      </select>

      {/* Owner */}
      <select
        className="input-field py-1.5 text-xs min-w-[100px]"
        value={filters.owner || ''}
        onChange={(e) => setFilters({ ...filters, owner: e.target.value || null })}
      >
        <option value="">All Owners</option>
        {owners.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>

      {/* Theme */}
      <select
        className="input-field py-1.5 text-xs min-w-[130px]"
        value={filters.strategicTheme || ''}
        onChange={(e) => setFilters({ ...filters, strategicTheme: e.target.value || null })}
      >
        <option value="">All Themes</option>
        {themes.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      {/* Timeline scale (only for timeline / swimlane views) */}
      {(viewMode === 'timeline' || viewMode === 'swimlane-product' || viewMode === 'swimlane-portfolio') && (
        <select
          className="input-field py-1.5 text-xs min-w-[90px]"
          value={timelineScale}
          onChange={(e) => setTimelineScale(e.target.value as any)}
        >
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
        </select>
      )}

      {/* Clear */}
      {hasActiveFilters && (
        <button
          className="btn-secondary py-1.5 text-xs"
          onClick={() => setFilters(DEFAULT_FILTERS)}
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  );
}
