# SaaSPath — Setup Guide

Complete, step-by-step instructions to stand up a **fresh** SaaSPath instance:
Supabase (database + auth), Google OAuth, local development, and deployment to
Cloudflare Workers via OpenNext.

> Everything below assumes you start from a clean clone of this repository.

---

## 0. Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 20+ (24 recommended) | `node -v` |
| npm | 10+ | ships with Node |
| Git | any | `git --version` |
| Supabase account | free tier is fine | https://supabase.com |
| Google Cloud account | free | for Google sign-in |
| Cloudflare account | free tier is fine | for deployment |

Clone and install:

```bash
git clone https://github.com/ethanhntt-gif/SaaSPath.git
cd SaaSPath
npm install
```

---

## 1. Create the Supabase project

1. Go to https://supabase.com/dashboard and click **New project**.
2. Pick an organization, a **name** (e.g. `saaspath`), a **database password**
   (store it safely) and a **region** close to your users.
3. Wait for provisioning to finish (~1–2 minutes).

### 1.1 Collect the API keys

Open **Project Settings → API** and copy:

| Value in the dashboard | Environment variable |
| --- | --- |
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon / public** key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role** key (optional) | `SUPABASE_SERVICE_ROLE_KEY` |

> The `anon` key is safe to expose to the browser — Row Level Security (RLS)
> protects your data. The `service_role` key **bypasses RLS**: keep it server-side
> only and never prefix it with `NEXT_PUBLIC_`.

---

## 2. Create the database schema

The schema lives in [`supabase/setup.sql`](supabase/setup.sql). It creates four
tables, enables RLS, adds policies, and installs two triggers:

| Table | Purpose |
| --- | --- |
| `public.products` | user-submitted products (public read, owner write) |
| `public.profiles` | one row per registered user, synced from `auth.users` |
| `public.saaspath` | a process (workflow) built from products |
| `public.saaspath_products` | many-to-many link with step order |

**Run it:**

1. Supabase Dashboard → **SQL Editor** → **New query**.
2. Paste the entire contents of [`supabase/setup.sql`](supabase/setup.sql).
3. Click **Run**.

The script is **idempotent** — safe to re-run at any time.

### 2.1 Optional: reset everything

To wipe all objects created by `setup.sql` (tables, functions, triggers) and
start over, run [`supabase/reset.sql`](supabase/reset.sql) in the SQL Editor,
then run `setup.sql` again.

### 2.2 Optional: profiles only

If you only need the registered-users table, run
[`supabase/01_profiles.sql`](supabase/01_profiles.sql) instead. It creates
`public.profiles`, its RLS policies, the signup trigger, and backfills existing
users.

### 2.3 Verify

In the SQL Editor run:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('products', 'profiles', 'saaspath', 'saaspath_products');
```

You should see all four tables.

---

## 3. Configure Google OAuth

Google sign-in is handled by Supabase Auth, so the client id/secret live in
Supabase — **not** in this repo.

### 3.1 Create OAuth credentials in Google Cloud

1. Open https://console.cloud.google.com/ and create (or pick) a project.
2. **APIs & Services → OAuth consent screen**:
   - User type: **External**.
   - Fill in app name, support email, developer email.
   - Add scopes: `userinfo.email`, `userinfo.profile`, `openid`.
   - Add yourself as a **Test user** while the app is unpublished.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://<your-production-domain>
     ```
   - **Authorized redirect URIs** (this is the important one):
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     Replace `<your-project-ref>` with your Supabase project ref.
4. Copy the generated **Client ID** and **Client Secret**.

### 3.2 Enable Google in Supabase

1. Supabase Dashboard → **Authentication → Providers → Google**.
2. Toggle **Enable Sign in with Google**.
3. Paste the **Client ID** and **Client Secret** from step 3.1.
4. Save.

### 3.3 Allow redirect URLs back into the app

Supabase Dashboard → **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` for local dev (change to your production
  URL after deploying).
- **Redirect URLs** — add every origin the app may return to:
  ```
  http://localhost:3000/auth/callback
  https://<your-production-domain>/auth/callback
  ```

The app exchanges the OAuth `code` for a session in
[`app/auth/callback/route.ts`](app/auth/callback/route.ts).

---

## 4. Configure environment variables

Copy the template and fill in the values from step 1.1:

```bash
cp .env.example .env.local        # macOS / Linux
copy .env.example .env.local      # Windows cmd
```

`.env.local` should contain at minimum:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
```

> `.env.local` is git-ignored. Never commit real keys.

---

## 5. Run locally

```bash
npm run dev
```

Open http://localhost:3000. Click **Continue with Google** to test the full
sign-in flow; after approval you land on `/dashboard`.

### Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build (`next build`) |
| `npm run build:cf` | OpenNext build for Cloudflare (creates `.open-next/`) |
| `npm run preview` | Build + preview the Cloudflare Worker locally |
| `npm run deploy` | Build + deploy the Cloudflare Worker |
| `npm run cf-typegen` | Generate `cloudflare-env.d.ts` types |
| `npm run lint` | Lint |

---

## 6. Deploy to Cloudflare (OpenNext)

The project deploys as a **Cloudflare Worker** using
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare). Configuration
lives in [`wrangler.jsonc`](wrangler.jsonc) and
[`open-next.config.ts`](open-next.config.ts).

### 6.1 Authenticate Wrangler

```bash
npx wrangler login
```

### 6.2 Set runtime secrets

The Worker needs the Supabase values at runtime:

```bash
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 6.3 Deploy

```bash
npm run deploy
```

This runs `opennextjs-cloudflare build` (which produces `.open-next/worker.js`)
and then `opennextjs-cloudflare deploy`.

### 6.4 Deploying via the Cloudflare dashboard (Git integration)

If you connected the repo to Cloudflare **Workers & Pages**, set the build
settings as follows:

| Setting | Value |
| --- | --- |
| **Build command** | `npm run build:cf` |
| **Deploy command** | `npx wrangler deploy` |

> **Important:** the build command must be `npm run build:cf`, **not**
> `npm run build`. A plain `next build` does not create `.open-next/worker.js`,
> and `wrangler deploy` will fail with
> `Could not find compiled Open Next config, did you run the build command?`.
>
> Do **not** set `npm run build` to run OpenNext: `opennextjs-cloudflare build`
> internally calls `npm run build`, which would cause infinite recursion.

### 6.5 Local Worker preview

```bash
npm run preview
```

For local previews OpenNext reads `.dev.vars` (git-ignored). Create it with the
same keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
```

---

## 7. Post-deploy checklist

- [ ] `setup.sql` executed — all four tables exist.
- [ ] Google provider enabled in Supabase with the correct redirect URI.
- [ ] `http://localhost:3000/auth/callback` and the production
      `https://<domain>/auth/callback` added to Supabase **Redirect URLs**.
- [ ] Supabase **Site URL** updated to the production domain.
- [ ] Worker secrets set (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- [ ] Cloudflare **Build command** = `npm run build:cf`.
- [ ] Sign-in works end-to-end and a row appears in `public.profiles`.

---

## 8. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `Missing Supabase environment variables` | `.env.local` missing or keys not filled in. |
| `Could not find compiled Open Next config` | Cloudflare build command is `npm run build`; change it to `npm run build:cf`. |
| Redirected to `/login?error=auth_callback_failed` | Redirect URI mismatch — check Google Cloud and Supabase URL Configuration. |
| `redirect_uri_mismatch` from Google | The Supabase callback URI is not listed in Google Cloud **Authorized redirect URIs**. |
| No row in `public.profiles` after signup | The `on_auth_user_created` trigger is missing — re-run `setup.sql`. |
| `permission denied for table ...` | RLS policy missing — re-run `setup.sql`. |
| OpenNext warns about Windows | OpenNext is only fully supported on Linux/WSL; use WSL for reliable local builds. |

---

## 9. Project structure (reference)

```text
app/                      Next.js App Router pages & route handlers
  auth/callback/route.ts  OAuth code -> session exchange
  auth/signout/route.ts   sign-out handler
  dashboard/              personal workspace (auth required)
components/               UI components
lib/supabase/
  client.ts               browser Supabase client
  server.ts               server Supabase client (cookies)
  profiles.ts             profiles data access
  products.ts             products data access
  saaspath.ts             processes data access
supabase/
  setup.sql               full schema (tables, RLS, triggers)
  reset.sql               drop everything created by setup.sql
  01_profiles.sql         profiles table only
proxy.ts                  session refresh middleware
wrangler.jsonc            Cloudflare Worker config
open-next.config.ts       OpenNext config
```
