# Est - Planning Poker Application

Est is an open source, self-hostable planning poker application for agile estimation sessions.

## Features

- 🎯 Multiple estimation types (Fibonacci, T-Shirt sizing)
- 👥 Unlimited participants per session
- 🔄 Real-time updates via WebSockets
- 📊 Session history and results tracking
- 🎨 Modern UI with Material-UI
- 🐳 Docker support for easy self-hosting

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Material-UI
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: SQLite with Prisma ORM
- **Real-time**: Socket.IO
- **Testing**: Vitest

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

```bash
npm test              # Run tests in all workspaces
npm run test --workspace=server    # Server tests only
npm run test --workspace=client    # Client tests only
```

### Linting and Formatting

```bash
npm run lint          # Lint all workspaces
npm run format        # Format code with Prettier
```

## Building for Production

```bash
npm run build         # Build both client and server
```

## Docker Deployment

Coming soon - Docker configuration for easy self-hosting.

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

## Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details.

## License

See LICENSE file for details.

## Support

For issues and questions, please open a GitHub issue.
Open source self-hostable planning poker
