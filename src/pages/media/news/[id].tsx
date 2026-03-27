"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import XIcon from "@mui/icons-material/X";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { WpMediaPost } from "@/types/ibs-wp-media";
import {
	decodeWpEntities,
	getOgImageUrl,
	stripHtmlTags,
} from "@/lib/ibs-wp-utils";

const WP_REST_BASE =
	process.env.NEXT_PUBLIC_IBS_WP_REST_BASE?.replace(/\/$/, "") ??
	"https://stg-newibsintelligence-ibsistgapr25.kinsta.cloud/wp-json/wp/v2";

function formatNewsDate(input?: string): string {
	if (!input) return "";
	const d = new Date(input);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export default function NewsDetailPage() {
	const [newsId, setNewsId] = useState<string | undefined>(undefined);
	const [post, setPost] = useState<WpMediaPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		const parts = window.location.pathname.split("/").filter(Boolean);
		const last = parts[parts.length - 1];
		setNewsId(last || undefined);
		return undefined;
	}, []);

	useEffect(() => {
		if (!newsId) return undefined;

		let cancelled = false;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(`${WP_REST_BASE}/ibsi_news/${newsId}`);
				if (!res.ok) throw new Error(`Request failed: ${res.status}`);
				const data = (await res.json()) as WpMediaPost;
				if (!cancelled) setPost(data);
			} catch (e) {
				if (!cancelled) {
					setError(e instanceof Error ? e.message : "Failed to load news");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [newsId]);

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
	const publishedAt = formatNewsDate(post.date);
	const heroImage = getOgImageUrl(post);
	const bodyHtml = post.content.rendered.replace(/<script[\s\S]*?<\/script>/gi, "");
	const articleUrl = post.link || (typeof window !== "undefined" ? window.location.href : "");
	const encodedUrl = encodeURIComponent(articleUrl);
	const encodedTitle = encodeURIComponent(title);

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
					News
				</Typography>
			</Box>

			<Box
				sx={{
					flex: 1,
					minHeight: 0,
					overflowY: "auto",
					px: 1.5,
					pt: 1.5,
					pb: 3,
				}}
			>
				<Typography
					variant="h6"
					component="h2"
					fontWeight={700}
					sx={{ px: 0.5, lineHeight: 1.35 }}
				>
					{title}
				</Typography>
				{publishedAt ? (
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ display: "block", mt: 0.75, px: 0.5 }}
					>
						{publishedAt}
					</Typography>
				) : null}
				<Box
					sx={{
						mt: 0.75,
						px: 0.5,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Typography variant="caption" color="text.secondary" fontWeight={600}>
						Share
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
						<IconButton
							component="a"
							href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
							aria-label="Share on LinkedIn"
							sx={{ color: "#0A66C2" }}
						>
							<LinkedInIcon fontSize="small" />
						</IconButton>
						<IconButton
							component="a"
							href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
							aria-label="Share on Facebook"
							sx={{ color: "#1877F2" }}
						>
							<FacebookIcon fontSize="small" />
						</IconButton>
						<IconButton
							component="a"
							href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
							aria-label="Share on X"
							sx={{ color: "text.primary" }}
						>
							<XIcon fontSize="small" />
						</IconButton>
						<IconButton
							component="a"
							href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
							aria-label="Share on Telegram"
							sx={{ color: "#24A1DE" }}
						>
							<TelegramIcon fontSize="small" />
						</IconButton>
						<IconButton
							component="a"
							href={`https://wa.me/?text=${encodeURIComponent(`${title} ${articleUrl}`)}`}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
							aria-label="Share on WhatsApp"
							sx={{ color: "#25D366" }}
						>
							<WhatsAppIcon fontSize="small" />
						</IconButton>
					</Box>
				</Box>
				{heroImage ? (
					<Box
						component="img"
						src={heroImage}
						alt=""
						sx={{
							mt: 1.25,
							width: "100%",
							height: "auto",
							maxHeight: 220,
							objectFit: "cover",
							borderRadius: 1,
							bgcolor: "action.hover",
						}}
					/>
				) : null}
				<Box
					sx={{
						mt: 1.5,
						px: 0.5,
						color: "text.primary",
						"& p": { m: 0, mb: 1.5, lineHeight: 1.7, fontSize: "0.95rem" },
						"& img": {
							display: "none",
						},
						"& a": { color: "primary.main", textDecoration: "none" },
						"& h1, & h2, & h3, & h4": {
							mt: 1.5,
							mb: 1,
							lineHeight: 1.35,
						},
					}}
					dangerouslySetInnerHTML={{ __html: bodyHtml }}
				/>
			</Box>
		</Box>
	);
}
