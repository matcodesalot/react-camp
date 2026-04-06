# React Camp

A full-stack campground listing app built with React, Express, MongoDB, and shared Zod schemas.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (default port `27017`)

## Setup

1. **Install dependencies** from the repo root:

   ```bash
   npm install
   ```

2. **Configure the server environment.** Copy the example file and set `MONGODB_URI` to use the `react-camp` database:

   ```bash
   cp apps/server/.env.example apps/server/.env
   ```

   Then open `apps/server/.env` and set:

   ```
   MONGODB_URI=mongodb://localhost:27017/react-camp
   ```

## Seeding the Database

The seed script deletes all existing campgrounds and inserts 50 randomly generated ones.

Run it from the `apps/server` directory:

```bash
cd apps/server
npx tsx src/seeds/index.ts
```

Expected output:

```
Connected to MongoDB
Seeded 50 campgrounds
Bye bye!
```

### Verify the seed

```bash
mongosh
use react-camp
db.campgrounds.find()
```

You should see 50 campground documents with randomised titles, locations, prices, and images.

## Development

Start both the client and server with hot-reload from the repo root:

```bash
npm run dev
```

Or start them individually:

```bash
npm run dev:server   # Express API on http://localhost:3000
npm run dev:client   # Vite/React on http://localhost:5173
```
