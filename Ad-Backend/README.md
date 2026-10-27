# Privacy-First AdTech Backend

## Overview
A scalable, secure backend for a privacy-first advertising technology platform. Implements contextual targeting, analytics, file storage, and more.

## Tech Stack
- Node.js, Express
- PostgreSQL, Redis, InfluxDB
- MinIO (S3-compatible for local dev)
- Docker Compose

## Services
- Authentication & User Management
- Content Analysis
- File Storage
- Analytics & Reporting
- Notification

## Setup
1. Clone the repo
2. Copy `.env.example` to `.env` and fill in secrets
3. Run `docker-compose up --build`
4. Run `npm install`
5. Start the server: `npm run dev` (with nodemon)

## API Endpoints
See PRD for full endpoint list. Each service has its own route module under `src/routes/`.

## Testing
- Run `npm test` for unit/integration tests

## Notes
- Uses MinIO for S3 emulation locally
- Analytics stored in InfluxDB
- All sensitive config via environment variables

## License
MIT 