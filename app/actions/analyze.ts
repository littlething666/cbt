"use server";

import type { DeterministicFacts } from "@/lib/engine/score";
import { callOpenRouter } from "@/lib/analyst/openrouter";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/analyst/prompts";
import type { Narrative } from "@/lib/analyst/schema";

export const runtime = "edge";

export async function analyze(args: {
	facts: DeterministicFacts;
	answers: Record<string, number>;
	notes: Record<string, string>;
}): Promise<Narrative | null> {
	const system = buildSystemPrompt();
	const user = buildUserPrompt(args);
	return callOpenRouter({ system, user });
}
