# Assessment Frontend (React)

## Prerequisites
- Node.js v22+ (see .nvmrc)
- npm v10+
- Docker (for backend and database)

## Installation
1. Navigate to the frontend directory:
   ```sh
   cd assessment-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Running the Frontend
1. Start the backend and database using Docker (see backend README for details).
2. Start the frontend development server:
   ```sh
   npm run dev
   ```
3. Open your browser and go to the URL shown in the terminal (usually http://localhost:5173).

## Environment Variables
- The frontend expects the backend API to be available at `http://localhost:3000` by default.
- To change the API URL, set the `VITE_API_URL` environment variable in a `.env` file in the frontend directory.

## Notes
- Ensure the backend and database are running before using the frontend.
- For more details on requirements and features, see `../requirements/frontend.md`.