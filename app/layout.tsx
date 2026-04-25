import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "CBT Quiz",
	description:
		"A short, CBT-informed self-check. Not a medical diagnosis.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-h-screen antialiased">
				<main className="mx-auto max-w-2xl px-4 py-10">{children}</main>
			</body>
		</html>
	);
}
