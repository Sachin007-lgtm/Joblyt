# CRITICAL FIX: Enable User Creation in Supabase

## The Issue
You're getting `403 Forbidden - User not allowed` when creating/deleting users because **Supabase has "Disable Signups" turned ON**.

## The Fix (Required - Do This First!)

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/qkmylglztycgnwscwfea
2. Click on **Authentication** (in the left sidebar)

### Step 2: Enable Signups
1. Click on **Settings** (under Authentication section)
2. Scroll down to find **"Auth Providers"** or **"User Signups"**
3. Find the toggle for **"Enable Signups"** or **"Disable Signups"**
4. **TURN IT ON** (Enable Signups = ON / Disable Signups = OFF)
5. Click **Save**

### Step 3: Disable Email Confirmation (For Development)
1. Still in **Authentication** → **Settings**
2. Scroll to **"Email Auth"** or **"Email Provider"** section
3. Find **"Confirm email"** toggle
4. **TURN IT OFF** (for development only)
5. Click **Save**

### Step 4: Verify Service Role Key
1. Go to **Settings** → **API**
2. Find **"Project API keys"** section
3. Look for **service_role** (NOT anon/public)
4. Click "Reveal" and copy the key
5. Make sure this EXACT key is in your `Backend/.env` file as `SUPABASE_KEY`

## After Making These Changes

### Restart your backend:
```bash
cd Backend
# Press Ctrl+C to stop uvicorn
uvicorn app.main:app --reload
```

### Test user creation:
It should now work! You'll see:
```
INFO: Successfully created user: test@example.com
INFO: 127.0.0.1:xxxxx - "POST /users/ HTTP/1.1" 200 OK
```

## Why This Happens
Supabase's "Disable Signups" setting blocks ALL user creation, even via the admin API with service role. This is a security feature to prevent unauthorized user creation, but it also blocks your backend admin endpoints.

## For Production
**Re-enable these security features** when deploying:
- Turn ON "Disable Signups" 
- Turn ON "Confirm email"
- Use a separate admin interface or manual user creation
