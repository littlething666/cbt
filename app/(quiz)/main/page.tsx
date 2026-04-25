"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import indicators from "@/resources/indicators.en.json";
import { LikertItem } from "@/components/quiz/LikertItem";
import { Controls } from "@/components/quiz/Controls";
import { score } from "@/lib/engine/score";
import { isCrisis } from "@/lib/engine/safety";
import { CrisisScreen } from "@/components/safety/CrisisScreen";
import { analyze } from "@/app/actions/analyze";
import { saveLatestSlot } from "@/lib/storage/latestSlot";

type MainItem = { id: string; prompt: string; safety?: boolean; distortion?: string };
type Block = { label: string; scale: "frequency" | "agreement"; items: MainItem[] };

export default function MainQuizPage() {
	const router = useRouter();
	const [discovery, setDiscovery] = useState<{ answers: Record<string, number>; notes: Record<string, string>; blocks: string[] } | null>(null);
	const [answers, setAnswers] = useState<Record<string, number>>({});
	const [notes, setNotes] = useState<Record<string, string>>({});
	const [crisis, setCrisis] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const raw = sessionStorage.getItem("cbt:discovery");
		if (!raw) {
			router.push("/discovery");
			return;
		}
		setDiscovery(JSON.parse(raw));
	}, [router]);

	if (!discovery) return null;

	const blocks: Array<[string, Block]> = discovery.blocks
		.map((key) => [key, (indicators.blocks as Record<string, Block>)[key]])
		.filter((entry): entry is [string, Block] => Boolean(entry[1]));

	const allItems: MainItem[] = blocks.flatMap(([, b]) => b.items);
	const allAnswered = allItems.every((it) => typeof answers[it.id] === "number");

	async function onContinue() {
		const combined = { ...discovery!.answers, ...answers };
		const combinedNotes = { ...discovery!.notes, ...notes };
		const facts = score(combined, indicators);
		if (isCrisis(facts) && !crisis) {
			setCrisis(true);
			return;
		}
		setSubmitting(true);
		const final = await analyze({ facts, answers: combined, notes: combinedNotes });
		saveLatestSlot(final);
		router.push("/result");
	}

	if (crisis) {
		return (
			<CrisisScreen
				onProceed={() => {
					setCrisis(false);
					void onContinue();
				}}
				onStop={() => router.push("/")}
			/>
		);
	}

	return (
		<div className="space-y-8">
			{blocks.map(([key, block]) => (
				<section key={key} className="space-y-4">
					<h2 className="text-lg font-semibold">{block.label}</h2>
					<p className="text-sm opacity-70">
						{block.scale === "frequency"
							? "Over the last 2 weeks, how often have you been bothered by…"
							: "How much do you agree with this thought right now?"}
					</p>
					<ol className="space-y-4">
						{block.items.map((it) => (
							<li key={it.id}>
								<LikertItem
									id={it.id}
									prompt={it.prompt}
									scale={block.scale}
									value={answers[it.id]}
									note={notes[it.id] ?? ""}
									onValueChange={(v) => setAnswers((s) => ({ ...s, [it.id]: v }))}
									onNoteChange={(n) => setNotes((s) => ({ ...s, [it.id]: n }))}
								/>
							</li>
						))}
					</ol>
				</section>
			))}
			<Controls disabled={!allAnswered || submitting} onContinue={onContinue} />
		</div>
	);
}
