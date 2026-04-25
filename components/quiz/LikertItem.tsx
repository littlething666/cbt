"use client";

import { FreeTextItem } from "./FreeTextItem";

const FREQUENCY = [
	{ value: 0, label: "Not at all" },
	{ value: 1, label: "Several days" },
	{ value: 2, label: "More than half the days" },
	{ value: 3, label: "Nearly every day" },
] as const;

const AGREEMENT = [
	{ value: 1, label: "Strongly disagree" },
	{ value: 2, label: "Disagree" },
	{ value: 3, label: "Neither agree nor disagree" },
	{ value: 4, label: "Agree" },
	{ value: 5, label: "Strongly agree" },
] as const;

export function LikertItem(props: {
	id: string;
	prompt: string;
	scale: "frequency" | "agreement";
	value: number | undefined;
	note: string;
	onValueChange: (v: number) => void;
	onNoteChange: (n: string) => void;
}) {
	const options = props.scale === "frequency" ? FREQUENCY : AGREEMENT;
	return (
		<div className="rounded-md border border-black/10 dark:border-white/10 p-4 space-y-3">
			<p className="text-sm">{props.prompt}</p>
			<div className="flex flex-wrap gap-2">
				{options.map((opt) => {
					const selected = props.value === opt.value;
					return (
						<button
							key={opt.value}
							type="button"
							onClick={() => props.onValueChange(opt.value)}
							aria-pressed={selected}
							className={
								"rounded-md border px-3 py-1.5 text-xs " +
								(selected
									? "border-foreground bg-foreground text-background"
									: "border-black/15 dark:border-white/15")
							}
						>
							<span className="font-medium">{opt.value}</span>
							<span className="ml-1.5 opacity-80">{opt.label}</span>
						</button>
					);
				})}
			</div>
			<FreeTextItem id={props.id} value={props.note} onChange={props.onNoteChange} />
		</div>
	);
}
