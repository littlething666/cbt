"use client";

import { useEffect, useState } from "react";
import { loadLatestSlot, type Result } from "@/lib/storage/latestSlot";
import { ResultView } from "@/components/result/ResultView";

export function ResultPageClient() {
	const [result, setResult] = useState<Result | null>(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setResult(loadLatestSlot());
		setLoaded(true);
	}, []);

	if (!loaded) return null;

	if (!result) {
		return (
			<div className="space-y-2">
				<h1 className="text-xl font-semibold">No result yet</h1>
				<p className="text-sm opacity-80">Take the quiz first.</p>
			</div>
		);
	}

	return <ResultView result={result} />;
}
