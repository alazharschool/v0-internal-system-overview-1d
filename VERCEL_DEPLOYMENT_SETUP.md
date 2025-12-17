# Deploying to Vercel - Admin User Setup

When you deploy to Vercel, you need to configure the `SUPABASE_SERVICE_ROLE_KEY` environment variable.

## Steps to Add Environment Variables to Vercel

1. **Go to Vercel Project Settings:**
   - Navigate to https://vercel.com/dashboard
   - Select your Al-Azhar School project
   - Click **Settings** → **Environment Variables**

2. **Add Required Variables:**
   - Click **Add New**
   - For each variable below, add them:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://qumeveerinufukgpbcyk.supabase.co
   ```

   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bWV2ZWVyaW51ZnVrZ3BiY3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMzI1NzQsImV4cCI6MjA4MDkwODU3NH0.hrhAj0fgXr2Q_WV6Y8AYzMMuomgJ5IrtaZZ3KcL3G8U
   ```

   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [YOUR_SERVICE_ROLE_KEY_HERE]
   ```

3. **Get Service Role Key:**
   - Go to https://app.supabase.com/projects
   - Select your project
   - Settings → API
   - Copy the **service_role secret**
   - Paste into Vercel

4. **Create Admin User:**
   - Deploy your project to Vercel
   - Visit your Vercel URL + `/admin-setup`
   - The admin user will be created automatically

---

## For GitHub Push Deployments

If you're using GitHub integration:
1. Add variables as above in Vercel settings
2. Push to your GitHub repository
3. Vercel auto-deploys with the variables
