# Al-Azhar School Admin Account Setup Guide

## Problem
You're seeing "Invalid login credentials" because the admin user `admin@alazhar.school` doesn't exist in your Supabase database yet.

## Solution: Create Admin Manually in Supabase Dashboard

### Step 1: Go to Supabase Dashboard
1. Visit https://app.supabase.com
2. Select your project: **qumeveerinufukgpbcyk** (Al-Azhar School)

### Step 2: Create the Admin User
1. Click on **Authentication** in the left sidebar
2. Click on **Users** tab
3. Click the **Add user** button (top right)
4. Select **Create user with email**

### Step 3: Fill in the Details
- **Email:** `admin@alazhar.school`
- **Password:** `mbanora1983`
- **Confirm Password:** `mbanora1983`
- ☑️ Check "Auto confirm user" (important!)

### Step 4: Create the User
1. Click **Create user** button
2. You should see a success message
3. The user appears in the Users list

### Step 5: Add Admin Metadata (Optional but Recommended)
1. Click on the newly created user `admin@alazhar.school` in the Users list
2. Scroll down to **User Metadata**
3. Add this JSON:
```json
{
  "role": "admin",
  "is_admin": true
}
```
4. Click **Save**

### Step 6: Test Login
1. Go to http://localhost:3000/login
2. Enter:
   - Email: `admin@alazhar.school`
   - Password: `mbanora1983`
3. Click **Sign In**
4. You should be redirected to the Dashboard

## Troubleshooting

### Still getting "Invalid login credentials"?
- Double-check the email is exactly: `admin@alazhar.school`
- Verify the password is exactly: `mbanora1983`
- Make sure "Auto confirm user" was checked when creating the user
- Try signing out of Supabase Dashboard and signing back in (sometimes UI caches old data)

### Can't find the Users tab?
- Make sure you're in the correct project
- Go to: https://app.supabase.com → Select your project → Click "Authentication" → Click "Users"

## What if I'm on Production (Vercel)?
Follow the same steps - you're managing the same Supabase project (qumeveerinufukgpbcyk) for both local and production environments.

---

**Next Steps After Login:**
- Dashboard will load automatically
- You can now manage students, teachers, classes, and schedules
- Create additional users/admins in Supabase if needed
