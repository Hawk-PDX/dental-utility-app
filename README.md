# DentalHub

Full-stack dental practice management application built for streamlining daily clinic operations.

## Features

**Doctor Portal**
- Appointment scheduling with calendar views
- Patient records and treatment history
- X-ray storage and management
- Digital intake form viewing
- Direct patient messaging
- Referral network tracking

**Patient Portal**
- Appointment viewing and requests
- Digital intake forms
- Medical records access
- Dentist messaging
- Provider linking

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL)
- Supabase Auth

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Add Supabase credentials to `.env.local`, then run the database schema from `supabase/schema.sql` in your Supabase SQL editor.

```bash
npm run dev
```

## Structure

```
app/
├── dashboard/doctor/     # Doctor portal
├── dashboard/patient/    # Patient portal  
├── login/
├── register/
lib/
├── supabase/            # DB clients
├── types/               # TypeScript types
supabase/
└── schema.sql           # Database schema
```

## Database

Server components:
```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

Client components:
```typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

## Security

Row Level Security policies ensure patients and doctors can only access their own data. Authentication handled via Supabase Auth.

## Deployment

Deploy to Vercel and add environment variables:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```
