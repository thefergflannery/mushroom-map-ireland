# Fix Google OAuth 400 Error

## Problem
Getting 400 error when signing in with Google at https://mush-chi.vercel.app/

## Root Cause
The redirect URI in Google OAuth Console doesn't match your deployment URL.

## Solution

### 1. Update Google OAuth Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add:
   ```
   https://mush-chi.vercel.app/api/auth/callback/google
   ```
4. Click SAVE

### 2. Update Vercel Environment Variables
```bash
# Set the correct NEXTAUTH_URL
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Enter: https://mush-chi.vercel.app

# Set NEXT_PUBLIC_APP_URL
vercel env rm NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://mush-chi.vercel.app
```

### 3. Redeploy (once Vercel platform is fixed)
```bash
vercel --prod
```

## Additional Redirect URIs (Optional but Recommended)
Add these to Google OAuth for flexibility:
- https://mush-chi.vercel.app/api/auth/callback/google
- https://mush.vercel.app/api/auth/callback/google (if you have custom domain)
- http://localhost:3000/api/auth/callback/google (for local development)

## Verify
After updating:
1. Wait 1-2 minutes for Google to propagate changes
2. Clear browser cache/cookies
3. Try signing in again

## Still Not Working?
Check:
- OAuth consent screen is published (not in testing mode with restricted users)
- Your email is added to test users (if in testing mode)
- Correct Client ID and Secret in Vercel environment variables

