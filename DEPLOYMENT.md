# Deployment Guide - Mushroom Map Ireland

## Quick Start Deployment

### 1. Database Setup (Neon)

Create a Neon Postgres database:

```bash
# Option A: Via Neon Console
# Visit: https://console.neon.tech
# Create new project: "mushroom-map-ireland"
# Copy connection string

# Option B: Via MCP (if configured)
# Use Neon MCP to create project programmatically
```

Get your `DATABASE_URL` connection string and save it.

### 2. Environment Variables Setup

Create production environment variables (either in Vercel dashboard or via CLI):

```bash
# Required
DATABASE_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Optional but recommended
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
OPENAI_API_KEY="sk-..."
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
CRON_SECRET="$(openssl rand -base64 32)"
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
# ... add all other env vars

# Deploy
vercel --prod
```

### 4. Initialize Database

After deployment, run migrations and seed:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

Or connect to your Vercel deployment and run via Vercel CLI:

```bash
vercel env pull .env.local
npm run db:push
npm run db:seed
```

### 5. Configure Cron Jobs

Vercel Cron jobs are configured in `vercel.json`. Ensure you:

1. Set `CRON_SECRET` environment variable
2. Verify cron endpoints are protected with this secret
3. Monitor cron execution in Vercel dashboard

Configured jobs:
- **Consensus Recalculation**: Daily at 2 AM UTC
- **Cache Warming**: Daily at 3 AM UTC

### 6. Configure OAuth (Google)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
6. Copy Client ID and Secret to environment variables

### 7. Configure Storage (Vercel Blob)

```bash
# Install Vercel Blob
npm install @vercel/blob

# Create blob store in Vercel dashboard
# Settings > Storage > Create Database > Blob

# Copy token to BLOB_READ_WRITE_TOKEN
```

### 8. Configure Rate Limiting (Upstash Redis)

1. Go to [Upstash Console](https://console.upstash.com)
2. Create new Redis database
3. Copy REST URL and token
4. Add to environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Post-Deployment Checklist

- [ ] Database schema deployed and seeded
- [ ] All environment variables set
- [ ] OAuth working (test sign in)
- [ ] Image uploads working (test observation creation)
- [ ] Map displaying observations
- [ ] AI suggestions working (if configured)
- [ ] Rate limiting active
- [ ] Cron jobs scheduled
- [ ] Custom domain configured (optional)
- [ ] Analytics configured (optional)
- [ ] Error monitoring setup (Sentry/LogRocket - optional)

## Monitoring

### Health Checks

Monitor these endpoints:
- `/` - Homepage loads
- `/api/observations` - API responding
- `/api/species` - Database queries working

### Cron Job Monitoring

Check Vercel dashboard > Deployments > Cron Logs for:
- Successful execution
- Error rates
- Execution duration

### Database Monitoring

Use Neon dashboard to monitor:
- Query performance
- Connection counts
- Storage usage

## Scaling Considerations

### Database
- Neon auto-scales, but monitor query performance
- Consider read replicas for heavy read loads
- Use connection pooling (already configured via Prisma)

### Rate Limiting
- Upstash Redis scales automatically
- Adjust rate limits in `lib/rate-limit.ts` based on usage

### Storage
- Vercel Blob scales automatically
- Consider CDN for heavy image traffic
- Implement image optimization (sharp) for bandwidth savings

### Caching
- Consider adding Redis caching for API responses
- Use Next.js revalidation for static pages
- Implement stale-while-revalidate for map data

## Backup Strategy

### Database Backups
Neon provides automatic backups. For additional safety:
- Export data regularly: `pg_dump $DATABASE_URL > backup.sql`
- Store backups off-site (S3, Google Cloud Storage)

### Blob Storage Backups
- Vercel Blob is replicated automatically
- Consider periodic exports for critical images

## Security Checklist

- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Environment variables secured (never commit .env)
- [ ] CSRF protection enabled (NextAuth default)
- [ ] Rate limiting active
- [ ] SQL injection protected (Prisma parameterized queries)
- [ ] XSS protection (React automatic escaping)
- [ ] Input validation (Zod schemas on all APIs)
- [ ] EXIF stripping on image uploads
- [ ] Cron endpoints protected with secret

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db push

# Check connection string format
# Should be: postgresql://user:password@host:port/database?sslmode=require
```

### OAuth Not Working
- Verify redirect URIs match exactly
- Check NEXTAUTH_URL is set correctly
- Ensure Google API is enabled

### Images Not Uploading
- Verify BLOB_READ_WRITE_TOKEN is set
- Check file size limits
- Review browser console for errors

### Cron Jobs Not Running
- Verify CRON_SECRET is set
- Check Vercel dashboard for execution logs
- Ensure routes are not cached

## Support

For issues:
1. Check logs in Vercel dashboard
2. Review Neon query logs
3. Check browser console for client errors
4. Contact: support@mushroommap.ie

## Updates and Maintenance

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Deploy to production
npx prisma migrate deploy
```

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update safely
npm update

# Test thoroughly before deploying
```

### Feature Flags
Consider implementing feature flags for:
- AI suggestions (can disable if quota exceeded)
- New observation uploads
- Experimental features

## Performance Optimization

### Next.js Optimizations
- Use dynamic imports for heavy components
- Implement streaming SSR where appropriate
- Optimize images with next/image

### Database Optimizations
- Add indexes for frequently queried fields (already configured)
- Monitor slow queries in Neon dashboard
- Consider materialized views for complex reports

### API Optimizations
- Implement response caching
- Use pagination for large datasets
- Optimize N+1 queries with Prisma includes

---

For detailed technical documentation, see [README.md](README.md)

