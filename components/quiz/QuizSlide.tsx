"use client";

import { LikertItem } from "./LikertItem";

export type Slide = {
	id: string;
	prompt: string;
	scale: "frequency" | "agreement";
	blockKey: string;
	blockLabel: string;
	stem: string;
};

export function QuizSlide(props: {
	slide: Slide;
	value: number | undefined;
	note: string;
	noteOpen: boolean;
	onValueChange: (v: number) => void;
	onNoteChange: (n: string) => void;
	onNoteOpenChange: (open: boolean) => void;
}) {
	const { slide } = props;
	return (
		<section className="space-y-6" aria-labelledby={`prompt-${slide.id}`}>
			<header className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
					{slide.blockLabel}
				</p>
				<p className="text-sm text-muted-foreground">{slide.stem}</p>
				<h2
					id={`prompt-${slide.id}`}
					className="text-xl font-semibold leading-snug sm:text-2xl"
				>
					{slide.prompt}
				</h2>
			</header>
			<LikertItem
				id={slide.id}
				scale={slide.scale}
				value={props.value}
				note={props.note}
				noteOpen={props.noteOpen}
				onValueChange={props.onValueChange}
				onNoteChange={props.onNoteChange}
				onNoteOpenChange={props.onNoteOpenChange}
			/>
		</section>
	);
}
