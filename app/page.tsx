import Link from "next/link";
import { Disclosure } from "@/components/safety/Disclosure";

export default function LandingPage() {
	return (
		<div className="space-y-6">
			<header className="space-y-2">
				<h1 className="text-2xl font-semibold">CBT Quiz</h1>
				<p className="text-sm opacity-80">
					A short self-check that uses standard CBT screens (PHQ-9, GAD-7) and a 10-category
					cognitive-distortion inventory. ~5–10 minutes. Your responses stay in your browser.
				</p>
			</header>
			<Disclosure />
			<div className="flex gap-3">
				<Link
					href="/discovery"
					className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
				>
					Start
				</Link>
			</div>
		</div>
	);
}
