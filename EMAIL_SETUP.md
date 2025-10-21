# Email Authentication Setup

Email authentication is now enabled using magic links. To complete the setup, you need to configure an email service provider.

## Option 1: Resend (Recommended - Free Tier Available)

### 1. Sign up for Resend
Visit https://resend.com and create an account.

### 2. Get your API Key
- Go to API Keys section
- Create a new API key
- Copy the key

### 3. Set up Vercel Environment Variables

```bash
# Add these to your Vercel project
vercel env add EMAIL_SERVER_HOST production
# Enter: smtp.resend.com

vercel env add EMAIL_SERVER_PORT production
# Enter: 587

vercel env add EMAIL_SERVER_USER production
# Enter: resend

vercel env add EMAIL_SERVER_PASSWORD production
# Enter: <your-resend-api-key>

vercel env add EMAIL_FROM production
# Enter: Beacáin <noreply@yourdomain.com>
```

### 4. Verify Domain (for production)
In Resend dashboard, add and verify your domain to send from your own domain.

## Option 2: Gmail SMTP

### 1. Enable 2-Step Verification
In your Google Account settings

### 2. Generate App Password
- Go to https://myaccount.google.com/apppasswords
- Create app password for "Mail"
- Copy the 16-character password

### 3. Set up Vercel Environment Variables

```bash
vercel env add EMAIL_SERVER_HOST production
# Enter: smtp.gmail.com

vercel env add EMAIL_SERVER_PORT production
# Enter: 587

vercel env add EMAIL_SERVER_USER production
# Enter: your-email@gmail.com

vercel env add EMAIL_SERVER_PASSWORD production
# Enter: <your-app-password>

vercel env add EMAIL_FROM production
# Enter: Beacáin <your-email@gmail.com>
```

## Option 3: SendGrid

### 1. Sign up for SendGrid
Visit https://sendgrid.com

### 2. Create API Key
- Go to Settings > API Keys
- Create new API key
- Copy the key

### 3. Set up Vercel Environment Variables

```bash
vercel env add EMAIL_SERVER_HOST production
# Enter: smtp.sendgrid.net

vercel env add EMAIL_SERVER_PORT production
# Enter: 587

vercel env add EMAIL_SERVER_USER production
# Enter: apikey

vercel env add EMAIL_SERVER_PASSWORD production
# Enter: <your-sendgrid-api-key>

vercel env add EMAIL_FROM production
# Enter: Beacáin <noreply@yourdomain.com>
```

## Testing Locally

Add these to your `.env.local` file:

```env
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=your_resend_api_key
EMAIL_FROM=Beacáin <noreply@yourdomain.com>
```

Then restart your dev server:
```bash
npm run dev
```

## After Setup

Once configured, users will be able to:
- Sign in with their email address
- Receive a magic link in their inbox
- Click the link to sign in (no password needed)
- Link expires after 24 hours

## Email Template

The email will contain:
- Subject: "Sign in to Mushroom Map Ireland"
- A secure sign-in link
- Instructions and expiry information

## Troubleshooting

**Emails not sending?**
- Check your API key is correct
- Verify environment variables are set in production
- Check Vercel deployment logs
- Ensure domain is verified (for Resend/SendGrid)

**Users not receiving emails?**
- Check spam folder
- Verify the EMAIL_FROM address is correct
- For Gmail: ensure app password is used, not regular password

