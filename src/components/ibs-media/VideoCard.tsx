"use client";

import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
	useTheme,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Link from "next/link";

export interface VideoCardProps {
	id: number;
	title: string;
	imageUrl?: string;
	excerpt?: string;
	href: string;
}

export default function VideoCard({
	title,
	imageUrl,
	excerpt,
	href,
}: VideoCardProps) {
	const theme = useTheme();

	return (
		<Card
			component={Link}
			href={href}
			elevation={0}
			sx={{
				display: "block",
				textDecoration: "none",
				color: "inherit",
				borderRadius: 3,
				overflow: "hidden",
				bgcolor: "background.paper",
				border: 1,
				borderColor: "divider",
				mb: 2,
				transition: "transform 0.15s ease, box-shadow 0.15s ease",
				cursor: "pointer",
				"&:hover": {
					transform: "scale(1.01)",
					boxShadow: theme.shadows[4],
				},
			}}
		>
			<Box sx={{ position: "relative", width: "100%", pt: "56.25%" }}>
				{imageUrl ? (
					<CardMedia
						component="img"
						image={imageUrl}
						alt=""
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
				) : (
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							bgcolor: "action.hover",
						}}
					/>
				)}
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						pointerEvents: "none",
						background:
							"linear-gradient(to top, rgba(0,0,0,0.55), transparent 45%)",
					}}
				>
					<PlayCircleOutlineIcon
						sx={{ fontSize: 56, color: "common.white", opacity: 0.95 }}
					/>
				</Box>
			</Box>
			<CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
				<Typography
					variant="subtitle1"
					component="h2"
					fontWeight={600}
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
				{excerpt ? (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							mt: 0.75,
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
						}}
					>
						{excerpt}
					</Typography>
				) : null}
			</CardContent>
		</Card>
	);
}
