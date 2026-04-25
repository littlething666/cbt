"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import indicators from "@/resources/indicators.en.json";
import { LikertItem } from "@/components/quiz/LikertItem";
import { Controls } from "@/components/quiz/Controls";
import { selectBlocks } from "@/lib/engine/selectBlocks";

type DiscoveryItem = { id: string; prompt: string; scale: "frequency" | "agreement"; routes: string[] };

export default function DiscoveryPage() {
	const router = useRouter();
	const items = (indicators.discovery as DiscoveryItem[]) ?? [];
	const [answers, setAnswers] = useState<Record<string, number>>({});
	const [notes, setNotes] = useState<Record<string, string>>({});

	const allAnswered = items.every((it) => typeof answers[it.id] === "number");

	function onContinue() {
		const blocks = selectBlocks(answers);
		sessionStorage.setItem(
			"cbt:discovery",
			JSON.stringify({ answers, notes, blocks }),
		);
		if (blocks.length === 0) {
			router.push("/result?empty=1");
		} else {
			router.push("/main");
		}
	}

	return (
		<div className="space-y-6">
			<header className="space-y-1">
				<h1 className="text-xl font-semibold">Discovery</h1>
				<p className="text-sm opacity-80">
					Over the last 2 weeks, how often have you been bothered by…
				</p>
			</header>
			<ol className="space-y-4">
				{items.map((it) => (
					<li key={it.id}>
						<LikertItem
							id={it.id}
							prompt={it.prompt}
							scale={it.scale}
							value={answers[it.id]}
							note={notes[it.id] ?? ""}
							onValueChange={(v) => setAnswers((s) => ({ ...s, [it.id]: v }))}
							onNoteChange={(n) => setNotes((s) => ({ ...s, [it.id]: n }))}
						/>
					</li>
				))}
			</ol>
			<Controls disabled={!allAnswered} onContinue={onContinue} />
		</div>
	);
}
