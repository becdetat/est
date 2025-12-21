# Est - Quick Start Guide

Get Est running in under 5 minutes!

## Choose Your Path

### 🐳 Docker (Recommended for Production)

**Prerequisites:** Docker and Docker Compose installed

```bash
# 1. Clone the repository
git clone <repository-url>
cd est

# 2. Start with Docker Compose
docker-compose up -d

# 3. Access the application
# Open http://localhost:3001 in your browser

# View logs
docker-compose logs -f
```

That's it! Est is now running with:
- ✅ Production build
- ✅ Persistent database
- ✅ Automatic restarts
- ✅ Health checks

### 💻 Development Mode

**Prerequisites:** Node.js 18+ and npm 9+

```bash
# 1. Clone the repository
git clone <repository-url>
cd est

# 2. Install dependencies
npm install

# 3. Set up environment
cp server/.env.example server/.env
cp client/.env.example client/.env

# 4. Generate Prisma client and run migrations
cd server
npx prisma generate
npx prisma migrate dev
cd ..

# 5. Start development servers
npm run dev

# 6. Access the application
# Client: http://localhost:3000
# Server: http://localhost:3001
```

## First Session

1. **Open the app** in your browser
2. **Enter your name** (and optional email for Gravatar)
3. **Click "Create Session"**
4. **Share the URL** with your team
5. **Start a feature** by clicking "Start Feature"
6. **Vote** by selecting a card
7. **Reveal results** when everyone has voted

## Common Tasks

### View Logs
```bash
# Docker
docker-compose logs -f

# Development
# Check terminal where npm run dev is running
```

### Stop the Application
```bash
# Docker
docker-compose down

# Development
# Press Ctrl+C in terminal
```

### Restart the Application
```bash
# Docker
docker-compose restart

# Development
npm run dev
```

### Backup Database
```bash
# Docker
docker cp est-app:/app/data/prod.db ./backup.db

# Development
cp server/prisma/dev.db ./backup.db
```

## Configuration

### Docker Environment Variables

Create a `.env` file in the project root:

```env
CORS_ORIGIN=https://your-domain.com
PORT=3001
NODE_ENV=production
```

### Development Environment

Edit `server/.env`:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
CLIENT_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

## Troubleshooting

### Port already in use

**Docker:**
```bash
docker-compose down
# Change port in docker-compose.yml
docker-compose up -d
```

**Development:**
```bash
# Edit PORT in server/.env
# Edit port in client/vite.config.ts
npm run dev
```

### Database errors

**Docker:**
```bash
docker-compose down -v  # WARNING: Deletes all data
docker-compose up -d
```

**Development:**
```bash
cd server
rm -rf prisma/migrations prisma/dev.db
npx prisma migrate dev
```

### Can't connect to server

1. Check if server is running: `curl http://localhost:3001/api/health`
2. Check logs for errors
3. Verify port configuration
4. Check firewall settings

## Next Steps

- 📖 Read the [full documentation](README.md)
- 🚀 See [deployment guide](DEPLOYMENT.md) for production
- 🧪 Review [testing guide](TESTING.md) for quality assurance
- 🤝 Check [contributing guide](CONTRIBUTING.md) to contribute

## Quick Reference

| Command | Purpose |
|---------|---------|
| `docker-compose up -d` | Start in Docker |
| `docker-compose down` | Stop Docker containers |
| `npm run dev` | Start development servers |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run test:e2e` | Run E2E tests |

## Support

- 🐛 [Report bugs](https://github.com/your-repo/est/issues)
- 💡 [Request features](https://github.com/your-repo/est/issues/new)
- 💬 [Discussions](https://github.com/your-repo/est/discussions)

## License

See [LICENSE](LICENSE) file for details.

---

**Happy Planning! 🎯**
