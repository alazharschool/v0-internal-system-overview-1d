# Database Migration Setup Guide

This guide explains how to initialize your Al-Azhar Online School database using the automated migration system.

## Prerequisites

- Node.js 18+ and npm 8+
- A Supabase project (from https://supabase.com)
- Environment variables configured

## Step 1: Configure Environment Variables

Add these variables to your `.env.local` file (never commit to git):

\`\`\`env
# Supabase Connection (Public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Supabase Connection (Server-side only - DO NOT EXPOSE)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
\`\`\`

### How to Find These Values:

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on **Settings** → **API**
3. Copy the following:
   - **Project URL** → `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this SECRET!)

⚠️ **SECURITY WARNING**: 
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Never commit `.env.local` to version control
- Use `.env.local.example` to document which variables are needed

## Step 2: Run the Migration

Run the migration script in your terminal:

\`\`\`bash
# Development
npm run supabase:migrate:dev

# Production
npm run supabase:migrate
\`\`\`

You should see output like:
\`\`\`
╔════════════════════════════════════════════╗
║     Supabase Migration Runner              ║
║     Al-Azhar Online School System          ║
╚════════════════════════════════════════════╝

[12:34:56] ℹ Connecting to Supabase...
[12:34:57] ✓ Connected successfully
[12:34:58] ℹ Creating tables...
[12:34:59] ✓ Created table 'users'
...
[12:35:02] ✓ All migrations completed successfully ✓
✓ Database is ready to use!
\`\`\`

## Step 3: Verify the Setup

1. Go to your Supabase Dashboard
2. Click **Database** → **Tables**
3. You should see these tables:
   - users
   - students
   - teachers
   - classes
   - invoices
   - payments
   - attendance
   - activity_logs
   - courses
   - certificates

## What the Migration Does

- ✓ Creates 10 database tables with proper relationships
- ✓ Sets up indexes for performance
- ✓ Enables Row Level Security (RLS)
- ✓ Creates RLS policies for access control
- ✓ Seeds sample data (1 teacher, 1 student, 1 trial class)

## Idempotency

The migration is **idempotent**, meaning you can run it multiple times safely:
- Existing tables are skipped
- Duplicate seeds are prevented
- No data loss

## Troubleshooting

### "Missing required environment variables"
- Check `.env.local` exists with correct variable names
- Verify keys are not expired in Supabase dashboard

### "Connection refused"
- Verify `SUPABASE_URL` is correct
- Check your internet connection
- Ensure Supabase project is not paused

### "Permission denied" errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Don't use `NEXT_PUBLIC_SUPABASE_ANON_KEY` for migrations

### Tables exist but are empty
- Run seed manually: `npm run supabase:migrate` again
- Check activity_logs in Supabase dashboard for errors

## CI/CD Deployment

For automated deployment with GitHub Actions:

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run supabase:migrate
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
\`\`\`

## Next Steps

1. Verify tables were created in Supabase dashboard
2. Start the development server: `npm run dev`
3. Navigate to `http://localhost:3000`
4. The system should load without warnings!

## Support

For issues with Supabase, visit: https://supabase.com/docs
For questions about this system, check the main README.md
