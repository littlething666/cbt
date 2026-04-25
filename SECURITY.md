# Security policy

## Reporting a vulnerability

Please open a private security advisory on GitHub or email littlething666@gmail.com.
Do **not** file a public issue for security-sensitive reports.

## Scope

This project ships:

- A Next.js app with a single Server Action (`/analyze`) that calls OpenRouter.
- No database, no user accounts, no analytics, no telemetry.
- All quiz responses are stored only in the user's browser `localStorage`.

## Secrets

- `OPENROUTER_API_KEY` is server-only (Vercel project env).
- `.env.example` is the only committed env file. Never commit a real key.

## Safety note

This is a self-reflection tool, not a medical device. It does not replace clinical care.
Users in crisis are pointed to local emergency services and https://findahelpline.com.
