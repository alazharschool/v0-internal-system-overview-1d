# Admin User Setup Guide for Al-Azhar School System

## The Problem

When trying to create an admin user through the setup page, you get:
```
Failed to create user: Database error creating new user...
```

**Root Cause:** The `SUPABASE_SERVICE_ROLE_KEY` is empty or not configured in `.env.local`

## Solution: Two Options

### Option 1: Manual Setup in Supabase Dashboard (Recommended for now)

This is the quickest way to get started without needing API keys:

1. **Open Supabase Dashboard:**
   - Go to https://app.supabase.com/projects
   - Select your project `qumeveerinufukgpbcyk`

2. **Create Admin User:**
   - Navigate to **Authentication → Users**
   - Click **Create a new user** button
   - Fill in the details:
     - **Email:** `admin@alazhar.school`
     - **Password:** `mbanora1983`
     - **✓ Check:** "Auto confirm user"
   - Click **Create User**

3. **Add Admin Role (Optional but recommended):**
   - Click on the newly created user
   - Scroll to **User Metadata**
   - Add this JSON:
     ```json
     {
       "role": "admin",
       "is_admin": true
     }
     ```
   - Save changes

4. **Login to your system:**
   - Visit `http://localhost:3000/login`
   - Email: `admin@alazhar.school`
   - Password: `mbanora1983`

---

### Option 2: Programmatic Setup (After getting Service Role Key)

If you want to use the `/admin-setup` page:

1. **Get Service Role Key from Supabase:**
   - Go to https://app.supabase.com/projects
   - Select your project
   - Go to **Settings → API**
   - Find **Service Role Key** (NOT the anon key)
   - Copy the entire key

2. **Add to `.env.local`:**
   - Open your project's `.env.local` file
   - Find: `SUPABASE_SERVICE_ROLE_KEY=`
   - Add your key: `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Save the file
   - Restart your development server

3. **Use Admin Setup Page:**
   - Visit `http://localhost:3000/admin-setup`
   - Click **Create Admin Account**
   - You'll see: "Admin user created successfully!"
   - Redirect to login automatically

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid login credentials" | User doesn't exist. Follow Option 1 above to create manually |
| "Email already exists" | Admin user was already created. Try logging in with the credentials |
| "Auto Confirm User" checkbox missing | It should be visible when creating a new user. Check you're on the Users tab |
| Service Role Key seems wrong | Copy it again from Settings → API. Make sure you get the full key without truncation |

---

## Security Notes

- Never share your `SUPABASE_SERVICE_ROLE_KEY` publicly
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The service role key has full database access - keep it private
- For production, use Vercel's environment variable system instead of `.env.local`
