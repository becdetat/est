# Est - Planning Poker Application

Est is an open source, self-hostable planning poker application for agile estimation sessions.

## ⚡ Quick Start

```bash
# Docker (recommended)
docker-compose up -d
# Access at http://localhost:3001

# Or development mode
npm install && npm run dev
# Client: http://localhost:3000
```

📖 **[Full Quick Start Guide →](QUICKSTART.md)**

## Features

- 🎯 Multiple estimation types (Fibonacci, T-Shirt sizing)
- 👥 Unlimited participants per session
- 🔄 Real-time updates via WebSockets
- 📊 Session history and results tracking
- 🎨 Modern UI with Material-UI
- 🐳 Docker support for easy self-hosting
- 🔒 Participant persistence across refreshes
- 👑 Host-only controls
- 🎭 Anonymous voting until reveal
- 🎉 Consensus detection
- 🧹 Automatic session cleanup (28 days)

## Documentation

- 📘 [Quick Start Guide](QUICKSTART.md) - Get running in 5 minutes
- 🚀 [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions
- 🧪 [Testing Guide](TESTING.md) - Comprehensive testing documentation
- 🤝 [Contributing Guide](CONTRIBUTING.md) - How to contribute
- 📝 [Changelog](CHANGELOG.md) - Version history

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite 7, Material-UI 6
- **Backend**: Node.js 18+, Express 4, TypeScript
- **Database**: SQLite with Prisma ORM 5
- **Real-time**: Socket.IO 4
- **Testing**: Vitest, Playwright
- **Deployment**: Docker, Docker Compose

## Project Structure

```
est/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── server/          # Express backend application
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   └── package.json
└── package.json     # Root workspace configuration
```

## Development Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd est
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**Server (.env in /server):**
```bash
cp server/.env.example server/.env
```

**Client (.env in /client):**
```bash
cp client/.env.example client/.env
```

4. Generate Prisma client and run migrations:
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
cd ..
```

### Running the Application

**Development mode (both client and server):**
```bash
npm run dev
```

**Or run them separately:**
```bash
npm run dev:server    # Server on http://localhost:3001
npm run dev:client    # Client on http://localhost:3000
```

The client will be available at http://localhost:3000 and the server at http://localhost:3001.

### Testing

**Unit/Integration Tests:**
```bash
npm test              # Run tests in all workspaces
npm run test --workspace=server    # Server tests only
npm run test --workspace=client    # Client tests only
```

**End-to-End Tests (Playwright):**
```bash
# First time setup
npm run playwright:install

# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug
```

**Manual Testing:**
See [TESTING.md](TESTING.md) for comprehensive manual testing checklist.


### Linting and Formatting

```bash
npm run lint          # Lint all workspaces
npm run format        # Format code with Prettier
```

## Building for Production

```bash
npm run build         # Build both client and server
```

The build creates:
- `client/dist/` - Static files for the frontend
- `server/dist/` - Compiled server code

## Docker Deployment

### Quick Start

```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Access at http://localhost:3001
```

### Manual Docker Build

```bash
# Build image
docker build -t est:latest .

# Run container
docker run -d -p 3001:3001 -v est-data:/app/data --name est est:latest
```

### Environment Configuration

Create a `.env` file or pass environment variables:

```env
CORS_ORIGIN=https://your-domain.com
PORT=3001
NODE_ENV=production
```

### Database Backup

```bash
docker cp est-app:/app/data/prod.db ./backup.db
```

**For detailed deployment instructions**, see [DEPLOYMENT.md](DEPLOYMENT.md)

## API Documentation

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create new session |
| GET | `/api/sessions/:sessionId` | Get session details |
| POST | `/api/sessions/:sessionId/participants` | Join session |
| GET | `/api/sessions/:sessionId/features` | Get features with votes |
| POST | `/api/sessions/:sessionId/features` | Create new feature (host only) |
| POST | `/api/sessions/:sessionId/features/:featureId/reveal` | Reveal results (host only) |

### Socket.IO Events

**Client → Server:**
- `join-session` - Join a session room
- `submit-vote` - Submit or update vote
- `start-feature` - Start new feature (host only)
- `reveal-results` - Reveal results (host only)

**Server → Client:**
- `session-updated` - Session state changed
- `participant-joined` - New participant joined
- `participant-left` - Participant left
- `vote-submitted` - Someone voted
- `feature-started` - New feature started
- `results-revealed` - Results revealed
- `host-disconnected` - Host left session

## Database Schema

The application uses SQLite with Prisma ORM. See [spec.md](spec.md) for detailed schema documentation.

Key tables:
- **Session** - Estimation sessions with unique IDs
- **Participant** - Users in sessions with UUID persistence
- **Feature** - Items to be estimated
- **Vote** - Individual votes with values


## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Code style guidelines
- Testing requirements
- Pull request process

Est is built with significant assistance from AI. We welcome AI generated pull requests, however we ask that you review the PR first for code quality and maintainability.

### Copilot/AI Instructions
When implementing features or fixes:
1. Write the implementation
2. Write comprehensive unit tests
3. Build the applications and verify no build errors or warnings
4. Run the tests to verify they pass
5. Report test results
6. Iterate if there are any issues

## License

See [LICENSE](LICENSE) file for details.

## Support

- 🐛 **Bug reports**: [GitHub Issues](https://github.com/becdetat/est/issues)
- 💡 **Feature requests**: [GitHub Issues](https://github.com/becdetat/est/issues/new)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/becdetat/est/discussions)

## Acknowledgments

Built using open source technologies:
- React, Express, Prisma, Socket.IO, Material-UI
- Thanks to all contributors and the open source community

---

**Est** - Open source self-hostable planning poker for agile teams

[⭐ Star on GitHub](https://github.com/your-repo/est) | [📖 Documentation](QUICKSTART.md) | [🚀 Deploy](DEPLOYMENT.md)
