-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    features jsonb DEFAULT '[]'::jsonb, -- Array of { title, description, icon }
    start_date date,
    end_date date,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Create announcement_views table to track who saw what
CREATE TABLE IF NOT EXISTS public.announcement_views (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    announcement_id uuid REFERENCES public.announcements(id) ON DELETE CASCADE,
    viewed_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, announcement_id)
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_views ENABLE ROW LEVEL SECURITY;

-- Policies for announcements
DROP POLICY IF EXISTS "Public read active announcements" ON public.announcements;
CREATE POLICY "Public read active announcements" ON public.announcements
    FOR SELECT USING (true); -- Everyone can read, filtering happens in query based on dates/active

DROP POLICY IF EXISTS "Admins manage announcements" ON public.announcements;
CREATE POLICY "Admins manage announcements" ON public.announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );

-- Policies for announcement_views
DROP POLICY IF EXISTS "Users manage own views" ON public.announcement_views;
CREATE POLICY "Users manage own views" ON public.announcement_views
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins view all views" ON public.announcement_views;
CREATE POLICY "Admins view all views" ON public.announcement_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );
