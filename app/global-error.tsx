"use client";

export const dynamic = "force-dynamic";

type GlobalErrorProps = {
	error: Error & { digest?: string };
	reset?: () => void;
	unstable_retry?: () => void;
};

export default function GlobalError({ error, reset, unstable_retry }: GlobalErrorProps) {
	const retry = reset ?? unstable_retry ?? (() => {});

	return (
		<html lang="en">
			<body>
				<main>
					<h1>Something went wrong</h1>
					<p>An unexpected error occurred.</p>
					<p>{error.message}</p>
					<button type="button" onClick={retry}>
						Try again
					</button>
					<a href="/">Back to home</a>
				</main>
			</body>
		</html>
	);
}
