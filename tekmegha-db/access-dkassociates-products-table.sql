-- Allow only the specific authenticated user to SELECT
CREATE POLICY "allow_specific_user_select" ON public.dkassociates_products
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = ' '::uuid);

-- Allow only the specific authenticated user to INSERT
CREATE POLICY "allow_specific_user_insert" ON public.dkassociates_products
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = ' '::uuid);

-- Allow only the specific authenticated user to UPDATE
CREATE POLICY "allow_specific_user_update" ON public.dkassociates_products
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = ' '::uuid)
  WITH CHECK ((SELECT auth.uid()) = ' '::uuid);

-- Allow only the specific authenticated user to DELETE
CREATE POLICY "allow_specific_user_delete" ON public.dkassociates_products
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = ' '::uuid);