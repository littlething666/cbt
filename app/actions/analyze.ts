"use server";

import type { DeterministicFacts } from "@/lib/engine/score";
import { callOpenRouter } from "@/lib/analyst/openrouter";
import { applySafetyBackstop } from "@/lib/engine/safety";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/analyst/prompts";
import type { Result } from "@/lib/storage/latestSlot";

export async function analyze(args: {
	facts: DeterministicFacts;
	answers: Record<string, number>;
	notes: Record<string, string>;
}): Promise<Result> {
	const system = buildSystemPrompt();
	const user = buildUserPrompt(args);
	const narrative = await callOpenRouter({ system, user });
	return applySafetyBackstop(args.facts, narrative);
}
