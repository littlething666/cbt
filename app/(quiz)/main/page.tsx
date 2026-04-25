"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import indicators from "@/resources/indicators.en.json";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuizSlide, type Slide } from "@/components/quiz/QuizSlide";
import { Controls } from "@/components/quiz/Controls";
import { AnalyzingScreen } from "@/components/quiz/AnalyzingScreen";
import { score } from "@/lib/engine/score";
import { isCrisis } from "@/lib/engine/safety";
import { CrisisScreen } from "@/components/safety/CrisisScreen";
import { analyze } from "@/app/actions/analyze";
import { saveLatestSlot } from "@/lib/storage/latestSlot";

type MainItem = {
	id: string;
	prompt: string;
	safety?: boolean;
	distortion?: string;
};
type Block = {
	label: string;
	scale: "frequency" | "agreement";
	items: MainItem[];
};

type Discovery = {
	answers: Record<string, number>;
	notes: Record<string, string>;
	blocks: string[];
};

const FREQUENCY_STEM =
	"Over the last 2 weeks, how often have you been bothered by…";
const AGREEMENT_STEM = "How much do you agree with this thought right now?";

const AUTO_ADVANCE_DELAY_MS = 220;

export default function MainQuizPage() {
	const router = useRouter();
	const [discovery, setDiscovery] = useState<Discovery | null>(null);
	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, number>>({});
	const [notes, setNotes] = useState<Record<string, string>>({});
	const [noteOpen, setNoteOpen] = useState<Record<string, boolean>>({});
	const [crisis, setCrisis] = useState(false);
	const [analyzing, setAnalyzing] = useState(false);

	useEffect(() => {
		const raw = sessionStorage.getItem("cbt:discovery");
		if (!raw) {
			router.push("/discovery");
			return;
		}
		try {
			setDiscovery(JSON.parse(raw) as Discovery);
		} catch {
			router.push("/discovery");
		}
	}, [router]);

	const slides: Slide[] = useMemo(() => {
		if (!discovery) return [];
		const out: Slide[] = [];
		for (const key of discovery.blocks) {
			const block = (indicators.blocks as Record<string, Block>)[key];
			if (!block) continue;
			const stem =
				block.scale === "frequency" ? FREQUENCY_STEM : AGREEMENT_STEM;
			for (const it of block.items) {
				out.push({
					id: it.id,
					prompt: it.prompt,
					scale: block.scale,
					blockKey: key,
					blockLabel: block.label,
					stem,
				});
			}
		}
		return out;
	}, [discovery]);

	if (!discovery) return null;
	if (analyzing) return <AnalyzingScreen />;

	async function runAnalyze(currentDiscovery: Discovery) {
		const combined = { ...currentDiscovery.answers, ...answers };
		const combinedNotes = { ...currentDiscovery.notes, ...notes };
		const facts = score(combined, indicators);
		setAnalyzing(true);
		try {
			const final = await analyze({
				facts,
				answers: combined,
				notes: combinedNotes,
			});
			saveLatestSlot(final);
			router.push("/result");
		} catch {
			setAnalyzing(false);
		}
	}

	if (crisis) {
		return (
			<CrisisScreen
				onProceed={() => {
					setCrisis(false);
					void runAnalyze(discovery);
				}}
				onStop={() => router.push("/")}
			/>
		);
	}

	const current = slides[index];
	if (!current) return null;
	const value = answers[current.id];
	const note = notes[current.id] ?? "";
	const isOpen = !!noteOpen[current.id];
	const isLast = index === slides.length - 1;

	function back() {
		setIndex((i) => Math.max(0, i - 1));
	}

	async function onContinue() {
		if (!isLast) {
			setIndex((i) => i + 1);
			return;
		}
		const combined = { ...discovery!.answers, ...answers };
		const facts = score(combined, indicators);
		if (isCrisis(facts)) {
			setCrisis(true);
			return;
		}
		await runAnalyze(discovery!);
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
				onContinue={onContinue}
				continueLabel={isLast ? "See results" : "Next"}
			/>
		</div>
	);
}
