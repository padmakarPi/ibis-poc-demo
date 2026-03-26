"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import IbsVideoPlayerScreen from "@/components/ibs-media/IbsVideoPlayerScreen";
import type { WpMediaPost } from "@/types/ibs-wp-media";
import {
	decodeWpEntities,
	stripHtmlTags,
	stripHtmlToExcerpt,
} from "@/lib/ibs-wp-utils";

const WP_REST_BASE =
	process.env.NEXT_PUBLIC_IBS_WP_REST_BASE?.replace(/\/$/, "") ??
	"https://stg-newibsintelligence-ibsistgapr25.kinsta.cloud/wp-json/wp/v2";

function getVideoUrl(post: WpMediaPost): string | undefined {
	// eslint-disable-next-line dot-notation
	const legacy = post.acf?.["video_"];
	const maybe = post.acf?.video || legacy;
	return typeof maybe === "string" && maybe.trim() ? maybe.trim() : undefined;
}

export default function VideoDetailPage() {
	const [videoId, setVideoId] = useState<string | undefined>(undefined);

	const [post, setPost] = useState<WpMediaPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		const parts = window.location.pathname.split("/").filter(Boolean);
		const last = parts[parts.length - 1];
		setVideoId(last || undefined);
		return undefined;
	}, []);

	useEffect(() => {
		if (!videoId) return undefined;

		let cancelled = false;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(`${WP_REST_BASE}/videos/${videoId}`);
				if (!res.ok) throw new Error(`Request failed: ${res.status}`);
				const data = (await res.json()) as WpMediaPost;
				if (!cancelled) setPost(data);
			} catch (e) {
				if (!cancelled)
					setError(e instanceof Error ? e.message : "Failed to load video");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [videoId]);

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
	const videoUrl = getVideoUrl(post);

	if (!videoUrl) {
		return (
			<Box sx={{ minHeight: "100dvh", p: 2 }}>
				<Typography color="error">
					Video URL missing in ACF (expected `acf.video` or `acf.video_`).
				</Typography>
			</Box>
		);
	}

	return (
		<IbsVideoPlayerScreen
			videoUrl={videoUrl}
			title={title}
			description={description}
		/>
	);
}
