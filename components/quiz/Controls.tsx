"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Controls(props: {
	canBack: boolean;
	canContinue: boolean;
	onBack?: () => void;
	onContinue?: () => void | Promise<void>;
	onStop?: () => void;
	continueLabel?: string;
}) {
	const router = useRouter();
	const stop = props.onStop ?? (() => router.push("/"));
	return (
		<div className="sticky bottom-0 left-0 right-0 -mx-4 mt-8 flex items-center justify-between gap-2 border-t border-border bg-background/85 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
			{props.canBack ? (
				<Button variant="ghost" size="lg" onClick={props.onBack}>
					Back
				</Button>
			) : (
				<Button variant="ghost" size="lg" onClick={stop}>
					Stop
				</Button>
			)}
			<Button
				variant="default"
				size="lg"
				disabled={!props.canContinue}
				onClick={() => void props.onContinue?.()}
			>
				{props.continueLabel ?? "Continue"}
			</Button>
		</div>
	);
}
