# SketchSync

SketchSync is a collaborative whiteboard. Users in the same room draw, chat and see the cursors of the other users in real time.

Live site: https://sketch-sync-board.vercel.app

## How it works

The project has two parts:

| Part                             | Code                            | Host               |
| -------------------------------- | ------------------------------- | ------------------ |
| Frontend (Next.js, Pages Router) | `pages/`, `modules/`, `common/` | Vercel             |
| Socket.IO server                 | `server/`                       | Render (free plan) |

Vercel cannot run a long-lived Socket.IO server. Thus the browser connects directly to the Socket.IO server on Render. The server keeps all rooms in memory:

- A server restart removes all rooms.
- The server deletes a room 10 minutes after its last user leaves (30 seconds for a room with no drawings).
- The server limits the number of rooms, the moves in a room and the memory for move data. See `server/rooms.ts`.
- The free Render plan stops the server after 15 minutes without traffic. The next visitor waits up to 1 minute while the server starts again. The home page shows a message during this time.

For local development, `server/index.ts` runs Next.js and the Socket.IO server on one port.

## Requirements

- Node.js 24 (see `engines` in `package.json`)
- npm

## Local development

```sh
npm install
npm run dev
```

Open http://localhost:3000. The dev server reloads when you change a file.

## Scripts

| Script                 | What it does                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Starts Next.js and the Socket.IO server on port 3000.                                                       |
| `npm run build`        | Compiles the server to `build/` and builds the Next.js app.                                                 |
| `npm start`            | Starts the compiled server with Next.js (after `npm run build`).                                            |
| `npm run start:socket` | Starts only the compiled Socket.IO server. Render uses this script.                                         |
| `npm run lint`         | Runs ESLint.                                                                                                |
| `npm run format`       | Formats all files with Prettier.                                                                            |
| `npm run typecheck`    | Type-checks the frontend and the server.                                                                    |
| `npm test`             | Runs the unit and server tests (Vitest).                                                                    |
| `npm run test:e2e`     | Builds the app and runs the browser tests (Playwright). Locally, the tests use the installed Google Chrome. |

## Environment variables

| Variable                 | Where                     | What it does                                                                                                                                                                                                |
| ------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SOCKET_URL` | Frontend (Vercel)         | The URL of the Socket.IO server. Next.js puts the value into the frontend code at build time. When the variable is not set, the frontend connects to its own origin (local development).                    |
| `CLIENT_ORIGIN`          | Socket.IO server (Render) | A comma-separated list of the frontend origins that can connect. A `*` matches one part of a host name, for example `https://my-app-*.vercel.app`. The server does not start when this variable is not set. |
| `PORT`                   | Both servers              | The port for the server. Render sets it.                                                                                                                                                                    |

## Deployment

A push to `main` deploys both parts:

- **Vercel** builds the frontend from the GitHub repository. The project `sketch-sync-board` has `NEXT_PUBLIC_SOCKET_URL=https://sketch-sync-socket.onrender.com` for Production and Preview.
- **Render** builds the Socket.IO server from `render.yaml`. The file also sets `CLIENT_ORIGIN` to the production URL and to the Vercel preview URLs.

CI (`.github/workflows/ci.yml`) runs the format check, lint, type check, unit tests and browser tests for each push and pull request.

## Project structure

```
common/        Code that the whole frontend shares: state (Jotai), hooks, helpers, types
modules/       Features: home page, modal, room (board, chat, toolbar)
pages/         Next.js pages
server/        Socket.IO server: validation, room store, entry points
e2e/           Browser tests (Playwright)
```

`common/types/global.ts` defines the Socket.IO events for the client and the server. `server/validation.ts` checks each payload that a client sends.

## Dependency notes

- **ESLint 9.** ESLint 10 is available, but `eslint-plugin-react` in `eslint-config-next` 16.3.6 stops with an error on ESLint 10. Update ESLint when `eslint-config-next` supports ESLint 10.
- **TypeScript 6.** TypeScript 7 is available, but `typescript-eslint` supports only TypeScript versions below 6.1. Update TypeScript when `typescript-eslint` supports TypeScript 7.
