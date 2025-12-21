# Est - Deployment Guide

## Deployment Options

Est can be deployed using Docker, which provides a consistent environment across different hosting platforms.

## Prerequisites

- Docker and Docker Compose installed
- At least 512MB RAM
- 1GB disk space (more for database growth)

## Docker Deployment (Recommended)

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd est
```

2. **Configure environment (optional):**
```bash
cp .env.production.example .env.production
# Edit .env.production with your settings
```

3. **Build and run with Docker Compose:**
```bash
docker-compose up -d
```

4. **Access the application:**
Open http://localhost:3001 in your browser

### Docker Compose Configuration

The `docker-compose.yml` file includes:
- Automatic container restart
- Health checks
- Persistent volume for SQLite database
- Environment variable configuration

**Environment Variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | production | Environment mode |
| `DATABASE_URL` | file:/app/data/prod.db | Database location |
| `CORS_ORIGIN` | http://localhost:3001 | Allowed CORS origin |

**Custom Configuration:**

Create a `.env` file in the project root:

```env
CORS_ORIGIN=https://your-domain.com
PORT=3001
```

Then start with:
```bash
docker-compose up -d
```

### Manual Docker Build

If you prefer to build and run manually:

```bash
# Build image
docker build -t est:latest .

# Run container
docker run -d \
  -p 3001:3001 \
  -v est-data:/app/data \
  -e CORS_ORIGIN=https://your-domain.com \
  --name est \
  est:latest
```

### Docker Commands

**View logs:**
```bash
docker-compose logs -f
# or
docker logs -f est
```

**Stop the application:**
```bash
docker-compose down
# or
docker stop est
```

**Restart the application:**
```bash
docker-compose restart
# or
docker restart est
```

**Rebuild and restart:**
```bash
docker-compose up -d --build
```

## Database Management

### Backup Database

```bash
# With Docker Compose
docker cp est-app:/app/data/prod.db ./backup-$(date +%Y%m%d-%H%M%S).db

# With Docker
docker cp est:/app/data/prod.db ./backup-$(date +%Y%m%d-%H%M%S).db
```

### Restore Database

```bash
# Stop the container
docker-compose down

# Copy backup file
docker cp backup-20251220-120000.db est-app:/app/data/prod.db

# Restart
docker-compose up -d
```

### Database Migrations

Migrations run automatically when the container starts. To run manually:

```bash
docker exec -it est-app sh
cd server
npx prisma migrate deploy
exit
```

## Deployment Platforms

### Docker-Compatible Platforms

Est can be deployed to any platform that supports Docker:

- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Heroku** (using container registry)
- **Railway**
- **Fly.io**
- **Self-hosted** (VPS with Docker)

### Platform-Specific Notes

#### Railway
1. Connect GitHub repository
2. Railway auto-detects Dockerfile
3. Add environment variables in dashboard
4. Deploy automatically on push

#### Fly.io
```bash
# Install flyctl
# Create fly.toml (example below)
fly launch
fly deploy
```

Example `fly.toml`:
```toml
app = "est-planning-poker"
kill_signal = "SIGINT"
kill_timeout = 5

[env]
  NODE_ENV = "production"
  PORT = "3001"

[[services]]
  internal_port = 3001
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

[mounts]
  source = "est_data"
  destination = "/app/data"
```

#### DigitalOcean App Platform
1. Create new app from GitHub
2. Select Dockerfile deployment
3. Add persistent volume mounted to `/app/data`
4. Configure environment variables
5. Deploy

## Reverse Proxy Configuration

### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support for Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Caddy

```caddyfile
your-domain.com {
    reverse_proxy localhost:3001
}
```

## SSL/TLS Configuration

### Using Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

### Using Caddy (Automatic HTTPS)

Caddy automatically provisions and renews SSL certificates. Just configure your domain and it works!

## Monitoring & Logs

### Health Check

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-20T10:30:00.000Z",
  "environment": "production"
}
```

### View Logs

```bash
# All logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f est
```

### Monitoring Tools

Consider integrating:
- **Uptime monitoring:** UptimeRobot, Pingdom
- **Error tracking:** Sentry
- **Analytics:** Plausible, Umami (self-hosted)
- **Logs:** Papertrail, Loggly

## Performance Optimization

### Production Checklist

- [x] Built with production optimizations (Vite)
- [x] Gzip compression enabled
- [x] Static assets served efficiently
- [x] Health checks configured
- [x] Automatic restarts on failure
- [ ] CDN for static assets (optional)
- [ ] Database backups automated
- [ ] Monitoring configured

### Scaling Considerations

For high traffic:

1. **Use a dedicated database:** Migrate from SQLite to PostgreSQL
2. **Add Redis:** For Socket.IO adapter (multi-instance support)
3. **Load balancer:** Distribute traffic across multiple instances
4. **CDN:** Serve static assets from edge locations

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs est-app

# Common issues:
# - Port 3001 already in use
# - Database migration failed
# - Missing environment variables
```

### Database errors

```bash
# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

### Socket.IO connection issues

- Ensure WebSocket support in reverse proxy
- Check CORS_ORIGIN environment variable
- Verify firewall allows port 3001

### Performance issues

```bash
# Check resource usage
docker stats est-app

# Increase memory limit
docker run -m 1g ...
```

## Security Best Practices

1. **Use HTTPS** in production
2. **Set CORS_ORIGIN** to your domain
3. **Regular updates:** Pull latest image and redeploy
4. **Database backups:** Schedule regular backups
5. **Monitor logs:** Watch for suspicious activity
6. **Firewall:** Only expose necessary ports
7. **Environment variables:** Never commit `.env` files

## Updating

### Update to Latest Version

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Database migrations run automatically
```

### Rollback

```bash
# Stop current version
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Rebuild
docker-compose up -d --build
```

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/your-repo/est/issues)
- Review logs: `docker-compose logs -f`
- Verify configuration: `docker-compose config`

## License

See LICENSE file for details.
