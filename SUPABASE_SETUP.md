# Supabase Setup Guide

## Quick Start

If you're getting the error: **"Could not find the 'weekly_schedule' column of 'students'"**

Run this command to fix it:

```bash
npm run supabase:add-column
```

## Step-by-Step Setup

### 1. Environment Variables

Make sure these variables are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get these from your Supabase project settings.

### 2. Initialize Database

#### Option A: Automatic Migration (Recommended)
```bash
npm run supabase:migrate:dev
```

This will:
- ✅ Drop existing tables (if any)
- ✅ Create all 10 tables with proper schema
- ✅ Add indexes for performance
- ✅ Configure RLS policies
- ✅ Seed sample data

#### Option B: Manual SQL Scripts

Run these in order in Supabase SQL Editor:

1. `scripts/00-drop-all-tables.sql` - Drop existing tables
2. `scripts/01-create-all-tables.sql` - Create new tables
3. `scripts/02-insert-sample-data.sql` - Add sample data

### 3. Fix Missing Column

If you already have a database and just need to add the `weekly_schedule` column:

```bash
npm run supabase:add-column
```

### 4. Verify Schema

Check if everything is set up correctly:

```bash
npm run supabase:check-schema
```

This will output:
- ✅ Students table exists
- ✅ All columns including weekly_schedule
- ✅ Ready to use!

## Database Schema Overview

### Tables (10 total)

1. **users** - Authentication & user accounts
2. **students** - Student information with weekly schedules
3. **teachers** - Teacher information
4. **classes** - Scheduled classes & trial sessions
5. **invoices** - Payment invoices
6. **payments** - Payment records
7. **attendance** - Class attendance tracking
8. **activity_logs** - System activity logging
9. **courses** - Student courses
10. **certificates** - Course completion certificates

### Key Features

- ✅ Row Level Security (RLS) policies
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Foreign key relationships
- ✅ Performance indexes
- ✅ JSONB for flexible data (schedules, profiles)

## Troubleshooting

### Error: "Could not find the 'weekly_schedule' column"

**Solution:** Run the migration
```bash
npm run supabase:add-column
```

### Error: "Missing Supabase environment variables"

**Solution:** Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Error: "Could not find the students table"

**Solution:** Initialize the database:
```bash
npm run supabase:migrate:dev
```

### Students/Teachers not appearing

**Solution:** Seed the database with sample data:
```bash
npm run supabase:migrate:dev
```

## Architecture

### Client-Side (`/lib/supabase/`)
- `client.ts` - Browser client (uses anon key)
- Queries use `@supabase/supabase-js`

### Server-Side (`/lib/supabase/`)
- `server.ts` - Server client (uses service role)
- API routes in `/app/api/`

### Database Utilities (`/lib/`)
- `database.ts` - Database functions & API calls

## RLS Policies

Each table has security policies:

- Teachers can only view their assigned students
- Students can only view their own data
- Admins can access everything
- Payments/invoices linked to student data

## Next Steps

1. ✅ Set environment variables
2. ✅ Run `npm run supabase:migrate:dev`
3. ✅ Verify with `npm run supabase:check-schema`
4. ✅ Start the app: `npm run dev`
5. ✅ Visit http://localhost:3000

Enjoy! 🎓
