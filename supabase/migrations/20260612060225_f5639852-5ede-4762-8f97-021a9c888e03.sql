
CREATE TABLE public.province_links (
  province text PRIMARY KEY,
  whatsapp_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.province_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.province_links TO authenticated;
GRANT ALL ON public.province_links TO service_role;

ALTER TABLE public.province_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read province links" ON public.province_links FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert province links" ON public.province_links FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update province links" ON public.province_links FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete province links" ON public.province_links FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.province_links (province, whatsapp_url) VALUES
  ('harare', ''),
  ('bulawayo', ''),
  ('manicaland', ''),
  ('mash_central', ''),
  ('mash_east', ''),
  ('mash_west', ''),
  ('mat_north', ''),
  ('mat_south', ''),
  ('midlands', ''),
  ('masvingo', '')
ON CONFLICT (province) DO NOTHING;
