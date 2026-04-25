import { z } from "zod";

export const DistortionEnum = z.enum([
	"all_or_nothing",
	"catastrophizing",
	"overgeneralization",
	"mental_filter",
	"disqualifying_positive",
	"jumping_to_conclusions",
	"magnification_minimization",
	"emotional_reasoning",
	"should_statements",
	"personalization",
]);

export const NarrativeSchema = z.object({
	summary: z.string().max(800),
	blockEvidence: z
		.array(
			z.object({
				block: z.enum(["depression", "anxiety"]),
				evidence: z.array(z.string()).max(5),
			}),
		)
		.default([]),
	distortionEvidence: z
		.array(
			z.object({
				distortion: DistortionEnum,
				evidence: z.array(z.string()).max(3),
			}),
		)
		.default([]),
	reframes: z
		.array(z.object({ original: z.string(), reframe: z.string() }))
		.max(5)
		.default([]),
	suggestedNextSteps: z.array(z.string()).max(5).default([]),
});

export type Narrative = z.infer<typeof NarrativeSchema>;

// Equivalent JSON schema for OpenRouter response_format.
export const NARRATIVE_JSON_SCHEMA = {
	name: "cbt_quiz_narrative",
	strict: true,
	schema: {
		type: "object",
		additionalProperties: false,
		required: ["summary", "blockEvidence", "distortionEvidence", "reframes", "suggestedNextSteps"],
		properties: {
			summary: { type: "string", maxLength: 800 },
			blockEvidence: {
				type: "array",
				items: {
					type: "object",
					additionalProperties: false,
					required: ["block", "evidence"],
					properties: {
						block: { type: "string", enum: ["depression", "anxiety"] },
						evidence: { type: "array", items: { type: "string" }, maxItems: 5 },
					},
				},
			},
			distortionEvidence: {
				type: "array",
				items: {
					type: "object",
					additionalProperties: false,
					required: ["distortion", "evidence"],
					properties: {
						distortion: {
							type: "string",
							enum: [
								"all_or_nothing",
								"catastrophizing",
								"overgeneralization",
								"mental_filter",
								"disqualifying_positive",
								"jumping_to_conclusions",
								"magnification_minimization",
								"emotional_reasoning",
								"should_statements",
								"personalization",
							],
						},
						evidence: { type: "array", items: { type: "string" }, maxItems: 3 },
					},
				},
			},
			reframes: {
				type: "array",
				maxItems: 5,
				items: {
					type: "object",
					additionalProperties: false,
					required: ["original", "reframe"],
					properties: {
						original: { type: "string" },
						reframe: { type: "string" },
					},
				},
			},
			suggestedNextSteps: { type: "array", maxItems: 5, items: { type: "string" } },
		},
	},
} as const;
