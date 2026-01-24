# Assessment Backend (NestJS)

## Prerequisites
- Node.js v22+ (see .nvmrc)
- npm v10+
- Docker (for database and Redis)

## Installation
1. Navigate to the backend directory:
   ```sh
   cd assessment-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Running with Docker Compose (Recommended)
1. From the project root, start all services (Postgres, Redis, backend, worker) with:
   ```sh
   docker-compose up --build
   ```
   - This will build and start the backend, worker, Postgres, and Redis containers.
   - The backend will be available at `http://localhost:3000`.

## Running Locally (Without Docker)
1. Ensure Postgres and Redis are running locally.
2. Set environment variables in `assessment-backend/.env` (see below for required variables).
3. Start the backend server:
   ```sh
   npm run start:dev
   ```
4. (Optional) Start the worker process in a separate terminal:
   ```sh
   npm run build
   node dist/workflows/worker.main.js
   ```

## Environment Variables
Create a `.env` file in the backend directory with the following (example values):
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=blackrose
DB_NAME=assessment
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
OPENAI_API_KEY=your_openai_api_key
```

## Database
- The backend uses PostgreSQL. The default database is set up by Docker Compose.
- Data is persisted in a Docker volume or your local Postgres instance.

## Notes
- The backend exposes API endpoints at `http://localhost:3000`.
- For more details on requirements and features, see `../requirements/backend.md`.