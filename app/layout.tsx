import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
		<html lang="en" className={cn("font-sans", inter.variable)}>
			<body className="min-h-screen antialiased">
				<main className="mx-auto max-w-2xl px-4 py-10">{children}</main>
			</body>
		</html>
	);
}
