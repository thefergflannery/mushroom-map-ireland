# 🚀 Quick Start Guide

## Your Mushroom Map Ireland is Ready!

### ✅ Already Done
- ✅ Next.js 15 app scaffolded
- ✅ Neon Postgres database created
- ✅ Database schema deployed
- ✅ Seeded with 12 Irish species + 10 glossary terms
- ✅ All code written and tested
- ✅ Vercel project connected

### ⚡ 5-Minute Launch

#### 1. Generate Secrets (Local Terminal)
```bash
cd /Users/fergflannery/Desktop/work/mush

# Generate NextAuth secret
openssl rand -base64 32

# Generate Cron secret
openssl rand -base64 32

# Save these for next step
```

#### 2. Set Environment Variables in Vercel

Go to: https://vercel.com/ferg-flannerys-projects/beacain/settings/environment-variables

Add these variables for **Production, Preview, and Development**:

```bash
DATABASE_URL
postgresql://neondb_owner:npg_A9DY6ZiEjedI@ep-still-wave-ab8e74w1-pooler.eu-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require

NEXTAUTH_SECRET
<paste the first secret you generated>

NEXTAUTH_URL
https://beacain-217ywl49v-ferg-flannerys-projects.vercel.app

CRON_SECRET
<paste the second secret you generated>

AI_PROVIDER
LOCAL

NEXT_PUBLIC_APP_URL
https://beacain-217ywl49v-ferg-flannerys-projects.vercel.app
```

#### 3. Deploy
```bash
# Option A: Push to git (auto-deploys)
git add .
git commit -m "Launch Mushroom Map Ireland"
git push

# Option B: Deploy directly
vercel --prod
```

#### 4. Visit Your Site!
🎉 https://beacain-217ywl49v-ferg-flannerys-projects.vercel.app

---

## 🧪 Test Locally First

```bash
# 1. Create local environment file
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://neondb_owner:npg_A9DY6ZiEjedI@ep-still-wave-ab8e74w1-pooler.eu-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
AI_PROVIDER="LOCAL"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF

# 2. Run dev server
npm run dev

# 3. Open browser
open http://localhost:3000
```

---

## 🔌 Optional Add-Ons

### Google OAuth Sign-In
1. [Create OAuth credentials](https://console.cloud.google.com)
2. Add redirect: `https://beacain-217ywl49v-ferg-flannerys-projects.vercel.app/api/auth/callback/google`
3. Add to Vercel:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### Image Uploads (Vercel Blob)
1. Vercel Dashboard → Storage → Create Blob
2. Add to Vercel:
   - `BLOB_READ_WRITE_TOKEN`

### Real AI Suggestions (OpenAI)
1. Get key from [platform.openai.com](https://platform.openai.com)
2. Add to Vercel:
   - `AI_PROVIDER="OPENAI"`
   - `OPENAI_API_KEY="sk-..."`

### Rate Limiting (Upstash Redis)
1. Create database at [console.upstash.com](https://console.upstash.com)
2. Add to Vercel:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

## 📱 What You'll See

### Homepage
- Interactive map of Ireland
- Recent observations plotted (privacy-safe)
- "Add a Find" button
- Species guide and glossary links

### Features Working Out of the Box
- 🗺️ Privacy-safe map (no satellite imagery)
- 📚 12 Irish species guide
- 🇮🇪 10 Irish glossary terms
- 🔐 Authentication ready
- 📊 Observation detail pages
- 🎨 Beautiful nature-themed UI

### Features Needing Setup
- 📸 Image uploads (needs BLOB_READ_WRITE_TOKEN)
- 🤖 Real AI (needs OPENAI_API_KEY)
- 🚦 Rate limiting (needs Upstash)
- 👤 OAuth (needs Google/etc credentials)

---

## 🆘 Common Issues

**"Database connection failed"**
→ Check DATABASE_URL in Vercel env vars

**"NextAuth configuration error"**
→ Verify NEXTAUTH_SECRET and NEXTAUTH_URL are set

**"Image upload failed"**
→ Set BLOB_READ_WRITE_TOKEN or skip uploads for now

**Build failing in Vercel**
→ Check build logs, ensure all required env vars set

---

## 📖 Full Documentation

- **SETUP_COMPLETE.md** - Detailed setup info
- **README.md** - Full project documentation
- **DEPLOYMENT.md** - Production deployment guide
- **ARCHITECTURE.md** - Technical architecture

---

## 🎯 Success!

Your privacy-first mushroom mapping platform for Ireland is ready to launch. All the hard work is done - just add those environment variables and deploy!

**Questions?** Check the documentation files above or the inline code comments.

**Go maith!** (Good luck!) 🍄🇮🇪

