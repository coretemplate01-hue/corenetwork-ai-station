-- Remove the overly permissive public policy
DROP POLICY IF EXISTS "Presentations are publicly manageable" ON public.presentations;

-- Create secure RLS policies for presentations table
-- Only authenticated users can view their own presentations
CREATE POLICY "Users can view their own presentations" 
ON public.presentations 
FOR SELECT 
TO authenticated
USING (auth.uid()::text = presenter_name OR auth.uid() IS NOT NULL);

-- Only authenticated users can create presentations
CREATE POLICY "Authenticated users can create presentations" 
ON public.presentations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update their own presentations  
CREATE POLICY "Users can update their own presentations" 
ON public.presentations 
FOR UPDATE 
TO authenticated
USING (auth.uid()::text = presenter_name OR auth.uid() IS NOT NULL)
WITH CHECK (auth.uid()::text = presenter_name OR auth.uid() IS NOT NULL);

-- Only authenticated users can delete their own presentations
CREATE POLICY "Users can delete their own presentations" 
ON public.presentations 
FOR DELETE 
TO authenticated
USING (auth.uid()::text = presenter_name OR auth.uid() IS NOT NULL);

-- Also secure the presentation_history table
DROP POLICY IF EXISTS "Presentation history is publicly manageable" ON public.presentation_history;

CREATE POLICY "Authenticated users can view presentation history" 
ON public.presentation_history 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create presentation history" 
ON public.presentation_history 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Add a user_id column to presentations table for better security
ALTER TABLE public.presentations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update existing presentations to have a placeholder user_id (you'll need to set this properly)
-- UPDATE public.presentations SET user_id = auth.uid() WHERE user_id IS NULL;

-- Create more specific policies using user_id
DROP POLICY IF EXISTS "Users can view their own presentations" ON public.presentations;
DROP POLICY IF EXISTS "Users can update their own presentations" ON public.presentations;  
DROP POLICY IF EXISTS "Users can delete their own presentations" ON public.presentations;

CREATE POLICY "Users can view their own presentations" 
ON public.presentations 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own presentations" 
ON public.presentations 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own presentations" 
ON public.presentations 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());