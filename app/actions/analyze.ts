"use server";

import { callOpenRouter } from "@/lib/analyst/openrouter";
import { applySafetyBackstop } from "@/lib/engine/safety";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/analyst/prompts";
import type { Result } from "@/lib/storage/latestSlot";
import type { IndicatorsConfig } from "@/lib/engine/types";

import { score } from "@/lib/engine/score";
import rawIndicators from "@/resources/indicators.en.json";

const indicators = rawIndicators as IndicatorsConfig;

export async function analyze(args: {
	answers: Record<string, number>;
	notes: Record<string, string>;
}): Promise<Result> {
	const facts = score(args.answers, indicators);
	const system = buildSystemPrompt();
	const user = buildUserPrompt({
		facts,
		answers: args.answers,
		notes: args.notes,
	});
	const narrative = await callOpenRouter({ system, user });
	return applySafetyBackstop(facts, narrative);
}
