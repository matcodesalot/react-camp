# React Camp

A full-stack campground listing app built with React, Express, MongoDB, and shared Zod schemas.

This project is a modernized rebuild of [Colt Steele's YelpCamp](https://github.com/Colt/YelpCamp/tree/6570c595edf0480fab6b832abd35d37717a081cd). The [original tutorial](https://www.udemy.com/course/the-web-developer-bootcamp/) used an older, server-rendered stack. Every layer has been updated to reflect current tooling and best practices:

| Concern | Original (YelpCamp) | This Project (ReactCamp) |
|---|---|---|
| **Language** | JavaScript | TypeScript (client, server, and shared package) |
| **Frontend** | EJS server-side templates | React 19 with React Router v7 |
| **Build tool** | None (served directly by Express) | Vite 8 |
| **Styling** | Bootstrap 5 | Tailwind CSS v4 |
| **Validation** | Joi (server-only) | Zod — shared schemas consumed by both client and server via an npm workspace package |
| **Authentication** | Passport.js + express-session | Better Auth |
| **Architecture** | Monolith (Express renders views) | Monorepo (npm workspaces) with a separate Express REST API and a Vite/React SPA |
| **Server runtime** | `node` / `nodemon` | `tsx watch` (no compile step in dev), `tsdown` for production builds |

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (default port `27017`)

## Setup

1. **Install dependencies** from the repo root:

   ```bash
   npm install
   ```

2. **Configure environment variables.** The Client and Server has its own `.env` file.

   **Server** (`apps/server/.env`):

   ```bash
   cp apps/server/.env.example apps/server/.env
   ```

   - `NODE_ENV` — Runtime environment (`development` or `production`). Defaults to `development`.
   - `PORT` — Port the Express API listens on. Defaults to `3000`.
   - `MONGODB_URI` — MongoDB connection string. Defaults to `mongodb://localhost:27017/my-project`.
   - `CLIENT_URL` — URL of the React client, used by Better Auth for CORS trusted origins. Defaults to `http://localhost:5173`.
   - `BETTER_AUTH_SECRET` — Secret used by Better Auth to sign sessions. Must be at least 32 characters. **Required.** Generate one with:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - `BETTER_AUTH_URL` — Public base URL of the API, used by Better Auth for cookie and redirect logic. Defaults to `http://localhost:3000`.

   **Client** (`apps/client/.env`):

   ```bash
   cp apps/client/.env.example apps/client/.env
   ```

   - `VITE_API_URL` — Base URL of the Express API, used by the auth client and all API calls. Defaults to `http://localhost:3000`.

## Project Structure

```
my-project/
├── apps/
│   ├── client/          # Vite + React SPA
│   └── server/          # Express REST API
└── packages/
    └── shared/          # Zod schemas and TypeScript types shared between client and server
```

The `packages/shared` package is the key architectural decision that sets this project apart from the original. Zod schemas are defined once and imported by both the server (for request validation) and the client (for form validation and type inference). This eliminates duplicated type definitions and ensures both sides always agree on the shape of data.

## Available Scripts

Run these from the repo root:

- `npm run dev` — Start both client and server concurrently with hot-reload
- `npm run dev:server` — Start only the Express API (`tsx watch`)
- `npm run dev:client` — Start only the Vite dev server
- `npm run build` — Production build for both apps
- `npm run build:server` — Bundle the server with `tsdown`
- `npm run build:client` — Bundle the client with Vite
- `npm run typecheck` — Run `tsc --noEmit` across both apps

## API Reference

All endpoints are prefixed with `/api`.

**Health**

- `GET /api/health` — Returns server status

**Campgrounds**

- `GET /api/campgrounds` — List all campgrounds
- `GET /api/campgrounds/:id` — Get a single campground (populated with author and reviews)
- `POST /api/campgrounds` — Create a campground *(auth required)*
- `PUT /api/campgrounds/:id` — Update a campground *(auth required, must be author)*
- `DELETE /api/campgrounds/:id` — Delete a campground *(auth required, must be author)*

**Reviews**

- `POST /api/campgrounds/:id/reviews` — Add a review to a campground *(auth required)*
- `DELETE /api/campgrounds/:id/reviews/:reviewId` — Delete a review *(auth required, must be author)*

**Auth** (handled by Better Auth)

- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-out`
- `GET /api/auth/get-session`

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

## TODO

- Homepage
- Add image upload instead of url link. Multiple images allowed?
- Cluster map with MapLibre GL JS and OpenMapTiles
- Better security with Helmet