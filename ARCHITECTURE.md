# Architecture Documentation - Mushroom Map Ireland

## System Overview

Mushroom Map Ireland is a privacy-first, citizen science platform for identifying and mapping fungal biodiversity across Ireland. The architecture prioritizes data privacy, community consensus, and accessibility.

## High-Level Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────┐
│      Next.js 15 App Router          │
│  (React Server Components + Client) │
├─────────────────────────────────────┤
│  - Server Components (default)       │
│  - Client Components (interactive)   │
│  - API Routes (REST)                 │
│  - Server Actions (mutations)        │
└──────┬─────────────┬────────────────┘
       │             │
       ▼             ▼
┌─────────────┐  ┌──────────────┐
│   Prisma    │  │  NextAuth    │
│   (ORM)     │  │   (Auth)     │
└──────┬──────┘  └──────┬───────┘
       │                │
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│    Neon     │  │   Session    │
│  Postgres   │  │    Store     │
└─────────────┘  └──────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, TypeScript 5.7
- **Styling**: Tailwind CSS 4.0, shadcn/ui
- **Maps**: MapLibre GL JS 5.0
- **Forms**: React Hook Form (planned)
- **State**: Server Components + URL state

### Backend
- **Runtime**: Node.js 18+ (Vercel Edge Functions)
- **Database**: Neon Postgres (serverless)
- **ORM**: Prisma 6
- **Auth**: NextAuth v5 (beta)
- **Validation**: Zod 3.24
- **Rate Limiting**: Upstash Redis

### Storage & Assets
- **Images**: Vercel Blob Storage
- **Static Assets**: Vercel CDN
- **Image Processing**: Sharp (EXIF stripping)

### AI/ML
- **Provider**: OpenAI GPT-4o Vision
- **Architecture**: Pluggable (LOCAL fallback)
- **Usage**: Assistive suggestions only

### Deployment
- **Platform**: Vercel
- **CI/CD**: GitHub Actions (planned)
- **Monitoring**: Vercel Analytics
- **Cron Jobs**: Vercel Cron

## Data Models

### Core Entities

```typescript
User → Observation → Identification → Vote
                   ↘ Comment
                   ↘ Flag
```

### Privacy Model

```
Exact Coordinates (stored, never exposed)
    ↓
Grid Snapping (1km or 10km)
    ↓
Display Coordinates (privacy-safe)
```

### Consensus Model

```
Identification + Votes → Score
    ↓
Score ≥ Threshold → Consensus
    ↓
Observation Status Update
```

## Privacy Architecture

### Three-Layer Privacy System

1. **Storage Layer** (Database)
   - Exact lat/lng stored in `observations` table
   - Grid references (1km, 10km) computed and cached
   - Never exposed in API responses

2. **Computation Layer** (Server)
   - `getDisplayCoordinates()` applies privacy rules
   - Considers: privacy level, species sensitivity, viewer role
   - Snaps to appropriate grid

3. **Display Layer** (Client)
   - MapLibre shows snapped coordinates only
   - Legend indicates grid precision
   - No satellite imagery (vector tiles only)

### Privacy Rules

| Privacy Level | Non-Sensitive | Sensitive Species |
|--------------|---------------|-------------------|
| EXACT        | Exact coords  | 1km grid          |
| GRID_1KM     | 1km grid      | 10km grid         |
| GRID_10KM    | 10km grid     | 10km grid         |

**Exception**: Moderators/Biologists can view exact coordinates for research.

## Consensus Algorithm

### Vote Weighting

```typescript
Weight = BaseRoleWeight + min(reputation / 100, 2)

Roles:
  USER: 1
  TRUSTED: 2
  MOD: 3
  BIOLOGIST: 5
  ADMIN: 5
```

### Consensus Calculation

```typescript
Score = Σ(vote.value * voterWeight)

Consensus when:
  - Top score ≥ 10 (threshold)
  - Top score - Runner-up ≥ 5 (margin)
```

### Status Transitions

```
NEEDS_ID → HAS_CANDIDATES → CONSENSUS
          ↑__________________|
              (if consensus lost)
```

## API Design

### REST Endpoints

```
GET    /api/observations        List observations
POST   /api/observations        Create observation
GET    /api/observations/:id    Get observation details
PATCH  /api/observations/:id    Update observation
DELETE /api/observations/:id    Delete observation

POST   /api/identifications     Propose identification
POST   /api/votes               Vote on identification

GET    /api/species             Search species
GET    /api/species/:slug       Get species details

GET    /api/glossary            Search Irish terms

POST   /api/ai/suggest          Get AI suggestions
POST   /api/upload              Upload image
```

### Response Format

```typescript
{
  data: T | T[],
  pagination?: {
    limit: number,
    offset: number,
    hasMore: boolean
  },
  error?: string,
  details?: ValidationError[]
}
```

### Rate Limiting

- **Standard**: 10 requests / 10 seconds
- **Strict** (uploads, AI): 3 requests / 60 seconds

Headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1234567890
```

## Authentication & Authorization

### Authentication
- NextAuth v5 with database sessions
- Email magic link (planned)
- Google OAuth
- Session stored in database

### Authorization Levels

```
USER          Basic access, can create observations
TRUSTED       Weighted votes (2x)
MOD           Can resolve flags, view sensitive locations
BIOLOGIST     Can resolve consensus, highest vote weight
ADMIN         Full system access
```

### Protected Routes

```typescript
/observe      → Authenticated
/profile/*    → Authenticated (own profile)
/moderation   → MOD+
/admin        → ADMIN
```

## Map Implementation

### MapLibre Configuration

```typescript
{
  style: 'carto-light-vector',  // No satellite imagery
  center: [-8.24, 53.41],       // Ireland center
  zoom: 7,
  minZoom: 5,
  maxZoom: 16                   // Limited zoom to discourage exact location inference
}
```

### Marker Clustering

Markers show:
- Observation photo thumbnail
- Status indicator (color-coded)
- Popup with basic info

Status colors (colorblind-safe):
- **Blue**: Needs ID
- **Amber**: Has candidates
- **Green**: Consensus

### Accessibility

- Full keyboard navigation
- ARIA labels on all markers
- Legend with screen reader text
- Skip links for map interaction

## Background Jobs

### Consensus Recalculation (Daily, 2 AM)

```typescript
For each observation with identifications:
  1. Recalculate all identification scores
  2. Process consensus logic
  3. Update consensus flags
  4. Update observation status
```

### Cache Warming (Daily, 3 AM)

```typescript
Pre-compute:
  - Platform statistics
  - Top species
  - Recent activity
  - Popular locations (grid-level)
```

## Image Processing Pipeline

```
User Upload
    ↓
Size/Type Validation
    ↓
Extract EXIF (GPS for grid calc)
    ↓
Strip EXIF (privacy)
    ↓
Optimize (Sharp)
    ↓
Upload to Blob Storage
    ↓
Return URL
```

## Caching Strategy

### Server Components
- Default: Static generation
- Revalidate: 3600s for listings
- Dynamic: Observation details, user profiles

### API Routes
- No default caching
- Consider Redis for expensive queries
- Edge caching via Vercel CDN

### Map Data
- Client-side cache: 5 minutes
- Stale-while-revalidate for UX
- Invalidate on new observation

## Database Schema Design

### Key Indexes

```sql
-- Spatial queries
CREATE INDEX idx_observation_location ON observations (lat, lng);
CREATE INDEX idx_observation_grid ON observations (grid1km);

-- Filtering
CREATE INDEX idx_observation_status ON observations (status);
CREATE INDEX idx_observation_created ON observations (createdAt DESC);

-- Consensus
CREATE INDEX idx_identification_consensus ON identifications (isConsensus);
CREATE INDEX idx_identification_score ON identifications (score DESC);

-- Voting
CREATE UNIQUE INDEX idx_vote_unique ON votes (identificationId, voterUserId);
```

### Relationships

- Cascade deletes for user-owned content
- Soft deletes for moderation (flags)
- Audit logs never deleted

## Security Measures

### Input Validation
- Zod schemas on all API inputs
- Prisma parameterized queries (SQL injection prevention)
- File type/size validation on uploads

### Output Sanitization
- React automatic XSS protection
- Privacy masking before output
- EXIF stripping

### Rate Limiting
- Upstash Redis-based
- Per-user (authenticated)
- Per-IP (anonymous)

### CORS
- Same-origin policy
- No public API (yet)

## Performance Optimizations

### Database
- Connection pooling via Prisma
- Neon serverless (auto-scaling)
- Selective field loading
- Query optimization (includes vs joins)

### Frontend
- Server Components reduce client JS
- Dynamic imports for heavy components (MapLibre)
- Image optimization via next/image
- Streaming SSR for fast TTFB

### API
- Pagination on all list endpoints
- Limit clause (max 100 items)
- Field selection (partial responses)

## Monitoring & Observability

### Logs
- Structured logging (JSON)
- Error tracking (console.error)
- Audit logs for moderation actions

### Metrics
- Vercel Analytics (performance)
- Database query performance (Neon)
- Cron job success/failure rates

### Alerts (Planned)
- Failed cron jobs
- High error rates
- Database connection issues
- Rate limit threshold breaches

## Accessibility Architecture

### WCAG 2.2 AA Compliance

- **Keyboard Navigation**: Tab order, focus management
- **Screen Readers**: ARIA labels, live regions
- **Color Contrast**: 4.5:1 minimum
- **Focus Indicators**: Visible outlines
- **Form Validation**: Error announcements

### Testing
- Automated: axe-core, Lighthouse
- Manual: NVDA, VoiceOver testing
- User testing: Community members

## Internationalization (i18n)

### Planned: next-intl

- English (en): Primary
- Irish (ga): Secondary
- Locale-aware routing: `/en`, `/ga`
- Translation keys in separate files
- RTL support not required (English/Irish LTR)

## Future Architecture Considerations

### Scalability
- Database read replicas for heavy load
- CDN for static assets (already via Vercel)
- API pagination with cursor-based approach
- Consider GraphQL for complex queries

### Features
- Real-time updates (WebSockets/SSE)
- Offline support (PWA)
- Mobile apps (React Native)
- Advanced search (Algolia/ElasticSearch)

### Data Science
- ML models for auto-identification
- Seasonal pattern analysis
- Distribution mapping
- Climate correlation studies

---

For implementation details, see code documentation and inline comments.

