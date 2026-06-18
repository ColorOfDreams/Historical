# Historical

Interactive frontend prototype for exploring Vietnamese history through a connected 3D scene, relationship constellation, and guided historical paths.

## Overview

This project is a standalone Next.js prototype focused on the Battle of Bach Dang 1288. It is frontend-only and uses mock typed data stored locally in the repository.

The core experience includes:

- A WebGL 3D reconstruction of the Bach Dang battlefield.
- Timeline controls for moving through battle stages.
- Selectable hotspots with contextual historical information.
- A constellation graph connecting people, events, places, and dynasties.
- Guided exploration paths that move between the major layers.
- Non-WebGL fallback support.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Three Fiber
- Drei
- Framer Motion
- Zustand

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deployment Notes

This repository uses `package-lock.json`, so Vercel should install dependencies with `npm install`.

If Vercel shows `Command "pnpm install" exited with 1`, make sure `pnpm-lock.yaml` is not committed. Vercel chooses the package manager from the lockfile it finds in the project root.

Recommended Vercel settings:

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave default

## Project Scope

- Frontend only
- Mock data only
- No backend
- No authentication
- No database
- Desktop-first interactive exploration prototype

## Main Files

- `app/page.tsx` - primary exploration route
- `components/space-scene.tsx` - 3D Bach Dang scene
- `components/constellation.tsx` - relationship graph
- `components/exploration-paths.tsx` - guided historical paths
- `lib/history-data.ts` - typed mock history data
