# 🍄 Mushroom Map Ireland

A privacy-first citizen science platform for identifying and mapping fungi across Ireland.

## Features

- **Privacy-First Design**: Locations displayed at 1-10km grid precision; exact coordinates never exposed
- **AI-Assisted Identification**: OpenAI Vision provides initial suggestions (assistive, not authoritative)
- **Community Consensus**: Wiki-style voting system with expert override
- **Bilingual**: English and Irish (Gaeilge) support
- **Accessible**: WCAG 2.2 AA compliant with keyboard navigation and screen reader support
- **Structured Data**: Exports for biological research

## Tech Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Database**: Neon Postgres with Prisma ORM
- **Auth**: NextAuth v5 (email magic link + Google OAuth)
- **Maps**: MapLibre GL JS with privacy-safe vector tiles
- **UI**: Tailwind CSS + shadcn/ui (Radix primitives)
- **Storage**: Vercel Blob
- **Rate Limiting**: Upstash Redis
- **AI**: OpenAI GPT-4o Vision (pluggable architecture)
- **i18n**: next-intl
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- API keys (see Environment Variables)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed initial data
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Environment Variables

Required:
- `DATABASE_URL` - Neon Postgres connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)

Optional:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `OPENAI_API_KEY` - For AI identification (or set `AI_PROVIDER=LOCAL` for stubs)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` - Rate limiting
- `POSTHOG_KEY` - Analytics

## Database Management

```bash
# Open Prisma Studio
npm run db:studio

# Create migration
npm run db:migrate

# Re-seed database
npm run db:seed
```

## Privacy Architecture

1. **Grid Snapping**: All coordinates displayed at 1km or 10km grid precision
2. **Sensitive Species**: Automatically masked at 10km level (e.g., rare species)
3. **User Control**: Users choose privacy level (EXACT | GRID_1KM | GRID_10KM)
4. **No Satellite Imagery**: MapLibre uses vector tiles only; no aerial photos
5. **EXIF Stripping**: Photo metadata removed on upload (preserves GPS for grid calc, then strips)

## Consensus Model

- **Vote Weight**: Based on user role (USER=1, TRUSTED=2, MOD=3, BIOLOGIST=5) + reputation
- **Threshold**: Consensus requires score ≥10 and lead ≥5 over runner-up
- **Expert Override**: Biologists/Moderators can resolve directly with audit log

## API Routes

- `GET /api/observations?bbox&status&since` - List observations
- `POST /api/observations` - Create observation (auth required)
- `POST /api/ai/suggest` - Get AI identification suggestions
- `POST /api/identifications` - Propose identification
- `POST /api/votes` - Vote on identification
- `GET /api/species?q&edibility` - Search species
- `GET /api/glossary?q&region` - Search Irish terms

## Development

```bash
# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Lint
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

### Database Setup (Neon)

```bash
# Using Neon MCP (if configured)
# Or create manually at console.neon.tech
```

## Accessibility

- Focus indicators on all interactive elements
- Keyboard navigation (Tab, Enter, Arrow keys)
- ARIA labels and live regions
- High contrast mode support
- Screen reader tested

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Safety Notice

⚠️ **NEVER consume mushrooms based solely on online identification.** Many edible species have deadly lookalikes. Always consult with an experienced mycologist in person before consuming any wild mushroom.

## License

MIT License - see [LICENSE](LICENSE) for details

## Acknowledgments

- Irish Mycological Society
- OpenStreetMap contributors
- CARTO for basemap tiles
- Citizen scientists of Ireland

## Contact

For research data access or partnerships: contact@mushroommap.ie

---

Built with 🍄 for the mycology community of Ireland
