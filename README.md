# CBT Quiz

A self-administered cognitive-behavioral self-check. Discovery screen routes users into the
relevant indicator blocks (PHQ-9, GAD-7, 10 cognitive distortions x 2 stems each), all scoring
is **deterministic server-side**, and an LLM analyst only narrates the result.

> ⚠️ This is a self-reflection tool, **not** a medical device or diagnosis. If you are in crisis,
> contact your local emergency services or visit https://findahelpline.com.

## Stack

- Next.js `16.2.4` (App Router, RSC, Server Actions)
- React `19.x`
- TypeScript strict
- Tailwind CSS `4.x`
- shadcn/ui `4.4.0` on Base UI primitives
- Zod `4.x`
- OpenRouter REST (no SDK)
- `@react-pdf/renderer`
- `localStorage` only — no DB, no analytics, no telemetry
- Hosted on Vercel (Edge runtime for the analyst Server Action)

## Getting started

```bash
pnpm install
cp .env.example .env.local
# set OPENROUTER_API_KEY in .env.local (or in your Vercel project env)
pnpm dev
```

Open http://localhost:3000.

## Project layout

See [`docs/architecture.md`](./docs/architecture.md) for the full plan. Short version:

```
app/                        # routes + analyze server action
components/                 # quiz / safety / result UI
lib/engine/                 # deterministic scoring + safety backstop
lib/analyst/                # OpenRouter wrapper + Zod schema + prompts
lib/storage/                # localStorage latest slot
resources/indicators.en.json
resources/crisis-resources.en.json
```

## Determinism

Scores, severities, distortion strengths, and safety flags are computed in `lib/engine/`.
The LLM **only narrates** — it never produces numeric facts. If PHQ-9 #9 ≥ 1, the server
forcibly attaches `safetyFlags` and prepends the crisis line to the summary regardless of model output.

## Model fallback chain

1. `mistralai/mistral-small-2603` (default, swap one constant in `lib/analyst/models.ts`)
2. `google/gemma-4-31b-it:free`
3. `google/gemma-4-26b-a4b-it:free`
4. Deterministic-only render (scores + static CBT primer)

## License

MIT — see [`LICENSE`](./LICENSE). PHQ-9 / GAD-7 attribution in [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md).
