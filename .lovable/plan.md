## Problem

Signing in as **CdeTinashe / Tinsoman5** at `/auth` (Admin tab) fails with "Invalid username or password."

What I confirmed in the database:
- Profile exists: `cdetinashe@cab3.app`, user id `16c811f3-…8729be`.
- That user has the `admin` role in `user_roles`.
- Auth code maps username → `cdetinashe@cab3.app` correctly.
- No failed-signin entries appear in recent auth logs, which means the credential mismatch is happening at password verification (the password on the auth.users row is no longer `Tinsoman5`).

So the account and admin grant are fine — only the password is out of sync.

## Fix

1. Run a one-shot server-side reset using the service-role key (same approach used previously) to set the password back to `Tinsoman5` and ensure the email is confirmed:
   - `supabaseAdmin.auth.admin.updateUserById('16c811f3-…8729be', { password: 'Tinsoman5', email_confirm: true })`
2. Verify by signing in via the Admin tab on `/auth` — should redirect to `/campaign-admin`.

## Follow-up (recommended, ask before doing)

To stop this from recurring, add a small "Reset member password" control to the Manage Admins panel in `campaign-admin`. It would call a protected server function (`requireSupabaseAuth` + `has_role('admin')` check) that uses `supabaseAdmin.auth.admin.updateUserById` to set a new password for any member. That way you can recover accounts from the UI without me touching scripts.

Want me to (a) just reset the password now, or (b) reset it **and** add the admin-side password reset control?
