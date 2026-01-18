# Assessment Backend (NestJS)

## Project Initialization

1. `cd` into `assessment-backend/`

2. Set your node environment

   - Run `nvm install && nvm use`, or

   - Alternatively manually set your node to v22+ and npm to v10+

3. Run `npm install` to install dependencies

   Note: Ensure you have properly set your node version before this step

4. Run `npm run start:dev` or `npm run start:debug` to spin-up the backend in watch mode

   Your backend server should be running on `localhost:3000`, unless a different port is defined in `process.env.PORT`.

   You can check that the server is running correctly by trying the base endpoint `GET http://localhost:3000`, which should return the text "Hello Lead Engineer Candidate!"

## Backend Requirements

Requirements can be found in the [backend requirements doc](../requirements/backend.md), or in `../requirements/backend.md`