import type { Metadata } from "next";
import { ResultPageClient } from "@/components/result/ResultPageClient";

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false,
	},
};

export default function ResultPage() {
	return <ResultPageClient />;
}
