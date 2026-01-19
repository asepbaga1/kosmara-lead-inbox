-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow service role insert on leads" ON public.leads;

-- Create a more restrictive insert policy - only service role can insert
-- This ensures leads are only inserted via backend edge functions
CREATE POLICY "Only backend can insert leads"
ON public.leads
FOR INSERT
TO service_role
WITH CHECK (true);