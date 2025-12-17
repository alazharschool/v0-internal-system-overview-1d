# Admin User Setup Instructions

## Problem
Login is failing with "Invalid login credentials" because the admin user doesn't exist in Supabase yet.

## Solution

### Option 1: Using Supabase Dashboard (Manual)
1. Go to https://supabase.com and sign into your project
2. Navigate to **Authentication** → **Users**
3. Click **Add user** button
4. Fill in:
   - **Email:** `admin@alazhar.school`
   - **Password:** `mbanora1983`
   - Check **Auto confirm user** ✓
5. Click **Create user**
6. The user will be created with basic auth
7. (Optional) Click on the user and add to **User metadata**:
   ```json
   {
     "role": "admin",
     "is_admin": true
   }
   ```

### Option 2: Using API Endpoint (Automated)
1. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in your environment variables
   - Get it from Supabase Dashboard → Settings → API → Service Role Secret
   - Add it to `.env.local`:
     ```
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```

2. Run this command (replace YOUR_URL with your localhost or deployment URL):
   ```bash
   curl -X POST http://localhost:3000/api/admin/create
   ```

3. If successful, you'll see:
   ```json
   {
     "message": "Admin user created successfully",
     "user": {
       "email": "admin@alazhar.school",
       "id": "..."
     }
   }
   ```

4. Now you can log in with:
   - **Email:** `admin@alazhar.school`
   - **Password:** `mbanora1983`

## Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY is not configured"
- You need to add the service role key to `.env.local`
- Get it from Supabase Dashboard → Settings → API → service_role key

### Error: "Admin user already exists"
- The admin account has already been created
- Try logging in directly with the credentials
- If password is forgotten, use Supabase Dashboard to reset it

### Still getting "Invalid login credentials" after creating the user
- Clear your browser cookies/cache
- Make sure you're using the exact email: `admin@alazhar.school`
- Make sure you're using the exact password: `mbanora1983`
- Check that "Auto confirm user" was enabled when creating the account

## Verification

To verify the admin exists in your Supabase project:
1. Go to Supabase Dashboard
2. Click **Authentication** → **Users**
3. You should see `admin@alazhar.school` listed
4. The `user_metadata` should show `role: "admin"`
