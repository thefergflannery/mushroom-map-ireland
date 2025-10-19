# Contributing to Mushroom Map Ireland

Thank you for your interest in contributing! This project is a community effort to map Ireland's fungal biodiversity while respecting privacy and promoting citizen science.

## Ways to Contribute

### 1. Code Contributions
- Bug fixes
- New features
- Performance improvements
- Accessibility enhancements
- Test coverage

### 2. Content Contributions
- Species data and descriptions
- Irish language terms (Gaeilge)
- Photography tips
- Identification guides

### 3. Community Contributions
- Mushroom identifications
- Quality observations
- Peer review of identifications
- Community moderation (for trusted members)

### 4. Documentation
- README improvements
- API documentation
- Translation (especially Irish/Gaeilge)
- Tutorial videos or guides

## Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/mush.git
cd mush

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
npm run db:push
npm run db:seed

# Run development server
npm run dev
```

## Code Standards

### TypeScript
- Use strict TypeScript
- No `any` types (use `unknown` with guards)
- Prefer interfaces over types for objects
- Document complex types

### React/Next.js
- Use Server Components by default
- Client Components only when necessary (`'use client'`)
- Prefer composition over inheritance
- Keep components focused and testable

### Styling
- Use Tailwind utility classes
- Follow existing component patterns
- Maintain accessibility (ARIA labels, keyboard nav)
- Test with screen readers

### API Design
- Use Zod for input validation
- Return consistent error formats
- Include rate limiting for public endpoints
- Document with JSDoc comments

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage Requirements
- All new features must include tests
- Aim for 80%+ coverage on critical paths
- Privacy functions require 100% coverage
- API routes require integration tests

## Privacy Guidelines

This project is **privacy-first**. All contributions must respect:

1. **Location Privacy**
   - Never expose exact coordinates without explicit user consent
   - Always apply grid snapping for display
   - Sensitive species get extra protection (10km minimum)

2. **User Privacy**
   - No tracking without consent
   - EXIF data stripped from uploads
   - Minimal data collection

3. **Data Security**
   - No sensitive data in logs
   - Environment variables never committed
   - Secure API endpoints

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `test/description` - Test improvements

### Commit Messages
Follow conventional commits:
```
feat: add species comparison view
fix: correct grid snapping calculation
docs: update deployment guide
test: add consensus voting tests
```

### Pull Request Process

1. **Create Issue First**
   - Describe the problem or feature
   - Get feedback before coding

2. **Development**
   - Create feature branch from `main`
   - Write tests first (TDD preferred)
   - Keep commits focused and atomic
   - Update documentation

3. **Before Submitting**
   - [ ] All tests pass
   - [ ] No linting errors
   - [ ] Documentation updated
   - [ ] Accessibility checked
   - [ ] Privacy implications considered

4. **Pull Request**
   - Clear title and description
   - Reference related issues
   - Add screenshots for UI changes
   - Request review from maintainers

5. **Review Process**
   - Address feedback promptly
   - Keep discussion focused
   - Squash commits before merge

## Code Review Guidelines

### As a Reviewer
- Be respectful and constructive
- Focus on code quality, not style preferences
- Test the changes locally
- Check privacy implications
- Verify accessibility

### As an Author
- Don't take feedback personally
- Ask questions if unclear
- Explain your reasoning
- Be open to alternative approaches

## Species Data Guidelines

When adding or updating species information:

### Required Fields
- Scientific name (Latin)
- Common English name
- Edibility rating (conservative!)
- Season
- Habitat

### Optional but Encouraged
- Irish name (Gaeilge) - with sources
- Key identification traits
- Lookalike species (especially toxic ones)
- Quality photographs

### Sources
- Cite reputable sources
- Prefer Irish field guides
- Link to scientific literature when possible

### Safety First
- Be conservative with edibility ratings
- Always note toxic lookalikes
- Include clear warnings
- Never encourage consumption without expert verification

## Irish Language (Gaeilge) Contributions

We welcome Irish language contributions:

### Translations
- UI text translations
- Species common names
- Error messages
- Help documentation

### Glossary Terms
- Traditional mushroom terms
- Regional variations
- Etymology when known
- Audio pronunciations (if possible)

### Resources
- Consult Foclóir.ie
- Verify with Irish speakers
- Note regional variations
- Cite sources

## Accessibility Requirements

All contributions must maintain WCAG 2.2 AA compliance:

- Keyboard navigation for all interactive elements
- ARIA labels for complex widgets
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators clearly visible
- Screen reader compatibility
- Alt text for all images

## Community Guidelines

### Be Respectful
- Welcome newcomers
- Assume good intentions
- Respect diverse perspectives
- No harassment or discrimination

### Be Helpful
- Share knowledge generously
- Mentor others
- Provide constructive feedback
- Celebrate others' contributions

### Focus on Science
- Citations for claims
- Admit uncertainty
- Learn from mistakes
- Prioritize accuracy over speed

## Identification Ethics

When identifying observations:

1. **Only ID when confident** - Don't guess
2. **Explain reasoning** - What features support your ID?
3. **Note lookalikes** - Especially dangerous ones
4. **Be humble** - Acknowledge limitations
5. **Cite sources** - Reference guides or experts
6. **Safety first** - When in doubt, mark as UNKNOWN

## Recognition

Contributors will be:
- Listed in GitHub contributors
- Credited in release notes
- Thanked in annual reports
- Featured in community highlights (with permission)

## Questions?

- Open a GitHub Discussion for questions
- Join our community forum (link)
- Email: contribute@mushroommap.ie

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping build a better understanding of Ireland's fungal biodiversity! 🍄

