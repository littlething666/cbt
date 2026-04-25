"use client";

import { useEffect, useState } from "react";

const PHASES = [
	"Reading your responses…",
	"Looking at patterns…",
	"Drafting your reflection…",
] as const;

const PHASE_INTERVAL_MS = 3500;
const SLOW_THRESHOLD_MS = 15000;

export function AnalyzingScreen() {
	const [phase, setPhase] = useState(0);
	const [slow, setSlow] = useState(false);

	useEffect(() => {
		const cycle = window.setInterval(() => {
			setPhase((p) => (p + 1) % PHASES.length);
		}, PHASE_INTERVAL_MS);
		const slowTimer = window.setTimeout(
			() => setSlow(true),
			SLOW_THRESHOLD_MS,
		);
		return () => {
			window.clearInterval(cycle);
			window.clearTimeout(slowTimer);
		};
	}, []);

	return (
		<div
			role="status"
			aria-live="polite"
			className="flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center"
		>
			<span
				aria-hidden="true"
				className="block h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
			/>
			<div className="space-y-2">
				<p className="text-lg font-semibold">{PHASES[phase]}</p>
				<p className="mx-auto max-w-sm text-sm text-muted-foreground">
					{slow
						? "Taking a little longer than usual — almost there."
						: "Your scores are ready. Drafting a personalized narrative now."}
				</p>
			</div>
			<div
				className="w-full max-w-sm space-y-3"
				aria-hidden="true"
			>
				<div className="h-3 w-full animate-pulse rounded-md bg-muted" />
				<div className="h-3 w-5/6 animate-pulse rounded-md bg-muted" />
				<div className="h-3 w-4/6 animate-pulse rounded-md bg-muted" />
			</div>
		</div>
	);
}
