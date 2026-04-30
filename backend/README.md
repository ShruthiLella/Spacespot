# Spacespot Backend

This is the backend for the Spacespot full-stack app.

- Node.js + Express
- PostgreSQL (AWS RDS, us-east-1)
- Sequelize ORM
- JWT authentication
- AWS S3 file uploads

## Setup Steps

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your AWS/Postgres credentials.
3. Run database migrations:
   ```sh
   npx sequelize-cli db:migrate
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

See `.env.example` for required environment variables.
