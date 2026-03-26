"use client";

import { useMemo } from "react";
import Script from "next/script";

export interface BuzzsproutPlayerProps {
	/** The full script src URL from content.rendered */
	scriptSrc: string;
	/** The div container id used by Buzzsprout, e.g. buzzsprout-player-16987733 */
	containerId: string;
}

function safeId(id: string): string {
	return id.replace(/[^a-zA-Z0-9_-]/g, "");
}

export default function BuzzsproutPlayer({
	scriptSrc,
	containerId,
}: BuzzsproutPlayerProps) {
	const normalizedId = useMemo(() => safeId(containerId), [containerId]);

	return (
		<>
			{/* Must exist before the Buzzsprout script runs */}
			<div id={normalizedId} />
			{/* Use next/script so it reliably executes on route changes */}
			<Script
				// key forces re-run if navigating between different episodes
				key={scriptSrc}
				src={scriptSrc}
				strategy="afterInteractive"
			/>
		</>
	);
}
