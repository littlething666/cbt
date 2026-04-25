"use client";

import { useRouter } from "next/navigation";

export function Controls(props: { disabled?: boolean; onContinue: () => void | Promise<void> }) {
	const router = useRouter();
	return (
		<div className="flex justify-between gap-3">
			<button
				type="button"
				onClick={() => router.push("/")}
				className="rounded-md border border-black/15 dark:border-white/15 px-4 py-2 text-sm"
			>
				Stop
			</button>
			<button
				type="button"
				disabled={props.disabled}
				onClick={() => void props.onContinue()}
				className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
			>
				Continue
			</button>
		</div>
	);
}
