# Preliminary spec for Est
Est is an open source, self-hostable planning poker project.

## Core Requirements

### User & Session Management
- Multiple users - no limit to how many users can join an estimation session
- User names and email addresses are stored in localStorage and persist across browser sessions
- User details (name and email) are sent to the server and stored with the estimation session
- Each participant is assigned a unique identifier (client-generated UUID) for vote tracking
- Sessions do not expire automatically but are deleted from the database after 28 days
- If a user loses connection, they can rejoin with the same identity using their client UUID
- Anyone with the share link can access the session and its historical data
- Sessions can be accessed concurrently in multiple browser tabs

### Estimation Types
- Estimations follow Fibonacci or t-shirt sizing:
    - Fibonacci points: 1, 2, 3, 5, 8, 13, 21
    - t-shirt sizes: XS, S, M, L, XL, XXL

### Session Creation Flow
1. Host user goes to https://est.becdetat.com
2. Clicks button to create a new estimation session
3. Enter name (required) and (optional) email address - the email address is only used to obtain the gravatar for the user
4. Host selects estimation type - Fibonacci or t-shirt sizing
5. Host user clicks "Start session"
6. Session is created on the server - generates a unique session ID
7. Host user is given a link to the session that they can send to other participants
8. Participant users follow the link, enter their name (required) and (optional) email address, click "Join session"
9. Participants land on the estimation session page
### Estimation Flow
- **One feature at a time** - host cannot queue multiple features
- Host user can:
    - Start a new feature estimation:
        1. Enter an optional feature name (sent to server)
        2. Enter an optional link to the feature (sent to server)
    - Reveal results for a feature estimation (even if not everyone has voted)
    - Start estimation on the same feature again after reveal (creates new feature entry internally to maintain voting history)
- Host user also participates and votes like other participants
- When the host starts estimation on a feature, all participants can see:
    - The name of the feature
    - The optional link to the feature
    - A set of cards with points or t-shirt sizes
- Participants can change their vote until the host reveals results
- When a participant selects their card:
    - They show as having voted to all users (card displayed face-down)
    - Other users cannot see the selected value
    - A visual indicator shows who has/hasn't voted yet
- The host can reveal results at any time
- When results are revealed:
    - The selected cards flip over for all users and all votes can be seen
    - Votes cannot be changed after reveal
    - Results are stored in the database
    - If all results are the same, all selected cards should wobble
- A list of features that have been estimated and the estimation results should be shown in a sidebar on the left of the main voting screen
- If a participant joins after a feature estimation has started, they can still vote on the current feature
- If the host closes their browser during an active estimation, the session ends for all users
    - A confirmation dialog appears: "The host has ended this estimation session"
    - After confirming, users are redirected to the Est home page
## Security

- Only host user is able to start and reveal estimations
- Only participants with the link to the session can view and participate in the session
- Host privileges are tied to the initial session creator (no transfer mechanism)
- Accessing a deleted session (28+ days old) returns a 404 error

## Technology Stack

- **Frontend**: React with Vite, TypeScript
- **UI Framework**: Material-UI (MUI)
- **Backend**: Node.js with Express.js, TypeScript
- **Database**: SQLite with Prisma ORM
- **Real-time Communication**: Socket.IO (WebSockets)
- **Testing**: Vitest for unit tests (no e2e testing)
- **Deployment**: Self-hostable using Docker (single container for both frontend and backend)
- **Project Structure**: Monorepo with `/client` and `/server` folders

### Coding Standards
- Four spaces per tab
- Complete TypeScript statements with semi-colons
- TypeScript for both frontend and backend

### Development Environment
- **Client**: http://localhost:3000
- **Server**: http://localhost:3001

## Data Management

- **Session retention**: 28 days, then automatically deleted
- **Session ID format**: Nanoid for shareable URLs (e.g., `est.becdetat.com/V1StGXR8_Z5jdHi6B-myT`)
- **Export**: CSV export capability (future feature)
- **Historical data**: Available to anyone with the session link until deletion
- **Gravatar**: Client-side fetch; default user image shown if no gravatar exists
- **Tracked data**: Only essential data is tracked (no vote timestamps, join/leave events, or estimation duration)

---

## Implementation Notes & Decisions
**User Management & Sessions**
- ✅ User persistence: Persist the user name and email across sessions using localStorage
- ✅ Session lifecycle: Sessions don't expire due to inactivity, but are deleted after 28 days
- ✅ Reconnection: Users can rejoin with the same identity using client-generated UUID
- ✅ Host transfer: Not needed - no mechanism for transferring host privileges

**Estimation Flow**
- ✅ Incomplete votes: Host can reveal results even if not everyone has voted; visual indicator (face-down card) shows who has voted
- ✅ Vote changing after reveal: Votes cannot change after results are revealed
- ✅ Multiple features in queue: One feature at a time to keep it simple

**Data & History**
- ✅ Historical data access: No dedicated page needed; session link provides access to history
- ✅ Export functionality: CSV exports can be a future feature
- ✅ Session sharing: Anyone with the share link can access historical data until session is deleted

- ✅ ORM: Prisma for type-safe database queries

**Technical Implementation**
- ✅ Backend framework: Express.js
- ✅ WebSocket library: Socket.IO
- ✅ Language: TypeScript for both frontend and backend
- ✅ Project structure: Monorepo with `/client` and `/server` folders
- ✅ Session ID: Nanoid for short, unique URLs
- ✅ Gravatar: Client-side fetch with default user image fallback
- ✅ Database tracking: Minimal - no timestamps, join/leave events, or duration tracking
- ✅ Testing: Vitest for unit tests (no e2e testing)
- ✅ Docker: Single container with both frontend and backend
- ✅ Local dev: localhost:3000 (client) and localhost:3001 (server)

**Error Handling**
- ✅ Late join: Participants joining after feature estimation starts can vote on current feature
- ✅ Host disconnect: Session ends for all users with confirmation dialog and redirect to home page
- ✅ Deleted session: Returns 404 error

**Additional Considerations**
- ✅ Concurrent sessions per host: No explicit support needed; users can open multiple tabs
- ✅ Participant identification: Client-generated UUID for vote tracking, user details sent to server
- ✅ Feature limits: No limit on features or participants per session

---

## Implementation Plan

### Phase 1: Project Setup & Infrastructure

#### 1.1 Monorepo Structure
- [ ] Initialize root project with `package.json`
- [ ] Create `/client` and `/server` directories
- [ ] Set up workspace configuration for monorepo
- [ ] Add root-level scripts for running both client and server

#### 1.2 Server Setup
- [ ] Initialize Node.js project in `/server`
- [ ] Install dependencies:
    - `express` - Web framework
    - `socket.io` - WebSocket support
    - `prisma` - ORM
    - `@prisma/client` - Prisma client
    - `nanoid` - Session ID generation
    - `cors` - CORS middleware
    - `dotenv` - Environment variables
- [ ] Install dev dependencies:
    - `typescript`, `@types/node`, `@types/express`
    - `tsx` - TypeScript execution
    - `vitest` - Testing framework
    - `@types/cors`
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Set up directory structure:
    ```
    server/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── services/
    │   ├── models/
    │   ├── socket/
    │   ├── middleware/
    │   ├── utils/
    │   └── index.ts
    ├── prisma/
    │   └── schema.prisma
    ├── tests/
    └── package.json
    ```

#### 1.3 Client Setup
- [ ] Initialize Vite React TypeScript project in `/client`
- [ ] Install dependencies:
    - `react`, `react-dom`
    - `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
    - `socket.io-client` - WebSocket client
    - `react-router-dom` - Routing
    - `uuid` - UUID generation for participants
- [ ] Install dev dependencies:
    - `typescript`, `@types/react`, `@types/react-dom`
    - `vite`
    - `vitest` - Testing framework
    - `@testing-library/react`, `@testing-library/jest-dom`
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Set up directory structure:
    ```
    client/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── services/
    │   ├── types/
    │   ├── utils/
    │   ├── App.tsx
    │   └── main.tsx
    ├── public/
    ├── tests/
    └── package.json
    ```

#### 1.4 Development Environment
- [ ] Create `.env` files for both client and server
- [ ] Set up ESLint and Prettier with shared config
- [ ] Configure Vitest for both projects
- [ ] Add npm scripts for development, build, and test

### Phase 2: Database Design & Setup

#### 2.1 Database Schema
- [ ] Design Prisma schema with the following models:
    - **Session**
        - `id` (String, primary key) - Nanoid
        - `estimationType` (Enum: FIBONACCI, TSHIRT)
        - `hostParticipantId` (String, foreign key)
        - `createdAt` (DateTime)
        - `updatedAt` (DateTime)
    - **Participant**
        - `id` (String, primary key) - UUID from client
        - `sessionId` (String, foreign key)
        - `name` (String)
        - `email` (String, nullable)
        - `isHost` (Boolean)
        - `createdAt` (DateTime)
    - **Feature**
        - `id` (String, primary key) - UUID
        - `sessionId` (String, foreign key)
        - `name` (String, nullable)
        - `link` (String, nullable)
        - `isRevealed` (Boolean, default: false)
        - `createdAt` (DateTime)
    - **Vote**
        - `id` (String, primary key) - UUID
        - `featureId` (String, foreign key)
        - `participantId` (String, foreign key)
        - `value` (String) - The vote value (1, 2, 3, etc. or XS, S, M, etc.)
        - `createdAt` (DateTime)
        - `updatedAt` (DateTime)

#### 2.2 Database Setup
- [ ] Create Prisma schema file
- [ ] Generate Prisma client
- [ ] Create initial migration
- [ ] Write seed data for testing (optional)

#### 2.3 Database Utilities
- [ ] Create database cleanup service for 28-day-old sessions
- [ ] Add scheduled job to run cleanup (can use node-cron or manual trigger)

### Phase 3: Backend API Development

#### 3.1 Core Server Setup
- [ ] Set up Express app with middleware (CORS, JSON parser)
- [ ] Configure Socket.IO server
- [ ] Create error handling middleware
- [ ] Set up health check endpoint

#### 3.2 REST API Endpoints
- [ ] `POST /api/sessions` - Create new session
    - Generate Nanoid for session ID
    - Create host participant
    - Return session ID and host participant ID
- [ ] `GET /api/sessions/:sessionId` - Get session details
    - Return session info and all participants
    - Return 404 if session doesn't exist or is older than 28 days
- [ ] `POST /api/sessions/:sessionId/participants` - Join session
    - Add new participant to session
    - Return participant ID
- [ ] `GET /api/sessions/:sessionId/features` - Get all features with votes
    - Return list of features with revealed votes
- [ ] `POST /api/sessions/:sessionId/features` - Create new feature
    - Host only - validate host participant ID
- [ ] `POST /api/sessions/:sessionId/features/:featureId/reveal` - Reveal results
    - Host only - validate host participant ID
    - Mark feature as revealed

#### 3.3 Socket.IO Events
- [ ] **Client to Server:**
    - `join-session` - Join a session room
    - `submit-vote` - Submit or update vote
    - `start-feature` - Host starts new feature estimation
    - `reveal-results` - Host reveals results
    - `disconnect` - Handle participant disconnect
- [ ] **Server to Client:**
    - `session-updated` - Broadcast session state changes
    - `participant-joined` - Notify when participant joins
    - `participant-left` - Notify when participant leaves
    - `vote-submitted` - Notify that someone voted (without revealing value)
    - `feature-started` - Notify all participants of new feature
    - `results-revealed` - Broadcast revealed votes
    - `host-disconnected` - Notify all participants that host left

#### 3.4 Services Layer
- [ ] Create `SessionService` for session management
- [ ] Create `ParticipantService` for participant operations
- [ ] Create `FeatureService` for feature and voting logic
- [ ] Create `SocketService` for Socket.IO event handling
- [ ] Add validation logic for host-only actions

#### 3.5 Tests
- [ ] Unit tests for services
- [ ] Unit tests for controllers
- [ ] Integration tests for API endpoints

### Phase 4: Frontend Development

#### 4.1 Core Setup
- [ ] Set up React Router with routes:
    - `/` - Home page
    - `/session/:sessionId` - Session page
- [ ] Create Socket.IO connection service
- [ ] Create API client service for REST endpoints
- [ ] Set up MUI theme configuration

#### 4.2 Utilities & Hooks
- [ ] Create localStorage utility for saving/loading user details
- [ ] Create UUID generation utility for participant IDs
- [ ] Create Gravatar URL generator utility
- [ ] Create custom hooks:
    - `useSocket` - Socket.IO connection management
    - `useLocalStorage` - Persist user name/email
    - `useSession` - Session state management
    - `useParticipant` - Current participant info

#### 4.3 Shared Components
- [ ] `UserAvatar` - Display user avatar (Gravatar or default)
- [ ] `VotingCard` - Individual voting card component
- [ ] `VotingCardGrid` - Grid of voting cards
- [ ] `ParticipantList` - List of participants with vote status
- [ ] `FeatureForm` - Form for creating/starting feature estimation
- [ ] `FeatureHistorySidebar` - Sidebar showing past estimations
- [ ] `ConfirmDialog` - Reusable confirmation dialog

#### 4.4 Home Page (`/`)
- [ ] Create landing page layout
- [ ] Add "Create Session" button
- [ ] Create session creation modal:
    - Name input (required)
    - Email input (optional)
    - Estimation type selector (Fibonacci/T-Shirt)
- [ ] Handle session creation flow
- [ ] Store user details in localStorage
- [ ] Redirect to session page after creation

#### 4.5 Session Page (`/session/:sessionId`)
- [ ] Create session page layout with:
    - Header with session info and share link
    - Left sidebar for feature history
    - Main area for voting cards
    - Participant list
    - Host controls (if user is host)
- [ ] Handle joining session flow:
    - Check localStorage for existing user details
    - Show join modal if new participant
    - Join session via API
    - Connect to Socket.IO room
- [ ] Display current feature info (name, link)
- [ ] Display voting cards based on estimation type
- [ ] Handle vote submission and updates
- [ ] Show visual indicators for who has voted (face-down cards)
- [ ] Handle results reveal:
    - Flip cards to show votes
    - Animate wobble if all votes are the same
- [ ] Update feature history sidebar in real-time
- [ ] Handle host-specific features:
    - Feature creation form
    - Reveal results button
    - Visual indication of host status

#### 4.6 Real-time Event Handling
- [ ] Listen for `session-updated` and update UI
- [ ] Listen for `participant-joined` and add to list
- [ ] Listen for `participant-left` and remove from list
- [ ] Listen for `vote-submitted` and show vote indicator
- [ ] Listen for `feature-started` and reset voting UI
- [ ] Listen for `results-revealed` and display votes
- [ ] Listen for `host-disconnected`:
    - Show "Host has ended this estimation session" dialog
    - Redirect to home page on confirmation

#### 4.7 Error Handling
- [ ] Handle 404 for non-existent sessions
- [ ] Handle connection errors
- [ ] Handle API errors
- [ ] Show appropriate error messages to users

#### 4.8 Tests
- [ ] Unit tests for utilities and hooks
- [ ] Component tests for major components
- [ ] Integration tests for key user flows

### Phase 5: Integration & Testing

#### 5.1 End-to-End Integration
- [ ] Test complete session creation flow
- [ ] Test participant joining flow
- [ ] Test voting flow with multiple participants
- [ ] Test reveal results flow
- [ ] Test host disconnect flow
- [ ] Test reconnection scenarios
- [ ] Test with multiple concurrent sessions

#### 5.2 Edge Cases
- [ ] Test late participant joining during active vote
- [ ] Test rapid vote changes
- [ ] Test session with 0 votes before reveal
- [ ] Test session with missing feature name/link
- [ ] Test accessing old (28+ day) sessions

### Phase 6: Docker & Deployment

#### 6.1 Docker Configuration
- [ ] Create `Dockerfile` for single container:
    - Build client (static files)
    - Build server
    - Serve client from server
- [ ] Create `.dockerignore`
- [ ] Create `docker-compose.yml` for easy deployment
- [ ] Set up volume for SQLite database persistence
- [ ] Configure environment variables for production

#### 6.2 Production Build
- [ ] Configure Vite for production build
- [ ] Configure server to serve static client files
- [ ] Set up production environment variables
- [ ] Optimize build size

#### 6.3 Documentation
- [ ] Create README with:
    - Project description
    - Setup instructions
    - Development guide
    - Docker deployment instructions
    - Manage database migrations
- [ ] Create CONTRIBUTING.md
- [ ] Add inline code documentation
- [ ] Create API documentation

### Phase 7: Polish & Additional Features

#### 7.1 UI/UX Polish
- [ ] Add loading states
- [ ] Add transition animations
- [ ] Ensure responsive design for mobile
- [ ] Add keyboard shortcuts
- [ ] Improve accessibility (ARIA labels, focus management)

#### 7.2 Additional Features
- [ ] Copy share link to clipboard button
- [ ] Show session creation date
- [ ] Add ability to delete old sessions manually
- [ ] Add statistics (average vote, consensus level)

#### 7.3 Future Enhancements (Post-MVP)
- [ ] CSV export functionality
- [ ] Custom card values
- [ ] Session passwords/authentication
- [ ] User presence indicators (typing, etc.)
- [ ] Dark mode
- [ ] Multiple languages/i18n

---

## Database Schema Reference

```prisma
model Session {
    id              String        @id
    estimationType  EstimationType
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt
    participants    Participant[]
    features        Feature[]
}

model Participant {
    id        String   @id
    sessionId String
    name      String
    email     String?
    isHost    Boolean  @default(false)
    createdAt DateTime @default(now())
    session   Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
    votes     Vote[]
}

model Feature {
    id         String   @id
    sessionId  String
    name       String?
    link       String?
    isRevealed Boolean  @default(false)
    createdAt  DateTime @default(now())
    session    Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
    votes      Vote[]
}

model Vote {
    id            String      @id
    featureId     String
    participantId String
    value         String
    createdAt     DateTime    @default(now())
    updatedAt     DateTime    @updatedAt
    feature       Feature     @relation(fields: [featureId], references: [id], onDelete: Cascade)
    participant   Participant @relation(fields: [participantId], references: [id], onDelete: Cascade)
    
    @@unique([featureId, participantId])
}

enum EstimationType {
    FIBONACCI
    TSHIRT
}
```

## API Endpoint Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/sessions` | Create new session | None |
| GET | `/api/sessions/:sessionId` | Get session details | None |
| POST | `/api/sessions/:sessionId/participants` | Join session | None |
| GET | `/api/sessions/:sessionId/features` | Get features with votes | None |
| POST | `/api/sessions/:sessionId/features` | Create new feature | Host |
| POST | `/api/sessions/:sessionId/features/:featureId/reveal` | Reveal results | Host |

## Socket.IO Events Reference

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-session` | `{ sessionId, participantId }` | Join session room |
| `submit-vote` | `{ sessionId, featureId, participantId, value }` | Submit/update vote |
| `start-feature` | `{ sessionId, participantId, name?, link? }` | Start new feature (host only) |
| `reveal-results` | `{ sessionId, featureId, participantId }` | Reveal results (host only) |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `session-updated` | `{ session, participants }` | Session state changed |
| `participant-joined` | `{ participant }` | New participant joined |
| `participant-left` | `{ participantId }` | Participant left |
| `vote-submitted` | `{ featureId, participantId, hasVoted }` | Someone voted (no value) |
| `feature-started` | `{ feature }` | New feature started |
| `results-revealed` | `{ feature, votes }` | Results revealed with votes |
| `host-disconnected` | `{}` | Host left session |ation dialog and redirect to home page
- ✅ Deleted session: Returns 404 error
**Additional Considerations**
- ✅ Concurrent sessions per host: No explicit support needed; users can open multiple tabs
- ✅ Participant identification: Client-generated UUID for vote tracking, user details sent to server
- ✅ Feature limits: No limit on features or participants per










