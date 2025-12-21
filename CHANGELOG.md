# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-20

### Added

#### Core Features
- Planning poker session creation and management
- Fibonacci (1, 2, 3, 5, 8, 13, 21) estimation support
- T-shirt sizing (XS, S, M, L, XL, XXL) support
- Real-time voting with Socket.IO
- Participant management with persistent IDs
- Host-only controls (create features, reveal results)
- Vote anonymity until results revealed
- Consensus detection
- Session history and feature tracking
- 28-day automatic session cleanup

#### Frontend
- React 18 with TypeScript
- Material-UI component library
- Real-time Socket.IO integration
- Responsive design (mobile, tablet, desktop)
- Gravatar support for participant avatars
- Custom hooks for state management
- LocalStorage for participant persistence
- Voting card grid interface
- Participant list with vote status
- Feature creation dialog
- Results display with vote breakdown
- Session sharing via URL

#### Backend
- Express.js REST API
- Socket.IO WebSocket server
- SQLite database with Prisma ORM
- Scheduled cleanup jobs (node-cron)
- CORS configuration
- Error handling middleware
- Health check endpoint
- Static file serving in production
- Database migrations support

#### Testing
- Playwright E2E test suite
- 25+ automated tests covering:
  - Session creation and persistence
  - Feature voting workflows
  - Multi-user real-time synchronization
  - Host permission controls
  - Edge cases and error handling
  - Mobile responsiveness
  - Performance testing
- Comprehensive manual testing documentation
- Test results tracking templates

#### Deployment
- Docker support with multi-stage builds
- Docker Compose configuration
- Production-optimized builds
- Database volume persistence
- Health checks and auto-restart
- Environment variable configuration
- Deployment guide for multiple platforms
- Nginx/Caddy reverse proxy examples
- GitHub Actions CI/CD workflow

#### Documentation
- Comprehensive README
- Detailed deployment guide (DEPLOYMENT.md)
- Testing documentation (TESTING.md, TESTING_QUICK_GUIDE.md)
- Contributing guidelines (CONTRIBUTING.md)
- API documentation
- Socket.IO event specifications
- Database schema documentation

### Technical Details

#### Dependencies
- Frontend: React 18, Vite 7, Material-UI 6, Socket.IO Client
- Backend: Express 4, Socket.IO 4, Prisma 5, SQLite
- Development: TypeScript 5, ESLint, Prettier, Playwright

#### Database Schema
- Sessions table with expiry tracking
- Participants with UUID identifiers
- Features with reveal status
- Votes with value tracking
- Proper relationships and constraints

#### API Endpoints
- POST `/api/sessions` - Create new session
- GET `/api/sessions/:sessionId` - Get session details
- POST `/api/sessions/:sessionId/participants` - Join session
- GET `/api/sessions/:sessionId/features` - Get features with votes
- POST `/api/sessions/:sessionId/features` - Create new feature
- POST `/api/sessions/:sessionId/features/:featureId/reveal` - Reveal results
- GET `/api/health` - Health check

#### Socket.IO Events
- Client → Server: `join-session`, `submit-vote`, `start-feature`, `reveal-results`
- Server → Client: `session-updated`, `participant-joined`, `participant-left`, `vote-submitted`, `feature-started`, `results-revealed`, `host-disconnected`

### Security
- CORS configuration
- Input validation
- SQL injection prevention (Prisma)
- XSS protection
- Participant ID verification
- Host permission checks

### Performance
- Optimized production builds
- Static asset compression
- Efficient database queries
- Connection pooling
- Real-time event optimization

## [Unreleased]

### Planned Features
- PostgreSQL support for production
- Redis adapter for Socket.IO (multi-instance)
- Feature voting history export
- Session statistics and analytics
- Dark mode support
- Additional estimation scales
- Keyboard shortcuts
- Results visualization (charts/graphs)
- Consensus animation (wobble effect)
- Email notifications (optional)
- Session templates

### Known Issues
- None reported

### Breaking Changes
- None

---
