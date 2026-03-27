"use client";

import { Box, IconButton, Typography } from "@mui/material";
import { useMemo } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export interface IbsVideoPlayerScreenProps {
	videoUrl: string;
	title: string;
	description?: string;
	screenTitle?: string;
}

function toYouTubeEmbedUrl(url: string): string {
	try {
		const u = new URL(url);
		const host = u.hostname.replace(/^www\./, "");

		const autoplayParams = "autoplay=1&mute=1&playsinline=1";

		// Playlist
		const list = u.searchParams.get("list");
		if (list) {
			return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
				list,
			)}&${autoplayParams}`;
		}

		// youtu.be/<id>
		if (host === "youtu.be") {
			const id = u.pathname.split("/").filter(Boolean)[0];
			if (id)
				return `https://www.youtube.com/embed/${encodeURIComponent(
					id,
				)}?${autoplayParams}`;
		}

		// youtube.com/watch?v=<id>
		const v = u.searchParams.get("v");
		if (v)
			return `https://www.youtube.com/embed/${encodeURIComponent(
				v,
			)}?${autoplayParams}`;

		// youtube.com/embed/<id>
		const parts = u.pathname.split("/").filter(Boolean);
		const embedIdx = parts.indexOf("embed");
		if (embedIdx >= 0 && parts[embedIdx + 1]) {
			return `https://www.youtube.com/embed/${encodeURIComponent(
				parts[embedIdx + 1],
			)}?${autoplayParams}`;
		}
	} catch {
		// ignore
	}
	return url;
}

export default function IbsVideoPlayerScreen({
	videoUrl,
	title,
	description,
	screenTitle,
}: IbsVideoPlayerScreenProps) {
	const embedUrl = useMemo(() => toYouTubeEmbedUrl(videoUrl), [videoUrl]);

	return (
		<Box
			sx={{
				height: "100dvh",
				maxHeight: "100dvh",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				bgcolor: "background.default",
				maxWidth: 480,
				mx: "auto",
				width: "100%",
			}}
		>
			<Box
				sx={{
					flexShrink: 0,
					px: 1,
					py: 1.5,
					borderBottom: 1,
					borderColor: "divider",
					display: "flex",
					alignItems: "center",
					gap: 1,
				}}
			>
				<IconButton
					aria-label="Back"
					onClick={() => {
						if (typeof window === "undefined") return;
						if (window.history.length > 1) window.history.back();
						else window.location.assign("/media");
					}}
				>
					<ArrowBackIcon />
				</IconButton>
				<Typography variant="h6" component="h1" fontWeight={700}>
					{screenTitle ?? "Videos"}
				</Typography>
			</Box>

			<Box sx={{ flexShrink: 0, px: 2, pt: 2 }}>
				<Box
					sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "action.hover" }}
				>
					<Box sx={{ position: "relative", width: "100%", pt: "56.25%" }}>
						<Box sx={{ position: "absolute", inset: 0 }}>
							<iframe
								src={embedUrl}
								title={title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
								style={{ width: "100%", height: "100%", border: 0 }}
							/>
						</Box>
					</Box>
				</Box>
			</Box>

			<Box
				sx={{
					flex: 1,
					minHeight: 0,
					overflowY: "auto",
					px: 2,
					pt: 1.75,
					pb: 3,
				}}
			>
				<Typography
					variant="subtitle1"
					component="h2"
					fontWeight={700}
					sx={{ lineHeight: 1.3 }}
				>
					{title}
				</Typography>
				{description ? (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 1, whiteSpace: "pre-wrap" }}
					>
						{description}
					</Typography>
				) : null}
			</Box>
		</Box>
	);
}
