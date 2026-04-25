// Deterministic scoring — never delegated to the LLM.

import type { IndicatorsConfig } from "./types";

export type Severity =
	| "none"
	| "mild"
	| "moderate"
	| "moderately_severe"
	| "severe";

export type DistortionStrength = "low" | "moderate" | "high";

export type SafetyFlag = "suicidality" | "self_harm" | "crisis_referral_recommended";

export type DeterministicFacts = {
	indicatorsVersion: string;
	scores: { phq9?: number; gad7?: number };
	severities: { depression?: Severity; anxiety?: Severity };
	distortionStrengths: Record<string, DistortionStrength>;
	phq9_9_raw: number; // 0..3, used by safety backstop
	safetyFlags: SafetyFlag[];
};

function phq9Severity(total: number): Severity {
	if (total >= 20) return "severe";
	if (total >= 15) return "moderately_severe";
	if (total >= 10) return "moderate";
	if (total >= 5) return "mild";
	return "none";
}

function gad7Severity(total: number): Severity {
	if (total >= 15) return "severe";
	if (total >= 10) return "moderate";
	if (total >= 5) return "mild";
	return "none";
}

function sumBlock(answers: Record<string, number>, ids: string[]): number | undefined {
	let hasAny = false;
	let total = 0;
	for (const id of ids) {
		const v = answers[id];
		if (typeof v === "number") {
			hasAny = true;
			total += v;
		}
	}
	return hasAny ? total : undefined;
}

export function score(
	answers: Record<string, number>,
	indicators: IndicatorsConfig,
): DeterministicFacts {
	const phq9Items = indicators.blocks.depression?.items.map((it) => it.id) ?? [];
	const gad7Items = indicators.blocks.anxiety?.items.map((it) => it.id) ?? [];
	const phq9 = phq9Items.length ? sumBlock(answers, phq9Items) : undefined;
	const gad7 = gad7Items.length ? sumBlock(answers, gad7Items) : undefined;

	const severities: { depression?: Severity; anxiety?: Severity } = {};
	if (typeof phq9 === "number") severities.depression = phq9Severity(phq9);
	if (typeof gad7 === "number") severities.anxiety = gad7Severity(gad7);

	// Distortion strength = mean of the 2 stems per distortion.
	const distortionItems = indicators.blocks.distortions?.items ?? [];
	const byDistortion = new Map<string, number[]>();
	for (const it of distortionItems) {
		if (!it.distortion) continue;
		const v = answers[it.id];
		if (typeof v !== "number") continue;
		const arr = byDistortion.get(it.distortion) ?? [];
		arr.push(v);
		byDistortion.set(it.distortion, arr);
	}
	const distortionStrengths: Record<string, DistortionStrength> = {};
	for (const [k, vs] of byDistortion) {
		const mean = vs.reduce((a, b) => a + b, 0) / vs.length;
		distortionStrengths[k] = mean >= 3.5 ? "high" : mean > 2.5 ? "moderate" : "low";
	}

	const phq9_9_raw = answers.phq9_9 ?? 0;

	return {
		indicatorsVersion: indicators.version,
		scores: { phq9, gad7 },
		severities,
		distortionStrengths,
		phq9_9_raw,
		safetyFlags: [], // populated by safety backstop after analyze
	};
}
