/* ──────────────────────────────────────────────
   Core data models — designed for easy migration
   from localStorage → Supabase.
   ────────────────────────────────────────────── */

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  owner: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  portfolioId: string;
  name: string;
  description: string;
  owner: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export type RoadmapItemType =
  | 'feature'
  | 'enhancement'
  | 'upgrade'
  | 'dependency'
  | 'technical-debt'
  | 'compliance'
  | 'operational-improvement'
  | 'new-capability';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type Status =
  | 'idea'
  | 'planned'
  | 'in-progress'
  | 'blocked'
  | 'delivered'
  | 'deferred';

export type EffortEstimate = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type CTOLever =
  | 'Operational Excellence'
  | 'Innovation'
  | 'Cost Management'
  | 'Revenue Acquisition';

export interface RoadmapItem {
  id: string;
  productId: string;
  portfolioId: string;
  title: string;
  description: string;
  type: RoadmapItemType;
  priority: Priority;
  status: Status;
  owner: string;
  startDate: string;          // ISO date
  endDate: string;            // ISO date
  milestoneDate?: string;     // ISO date — optional milestone marker
  dependencies: string[];     // IDs of other RoadmapItems
  strategicTheme: string;
  ctoLever: CTOLever;
  customerImpact: string;
  notes: string;
  confidenceLevel: ConfidenceLevel;
  effortEstimate: EffortEstimate;
  colorTag: string;
  quarterLabel: string;       // e.g. "Q1 FY26"
  createdAt: string;
  updatedAt: string;
}

export type FeatureRequestStatus =
  | 'new'
  | 'under-review'
  | 'backlog'
  | 'accepted'
  | 'planned'
  | 'rejected'
  | 'delivered';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  portfolioId: string | null;
  productId: string | null;
  type: string;
  businessJustification: string;
  expectedBenefit: string;
  priority: Priority;
  submitterName: string;
  submitterEmail: string;
  team: string;
  status: FeatureRequestStatus;
  supportingLink?: string;
  impact?: string;
  strategicAlignment?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'viewer' | 'editor';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

/** Entire application state persisted to storage */
export interface AppData {
  portfolios: Portfolio[];
  products: Product[];
  roadmapItems: RoadmapItem[];
  featureRequests: FeatureRequest[];
  version: string;            // schema version for future migrations
}

/* ── View / UI types ── */

export type ViewMode =
  | 'home'
  | 'dashboard'
  | 'timeline'
  | 'swimlane-product'
  | 'swimlane-portfolio'
  | 'kanban'
  | 'table'
  | 'milestones'
  | 'request-feature'
  | 'feature-requests'
  | 'user-management';

export type TimelineScale = 'month' | 'quarter' | 'year';

export interface Filters {
  portfolioId: string | null;
  productId: string | null;
  owner: string | null;
  priority: Priority | null;
  status: Status | null;
  type: RoadmapItemType | null;
  ctoLever: CTOLever | null;
  strategicTheme: string | null;
  search: string;
}

export const DEFAULT_FILTERS: Filters = {
  portfolioId: null,
  productId: null,
  owner: null,
  priority: null,
  status: null,
  type: null,
  ctoLever: null,
  strategicTheme: null,
  search: '',
};

/* ── Constants ── */

export const ITEM_TYPES: { value: RoadmapItemType; label: string }[] = [
  { value: 'feature', label: 'Feature' },
  { value: 'enhancement', label: 'Enhancement' },
  { value: 'upgrade', label: 'Upgrade' },
  { value: 'dependency', label: 'Dependency' },
  { value: 'technical-debt', label: 'Technical Debt' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'operational-improvement', label: 'Operational Improvement' },
  { value: 'new-capability', label: 'New Capability' },
];

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: '#ef4444' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'medium', label: 'Medium', color: '#eab308' },
  { value: 'low', label: 'Low', color: '#6b7280' },
];

export const STATUSES: { value: Status; label: string; color: string }[] = [
  { value: 'idea', label: 'Idea', color: '#8b5cf6' },
  { value: 'planned', label: 'Planned', color: '#3b82f6' },
  { value: 'in-progress', label: 'In Progress', color: '#06b6d4' },
  { value: 'blocked', label: 'Blocked', color: '#ef4444' },
  { value: 'delivered', label: 'Delivered', color: '#22c55e' },
  { value: 'deferred', label: 'Deferred', color: '#6b7280' },
];

export const CTO_LEVERS: CTOLever[] = [
  'Operational Excellence',
  'Innovation',
  'Cost Management',
  'Revenue Acquisition',
];

export const EFFORT_ESTIMATES: EffortEstimate[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const CONFIDENCE_LEVELS: ConfidenceLevel[] = ['high', 'medium', 'low'];
