# Database Setup Instructions

The Al-Azhar School Management System requires database tables to be initialized in your Supabase project.

## Quick Setup (2 minutes)

### Option 1: Using the Setup Page (Recommended)

1. Visit `http://localhost:3000/db-setup` in your browser
2. Follow the on-screen instructions to copy and run the SQL script
3. Create the admin user in Supabase Authentication
4. Return to the dashboard

### Option 2: Manual Setup

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `/scripts/00-complete-setup.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute the script

## What Gets Created

- **8 Database Tables:**
  - students
  - teachers  
  - classes
  - trial_classes
  - courses
  - payments
  - certificates
  - activities

- **Sample Data:**
  - 5 teachers with different subjects
  - Empty student table (ready for your data)
  - All necessary indexes and triggers

- **Security:**
  - Row Level Security (RLS) enabled on all tables
  - Permissive policies for development (customize later for production)

## After Setup

1. Create admin user in Supabase:
   - Go to **Authentication → Users** in Supabase Dashboard
   - Click "Add User"
   - Email: `admin@alazhar.school`
   - Password: `mbanora1983`
   - Check "Auto confirm user"

2. Return to your app and login at `/login`

## Troubleshooting

If you see "table does not exist" errors:
- Make sure you ran the SQL script completely
- Check Supabase logs for any error messages
- Visit `/db-setup` to re-run the setup

If you have connection issues:
- Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Check that your Supabase project is active
