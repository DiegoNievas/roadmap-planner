/* ──────────────────────────────────────────────
   Storage service — Supabase implementation.
   Each function targets individual tables rather
   than persisting a single JSON blob.
   ────────────────────────────────────────────── */

import { supabase } from '../lib/supabase';
import type { AppData, Portfolio, Product, RoadmapItem, FeatureRequest } from '../types';

// ── Column mapping helpers ────────────────────

function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const map: Record<string, string> = {
    portfolioId: 'portfolio_id',
    productId: 'product_id',
    startDate: 'start_date',
    endDate: 'end_date',
    milestoneDate: 'milestone_date',
    strategicTheme: 'strategic_theme',
    ctoLever: 'cto_lever',
    customerImpact: 'customer_impact',
    confidenceLevel: 'confidence_level',
    effortEstimate: 'effort_estimate',
    colorTag: 'color_tag',
    quarterLabel: 'quarter_label',
    businessJustification: 'business_justification',
    expectedBenefit: 'expected_benefit',
    submitterName: 'submitter_name',
    submitterEmail: 'submitter_email',
    supportingLink: 'supporting_link',
    strategicAlignment: 'strategic_alignment',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    result[map[k] ?? k] = v;
  }
  return result;
}

function toCamel<T>(obj: Record<string, unknown>): T {
  const map: Record<string, string> = {
    portfolio_id: 'portfolioId',
    product_id: 'productId',
    start_date: 'startDate',
    end_date: 'endDate',
    milestone_date: 'milestoneDate',
    strategic_theme: 'strategicTheme',
    cto_lever: 'ctoLever',
    customer_impact: 'customerImpact',
    confidence_level: 'confidenceLevel',
    effort_estimate: 'effortEstimate',
    color_tag: 'colorTag',
    quarter_label: 'quarterLabel',
    business_justification: 'businessJustification',
    expected_benefit: 'expectedBenefit',
    submitter_name: 'submitterName',
    submitter_email: 'submitterEmail',
    supporting_link: 'supportingLink',
    strategic_alignment: 'strategicAlignment',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
  };
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    result[map[k] ?? k] = v;
  }
  return result as T;
}

// ── Load all data ─────────────────────────────

export async function loadAppData(): Promise<AppData> {
  const [pRes, prRes, riRes, frRes] = await Promise.all([
    supabase.from('portfolios').select('*').order('created_at'),
    supabase.from('products').select('*').order('created_at'),
    supabase.from('roadmap_items').select('*').order('created_at'),
    supabase.from('feature_requests').select('*').order('created_at'),
  ]);

  if (pRes.error) throw pRes.error;
  if (prRes.error) throw prRes.error;
  if (riRes.error) throw riRes.error;
  if (frRes.error) throw frRes.error;

  return {
    portfolios: (pRes.data ?? []).map((r) => toCamel<Portfolio>(r as Record<string, unknown>)),
    products: (prRes.data ?? []).map((r) => toCamel<Product>(r as Record<string, unknown>)),
    roadmapItems: (riRes.data ?? []).map((r) => toCamel<RoadmapItem>(r as Record<string, unknown>)),
    featureRequests: (frRes.data ?? []).map((r) => toCamel<FeatureRequest>(r as Record<string, unknown>)),
    version: '2.0.0',
  };
}

// ── Portfolio CRUD ────────────────────────────

export async function addPortfolioDb(p: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Portfolio> {
  const { data, error } = await supabase
    .from('portfolios')
    .insert(toSnake(p as unknown as Record<string, unknown>))
    .select()
    .single();
  if (error) throw error;
  return toCamel<Portfolio>(data as Record<string, unknown>);
}

export async function updatePortfolioDb(p: Portfolio): Promise<Portfolio> {
  const { id, createdAt: _c, updatedAt: _u, ...rest } = p;
  const { data, error } = await supabase
    .from('portfolios')
    .update(toSnake(rest as unknown as Record<string, unknown>))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return toCamel<Portfolio>(data as Record<string, unknown>);
}

export async function deletePortfolioDb(id: string): Promise<void> {
  const { error } = await supabase.from('portfolios').delete().eq('id', id);
  if (error) throw error;
}

// ── Product CRUD ──────────────────────────────

export async function addProductDb(p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(toSnake(p as unknown as Record<string, unknown>))
    .select()
    .single();
  if (error) throw error;
  return toCamel<Product>(data as Record<string, unknown>);
}

export async function updateProductDb(p: Product): Promise<Product> {
  const { id, createdAt: _c, updatedAt: _u, ...rest } = p;
  const { data, error } = await supabase
    .from('products')
    .update(toSnake(rest as unknown as Record<string, unknown>))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return toCamel<Product>(data as Record<string, unknown>);
}

export async function deleteProductDb(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ── Roadmap Item CRUD ─────────────────────────

export async function addRoadmapItemDb(
  item: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<RoadmapItem> {
  const { data, error } = await supabase
    .from('roadmap_items')
    .insert(toSnake(item as unknown as Record<string, unknown>))
    .select()
    .single();
  if (error) throw error;
  return toCamel<RoadmapItem>(data as Record<string, unknown>);
}

export async function updateRoadmapItemDb(item: RoadmapItem): Promise<RoadmapItem> {
  const { id, createdAt: _c, updatedAt: _u, ...rest } = item;
  const { data, error } = await supabase
    .from('roadmap_items')
    .update(toSnake(rest as unknown as Record<string, unknown>))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return toCamel<RoadmapItem>(data as Record<string, unknown>);
}

export async function deleteRoadmapItemDb(id: string): Promise<void> {
  const { error } = await supabase.from('roadmap_items').delete().eq('id', id);
  if (error) throw error;
}

// ── Feature Request CRUD ──────────────────────

export async function addFeatureRequestDb(
  fr: Omit<FeatureRequest, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FeatureRequest> {
  const { data, error } = await supabase
    .from('feature_requests')
    .insert(toSnake(fr as unknown as Record<string, unknown>))
    .select()
    .single();
  if (error) throw error;
  return toCamel<FeatureRequest>(data as Record<string, unknown>);
}

export async function updateFeatureRequestDb(fr: FeatureRequest): Promise<FeatureRequest> {
  const { id, createdAt: _c, updatedAt: _u, ...rest } = fr;
  const { data, error } = await supabase
    .from('feature_requests')
    .update(toSnake(rest as unknown as Record<string, unknown>))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return toCamel<FeatureRequest>(data as Record<string, unknown>);
}

export async function deleteFeatureRequestDb(id: string): Promise<void> {
  const { error } = await supabase.from('feature_requests').delete().eq('id', id);
  if (error) throw error;
}

// ── Bulk operations ───────────────────────────

export async function replaceAllDataDb(appData: AppData): Promise<void> {
  // Clear all tables (cascade handles children)
  await supabase.from('feature_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('roadmap_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('portfolios').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert new data
  if (appData.portfolios.length > 0) {
    const { error } = await supabase
      .from('portfolios')
      .insert(appData.portfolios.map((p) => toSnake(p as unknown as Record<string, unknown>)));
    if (error) throw error;
  }
  if (appData.products.length > 0) {
    const { error } = await supabase
      .from('products')
      .insert(appData.products.map((p) => toSnake(p as unknown as Record<string, unknown>)));
    if (error) throw error;
  }
  if (appData.roadmapItems.length > 0) {
    const { error } = await supabase
      .from('roadmap_items')
      .insert(appData.roadmapItems.map((r) => toSnake(r as unknown as Record<string, unknown>)));
    if (error) throw error;
  }
  if (appData.featureRequests.length > 0) {
    const { error } = await supabase
      .from('feature_requests')
      .insert(appData.featureRequests.map((r) => toSnake(r as unknown as Record<string, unknown>)));
    if (error) throw error;
  }
}

export async function clearAllDataDb(): Promise<void> {
  await supabase.from('feature_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('roadmap_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('portfolios').delete().neq('id', '00000000-0000-0000-0000-000000000000');
}

// ── JSON export/import (client-side) ──────────

export function exportToJson(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `roadmap-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJson(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as AppData;
        if (!data.portfolios || !data.products || !data.roadmapItems) {
          reject(new Error('Invalid data format'));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error('Failed to parse JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
