# Meeting Hub Frontend

A Next.js 16 frontend for the Meeting Hub platform. The app includes authentication screens, a dashboard and home experience, group and profile views, and a Jitsi-powered meeting page for live calls.

## Current Scope

Implemented in the frontend today:

- App Router based Next.js application
- Login, register, and password reset screens
- Dashboard and home views built from reusable UI components
- Group, profile, settings, and notifications pages
- Meeting room page powered by `@jitsi/react-sdk`
- Shared Axios client configured for the backend API
- Form handling with React Hook Form and Zod validation

Current gaps:

- Most auth forms are still wired for UI flow only and do not yet submit to live backend endpoints
- Several pages are still backed by mock data
- No frontend test suite is configured yet

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Axios
- React Hook Form
- Zod
- Zustand
- Jitsi React SDK

## Project Structure

```text
frontend/
|-- src/
|   |-- app/                      # App Router routes and layouts
|   |   |-- (auth)/               # Login, register, reset flows
|   |   |-- (dashboard)/          # Dashboard and notifications
|   |   |-- (home)/               # Home, group, profile, settings
|   |   |-- (meetings)/           # Meeting room pages
|   |-- components/               # Shared UI and feature components
|   |-- hooks/                    # Small reusable helpers
|   |-- lib/                      # API client, mock data, utilities
|-- package.json
|-- package-lock.json
|-- README.md
```

## Installation

1. Install dependencies.

```bash
npm install
```

2. Start the development server.

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` - start the Next.js development server
- `npm run build` - create a production build
- `npm run start` - run the production build locally
- `npm run lint` - run ESLint

## Environment Variables

The shared API client is defined in `src/lib/api.ts` and uses the following variable:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000/api
```

If `NEXT_PUBLIC_API_BASE` is not set, the frontend falls back to `http://localhost:8000/api`.

## Main Routes

- `/` - simple landing page
- `/login` - sign in form
- `/register` - account creation form
- `/reset` - password reset form
- `/dashboard` - dashboard area
- `/notifications` - notifications view
- `/home` - main home overview
- `/group/[groupId]` - group details page
- `/profile` - user profile page
- `/settings` - settings page
- `/meeting/[meetingId]` - live meeting room

## Backend Integration

This frontend is intended to work with the Django backend in `../backend`.

Expected local defaults:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api`

The backend README documents available endpoints for:

- authentication
- groups and invitations
- meetings and minutes
- notifications

## Jitsi Notes

There are currently two meeting integration paths in the codebase:

- `src/app/(meetings)/meeting/[meetingId]/page.tsx` uses the public `meet.jit.si` domain
- `src/components/jitsi/JitsiMeetingWrapper.tsx` points at `https://localhost:8443` for a local or self-hosted Jitsi deployment

Before standardizing meeting behavior, decide which Jitsi environment should be the default for local development.

## Development Status

This frontend is in active build-out. It already has route structure, component building blocks, and API wiring points, but some flows still need full backend integration and end-to-end polish.
