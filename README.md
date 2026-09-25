# Standalone Menu Server Website Remake

This package provides:

- `/` — API-style status response
- `/dashboard` — visual web dashboard
- `/serverdata` — JSON endpoint
- `/api/serverdata` — JSON endpoint for the dashboard
- `/api/status` — server status summary
- `/api/serverdata` `PUT` — protected JSON replacement endpoint
- `/ai` — compatibility placeholder returning HTTP 501 until an AI provider is configured

## Run

1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000/dashboard`.

## Public deployment

Put the Node app behind HTTPS and reverse proxy the desired hostname to it.

Before exposing the write endpoint, set:

`ADMIN_KEY=your-long-random-secret`

The dashboard is intentionally read-only. `/api/serverdata` writes require:

`Authorization: Bearer your-long-random-secret`

## Notes

The live `menu.seralyth.software` root currently identifies itself as an API, and `/serverdata` exposes the server-data JSON consumed by the menu. This remake reproduces that API-facing behavior and adds a usable dashboard around the same data shape.

The `/ai` route is a compatibility stub; no third-party AI credentials are included.
