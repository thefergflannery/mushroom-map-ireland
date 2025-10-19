# 🍄 Development Roadmap - Mushroom Map Ireland

## ✅ Phase 1: Foundation (COMPLETED)
- [x] Next.js 15 app scaffold
- [x] Database schema & seeding (12 species, 10 glossary terms)
- [x] Privacy-safe map with MapLibre
- [x] Urban ReLeaf-inspired design
- [x] Core API routes
- [x] NextAuth setup
- [x] Deployed to Vercel

**Current Status:** Live at https://mush-lzkpcrpl1-ferg-flannerys-projects.vercel.app

---

## 🚧 Phase 2: Core Features (NEXT - Week 1-2)

### Priority 1: Functional Observation Submission
- [ ] **Image Upload Integration**
  - Set up Vercel Blob storage
  - Add `BLOB_READ_WRITE_TOKEN` to environment
  - Implement drag-and-drop upload UI
  - Add image preview and validation
  - EXIF extraction and stripping

- [ ] **Interactive Map Pin Placement**
  - Click-to-place location on map
  - "Use My Location" button
  - Address search/geocoding
  - Visual confirmation of grid-snapped location

- [ ] **Complete Observe Form**
  - Connect form to upload API
  - Privacy level selector with explanations
  - Notes textarea
  - Form validation and error handling
  - Success confirmation and redirect

### Priority 2: Authentication Flow
- [ ] **Sign In/Sign Up Pages**
  - Email magic link UI (if implementing)
  - Google OAuth button
  - Error handling and redirects
  - Protected route guards

- [ ] **User Profile Creation**
  - Auto-generate handle from email
  - Welcome flow for new users
  - Profile setup page

### Priority 3: Observation Detail Pages
- [ ] **Interactive Observation View**
  - Full-size image display
  - Location map (privacy-masked)
  - Metadata display
  - Edit/delete for owners

- [ ] **Identification Proposals**
  - "Propose Identification" form
  - Species search/autocomplete
  - Confidence slider
  - Rationale textarea
  - AI suggestion button integration

- [ ] **Voting Interface**
  - Agree/Disagree buttons
  - Vote count display
  - Score calculation visualization
  - Consensus indicator

### Priority 4: AI Integration
- [ ] **AI Suggestion Workflow**
  - Connect OpenAI API (or use LOCAL stub)
  - Set `OPENAI_API_KEY` if using real AI
  - Loading states and error handling
  - Display top 3 candidates
  - Match with database species
  - Clear disclaimer text

---

## 📈 Phase 3: Community Features (Week 3-4)

### Comments & Discussion
- [ ] Comment form on observations
- [ ] Comment threading (optional)
- [ ] Edit/delete own comments
- [ ] Mention other users (@username)

### Flagging & Moderation
- [ ] Flag observation button
- [ ] Flag reasons dropdown
- [ ] Moderation queue page (`/moderation`)
- [ ] Resolve/dismiss flags
- [ ] Audit log for moderator actions

### User Profiles
- [ ] Profile page (`/profile/[handle]`)
- [ ] User stats (observations, consensus reached)
- [ ] Reputation score display
- [ ] Badges/achievements
- [ ] Edit own profile

### Species Pages Enhancement
- [ ] Individual species detail pages (`/species/[slug]`)
- [ ] Lookalike comparison view
- [ ] Seasonal calendar
- [ ] Habitat information
- [ ] Recent observations of this species
- [ ] User-contributed photos

---

## 🌍 Phase 4: Polish & Production (Week 5-6)

### i18n - Irish Language
- [ ] Set up next-intl routing
- [ ] Translate UI strings to Irish
- [ ] Language switcher in header
- [ ] Locale-aware formatting

### Rate Limiting Setup
- [ ] Create Upstash Redis database
- [ ] Add credentials to environment
- [ ] Test rate limiting on uploads
- [ ] Test rate limiting on AI calls

### Performance Optimization
- [ ] Add Redis caching for API responses
- [ ] Implement ISR for species pages
- [ ] Optimize images with next/image
- [ ] Add loading skeletons
- [ ] Lighthouse audit & fixes

### Testing
- [ ] Fix and run unit tests (Vitest)
- [ ] Add more privacy masking tests
- [ ] Run E2E tests (Playwright)
- [ ] Test critical user flows
- [ ] Mobile device testing

### Content & Documentation
- [ ] About page
- [ ] Privacy policy page
- [ ] Terms of service
- [ ] Contact page
- [ ] Contribution guidelines
- [ ] Help/FAQ section

---

## 🚀 Phase 5: Advanced Features (Future)

### Analytics & Monitoring
- [ ] Vercel Analytics integration
- [ ] PostHog setup (optional)
- [ ] Error monitoring (Sentry)
- [ ] Performance tracking
- [ ] User behavior analytics

### Advanced Map Features
- [ ] Clustering for dense areas
- [ ] Heatmap toggle
- [ ] Filter by species
- [ ] Filter by date range
- [ ] Export map data
- [ ] Print map view

### Data Export
- [ ] CSV export for researchers
- [ ] Filtered exports
- [ ] API for programmatic access
- [ ] iNaturalist integration
- [ ] GBIF data sharing

### Community Tools
- [ ] Newsletter signup (working)
- [ ] Email notifications
- [ ] Mention notifications
- [ ] Consensus achievement notifications
- [ ] Weekly digest emails

### Mobile Experience
- [ ] PWA setup
- [ ] Install prompt
- [ ] Offline observation drafts
- [ ] Camera integration
- [ ] Location services

### Admin Dashboard
- [ ] User management
- [ ] Species management
- [ ] Bulk import tools
- [ ] Analytics dashboard
- [ ] System health monitoring

---

## 🔧 Technical Debt & Improvements

### Code Quality
- [ ] Fix TypeScript `any` types
- [ ] Remove unused imports
- [ ] Add JSDoc comments
- [ ] Improve error messages
- [ ] Add prop validation

### Accessibility
- [ ] Screen reader testing
- [ ] Keyboard navigation audit
- [ ] Color contrast fixes
- [ ] ARIA label improvements
- [ ] Focus management

### Security
- [ ] CSRF protection
- [ ] Input sanitization review
- [ ] SQL injection prevention audit
- [ ] Rate limiting on all APIs
- [ ] Content Security Policy headers

### Database
- [ ] Add missing indexes
- [ ] Query optimization
- [ ] Connection pool tuning
- [ ] Backup strategy
- [ ] Migration testing

---

## 📊 Success Metrics

### Launch Goals (Month 1)
- 50+ observations submitted
- 10+ active contributors
- 5+ species with consensus identifications
- 90+ Lighthouse score
- 0 critical security issues

### Growth Goals (Month 3)
- 500+ observations
- 100+ registered users
- All 12 seeded species observed
- 20+ additional species added
- Featured by Irish conservation groups

---

## 🎯 Immediate Next Steps (This Week)

1. **Set up Vercel Blob** (30 min)
   - Create storage in Vercel dashboard
   - Add token to environment
   - Test image upload API

2. **Functional Observe Form** (3-4 hours)
   - Wire up image upload
   - Connect map interaction
   - Submit to database
   - Success confirmation

3. **Basic Auth Pages** (2 hours)
   - Create `/auth/signin` page
   - Add Google OAuth flow
   - Test sign in/sign out

4. **Observation Detail Interactions** (4-5 hours)
   - Make voting buttons functional
   - Add identification proposal form
   - Display consensus status
   - Show vote breakdown

5. **Deploy & Test** (1 hour)
   - Push changes
   - Test on production
   - Fix any issues

**Estimated Total:** 10-15 hours of focused development

---

## 💡 Quick Wins (Low-hanging fruit)

- Add "Copy coordinates" button
- Add "Share observation" button
- Add breadcrumbs navigation
- Add search to species guide
- Add filter to glossary
- Add "Back to top" button
- Add loading states everywhere
- Add empty states for no data
- Improve mobile menu
- Add keyboard shortcuts

---

## 🐛 Known Issues to Fix

1. TypeScript errors (warnings currently suppressed)
2. Image components should use next/image
3. Escaped apostrophes in text
4. Unused imports cleanup
5. Better error boundaries
6. Consistent spacing/styling

---

## 📞 Need Help With?

- **Vercel Blob**: Setting up image storage
- **OpenAI API**: Getting and setting up key
- **Upstash Redis**: Creating database
- **Google OAuth**: Setting up credentials
- **Testing**: Running and fixing tests
- **Content**: Writing species descriptions
- **i18n**: Irish translations

---

**Last Updated:** October 19, 2025  
**Current Phase:** 2 - Core Features  
**Next Milestone:** Functional observation submission

