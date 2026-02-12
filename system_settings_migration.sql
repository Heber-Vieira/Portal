-- Create system_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_settings (
    key text PRIMARY KEY,
    value text
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (public)
DROP POLICY IF EXISTS "Allow public read access" ON public.system_settings;
CREATE POLICY "Allow public read access" ON public.system_settings
    FOR SELECT USING (true);

-- Allow write access only to administrators
DROP POLICY IF EXISTS "Allow admin write access" ON public.system_settings;
CREATE POLICY "Allow admin write access" ON public.system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );

-- Create branding bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to branding bucket
DROP POLICY IF EXISTS "Branding images are publicly accessible" ON storage.objects;
CREATE POLICY "Branding images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'branding');

-- Allow authenticated users (admins) to upload to branding bucket
DROP POLICY IF EXISTS "Admins can upload branding" ON storage.objects;
CREATE POLICY "Admins can upload branding" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'branding' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );

-- Allow admins to update/delete branding
DROP POLICY IF EXISTS "Admins can update branding" ON storage.objects;
CREATE POLICY "Admins can update branding" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'branding' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );

DROP POLICY IF EXISTS "Admins can delete branding" ON storage.objects;
CREATE POLICY "Admins can delete branding" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'branding' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );
