// Deterministic safety backstop — never delegated to the LLM.

import type { DeterministicFacts, SafetyFlag } from "./score";
import type { Narrative } from "@/lib/analyst/schema";
import type { Result } from "@/lib/storage/latestSlot";

const CRISIS_LINE =
	"If you are thinking about suicide or self-harm, please reach out for help right now — contact your local emergency services or visit https://findahelpline.com. ";

export function isCrisis(facts: DeterministicFacts): boolean {
	return facts.phq9_9_raw >= 1;
}

export function applySafetyBackstop(
	facts: DeterministicFacts,
	narrative: Narrative | null,
): Result {
	const flagged = isCrisis(facts);
	const safetyFlags: SafetyFlag[] = flagged
		? ["suicidality", "crisis_referral_recommended"]
		: [];

	let finalNarrative: Result["narrative"] = narrative;
	if (narrative && flagged && !narrative.summary.startsWith(CRISIS_LINE.trimEnd())) {
		finalNarrative = {
			...narrative,
			summary: `${CRISIS_LINE}${narrative.summary}`,
		};
	}

	return {
		indicatorsVersion: facts.indicatorsVersion,
		analyzedAt: new Date().toISOString(),
		scores: facts.scores,
		severities: facts.severities,
		distortionStrengths: facts.distortionStrengths,
		safetyFlags,
		narrative: finalNarrative,
	};
}
