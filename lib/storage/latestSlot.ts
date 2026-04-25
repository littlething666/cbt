import type { DistortionStrength, SafetyFlag, Severity } from "@/lib/engine/score";
import type { Narrative } from "@/lib/analyst/schema";

const KEY = "cbt:result:latest";

export type Result = {
	indicatorsVersion: string;
	analyzedAt: string;
	scores: { phq9?: number; gad7?: number };
	severities: { depression?: Severity; anxiety?: Severity };
	distortionStrengths: Record<string, DistortionStrength>;
	safetyFlags: SafetyFlag[];
	narrative: Narrative | null;
};

export function saveLatestSlot(result: Result): void {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY, JSON.stringify(result));
}

export function loadLatestSlot(): Result | null {
	if (typeof window === "undefined") return null;
	const raw = window.localStorage.getItem(KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as Result;
	} catch {
		return null;
	}
}
