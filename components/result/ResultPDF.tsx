import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Result } from "@/lib/storage/latestSlot";

const styles = StyleSheet.create({
	page: { padding: 40, fontSize: 11, lineHeight: 1.5, fontFamily: "Helvetica" },
	heading: { fontSize: 16, fontWeight: 700, marginBottom: 12 },
	subheading: { fontSize: 12, fontWeight: 700, marginTop: 16, marginBottom: 6 },
	line: { marginBottom: 4 },
	crisis: { color: "#b91c1c", marginBottom: 12 },
	footer: { marginTop: 24, fontSize: 9, color: "#6b7280" },
});

export function ResultPDF({ result }: { result: Result }) {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<Text style={styles.heading}>CBT Quiz — Result</Text>
				<Text style={styles.line}>Analyzed at: {result.analyzedAt}</Text>
				<Text style={styles.line}>Indicators version: {result.indicatorsVersion}</Text>

				{result.safetyFlags.length > 0 ? (
					<Text style={styles.crisis}>
						If you are thinking about suicide or self-harm, please reach a crisis line now —
						https://findahelpline.com.
					</Text>
				) : null}

				<Text style={styles.subheading}>Summary</Text>
				<Text style={styles.line}>
					{result.narrative?.summary ??
						"We couldn’t generate the personalized narrative for this attempt. Your scored results are below."}
				</Text>

				<Text style={styles.subheading}>Scores</Text>
				{result.scores.phq9 != null ? (
					<Text style={styles.line}>
						PHQ-9: {result.scores.phq9} ({result.severities.depression})
					</Text>
				) : null}
				{result.scores.gad7 != null ? (
					<Text style={styles.line}>
						GAD-7: {result.scores.gad7} ({result.severities.anxiety})
					</Text>
				) : null}

				<Text style={styles.subheading}>Cognitive distortion strengths</Text>
				{Object.entries(result.distortionStrengths).map(([k, v]) => (
					<Text key={k} style={styles.line}>
						{k}: {v}
					</Text>
				))}

				<View style={styles.footer}>
					<Text>
						PHQ-9 © Pfizer Inc., reproduced under their public-use statement. GAD-7 developed by
						Drs. Spitzer, Williams, Kroenke, and colleagues. This is a self-reflection tool, not a
						clinical diagnosis.
					</Text>
				</View>
			</Page>
		</Document>
	);
}
