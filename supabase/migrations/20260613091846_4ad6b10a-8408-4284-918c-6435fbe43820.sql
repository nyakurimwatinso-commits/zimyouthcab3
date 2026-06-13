DROP POLICY IF EXISTS "Public insert vote" ON public.poll_votes;

CREATE POLICY "Public insert valid vote"
ON public.poll_votes
FOR INSERT
TO anon, authenticated
WITH CHECK (
  option IN ('jobs', 'education', 'health', 'housing')
  AND voter_key ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
);