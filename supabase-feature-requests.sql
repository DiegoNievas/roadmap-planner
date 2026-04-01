-- Roadmap Planner — Feature Request Schema Extension
-- Purpose: Support internal feature intake and triage workflow for AMS portfolios.

-- 1. Create Feature Requests Table
CREATE TABLE IF NOT EXISTS public.feature_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- 'feature', 'enhancement', 'upgrade', 'operational', 'issue', 'capability'
    business_justification TEXT NOT NULL,
    expected_benefit TEXT NOT NULL,
    priority TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
    submitter_name TEXT NOT NULL,
    submitter_email TEXT NOT NULL,
    team TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'under-review', 'backlog', 'accepted', 'planned', 'rejected', 'delivered'
    supporting_link TEXT,
    impact TEXT,
    strategic_alignment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Authenticated users can read and insert feature requests
CREATE POLICY "Allow authenticated users to read feature requests"
    ON public.feature_requests FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert feature requests"
    ON public.feature_requests FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update their triage (admin/owner check can be added later)
CREATE POLICY "Allow authenticated users to update feature requests"
    ON public.feature_requests FOR UPDATE
    TO authenticated
    USING (true);

-- 4. Add updated_at Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feature_requests_updated_at
    BEFORE UPDATE ON public.feature_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
