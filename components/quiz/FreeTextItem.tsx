"use client";

import { useState } from "react";

export function FreeTextItem(props: {
	id: string;
	value: string;
	onChange: (v: string) => void;
}) {
	const [open, setOpen] = useState(props.value.length > 0);
	return (
		<div className="text-xs">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="opacity-70 underline-offset-2 hover:underline"
			>
				{open ? "Hide note" : "Add a note (optional)"}
			</button>
			{open ? (
				<textarea
					id={`note-${props.id}`}
					rows={2}
					value={props.value}
					onChange={(e) => props.onChange(e.target.value)}
					placeholder="In your own words…"
					className="mt-2 w-full resize-y rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1.5 text-xs"
				/>
			) : null}
		</div>
	);
}
