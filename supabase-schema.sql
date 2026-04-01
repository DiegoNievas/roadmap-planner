-- ═══════════════════════════════════════════════════════════
-- Roadmap Planner — Supabase Schema & Seed Data
-- Run this in the Supabase SQL Editor (once)
-- ═══════════════════════════════════════════════════════════

-- ── 1. Tables ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS portfolios (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  owner       text NOT NULL DEFAULT '',
  color       text NOT NULL DEFAULT '#6366f1',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id  uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text NOT NULL DEFAULT '',
  owner         text NOT NULL DEFAULT '',
  color         text NOT NULL DEFAULT '#06b6d4',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roadmap_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  portfolio_id      uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  title             text NOT NULL,
  description       text NOT NULL DEFAULT '',
  type              text NOT NULL DEFAULT 'feature',
  priority          text NOT NULL DEFAULT 'medium',
  status            text NOT NULL DEFAULT 'idea',
  owner             text NOT NULL DEFAULT '',
  start_date        text NOT NULL,
  end_date          text NOT NULL,
  milestone_date    text,
  dependencies      jsonb NOT NULL DEFAULT '[]'::jsonb,
  strategic_theme   text NOT NULL DEFAULT '',
  cto_lever         text NOT NULL DEFAULT 'Innovation',
  customer_impact   text NOT NULL DEFAULT '',
  notes             text NOT NULL DEFAULT '',
  confidence_level  text NOT NULL DEFAULT 'medium',
  effort_estimate   text NOT NULL DEFAULT 'M',
  color_tag         text NOT NULL DEFAULT '#6366f1',
  quarter_label     text NOT NULL DEFAULT '',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ── 2. Indexes ─────────────────────────────────────────────

CREATE INDEX idx_products_portfolio ON products(portfolio_id);
CREATE INDEX idx_roadmap_items_product ON roadmap_items(product_id);
CREATE INDEX idx_roadmap_items_portfolio ON roadmap_items(portfolio_id);
CREATE INDEX idx_roadmap_items_status ON roadmap_items(status);

-- ── 3. Updated_at trigger ──────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER roadmap_items_updated_at
  BEFORE UPDATE ON roadmap_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 4. Row Level Security ──────────────────────────────────
-- Enable RLS but allow authenticated users full access.
-- This ensures only logged-in users can read/write data.

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;

-- Authenticated users can do everything
CREATE POLICY "Authenticated users full access" ON portfolios
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON products
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON roadmap_items
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── 5. Seed Data ───────────────────────────────────────────
-- Realistic roadmap: Firewall as a Service → Full SASE as a Service
-- Portfolio: Connect | Product: SASE as a Service (Fortinet)

-- Use fixed UUIDs so foreign keys work
INSERT INTO portfolios (id, name, description, owner, color) VALUES
  ('a1b2c3d4-1111-4000-8000-000000000001', 'Connect', 'Connectivity, SD-WAN and secure access services', 'Diego Nievas', '#6366f1');

INSERT INTO products (id, portfolio_id, name, description, owner, color) VALUES
  ('b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'SASE as a Service', 'Managed SASE platform evolution from Firewall as a Service to full SASE, powered by Fortinet technology (FortiGate, FortiSASE, FortiProxy).', 'Diego Nievas', '#818cf8');

INSERT INTO roadmap_items (id, product_id, portfolio_id, title, description, type, priority, status, owner, start_date, end_date, milestone_date, dependencies, strategic_theme, cto_lever, customer_impact, notes, confidence_level, effort_estimate, color_tag, quarter_label) VALUES

  -- 1. Managed Firewall as a Service (DELIVERED — the starting point)
  ('c1000000-0001-4000-8000-000000000001',
   'b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'Managed Firewall as a Service',
   'Launch managed FWaaS offering based on FortiGate Cloud. Includes NGFW policies, IPS/IDS, application control and centralised management via FortiManager.',
   'new-capability', 'critical', 'delivered', 'Diego Nievas',
   '2025-01-15', '2025-06-30', '2025-06-30',
   '[]'::jsonb,
   'Foundation Platform', 'Revenue Acquisition',
   'Provides enterprise-grade firewall protection as a fully managed service. Eliminates customer need to manage physical appliances.',
   'Successfully launched. 8 customers onboarded in first quarter. FortiManager integration stable.',
   'high', 'XL', '#6366f1', 'Q3 FY25'),

  -- 2. SD-WAN Integration (IN-PROGRESS — next building block)
  ('c1000000-0002-4000-8000-000000000001',
   'b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'SD-WAN Overlay Integration',
   'Integrate FortiGate SD-WAN capabilities into the managed service. Enable application-aware routing, WAN path selection, and centralised SD-WAN orchestration via FortiManager.',
   'new-capability', 'critical', 'in-progress', 'Diego Nievas',
   '2025-10-01', '2026-03-31', '2026-02-15',
   '["c1000000-0001-4000-8000-000000000001"]'::jsonb,
   'Network Modernisation', 'Innovation',
   'Allows customers to consolidate WAN edge and security into a single managed service. Reduces MPLS costs by 30-50%.',
   'Phase 1: single-hub topology. Multi-hub and dynamic mesh planned for Phase 2. FortiManager SD-WAN templates in testing.',
   'high', 'XL', '#818cf8', 'Q2 FY26'),

  -- 3. Secure Web Gateway (PLANNED)
  ('c1000000-0003-4000-8000-000000000001',
   'b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'Secure Web Gateway (SWG)',
   'Deploy FortiSASE Secure Web Gateway to provide cloud-delivered web filtering, SSL inspection and threat protection for remote and branch users.',
   'new-capability', 'high', 'planned', 'Diego Nievas',
   '2026-04-01', '2026-08-31', '2026-06-30',
   '["c1000000-0002-4000-8000-000000000001"]'::jsonb,
   'Zero Trust Transformation', 'Innovation',
   'Extends security posture to remote workers and branch offices without backhauling traffic. Critical for hybrid work enablement.',
   'Depends on FortiSASE tenant provisioning API. Evaluating FortiProxy for on-prem complement.',
   'medium', 'L', '#a78bfa', 'Q4 FY26'),

  -- 4. Zero Trust Network Access (PLANNED)
  ('c1000000-0004-4000-8000-000000000001',
   'b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'Zero Trust Network Access (ZTNA)',
   'Implement FortiSASE ZTNA to replace traditional VPN with identity-aware, per-application access. Integrates with FortiClient for endpoint posture checking.',
   'new-capability', 'high', 'planned', 'Diego Nievas',
   '2026-06-01', '2026-11-30', '2026-09-15',
   '["c1000000-0003-4000-8000-000000000001"]'::jsonb,
   'Zero Trust Transformation', 'Innovation',
   'Eliminates VPN attack surface. Provides granular per-app access based on user identity and device posture. Key differentiator vs competitors.',
   'ZTNA tags and FortiClient EMS integration required. Planning for ZTNA inline and proxy modes.',
   'medium', 'L', '#c084fc', 'Q1 FY27'),

  -- 5. Cloud Access Security Broker (IDEA)
  ('c1000000-0005-4000-8000-000000000001',
   'b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'Cloud Access Security Broker (CASB)',
   'Add FortiCASB inline and API-based CASB capabilities for SaaS application visibility, shadow IT discovery, and data loss prevention across cloud apps.',
   'new-capability', 'medium', 'idea', 'Diego Nievas',
   '2026-10-01', '2027-03-31', NULL,
   '["c1000000-0004-4000-8000-000000000001"]'::jsonb,
   'Data Protection', 'Revenue Acquisition',
   'Addresses the #1 customer concern around SaaS data security. Enables compliance with data sovereignty requirements.',
   'Evaluating FortiCASB inline vs API mode. Need to assess M365 and Google Workspace integration depth.',
   'low', 'L', '#e879f9', 'Q2 FY27'),

  -- 6. DLP & Data Classification (IDEA)
  ('c1000000-0006-4000-8000-000000000001',
   'b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'Data Loss Prevention (DLP)',
   'Integrate FortiDLP across the SASE stack to provide unified data classification and loss prevention policies spanning web, cloud apps and endpoints.',
   'new-capability', 'medium', 'idea', 'Diego Nievas',
   '2027-01-01', '2027-06-30', NULL,
   '["c1000000-0005-4000-8000-000000000001"]'::jsonb,
   'Data Protection', 'Operational Excellence',
   'Unified DLP policy across all SASE pillars. Required for compliance-driven customers (PCI-DSS, HIPAA, NZ Privacy Act).',
   'FortiDLP acquisition (Next DLP) still maturing integration with FortiSASE. Monitor roadmap.',
   'low', 'XL', '#f472b6', 'Q3 FY27'),

  -- 7. Unified SASE Management Portal (PLANNED — enabling platform)
  ('c1000000-0007-4000-8000-000000000001',
   'b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'Unified SASE Management Portal',
   'Build a single-pane-of-glass customer portal consolidating FWaaS, SD-WAN, SWG, ZTNA dashboards. Leverages FortiAnalyzer and FortiManager APIs.',
   'feature', 'high', 'planned', 'Diego Nievas',
   '2026-05-01', '2026-10-31', '2026-08-31',
   '["c1000000-0002-4000-8000-000000000001"]'::jsonb,
   'Customer Experience', 'Operational Excellence',
   'Single dashboard for all SASE components. Reduces support ticket volume and improves customer self-service.',
   'Will use FortiAnalyzer REST API for reporting and FortiManager JSON API for config visibility. React frontend with SSO.',
   'medium', 'XL', '#60a5fa', 'Q4 FY26'),

  -- 8. Multi-Tenant Onboarding Automation (PLANNED — operational)
  ('c1000000-0008-4000-8000-000000000001',
   'b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'Multi-Tenant Onboarding Automation',
   'Automate customer onboarding workflows: FortiGate VM provisioning, FortiManager ADOM creation, FortiSASE tenant setup and FortiClient EMS configuration via Infrastructure as Code.',
   'operational-improvement', 'high', 'planned', 'Diego Nievas',
   '2026-03-01', '2026-07-31', '2026-05-31',
   '["c1000000-0001-4000-8000-000000000001"]'::jsonb,
   'Platform Modernisation', 'Cost Management',
   'Reduces onboarding time from 2 weeks to 2 days. Enables scale without linear headcount growth.',
   'Terraform modules for FortiGate + Ansible playbooks for FortiManager. FortiSASE API for tenant provisioning.',
   'high', 'L', '#34d399', 'Q3 FY26'),

  -- 9. FortiClient Endpoint Integration (IDEA — endpoint pillar)
  ('c1000000-0009-4000-8000-000000000001',
   'b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'Managed FortiClient Endpoint',
   'Add managed endpoint protection via FortiClient EMS with EPP/EDR capabilities integrated into the SASE fabric for unified endpoint-to-cloud security.',
   'new-capability', 'medium', 'idea', 'Diego Nievas',
   '2026-09-01', '2027-02-28', NULL,
   '["c1000000-0004-4000-8000-000000000001"]'::jsonb,
   'Endpoint Security', 'Revenue Acquisition',
   'Completes the SASE story with endpoint visibility. FortiClient telemetry feeds into FortiSASE for dynamic access decisions.',
   'FortiClient EMS Cloud vs on-prem deployment model to be decided. Licensing model under review.',
   'low', 'L', '#fbbf24', 'Q1 FY27'),

  -- 10. Full SASE GA Launch (the milestone — bringing it all together)
  ('c1000000-0010-4000-8000-000000000001',
   'b1b2c3d4-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001',
   'SASE as a Service — General Availability',
   'Full GA launch of the unified SASE as a Service offering combining FWaaS, SD-WAN, SWG, ZTNA, and management portal into a single SKU with tiered pricing.',
   'compliance', 'critical', 'idea', 'Diego Nievas',
   '2026-11-01', '2027-03-31', '2027-01-31',
   '["c1000000-0003-4000-8000-000000000001", "c1000000-0004-4000-8000-000000000001", "c1000000-0007-4000-8000-000000000001"]'::jsonb,
   'Service Expansion', 'Revenue Acquisition',
   'Market-ready SASE offering positioned against Cato, Zscaler and Palo Alto Prisma. Target: 20 customers in first 6 months.',
   'Commercial model: Base (FWaaS+SD-WAN), Standard (+SWG+ZTNA), Premium (+CASB+DLP+Endpoint). MSP partner program planned.',
   'low', 'XXL', '#f43f5e', 'Q3 FY27');
