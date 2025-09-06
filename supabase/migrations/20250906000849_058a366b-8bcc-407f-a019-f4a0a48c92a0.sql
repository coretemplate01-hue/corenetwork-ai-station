-- Fix RLS policy for presentation_history to restrict users to their own data only
-- Drop the existing overly permissive policy
DROP POLICY "Authenticated users can view presentation history" ON public.presentation_history;

-- Create a new policy that restricts users to only see their own presentation history
-- by joining with the presentations table to check user ownership
CREATE POLICY "Users can only view their own presentation history" 
ON public.presentation_history 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.presentations 
    WHERE presentations.id = presentation_history.presentation_id 
    AND presentations.user_id = auth.uid()
  )
);

-- Also update the INSERT policy to be more restrictive
-- Users should only be able to create history for their own presentations
DROP POLICY "Authenticated users can create presentation history" ON public.presentation_history;

CREATE POLICY "Users can only create history for their own presentations" 
ON public.presentation_history 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.presentations 
    WHERE presentations.id = presentation_history.presentation_id 
    AND presentations.user_id = auth.uid()
  )
);