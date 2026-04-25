"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function FreeTextItem(props: {
	id: string;
	value: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onChange: (v: string) => void;
}) {
	return (
		<Collapsible
			open={props.open}
			onOpenChange={props.onOpenChange}
			className="text-sm"
		>
			<CollapsibleTrigger className="text-muted-foreground underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none">
				{props.open ? "Hide note" : "Add a note (optional)"}
			</CollapsibleTrigger>
			<CollapsibleContent className="pt-2">
				<textarea
					id={`note-${props.id}`}
					rows={3}
					value={props.value}
					onChange={(e) => props.onChange(e.target.value)}
					placeholder="In your own words…"
					className="w-full resize-y rounded-md border border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
				/>
			</CollapsibleContent>
		</Collapsible>
	);
}
