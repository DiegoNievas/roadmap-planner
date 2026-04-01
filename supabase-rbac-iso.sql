-- Roadmap Planner — ISO-Compliant Roles & Permissions
-- Purpose: Implement secure access control with explicit promotion by administrators.

-- 1. Create Profiles Table (Public)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('viewer', 'editor')) DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Policies
-- All authenticated users can read profiles (to see who is who)
CREATE POLICY "Allow authenticated users to read profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

-- Only editors can update profiles (promote/demote)
CREATE POLICY "Allow editors to update roles"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'editor'
        )
    );

-- 4. Automatic Profile Creation on Signup
-- Trigger to sync auth.users with public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. REINFORCE RLS FOR ALL TABLES (CRUD Enforcement)
-- All tables follow: Read for all AUTH, Write for EDITORS.

-- Portfolios
DROP POLICY IF EXISTS "Allow users to read portfolios" ON public.portfolios;
CREATE POLICY "Allow authenticated users to read portfolios"
    ON public.portfolios FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert/update/delete portfolios" ON public.portfolios;
CREATE POLICY "Allow editors to manage portfolios"
    ON public.portfolios FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'editor'));

-- Products
DROP POLICY IF EXISTS "Allow users to read products" ON public.products;
CREATE POLICY "Allow authenticated users to read products"
    ON public.products FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow editors to manage products"
    ON public.products FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'editor'));

-- Roadmap Items
DROP POLICY IF EXISTS "Allow authenticated users to read roadmap_items" ON public.roadmap_items;
CREATE POLICY "Allow authenticated users to read roadmap_items"
    ON public.roadmap_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow editors to manage roadmap_items"
    ON public.roadmap_items FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'editor'));

-- Feature Requests
DROP POLICY IF EXISTS "Allow anyone to insert feature requests" ON public.feature_requests;
DROP POLICY IF EXISTS "Allow authenticated users to read feature requests" ON public.feature_requests;
DROP POLICY IF EXISTS "Allow authenticated users to update feature requests" ON public.feature_requests;

CREATE POLICY "Allow authenticated users to read feature requests"
    ON public.feature_requests FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to submit feature requests"
    ON public.feature_requests FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow editors to manage feature requests"
    ON public.feature_requests FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'editor'));

CREATE POLICY "Allow editors to delete feature requests"
    ON public.feature_requests FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'editor'));

-- 6. BOOTSTRAP COMMAND (FOR USER TO RUN MANUALLY)
-- Note: Replace 'user@email.com' with the actual email.
-- UPDATE public.profiles SET role = 'editor' WHERE email = 'user@email.com';
