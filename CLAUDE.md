# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lunch recommendation service that reads public restaurant data (CSV from data.go.kr), filters it by location/type, stores results as JSON, and sends 5 random restaurant suggestions to a Jandi team chat via webhook. No database — all state lives in `json/` files.

## Commands

```bash
# Development (PM2 with file watching)
npm run dev

# Build TypeScript to dist/
npm run build

# Start in specific environment
npm run start:dev   # dev server
npm run start:prod  # production

# Stop PM2
npm run stop
```

There is no test runner configured. Use `npm run build` to verify TypeScript compilation.

## Architecture

**Entry point:** `server.ts` → sets up Express with Helmet, CORS, JSON parsing, mounts routes, initializes Swagger at `/swagger`, and starts scheduled jobs.

**Data flow for restaurant data:**
1. User uploads CSV via `POST /api/v1/file/upload`
2. `controller/upload.ts` parses CSV with `csv-parser`, applies filters (see below), writes results to `json/restaurant.json`
3. `GET /api/v1/recommand/send_recommand` reads `json/restaurant.json`, picks 5 random entries, fetches images via Kakao Blog Search API, sends to Jandi webhook

**Scheduled jobs** (`lib/schedule.ts`):
- `0 20 11 * * 1-5` — Sends lunch recommendations at 11:20 AM Mon–Fri
- `0 0 15 * * 4` — Sends weekly report reminder at 3:00 PM Thursday

**Restaurant filtering criteria** (applied during CSV upload):
- `영업상태` must be `"영업중"` (open)
- `업태구분명` must be `"일반음식점"` (general restaurant)
- Address must be in `"중원구"` district and contain `"여수동"`
- Business name not in `json/name_exception.json` (case-insensitive)
- Address not in `json/address_exception.json`

## Key Files & Directories

| Path | Purpose |
|------|---------|
| `server.ts` | Express app entry point |
| `route/index.ts` | Route aggregation |
| `controller/upload.ts` | CSV parsing and filtering logic |
| `controller/recommand.ts` | Random selection and recommendation dispatch |
| `api/jandi/index.ts` | Jandi webhook integration |
| `api/kakao/index.ts` | Kakao Blog Search for restaurant images (query: "야탑 {name}") |
| `lib/schedule.ts` | Cron job definitions |
| `json/restaurant.json` | Processed restaurant data (generated, not committed) |
| `json/name_exception.json` | Restaurant name exclusion list |
| `json/address_exception.json` | Address exclusion list |
| `ecosystem.config.js` | PM2 config for local/dev/prod environments |

## TypeScript Path Aliases

Defined in `tsconfig.json` and resolved at runtime via `tsconfig-paths/register`:
- `@/controller/*` → `controller/*`
- `@/lib/*` → `lib/*`
- `@/util/*` → `util/*`
- `@/api/*` → `api/*`
- `@/helper/*` → `helper/*`

## Environment Variables

Required in `.env` (not committed):
- `JANDI_WEBHOOK_URL` — Jandi webhook endpoint
- `KAKAO_API_KEY` — Kakao REST API key

Environment-specific `.env.local`, `.env.develop`, `.env.prod` files set `HOST` and `PORT`.

## Swagger

API documentation auto-generated from JSDoc comments in route files. Available at `http://localhost:{PORT}/swagger` when running. Use Swagger UI to test the CSV upload and recommendation endpoints manually.
