# Fix "User not allowed" 403 Error when Creating Users

## Problem
When trying to create users via the `/users/` endpoint, you're getting:
```
ERROR: User not allowed (403 Forbidden)
```

## Root Cause
Supabase has security restrictions on the Auth admin API. Even with a service role key, certain Auth settings can block user creation.

## Solution - Update Supabase Dashboard Settings

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `qkmylglztycgnwscwfea`

### Step 2: Disable Email Confirmations (for Development)
1. Go to **Authentication** → **Providers** → **Email**
2. Find **"Confirm email"** toggle
3. **Turn it OFF** (disable)
4. Click **Save**

### Step 3: Enable Service Role Access
1. Go to **Authentication** → **Settings**
2. Scroll to **"Site URL"** section
3. Make sure **"Disable email confirmations"** is enabled
4. Scroll to **"Security and Protection"**
5. Under **"JWT Expiry"**, make sure it's set appropriately (default: 3600 seconds)

### Step 4: Verify Service Role Key
1. Go to **Settings** → **API**
2. Under **Project API keys**, find **`service_role`** key
3. Copy it again and verify it matches your `.env` file
4. **IMPORTANT:** Make sure you're using `service_role` key, NOT `anon` key

Your `.env` should look like:
```env
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi...  (very long key, ~219 chars)
```

### Step 5: Alternative - Allow Signups
If you want to keep email confirmations ON:
1. Go to **Authentication** → **Settings**
2. Under **"Auth Providers"**, make sure **"Enable Sign ups"** is ON
3. This allows the admin API to create users even with confirmations enabled

### Step 6: Restart Backend
After making changes in Supabase:
```bash
cd Backend
# Stop uvicorn (Ctrl+C)
# Restart it
uvicorn app.main:app --reload
```

### Step 7: Test User Creation
Try creating a user again from the frontend User Management page.

## Verification
After applying these changes, you should see:
```
INFO: Successfully created user: backend@cvautomation.com
INFO: 127.0.0.1:xxxxx - "POST /users/ HTTP/1.1" 200 OK
```

Instead of:
```
ERROR: User not allowed
INFO: 127.0.0.1:xxxxx - "POST /users/ HTTP/1.1" 400 Bad Request
```

## Still Having Issues?
If the error persists, check:
1. ✅ Service role key is correct in `.env`
2. ✅ Email confirmations are disabled
3. ✅ Supabase project is not rate-limited
4. ✅ You're logged in as an admin user in the frontend

## Important for Production
**Re-enable email confirmations** before deploying to production for security!
