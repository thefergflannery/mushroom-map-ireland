# 🍄 Mushroom Map Ireland - Setup Complete!

## ✅ What's Been Configured

### Database (Neon)
- **Project**: beacain
- **Project ID**: `odd-bush-21046932`
- **Branch**: main (`br-restless-mountain-abgjl1ni`)
- **Database**: neondb
- **Status**: ✅ Schema deployed, seeded with data

**Database Contents:**
- ✅ 12 Irish mushroom species (including Death Cap, Chanterelle, Field Mushroom, etc.)
- ✅ 10 Irish language glossary terms (Beacán, Muisiriún, Pucaí, etc.)
- ✅ All tables created (15 tables total)
- ✅ Indexes and relationships configured

**Sample Species:**
```
Agaricus campestris  - Field Mushroom (Beacán Páirce) - EDIBLE
Boletus edulis       - Penny Bun/Cep (Boileatán Inite) - CHOICE
Amanita phalloides   - Death Cap (Caipín an Bháis) - DEADLY ⚠️
Cantharellus cibarius - Chanterelle (Cantaral) - CHOICE
Amanita muscaria     - Fly Agaric (Caipín Cuileog) - TOXIC
```

**Sample Glossary:**
```
Beacán         - Mushroom (general term)
Muisiriún      - Mushroom (cultivated)
Pucaí          - Toadstool, poisonous mushroom
Cos préacháin  - Fairy ring mushroom
Balláin chapall - Puffball
```

### Vercel Deployment
- **URL**: https://beacain-217ywl49v-ferg-flannerys-projects.vercel.app
- **Team**: Ferg Flannery's projects
- **Team ID**: `team_XKafHT4L95zIlk3zGcJYOrpA`

## 🔧 Environment Configuration

### Database Connection
```bash
DATABASE_URL="postgresql://neondb_owner:npg_A9DY6ZiEjedI@ep-still-wave-ab8e74w1-pooler.eu-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
```

### Required Environment Variables

You need to set these in your Vercel dashboard or via CLI:

```bash
# Database (already set up)
DATABASE_URL=<your connection string above>

# NextAuth (generate secrets)
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL="https://beacain-217ywl49v-ferg-flannerys-projects.vercel.app"

# Cron Jobs
CRON_SECRET=<run: openssl rand -base64 32>

# AI (optional - defaults to LOCAL stub)
AI_PROVIDER="LOCAL"  # or "OPENAI" with key below
OPENAI_API_KEY=""    # Optional: for real AI suggestions

# Storage (optional - for image uploads)
BLOB_READ_WRITE_TOKEN=""  # Get from Vercel Blob dashboard

# Rate Limiting (optional - for production)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# OAuth (optional - for Google sign-in)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Set Environment Variables in Vercel

Option 1 - Via Vercel Dashboard:
1. Go to: https://vercel.com/ferg-flannerys-projects/beacain/settings/environment-variables
2. Add each variable above
3. Select "Production", "Preview", and "Development"
4. Click "Save"

Option 2 - Via Vercel CLI:
```bash
vercel env add DATABASE_URL production
# Paste the connection string when prompted

vercel env add NEXTAUTH_SECRET production
# Generate with: openssl rand -base64 32

vercel env add CRON_SECRET production
# Generate with: openssl rand -base64 32

# Repeat for other required variables
```

## 🚀 Local Development

### 1. Set Up Local Environment

Create `.env.local` file in project root:
```bash
DATABASE_URL="postgresql://neondb_owner:npg_A9DY6ZiEjedI@ep-still-wave-ab8e74w1-pooler.eu-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

AI_PROVIDER="LOCAL"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Run Development Server

```bash
cd /Users/fergflannery/Desktop/work/mush
npm run dev
```

Visit: http://localhost:3000

### 3. Database Commands

```bash
# View database in browser
npm run db:studio

# Re-seed database (if needed)
npm run db:seed

# Generate Prisma client
npm run db:generate
```

## 🎯 Next Steps

### 1. Deploy to Production
```bash
# From project directory
vercel --prod

# Or push to git and it will auto-deploy
git add .
git commit -m "Initial deployment"
git push
```

### 2. Configure OAuth (Optional)

For Google Sign-In:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://beacain-217ywl49v-ferg-flannerys-projects.vercel.app/api/auth/callback/google`
4. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel env vars

### 3. Set Up Image Storage (Optional)

For observation photo uploads:
1. Go to Vercel dashboard → Storage → Create Database → Blob
2. Get the `BLOB_READ_WRITE_TOKEN`
3. Add to environment variables

### 4. Enable Rate Limiting (Recommended for Production)

1. Go to [Upstash Console](https://console.upstash.com)
2. Create new Redis database
3. Copy REST URL and token
4. Add to environment variables

### 5. Configure AI Suggestions (Optional)

To enable real AI identification:
1. Get OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Set `AI_PROVIDER="OPENAI"`
3. Add `OPENAI_API_KEY` to environment variables

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests (requires local dev server running)
npm run test:e2e
```

### Test Coverage
- ✅ Privacy masking utilities
- ✅ Consensus voting logic
- ✅ Homepage accessibility
- ✅ Navigation flows

## 📊 Database Schema

**Core Tables:**
- `User` - User accounts with roles and reputation
- `Species` - Mushroom species data (12 Irish species)
- `Observation` - User submissions with photos and grid locations
- `Identification` - AI and human identification proposals
- `Vote` - Community voting on identifications
- `Glossary` - Irish language terms (10 terms)
- `Comment`, `Flag`, `Tag` - Community features
- `AuditLog` - Moderator action tracking

**Auth Tables:**
- `Account`, `Session`, `VerificationToken` - NextAuth

## 🔒 Privacy Features

✅ **Location Privacy**
- Exact coordinates stored privately
- Display at 1km or 10km grid precision
- Sensitive species automatically protected
- No satellite imagery

✅ **Image Privacy**
- EXIF data stripped on upload
- GPS coordinates extracted then removed
- User privacy controls

## 🎨 Application Features

### Available Now
- 🗺️ Interactive privacy-safe map
- 📸 Observation submission workflow
- 🤖 AI-assisted identification (stub mode)
- 👥 Community consensus voting system
- 📚 Irish species guide (12 species)
- 🇮🇪 Irish language glossary (10 terms)
- 🔐 NextAuth authentication (email + Google)
- 📊 Observation detail pages
- 🏷️ Species comparison and safety info

### Planned/Optional
- Email magic link authentication
- Real-time notifications
- Advanced search and filters
- Mobile app (PWA)
- Export data for research
- Seasonal distribution maps

## 📖 Documentation

- **README.md** - Getting started guide
- **ARCHITECTURE.md** - System design and technical details
- **DEPLOYMENT.md** - Production deployment guide
- **CONTRIBUTING.md** - How to contribute
- **This file** - Setup completion summary

## 🐛 Troubleshooting

### Can't connect to database
- Check DATABASE_URL is set correctly
- Verify Neon project is active
- Test connection: `npx prisma db push`

### OAuth not working
- Verify NEXTAUTH_SECRET is set
- Check redirect URIs match exactly
- Ensure NEXTAUTH_URL is correct

### Images not uploading
- Verify BLOB_READ_WRITE_TOKEN is set (or skip for now)
- Check file size (max 10MB)

### Tests failing
- Ensure dev server is running for E2E tests
- Check DATABASE_URL is set for unit tests

## 📞 Support

For issues:
- Check logs in Vercel dashboard
- Review Neon query logs
- Open GitHub issue
- Email: support@mushroommap.ie

## 🎉 Success Checklist

- ✅ Neon database created and configured
- ✅ Database schema deployed (15 tables)
- ✅ Seeded with 12 species + 10 glossary terms
- ✅ Vercel project deployed
- ✅ Application code complete
- ✅ Tests written and passing
- ⏳ Environment variables (set in Vercel)
- ⏳ OAuth providers (optional)
- ⏳ Image storage (optional)
- ⏳ Rate limiting (recommended)
- ⏳ AI integration (optional)

## 🚀 You're Ready to Launch!

Your Mushroom Map Ireland application is fully built and the database is seeded. Just add the environment variables to Vercel and you're live!

**Quick Start:**
```bash
# Set environment variables in Vercel
vercel env add NEXTAUTH_SECRET production
vercel env add CRON_SECRET production
vercel env add DATABASE_URL production

# Deploy
vercel --prod

# Visit your site
open https://beacain-217ywl49v-ferg-flannerys-projects.vercel.app
```

Happy mushroom mapping! 🍄🇮🇪

