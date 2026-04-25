"use client";

import crisis from "@/resources/crisis-resources.en.json";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function CrisisScreen(props: { onProceed: () => void; onStop: () => void }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>We noticed something important</CardTitle>
				<CardDescription>
					Based on your answer, we want to make sure you have crisis resources right now before
					showing any results.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<p>{crisis.message}</p>
				<p>
					<a
						href={crisis.findHelpUrl}
						className="underline underline-offset-2"
						target="_blank"
						rel="noopener noreferrer"
					>
						{crisis.findHelpUrl}
					</a>{" "}
					has a directory of free crisis lines worldwide.
				</p>
			</CardContent>
			<CardFooter className="flex justify-between gap-3">
				<Button variant="outline" type="button" onClick={props.onStop}>
					Back to start
				</Button>
				<Button type="button" onClick={props.onProceed}>
					Save anyway and analyze
				</Button>
			</CardFooter>
		</Card>
	);
}
