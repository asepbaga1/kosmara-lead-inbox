-- Drop the existing RESTRICTIVE policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Admins can read leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;

-- Create PERMISSIVE SELECT policy for admins (default is PERMISSIVE)
CREATE POLICY "Admins can read leads"
ON public.leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create PERMISSIVE UPDATE policy for admins
CREATE POLICY "Admins can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));