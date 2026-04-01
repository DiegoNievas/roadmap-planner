-- Roadmap Planner — Public Access Policies
-- Purpose: Allow unauthenticated visitors to view the landing page (Home) and submit feature requests.

-- 1. Portfolios & Products: Public Read (needed for dropdowns and dashboard stats)
ALTER POLICY "Allow authenticated users to read portfolios" ON public.portfolios
    RENAME TO "Allow users to read portfolios";

ALTER POLICY "Allow users to read portfolios" ON public.portfolios
    TO anon, authenticated;

ALTER POLICY "Allow authenticated users to read products" ON public.products
    RENAME TO "Allow users to read products";

ALTER POLICY "Allow users to read products" ON public.products
    TO anon, authenticated;

-- 2. Feature Requests: Public Insert
-- Rename existing restricted policy or add an additional one for anon
DROP POLICY IF EXISTS "Allow authenticated users to insert feature requests" ON public.feature_requests;
CREATE POLICY "Allow anyone to insert feature requests"
    ON public.feature_requests FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 3. Feature Requests: Keep Read/Update Restricted
-- Only authenticated users (admins) can see the full list or triage
ALTER POLICY "Allow authenticated users to read feature requests" ON public.feature_requests
    TO authenticated
    USING (true);

-- 4. Roadmap Items: Keep Read Restricted
-- Full roadmap is private to AMS admins
ALTER POLICY "Allow authenticated users to read roadmap_items" ON public.roadmap_items
    TO authenticated
    USING (true);
