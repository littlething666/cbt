"use client";

import crisis from "@/resources/crisis-resources.en.json";

export function CrisisScreen(props: { onProceed: () => void; onStop: () => void }) {
	return (
		<div className="space-y-5">
			<header className="space-y-2">
				<h1 className="text-xl font-semibold">We noticed something important</h1>
				<p className="text-sm opacity-90">
					Based on your answer, we want to make sure you have crisis resources right now
					before showing any results.
				</p>
			</header>
			<div className="rounded-md border border-red-500/40 bg-red-500/5 p-4 text-sm space-y-2">
				<p>{crisis.message}</p>
				<p>
					<a href={crisis.findHelpUrl} className="underline" target="_blank" rel="noopener noreferrer">
						{crisis.findHelpUrl}
					</a>{" "}
					has a directory of free crisis lines worldwide.
				</p>
			</div>
			<div className="flex justify-between gap-3">
				<button
					type="button"
					onClick={props.onStop}
					className="rounded-md border border-black/15 dark:border-white/15 px-4 py-2 text-sm"
				>
					Back to start
				</button>
				<button
					type="button"
					onClick={props.onProceed}
					className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
				>
					Save anyway and analyze
				</button>
			</div>
		</div>
	);
}
