// Single source of truth for which OpenRouter model the analyst uses.
// Change OPENROUTER_DEFAULT_MODEL in this one place to swap the primary.
export const OPENROUTER_DEFAULT_MODEL = "mistralai/mistral-small-2603";

// Tried in order if the primary fails (HTTP error, timeout, empty content,
// or Zod parse failure). After all of these fail we fall back to a
// deterministic-only render in the result page.
export const OPENROUTER_FALLBACK_MODELS = [
	"google/gemma-4-31b-it:free",
	"google/gemma-4-26b-a4b-it:free",
] as const;
