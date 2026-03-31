# React + TypeScript + Vite + Express + Mongoose + Zod

A minimal full-stack starter: **React + TypeScript + Vite** on the client, **Express + Mongoose** on the server, with **Zod** schemas shared via a workspace package. The goal is a small, modern setup without extra fluff.

## Stack

| Layer | Choices |
|--------|---------|
| Client | React 19, Vite 8, TypeScript, ESLint |
| Server | Express 5, Mongoose, CORS |
| Shared | `@my-project/shared` — Zod schemas and inferred TypeScript types |
| Tooling | npm workspaces, `concurrently` for dev, `tsx watch` for the API |

### Vite 8 + Rolldown + Oxc

Vite 8 ships with [Rolldown](https://rolldown.rs/) as its single unified Rust-based bundler, replacing the previous dual-bundler setup (esbuild for dev, Rollup for production). Rolldown benchmarks 10–30x faster than Rollup while keeping full plugin compatibility.

`@vitejs/plugin-react` v6 (used here) uses [Oxc](https://oxc.rs/) — Rolldown's companion compiler — for the React Refresh transform. Babel is no longer installed as a dependency, which reduces install size and speeds up transforms. The old "Vite (using SWC)" framing that appeared in earlier templates no longer applies; SWC is not involved.

## Repository layout

```
apps/
  client/     # Vite + React
  server/     # Express API
packages/
  shared/     # Zod schemas exported to client and server
```

## Prerequisites

- **Node.js** v20.6.0 or later (native `--env-file` is used on the server)
- **npm** v9 or later
- **MongoDB** running locally (or a connection string to a remote instance)

## Getting started

1. **Install dependencies** (from the repository root):

   ```bash
   npm install
   ```

2. **Environment files**

   - Server: copy `apps/server/.env.example` to `apps/server/.env` and set `MONGODB_URI` (and optionally `PORT`, `CLIENT_URL`).
   - Client: copy `apps/client/.env.example` to `apps/client/.env` if you need `VITE_API_URL` for production builds; in development, the Vite dev server proxies `/api` to the backend.

3. **Run both apps** in development:

   ```bash
   npm run dev
   ```

   - Client: [http://localhost:5173](http://localhost:5173)  
   - Server: [http://localhost:3000](http://localhost:3000)  

   The client calls `/api/...`, which Vite forwards to the Express server during `npm run dev`.

## npm scripts (root)

| Script | Description |
|--------|-------------|
| `npm run dev` | Runs client and server together |
| `npm run dev:client` | Client only |
| `npm run dev:server` | Server only |
| `npm run build` | Builds server, then client |
| `npm run build:client` / `npm run build:server` | Per-package builds |
| `npm run typecheck` | Typecheck server and client |

## API (overview)

- `GET /api/health` — health check  
- `GET /api/users` — list users  
- `POST /api/users` — create user (body validated with shared Zod schemas)

## Shared types and validation

`packages/shared` defines Zod schemas (for example `UserSchema`, `CreateUserSchema`) and exports inferred types so the client and server stay aligned without duplicating definitions.

## Production notes

- Build with `npm run build` from the root.  
- Start the compiled API with `npm run start --workspace=apps/server` from `apps/server`, after `npm run build:server`. Set `PORT`, `MONGODB_URI`, and `CLIENT_URL` in the environment (the `start` script does not load `.env` automatically; you can run `node --env-file=.env dist/index.js` instead if you prefer file-based config).  
- Serve the client from `apps/client/dist` with your host, or run `npm run preview --workspace=apps/client` to preview the Vite build.  
- Ensure `CLIENT_URL` matches your deployed frontend origin for CORS.  
- Point `VITE_API_URL` at your API base URL when building the client for production if the SPA is not served from the same origin as the API.

## Why this shape

Most fat templates ship extra layers you may not want. This repo stays **small**: workspaces for clear boundaries, one shared package for contracts, native `.env` loading on the server (`tsx --env-file=.env`), and no `dotenv` dependency on the server.
