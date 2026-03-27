"use client";

import { Box, Card, CardMedia, Typography, useTheme } from "@mui/material";
import Link from "next/link";

export interface NewsCardProps {
	id: number;
	title: string;
	imageUrl?: string;
	date?: string;
	href: string;
}

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

export default function NewsCard({
	title,
	imageUrl,
	date,
	href,
}: NewsCardProps) {
	const theme = useTheme();
	const displayDate = formatNewsDate(date);

	return (
		<Card
			component={Link}
			href={href}
			elevation={0}
			sx={{
				display: "flex",
				alignItems: "stretch",
				textDecoration: "none",
				color: "inherit",
				borderRadius: 0.5,
				overflow: "hidden",
				bgcolor: "#efefef",
				border: 0,
				mb: 1.5,
				transition: "transform 0.15s ease, box-shadow 0.15s ease",
				"&:hover": {
					transform: "scale(1.005)",
					boxShadow: theme.shadows[2],
				},
			}}
		>
			<Box sx={{ width: 110, minWidth: 110, height: 100 }}>
				{imageUrl ? (
					<CardMedia
						component="img"
						image={imageUrl}
						alt=""
						sx={{ width: "100%", height: "100%", objectFit: "cover" }}
					/>
				) : (
					<Box sx={{ width: "100%", height: "100%", bgcolor: "success.light" }} />
				)}
			</Box>
			<Box
				sx={{
					flex: 1,
					minWidth: 0,
					px: 1.5,
					py: 1.25,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				{displayDate ? (
					<Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
						{displayDate}
					</Typography>
				) : null}
				<Typography
					variant="subtitle2"
					component="h2"
					fontWeight={700}
					sx={{
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
						lineHeight: 1.35,
					}}
				>
					{title}
				</Typography>
			</Box>
		</Card>
	);
}
