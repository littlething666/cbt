"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FreeTextItem } from "./FreeTextItem";
import { cn } from "@/lib/utils";

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
	scale: "frequency" | "agreement";
	value: number | undefined;
	note: string;
	noteOpen: boolean;
	onValueChange: (v: number) => void;
	onNoteChange: (n: string) => void;
	onNoteOpenChange: (open: boolean) => void;
}) {
	const options = props.scale === "frequency" ? FREQUENCY : AGREEMENT;
	const value = typeof props.value === "number" ? String(props.value) : "";

	return (
		<div className="space-y-4">
			<RadioGroup
				value={value}
				onValueChange={(v) => props.onValueChange(Number(v))}
				className="grid w-full gap-2"
				aria-label="Answer options"
			>
				{options.map((opt) => {
					const optionId = `${props.id}-${opt.value}`;
					return (
						<label
							key={opt.value}
							htmlFor={optionId}
							className={cn(
								"flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left text-base shadow-sm ring-1 ring-foreground/5 transition-colors",
								"hover:bg-muted",
								"has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary has-[[data-checked]]:text-primary-foreground has-[[data-checked]]:ring-primary/30",
							)}
						>
							<RadioGroupItem id={optionId} value={String(opt.value)} />
							<span className="flex-1 font-medium">{opt.label}</span>
							<span className="ml-auto text-xs opacity-60 tabular-nums">
								{opt.value}
							</span>
						</label>
					);
				})}
			</RadioGroup>
			<FreeTextItem
				id={props.id}
				value={props.note}
				open={props.noteOpen}
				onOpenChange={props.onNoteOpenChange}
				onChange={props.onNoteChange}
			/>
		</div>
	);
}
