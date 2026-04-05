# Subscription Tracker

This project now includes:

- A React frontend connected to live APIs
- A Node.js + Express backend
- MongoDB persistence with Mongoose
- JWT-based signup/login
- Protected CRUD APIs for subscriptions

## Backend Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
server.js
```

## Subscription Fields

- `appName`
- `cost`
- `category`
- `renewalDate`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Update [.env](./.env) with your MongoDB connection string and JWT secret.
3. Start frontend and backend together:
   ```bash
   npm run dev:full
   ```

Frontend runs on `http://localhost:3000`.
Backend runs on `http://localhost:5000`.

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/subscriptions`
- `POST /api/subscriptions`
- `PUT /api/subscriptions/:id`
- `DELETE /api/subscriptions/:id`
