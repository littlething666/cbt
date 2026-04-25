"use client";

import { Progress } from "@/components/ui/progress";

export function QuizHeader(props: { currentIndex: number; total: number }) {
	const total = Math.max(1, props.total);
	const percent = Math.round(((props.currentIndex + 1) / total) * 100);
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between text-xs font-medium tabular-nums text-muted-foreground">
				<span aria-live="polite">
					Question {props.currentIndex + 1} of {props.total}
				</span>
				<span>{percent}%</span>
			</div>
			<Progress value={percent} aria-label="Quiz progress" />
		</div>
	);
}
