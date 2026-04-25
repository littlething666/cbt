import type { ReactNode } from "react";

export const runtime = "edge";

export default function QuizLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
