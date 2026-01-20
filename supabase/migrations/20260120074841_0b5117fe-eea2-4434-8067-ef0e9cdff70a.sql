-- Fix leads table: Drop existing policies and recreate with proper security
DROP POLICY IF EXISTS "Admins can read leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Only backend can insert leads" ON public.leads;

-- Create policy that denies all public/anonymous access (base deny-all)
-- Only authenticated admins can SELECT
CREATE POLICY "Only admins can read leads"
ON public.leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only authenticated admins can UPDATE
CREATE POLICY "Only admins can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- INSERT only via service_role (edge functions use service_role key)
-- This policy allows insert but the anon key won't have access due to role restriction
CREATE POLICY "Service role can insert leads"
ON public.leads
FOR INSERT
TO service_role
WITH CHECK (true);

-- Fix user_roles table: Add restrictive policies for INSERT, UPDATE, DELETE
-- Only service_role (backend) should be able to modify roles

-- Policy to prevent any user from inserting roles
CREATE POLICY "No user can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Policy to prevent any user from updating roles  
CREATE POLICY "No user can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

-- Policy to prevent any user from deleting roles
CREATE POLICY "No user can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);

-- Allow service_role to manage roles (for admin setup)
CREATE POLICY "Service role can manage roles"
ON public.user_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);