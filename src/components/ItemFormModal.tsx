import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import type { RoadmapItem, RoadmapItemType, Priority, Status, CTOLever, ConfidenceLevel, EffortEstimate } from '../types';
import { ITEM_TYPES, PRIORITIES, STATUSES, CTO_LEVERS, CONFIDENCE_LEVELS, EFFORT_ESTIMATES } from '../types';

const EMPTY_ITEM: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'> = {
  productId: '',
  portfolioId: '',
  title: '',
  description: '',
  type: 'feature',
  priority: 'medium',
  status: 'idea',
  owner: '',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
  milestoneDate: undefined,
  dependencies: [],
  strategicTheme: '',
  ctoLever: 'Innovation',
  customerImpact: '',
  notes: '',
  confidenceLevel: 'medium',
  effortEstimate: 'M',
  colorTag: '#6366f1',
  quarterLabel: '',
};

export default function ItemFormModal() {
  const {
    data,
    editingItem,
    setShowItemForm,
    setEditingItem,
    addRoadmapItem,
    updateRoadmapItem,
  } = useRoadmap();

  const isEdit = !!editingItem;

  const [form, setForm] = useState<Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>>(() => {
    if (editingItem) {
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = editingItem;
      return rest;
    }
    const defaults = { ...EMPTY_ITEM };
    if (data.portfolios.length > 0) defaults.portfolioId = data.portfolios[0].id;
    if (data.products.length > 0) defaults.productId = data.products[0].id;
    return defaults;
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Sync portfolio when product changes
  useEffect(() => {
    if (form.productId) {
      const prod = data.products.find((p) => p.id === form.productId);
      if (prod && prod.portfolioId !== form.portfolioId) {
        setForm((f) => ({ ...f, portfolioId: prod.portfolioId }));
      }
    }
  }, [form.productId, data.products, form.portfolioId]);

  const update = (key: string, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.title.trim()) errs.push('Title is required');
    if (!form.productId) errs.push('Product is required');
    if (!form.startDate) errs.push('Start date is required');
    if (!form.endDate) errs.push('End date is required');
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errs.push('End date cannot be before start date');
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isEdit && editingItem) {
      updateRoadmapItem({ ...editingItem, ...form });
    } else {
      addRoadmapItem(form);
    }
    close();
  };

  const close = () => {
    setShowItemForm(false);
    setEditingItem(null);
  };

  const availableProducts = data.products.filter(
    (p) => !form.portfolioId || p.portfolioId === form.portfolioId
  );

  const otherItems = data.roadmapItems.filter((i) => !editingItem || i.id !== editingItem.id);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="modal-content">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit Roadmap Item' : 'New Roadmap Item'}
          </h2>
          <button onClick={close} className="p-1 rounded cursor-pointer" style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mx-6 mb-3 p-3 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
            {errors.map((e, i) => <div key={i}>• {e}</div>)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Title *</label>
            <input className="input-field" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. FortiSASE Integration" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>

          {/* Portfolio & Product */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Portfolio</label>
              <select className="input-field" value={form.portfolioId} onChange={(e) => update('portfolioId', e.target.value)}>
                <option value="">Select…</option>
                {data.portfolios.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Product *</label>
              <select className="input-field" value={form.productId} onChange={(e) => update('productId', e.target.value)}>
                <option value="">Select…</option>
                {availableProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          {/* Type, Priority, Status */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Type</label>
              <select className="input-field" value={form.type} onChange={(e) => update('type', e.target.value as RoadmapItemType)}>
                {ITEM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Priority</label>
              <select className="input-field" value={form.priority} onChange={(e) => update('priority', e.target.value as Priority)}>
                {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <select className="input-field" value={form.status} onChange={(e) => update('status', e.target.value as Status)}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Owner */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Owner</label>
            <input className="input-field" value={form.owner} onChange={(e) => update('owner', e.target.value)} placeholder="e.g. Diego Nievas" />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Start Date *</label>
              <input type="date" className="input-field" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>End Date *</label>
              <input type="date" className="input-field" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Milestone Date</label>
              <input type="date" className="input-field" value={form.milestoneDate || ''} onChange={(e) => update('milestoneDate', e.target.value || undefined)} />
            </div>
          </div>

          {/* Quarter Label */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Quarter Label</label>
              <input className="input-field" value={form.quarterLabel} onChange={(e) => update('quarterLabel', e.target.value)} placeholder="e.g. Q2 FY26" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Colour Tag</label>
              <input type="color" className="input-field h-[36px] p-1 cursor-pointer" value={form.colorTag} onChange={(e) => update('colorTag', e.target.value)} />
            </div>
          </div>

          {/* Strategic Theme & CTO Lever */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Strategic Theme</label>
              <input className="input-field" value={form.strategicTheme} onChange={(e) => update('strategicTheme', e.target.value)} placeholder="e.g. Zero Trust Transformation" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>CTO Lever</label>
              <select className="input-field" value={form.ctoLever} onChange={(e) => update('ctoLever', e.target.value as CTOLever)}>
                {CTO_LEVERS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Confidence & Effort */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Confidence Level</label>
              <select className="input-field" value={form.confidenceLevel} onChange={(e) => update('confidenceLevel', e.target.value as ConfidenceLevel)}>
                {CONFIDENCE_LEVELS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Effort Estimate</label>
              <select className="input-field" value={form.effortEstimate} onChange={(e) => update('effortEstimate', e.target.value as EffortEstimate)}>
                {EFFORT_ESTIMATES.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
          </div>

          {/* Customer Impact */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Customer Impact</label>
            <textarea className="input-field" rows={2} value={form.customerImpact} onChange={(e) => update('customerImpact', e.target.value)} />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label>
            <textarea className="input-field" rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} />
          </div>

          {/* Dependencies */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Dependencies</label>
            <div className="space-y-1 max-h-32 overflow-y-auto p-2 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              {otherItems.length === 0 && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No other items to link</span>}
              {otherItems.map((item) => (
                <label key={item.id} className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={form.dependencies.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        update('dependencies', [...form.dependencies, item.id]);
                      } else {
                        update('dependencies', form.dependencies.filter((d) => d !== item.id));
                      }
                    }}
                  />
                  {item.title}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={close}>Cancel</button>
            <button type="submit" className="btn-primary">{isEdit ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
