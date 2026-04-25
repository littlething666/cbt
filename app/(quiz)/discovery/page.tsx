"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import indicators from "@/resources/indicators.en.json";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuizSlide, type Slide } from "@/components/quiz/QuizSlide";
import { Controls } from "@/components/quiz/Controls";
import { selectBlocks } from "@/lib/engine/selectBlocks";

type DiscoveryItem = {
	id: string;
	prompt: string;
	scale: "frequency" | "agreement";
	routes: string[];
};

const FREQUENCY_STEM =
	"Over the last 2 weeks, how often have you been bothered by…";
const AGREEMENT_STEM = "How much do you agree with this thought right now?";

const AUTO_ADVANCE_DELAY_MS = 220;

export default function DiscoveryPage() {
	const router = useRouter();

	const slides: Slide[] = useMemo(() => {
		const items = (indicators.discovery as DiscoveryItem[]) ?? [];
		return items.map((it) => ({
			id: it.id,
			prompt: it.prompt,
			scale: it.scale,
			blockKey: "discovery",
			blockLabel: "Discovery",
			stem: it.scale === "frequency" ? FREQUENCY_STEM : AGREEMENT_STEM,
		}));
	}, []);

	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, number>>({});
	const [notes, setNotes] = useState<Record<string, string>>({});
	const [noteOpen, setNoteOpen] = useState<Record<string, boolean>>({});

	if (slides.length === 0) return null;
	const current = slides[index];
	const value = answers[current.id];
	const note = notes[current.id] ?? "";
	const isOpen = !!noteOpen[current.id];
	const isLast = index === slides.length - 1;

	function finish(finalAnswers: Record<string, number>) {
		const blocks = selectBlocks(finalAnswers);
		sessionStorage.setItem(
			"cbt:discovery",
			JSON.stringify({ answers: finalAnswers, notes, blocks }),
		);
		if (blocks.length === 0) router.push("/result?empty=1");
		else router.push("/main");
	}

	function next() {
		if (isLast) finish(answers);
		else setIndex((i) => i + 1);
	}

	function back() {
		setIndex((i) => Math.max(0, i - 1));
	}

	function onValueChange(v: number) {
		setAnswers((s) => ({ ...s, [current.id]: v }));
		const noteHasContent = (notes[current.id] ?? "").length > 0;
		if (!isOpen && !noteHasContent && !isLast) {
			window.setTimeout(
				() => setIndex((i) => i + 1),
				AUTO_ADVANCE_DELAY_MS,
			);
		}
	}

	return (
		<div className="space-y-6">
			<QuizHeader currentIndex={index} total={slides.length} />
			<QuizSlide
				slide={current}
				value={value}
				note={note}
				noteOpen={isOpen}
				onValueChange={onValueChange}
				onNoteChange={(n) =>
					setNotes((s) => ({ ...s, [current.id]: n }))
				}
				onNoteOpenChange={(open) =>
					setNoteOpen((s) => ({ ...s, [current.id]: open }))
				}
			/>
			<Controls
				canBack={index > 0}
				canContinue={typeof value === "number"}
				onBack={back}
				onContinue={next}
				continueLabel={isLast ? "Finish discovery" : "Next"}
			/>
		</div>
	);
}
