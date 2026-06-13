GRANT INSERT, DELETE ON public.user_roles TO authenticated;

CREATE POLICY "Admins can grant roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  AND role = 'admin'::public.app_role
  AND user_id <> auth.uid()
);

CREATE POLICY "Admins can revoke roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  AND role = 'admin'::public.app_role
  AND user_id <> auth.uid()
);