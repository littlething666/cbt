// PHQ-2 / GAD-2 routing — both use the standard cutoff of 3.
export function selectBlocks(answers: Record<string, number>): string[] {
	const d = (answers.phq2_1 ?? 0) + (answers.phq2_2 ?? 0);
	const a = (answers.gad2_1 ?? 0) + (answers.gad2_2 ?? 0);
	const blocks: string[] = [];
	if (d >= 3) blocks.push("depression");
	if (a >= 3) blocks.push("anxiety");
	if (blocks.length > 0) blocks.push("distortions");
	return blocks;
}
