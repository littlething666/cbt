import crisis from "@/resources/crisis-resources.en.json";

export function Disclosure() {
	return (
		<aside className="rounded-md border border-amber-500/40 bg-amber-500/5 p-4 text-sm space-y-2">
			<p className="font-medium">This is not a clinical diagnosis.</p>
			<p className="opacity-90">{crisis.message}</p>
			<p>
				If you are in crisis, contact your local emergency services or visit{" "}
				<a href={crisis.findHelpUrl} className="underline" target="_blank" rel="noopener noreferrer">
					{crisis.findHelpUrl}
				</a>
				.
			</p>
		</aside>
	);
}
