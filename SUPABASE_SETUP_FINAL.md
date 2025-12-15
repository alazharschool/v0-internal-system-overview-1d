# Supabase Setup Guide - Al-Azhar Online School

## Quick Start

### 1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Copy your Project URL and Anon Key

### 2. **Add Environment Variables**
   Navigate to the **Vars** section in the left sidebar and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### 3. **Initialize Database**
   - Navigate to `/setup` page
   - Click "Initialize Database"
   - Wait for completion (usually 30-60 seconds)
   - You'll be redirected to dashboard

## What Gets Created

### Tables (8 total)
- **students** - Student information and weekly schedules
- **teachers** - Teacher profiles
- **classes** - Regular class sessions
- **trial_classes** - Trial classes for new students
- **courses** - Course information
- **payments** - Payment records
- **certificates** - Student certificates
- **activities** - Activity logs

### Sample Data
- 5 Teachers (Ahmed, Fatima, Muhammad, Aisha, Omar)
- 7 Students with weekly schedules
- All configured for testing

### Security
- Row Level Security enabled on all tables
- Policies allow all operations (customize later)
- Indexes for performance optimization

## API Endpoints

### Initialize Database
```bash
POST /api/db/init
```
Creates all tables and seeds sample data

### Check Connection Status
```bash
GET /api/db/status
```
Returns database status and student count

## Troubleshooting

### "Missing Supabase credentials"
- Check that all environment variables are set in the Vars section
- Refresh the page after adding variables

### "Database connection failed"
- Verify your Supabase project is active
- Check that the Service Role Key is correct
- Ensure your IP is not blocked by Supabase

### Tables already exist but no data
- Go to `/setup` and click "Initialize Database" again
- It will skip creating tables and add sample data

## Next Steps

1. ✅ Database initialized
2. View your dashboard at `/`
3. Add more students via the Students page
4. Add trial classes and schedule them
5. Manage teachers and courses
6. Track payments

## Production Deployment

Before going live:

1. **Update RLS Policies** - Customize row-level security for your use case
2. **Enable Backups** - Enable automatic backups in Supabase
3. **Set Up Monitoring** - Monitor database performance
4. **Secure API Keys** - Never expose service role key in frontend
5. **Test Thoroughly** - Test all features with production data

---

For more help, visit https://supabase.com/docs
