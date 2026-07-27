-- 1. Ensure notifications table exists and is structured correctly
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info' CHECK (type IN ('info', 'alert', 'success', 'warning')),
    target_user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_global boolean DEFAULT true
);

-- 2. Ensure notification_reads table exists and is structured correctly
CREATE TABLE IF NOT EXISTS public.notification_reads (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    notification_id uuid REFERENCES public.notifications(id) ON DELETE CASCADE,
    read_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, notification_id)
);

-- 3. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- 4. Recreate RLS Policies for public.notifications
DROP POLICY IF EXISTS "Users can read global or targeted notifications" ON public.notifications;
CREATE POLICY "Users can read global or targeted notifications" ON public.notifications
    FOR SELECT USING (
        is_global = true OR 
        target_user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );

DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;
CREATE POLICY "Admins can manage notifications" ON public.notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'Administrador'
        )
    );

-- 5. Recreate RLS Policies for public.notification_reads
DROP POLICY IF EXISTS "Users manage own reads" ON public.notification_reads;
CREATE POLICY "Users manage own reads" ON public.notification_reads
    FOR ALL USING (
        auth.uid() = user_id
    )
    WITH CHECK (
        auth.uid() = user_id
    );

-- 6. Create or replace the view for unread notifications to handle filtering at database level
CREATE OR REPLACE VIEW public.unread_notifications AS
SELECT n.*
FROM public.notifications n
WHERE (n.is_global = true OR n.target_user_id = auth.uid())
  AND NOT EXISTS (
      SELECT 1 FROM public.notification_reads nr
      WHERE nr.notification_id = n.id AND nr.user_id = auth.uid()
  );
