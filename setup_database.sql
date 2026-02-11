-- PROFILES TABLE SCHEMA UPDATE
-- Add missing columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'primary_color') THEN
        ALTER TABLE public.profiles ADD COLUMN primary_color text DEFAULT '#0f172a';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'allowed_apps') THEN
        ALTER TABLE public.profiles ADD COLUMN allowed_apps text[];
    END IF;
END $$;

-- ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- 1. VIEW: Everyone can see their own profile. Admins can see all.
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );

-- 2. UPDATE: Users can update their own profile. Admins can update all.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );

-- 3. INSERT: Allow new user creation (usually handled by Trigger, but explicit insert might be needed)
-- Note: Authenticated users (mostly admins) should be able to insert if necessary, or the trigger handles it.
-- If you are using service_role key for admin tasks, RLS is bypassed.
-- But for client-side inserts (if any), we need policy. 
-- However, profiles are usually created by triggers on auth.users. 
-- If your app inserts into profiles manually, add this:
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );

-- STORAGE BUCKET POLICIES (Avatars)
-- Ensure the 'avatars' bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatars
DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
CREATE POLICY "Anyone can upload an avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow users to update their own avatars
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);
