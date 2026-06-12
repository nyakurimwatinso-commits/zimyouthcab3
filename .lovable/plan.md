## Grant admin access to CdeTinashe

You've shared your signup details. Before I can grant the role, I need to confirm you've actually completed signup in the app (visit `/auth`, sign up with username **CdeTinashe** and password **Tinsoman5**, fill in name/phone/age/province). Once that's done, I'll run a one-line data insert.

### What I'll do (after you confirm signup is complete)

Run a single `INSERT` into `public.user_roles` that grants the `admin` role to the auth user whose profile username is `CdeTinashe`:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM public.profiles WHERE username = 'CdeTinashe'
ON CONFLICT (user_id, role) DO NOTHING;
```

That's it — no code changes, no migration. After it runs, refresh `/campaign-admin` and you'll have full access to publish news posts and view metrics.

### Security note
Please change your password after first sign-in if you ever shared it outside this chat — treat passwords as private.

**Reply "signed up" (or just "go") once your account exists and I'll run the insert.**