import { useEffect, useRef } from "react";

export type AutoAdvanceTimer = ReturnType<typeof setTimeout> | number | null;

export function useAutoAdvanceTimer() {
	const timer = useRef<AutoAdvanceTimer>(null);

	function clearAutoAdvanceTimer() {
		if (timer.current !== null) {
			clearTimeout(timer.current);
			timer.current = null;
		}
	}

	function scheduleAutoAdvance(callback: () => void, delayMs: number) {
		clearAutoAdvanceTimer();
		timer.current = window.setTimeout(() => {
			timer.current = null;
			callback();
		}, delayMs);
	}

	useEffect(() => {
		return () => {
			clearAutoAdvanceTimer();
		};
	}, []);

	return { scheduleAutoAdvance, clearAutoAdvanceTimer };
}
