"use client";

import { pdf } from "@react-pdf/renderer";
import { ResultPDF } from "./ResultPDF";
import type { Result } from "@/lib/storage/latestSlot";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function ResultView({ result }: { result: Result }) {
	async function downloadPdf() {
		const blob = await pdf(<ResultPDF result={result} />).toBlob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `cbt-quiz-${result.analyzedAt}.pdf`;
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="space-y-6">
			<header className="flex items-center justify-between gap-3">
				<h1 className="text-xl font-semibold">Your result</h1>
				<button
					type="button"
					onClick={downloadPdf}
					className="rounded-md border border-black/15 dark:border-white/15 px-3 py-1.5 text-xs"
				>
					Download as PDF
				</button>
			</header>

			{result.safetyFlags.length > 0 ? (
				<aside className="rounded-md border border-red-500/40 bg-red-500/5 p-3 text-sm">
					If you are thinking about suicide or self-harm, please reach a crisis line now —{" "}
					<a href="https://findahelpline.com" className="underline" target="_blank" rel="noopener noreferrer">
						findahelpline.com
					</a>
					.
				</aside>
			) : null}

			{result.narrative ? (
				<section className="space-y-2">
					<h2 className="font-medium">Summary</h2>
					<p className="text-sm whitespace-pre-line">{result.narrative.summary}</p>
				</section>
			) : (
				<section className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
					We couldn’t generate the personalized narrative right now — your scored results are below.
				</section>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Scores</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="text-sm space-y-1">
						{result.scores.phq9 != null ? (
							<li>
								PHQ-9: <span className="font-medium">{result.scores.phq9}</span> (
								{result.severities.depression})
							</li>
						) : null}
						{result.scores.gad7 != null ? (
							<li>
								GAD-7: <span className="font-medium">{result.scores.gad7}</span> (
								{result.severities.anxiety})
							</li>
						) : null}
					</ul>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Cognitive distortion strengths</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="text-sm space-y-1">
						{Object.entries(result.distortionStrengths).map(([k, v]) => (
							<li key={k}>
								{k}: <span className="font-medium">{v}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<footer className="text-[11px] opacity-60">
				PHQ-9 © Pfizer Inc., reproduced under their public-use statement. GAD-7 developed by
				Drs. Spitzer, Williams, Kroenke, and colleagues.
			</footer>
		</div>
	);
}
