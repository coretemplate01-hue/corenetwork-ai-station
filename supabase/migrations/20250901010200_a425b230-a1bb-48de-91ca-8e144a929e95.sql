-- Fix security vulnerability: Restrict content library management to authenticated users only

-- Drop the overly permissive policy that allows anyone to modify content
DROP POLICY IF EXISTS "Content library is publicly manageable" ON public.content_library;

-- Create secure policies for authenticated users only
CREATE POLICY "Authenticated users can create content" 
ON public.content_library 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update content" 
ON public.content_library 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete content" 
ON public.content_library 
FOR DELETE 
TO authenticated
USING (true);

-- Keep public read access for presentations to work
-- (The existing "Content library is publicly readable" policy remains)