import type { DeterministicFacts } from "@/lib/engine/score";

export function buildSystemPrompt(): string {
	return [
		"You are a CBT-informed self-reflection narrator. You are NOT a clinician and you do NOT diagnose.",
		"",
		"You will receive ALREADY-COMPUTED facts (scores, severity buckets, distortion strengths,",
		"safety status) and the user's verbatim free-text notes. You MUST treat the computed facts as",
		"ground truth. Do NOT recompute scores, do NOT change severity labels, do NOT alter safety status.",
		"",
		"Your job is narrative only:",
		"1. summary: plain, compassionate, non-clinical English. Echo the computed severities in words.",
		"   <= 800 chars. If safetyStatus.flagged === true, the FIRST line MUST be a crisis-acknowledgement",
		"   pointing the user to local emergency services and findahelpline.com.",
		"2. blockEvidence: up to 5 short verbatim or paraphrased excerpts per block that support the",
		"   computed severity.",
		"3. distortionEvidence: for each computed high/moderate distortion, up to 3 short evidence excerpts",
		"   from the user's notes or high-agreement items.",
		"4. reframes: up to 5 balanced alternative thoughts for the user's most distorted items. A reframe",
		"   is an alternative thought, not advice.",
		"5. suggestedNextSteps: up to 5 small concrete CBT-aligned next steps (e.g. behavioral activation,",
		"   thought record, 4-7-8 breathing, talking to a GP). Never recommend specific medications.",
		"",
		"Hard rules:",
		"- Do not diagnose. Do not name DSM disorders.",
		"- Do not produce content outside the provided JSON schema.",
		"- Use second person (\"you\"), warm and direct, no clinical jargon.",
		"- Never contradict the computed facts.",
	].join("\n");
}

export function buildUserPrompt(args: {
	facts: DeterministicFacts;
	answers: Record<string, number>;
	notes: Record<string, string>;
}): string {
	const { facts, answers, notes } = args;
	const payload = {
		computedFacts: {
			scores: facts.scores,
			severities: facts.severities,
			distortionStrengths: facts.distortionStrengths,
			safetyStatus: { flagged: facts.phq9_9_raw >= 1, phq9_9_raw: facts.phq9_9_raw },
		},
		answers,
		notes: Object.fromEntries(
			Object.entries(notes).filter(([, v]) => typeof v === "string" && v.trim().length > 0),
		),
	};
	return [
		"COMPUTED FACTS (treat as ground truth, do not recompute):",
		JSON.stringify(payload, null, 2),
		"",
		"Return ONLY the JSON object matching cbt_quiz_narrative.",
	].join("\n");
}
