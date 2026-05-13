# BookSurveyor.co

A full-stack Next.js marketplace for connecting customers with verified land surveyors across India.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill Supabase and admin values.
3. Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor.
4. Run:

```bash
npm install
npm run dev
```

## Vercel

Add these environment variables in Vercel before deploying:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_WHATSAPP=91XXXXXXXXXX
```

The app builds without credentials, but registration, dashboard OTP, uploads, and admin actions require Supabase credentials.
