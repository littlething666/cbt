# Architecture

This is the locked v1 plan. The canonical source of truth is the Notion page; this file mirrors
the key decisions for engineers reading the repo.

## Locked decisions

- **Hosting:** Vercel (Edge runtime for the analyst Server Action). `vercel.json` is committed.
- **Public domain:** none in v1 — dev/preview deployments only.
- **Repo / license:** `github.com/littlething666/cbt`, public, MIT.
- **Workflow:** scaffold lands on `chore/scaffold-v1` and is merged via PR — never directly to `main`.
- **Analytics:** none in v1 (zero telemetry).
- **Quiz controls:** Continue and Stop only.
- **Discovery:** 4-item ultra-brief screen (PHQ-2 + GAD-2), 4-point frequency scale (0–3).
- **Main quiz:** indicator subset chosen from `resources/indicators.en.json` based on PHQ-2 / GAD-2 cutoff = 3.
- **Response format:** native 4-point frequency for PHQ-9 / GAD-7 (Pfizer wording, verbatim, attributed); 5-point agreement for distortions only. Always-on collapsible "Add a note (optional)" under every item.
- **Determinism:** scores, severities, distortion strengths, and safety flags are computed in `lib/engine/`. The LLM only narrates.
- **Safety backstop:** PHQ-9 #9 ≥ 1 → server-side forced safety flags + crisis-line summary prefix, **and** the pre-result crisis screen fires.
- **Localization:** English only in v1.
- **Crisis resources:** international generic message + prominent link to https://findahelpline.com.
- **LLM:** OpenRouter REST. Default model is held in the single exported constant `OPENROUTER_DEFAULT_MODEL` in `lib/analyst/models.ts`. Fallback chain on failure: `google/gemma-4-31b-it:free` → `google/gemma-4-26b-a4b-it:free` → deterministic-only render.
- **Persistence:** unlimited retakes, latest slot only (`localStorage`), `indicatorsVersion` + `analyzedAt` stamped.
- **Export:** download as PDF on the result page (`@react-pdf/renderer`).
- **Secrets:** `.env.example` is committed (template only). Real `OPENROUTER_API_KEY` set in the Vercel project env, server-only.
- **Result page:** `noindex` (meta + `X-Robots-Tag` from `vercel.json`).

## Indicator set (v1)

| Block | Source | Items | Scale | When included |
|---|---|---:|---|---|
| Depression | PHQ-9 (verbatim) | 9 | Frequency 0–3 | D1+D2 ≥ 3 |
| Anxiety | GAD-7 (verbatim) | 7 | Frequency 0–3 | D3+D4 ≥ 3 |
| Cognitive distortions | 20 plain-English stems (2 per distortion) | 20 | Agreement 1–5 | Any block triggered, or as standalone short track |

Worst-case length: 4 + 9 + 7 + 20 = **40 items**, ~8–10 minutes.
Minimum-case length: 4 + 20 = **24 items**, ~4–5 minutes.

## Distortion strength

Computed as the mean of each distortion's 2 agreement scores:

- mean ≤ 2.5 → `low`
- mean 2.5–3.5 → `moderate`
- mean ≥ 3.5 → `high`

## Cutoffs

- **PHQ-9:** mild ≥ 5, moderate ≥ 10, moderately severe ≥ 15, severe ≥ 20.
- **GAD-7:** mild ≥ 5, moderate ≥ 10, severe ≥ 15.
- **PHQ-2 / GAD-2:** routing cutoff = 3.

## End-to-end flow

1. Landing → safety disclosure (must acknowledge).
2. Discovery (4 items, one screen, 0–3 frequency). Continue / Stop.
3. Selector resolves blocks from `indicators.en.json`.
4. Main quiz runs the resolved blocks; each item has a collapsible "Add a note (optional)".
5. `lib/engine/score.ts` runs locally on submit and produces deterministic facts.
6. If `phq9_9 ≥ 1` → crisis screen, optional "save anyway and analyze".
7. Server Action `/analyze` calls OpenRouter with deterministic facts + raw responses.
8. Retry / fallback chain: primary → gemma-4-31b → gemma-4-26b → deterministic-only render.
9. On any successful narrative: Zod-validate, then server-side enforce safety flags + crisis-line summary prefix if `phq9_9 ≥ 1`.
10. Final result merged and written to `localStorage` latest slot.
11. Result page renders. User can Download as PDF or retake. `noindex` on the result page.

## Result-page attribution line (locked)

> *PHQ-9 © Pfizer Inc., reproduced under their public-use statement. GAD-7 developed by Drs. Spitzer, Williams, Kroenke, and colleagues.*

Also captured verbatim in `ATTRIBUTIONS.md`.

## Out of scope for v1

- Public production domain (dev/preview only).
- Analytics / telemetry of any kind.
- Non-English locales (structure ready for `indicators.<locale>.json`).
- Region detection / per-country crisis routing (deferred to v1.x).
- Accounts, login, cross-device sync, longitudinal tracking.
- In-app cost tracking, per-user spend caps, rate limiting (acceptable while there is no public domain).
- Bespoke a11y audit beyond shadcn + Base UI defaults.
- Gameability / lie-detection scoring.
