import { OPENROUTER_DEFAULT_MODEL, OPENROUTER_FALLBACK_MODELS } from "./models";
import { NARRATIVE_JSON_SCHEMA, NarrativeSchema, type Narrative } from "./schema";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

async function callModel(args: {
	model: string;
	system: string;
	user: string;
}): Promise<Narrative | null> {
	const apiKey = process.env.OPENROUTER_API_KEY;
	if (!apiKey) return null;

	const referer = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

	const res = await fetch(ENDPOINT, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"HTTP-Referer": referer,
			"X-Title": "CBT Quiz",
		},
		body: JSON.stringify({
			model: args.model,
			temperature: 0.2,
			response_format: { type: "json_schema", json_schema: NARRATIVE_JSON_SCHEMA },
			messages: [
				{ role: "system", content: args.system },
				{ role: "user", content: args.user },
			],
		}),
	});
	if (!res.ok) return null;
	const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
	const content = data.choices?.[0]?.message?.content;
	if (!content) return null;
	try {
		const parsed = JSON.parse(content);
		const valid = NarrativeSchema.safeParse(parsed);
		return valid.success ? valid.data : null;
	} catch {
		return null;
	}
}

export async function callOpenRouter(args: {
	system: string;
	user: string;
}): Promise<Narrative | null> {
	// Primary + 1 retry on the same model.
	for (let i = 0; i < 2; i++) {
		const result = await callModel({ model: OPENROUTER_DEFAULT_MODEL, ...args });
		if (result) return result;
	}
	// Fallbacks, single attempt each.
	for (const model of OPENROUTER_FALLBACK_MODELS) {
		const result = await callModel({ model, ...args });
		if (result) return result;
	}
	return null;
}
