/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { Box, Typography } from "@mui/material";
import BuzzsproutPlayer from "./BuzzsproutPlayer";

export interface IbsPodcastPlayerScreenProps {
	title: string;
	description?: string;
	buzzsproutScriptSrc: string;
	buzzsproutContainerId: string;
}

export default function IbsPodcastPlayerScreen({
	title,
	description,
	buzzsproutScriptSrc,
	buzzsproutContainerId,
}: IbsPodcastPlayerScreenProps) {
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
					px: 2,
					py: 1.5,
					borderBottom: 1,
					borderColor: "divider",
				}}
			>
				<Typography variant="h6" component="h1" fontWeight={700}>
					Podcasts
				</Typography>
			</Box>

			<Box sx={{ flexShrink: 0, px: 2, pt: 2 }}>
				<Box
					sx={{
						borderRadius: 3,
						overflow: "hidden",
						bgcolor: "background.paper",
						border: 1,
						borderColor: "divider",
					}}
				>
					<Box sx={{ p: 1.5 }}>
						<BuzzsproutPlayer
							scriptSrc={buzzsproutScriptSrc}
							containerId={buzzsproutContainerId}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
