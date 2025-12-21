# Production Deployment Scripts

## Docker Commands
docker-build:
	docker build -t est:latest .

docker-run:
	docker run -d -p 3001:3001 -v est-data:/app/data --name est est:latest

docker-stop:
	docker stop est && docker rm est

docker-logs:
	docker logs -f est

## Docker Compose Commands
compose-up:
	docker-compose up -d

compose-down:
	docker-compose down

compose-logs:
	docker-compose logs -f

compose-rebuild:
	docker-compose up -d --build

## Database Management
db-backup:
	docker cp est:/app/data/prod.db ./backup-$(shell date +%Y%m%d-%H%M%S).db

db-restore:
	@echo "Usage: make db-restore FILE=backup-YYYYMMDD-HHMMSS.db"
	docker cp $(FILE) est:/app/data/prod.db
	docker restart est
