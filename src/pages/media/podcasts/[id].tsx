"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { WpMediaPost } from "@/types/ibs-wp-media";
import {
	decodeWpEntities,
	stripHtmlTags,
	stripHtmlToExcerpt,
} from "@/lib/ibs-wp-utils";
import IbsPodcastPlayerScreen from "@/components/ibs-media/IbsPodcastPlayerScreen";

const WP_REST_BASE =
	process.env.NEXT_PUBLIC_IBS_WP_REST_BASE?.replace(/\/$/, "") ??
	"https://stg-newibsintelligence-ibsistgapr25.kinsta.cloud/wp-json/wp/v2";

function parseBuzzsproutEmbed(html: string): {
	scriptSrc?: string;
	containerId?: string;
} {
	// Example content:
	// <div id="buzzsprout-player-16987733"></div>
	// <script src="https://www.buzzsprout.com/...js?container_id=buzzsprout-player-16987733&player=small"></script>
	const containerMatch = html.match(/id="(buzzsprout-player-[^"]+)"/i);
	const scriptMatch = html.match(/<script[^>]+src="([^"]+buzzsprout[^"]+)"/i);
	return {
		containerId: containerMatch?.[1],
		scriptSrc: scriptMatch?.[1],
	};
}

export default function PodcastDetailPage() {
	const [podcastId, setPodcastId] = useState<string | undefined>(undefined);
	const [post, setPost] = useState<WpMediaPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		const parts = window.location.pathname.split("/").filter(Boolean);
		const last = parts[parts.length - 1];
		setPodcastId(last || undefined);
		return undefined;
	}, []);

	useEffect(() => {
		if (!podcastId) return undefined;

		let cancelled = false;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(`${WP_REST_BASE}/podcasts/${podcastId}`);
				if (!res.ok) throw new Error(`Request failed: ${res.status}`);
				const data = (await res.json()) as WpMediaPost;
				if (!cancelled) setPost(data);
			} catch (e) {
				if (!cancelled) {
					setError(e instanceof Error ? e.message : "Failed to load podcast");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [podcastId]);

	if (loading) {
		return (
			<Box
				sx={{
					minHeight: "100dvh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ minHeight: "100dvh", p: 2 }}>
				<Typography color="error">{error}</Typography>
			</Box>
		);
	}

	if (!post) return null;

	const rawTitle = stripHtmlTags(post.title.rendered);
	const title = decodeWpEntities(rawTitle);
	const description = stripHtmlToExcerpt(post.content.rendered, 2000);

	const { scriptSrc, containerId } = parseBuzzsproutEmbed(
		post.content.rendered,
	);

	if (!scriptSrc || !containerId) {
		return (
			<Box sx={{ minHeight: "100dvh", p: 2 }}>
				<Typography color="error">
					Buzzsprout embed not found in `content.rendered`.
				</Typography>
			</Box>
		);
	}

	return (
		<IbsPodcastPlayerScreen
			title={title}
			description={description}
			buzzsproutScriptSrc={scriptSrc}
			buzzsproutContainerId={containerId}
		/>
	);
}
