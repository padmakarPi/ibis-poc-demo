"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	Box,
	BottomNavigation,
	BottomNavigationAction,
	CircularProgress,
	FormControl,
	IconButton,
	InputLabel,
	Paper,
	Select,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// eslint-disable-next-line import/no-extraneous-dependencies
import InfiniteScroll from "react-infinite-scroll-component";
import type { WpMediaPost } from "@/types/ibs-wp-media";
import {
	decodeWpEntities,
	getOgImageUrl,
	stripHtmlTags,
	stripHtmlToExcerpt,
} from "@/lib/ibs-wp-utils";
import VideoCard, { type VideoCardProps } from "./VideoCard";
import PodcastCard, { type PodcastCardProps } from "./PodcastCard";

const PER_PAGE = 10;
const SCROLL_ID = "ibs-media-scroll";

/** Public WordPress REST base (no trailing slash). Override via NEXT_PUBLIC_IBS_WP_REST_BASE. */
const WP_REST_BASE =
	process.env.NEXT_PUBLIC_IBS_WP_REST_BASE?.replace(/\/$/, "") ??
	"https://ibsintelligence.com/wp-json/wp/v2";

async function fetchMediaPage(
	type: "videos" | "podcasts" | "webinars",
	page: number,
	search?: string,
	categoriesId?: number,
): Promise<{ items: WpMediaPost[]; totalPages: number | null }> {
	const s = (search || "").trim();
	const searchParam = s ? `&search=${encodeURIComponent(s)}` : "";
	const categoriesParam =
		categoriesId && categoriesId > 0
			? `&categories=${encodeURIComponent(String(categoriesId))}`
			: "";
	const url = `${WP_REST_BASE}/${type}?page=${page}&per_page=${PER_PAGE}${searchParam}${categoriesParam}`;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Request failed: ${res.status}`);
	}
	const items = (await res.json()) as WpMediaPost[];
	const tp = res.headers.get("X-WP-TotalPages");
	const parsed = tp != null && tp !== "" ? parseInt(tp, 10) : NaN;
	const totalPages = Number.isFinite(parsed) ? parsed : null;
	return { items, totalPages };
}

function hasMoreAfterPage(
	page: number,
	items: WpMediaPost[],
	totalPages: number | null,
): boolean {
	if (totalPages !== null) return page < totalPages;
	return items.length === PER_PAGE;
}

function toVideoProps(post: WpMediaPost): VideoCardProps {
	const rawTitle = stripHtmlTags(post.title.rendered);
	const title = decodeWpEntities(rawTitle);
	const fromContent = stripHtmlToExcerpt(post.content.rendered);
	const excerpt =
		fromContent.length > 48
			? fromContent
			: post.yoast_head_json?.og_description?.slice(0, 160)?.trim() ?? "";

	return {
		id: post.id,
		title,
		imageUrl: getOgImageUrl(post),
		excerpt: excerpt || undefined,
		href: `/media/videos/${post.id}`,
	};
}

function toPodcastProps(post: WpMediaPost): PodcastCardProps {
	const rawTitle = stripHtmlTags(post.title.rendered);
	const title = decodeWpEntities(rawTitle);
	const fromContent = stripHtmlToExcerpt(post.content.rendered);
	const excerpt =
		fromContent.length > 48
			? fromContent
			: post.yoast_head_json?.og_description?.slice(0, 160)?.trim() ?? "";

	return {
		id: post.id,
		title,
		imageUrl: getOgImageUrl(post),
		excerpt: excerpt || undefined,
		href: `/media/podcasts/${post.id}`,
	};
}

function toWebinarProps(post: WpMediaPost): VideoCardProps {
	const rawTitle = stripHtmlTags(post.title.rendered);
	const title = decodeWpEntities(rawTitle);
	const fromContent = stripHtmlToExcerpt(post.content.rendered);
	const excerpt =
		fromContent.length > 48
			? fromContent
			: post.yoast_head_json?.og_description?.slice(0, 160)?.trim() ?? "";

	return {
		id: post.id,
		title,
		imageUrl: getOgImageUrl(post),
		excerpt: excerpt || undefined,
		href: `/media/webinars/${post.id}`,
	};
}

export default function IbsMediaMobilePage() {
	// IMPORTANT: keep initial render identical between server and client to avoid hydration mismatch
	const [tab, setTab] = useState(0);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchText, setSearchText] = useState("");
	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const [debouncedSearch, setDebouncedSearch] = useState("");

	const [videos, setVideos] = useState<WpMediaPost[]>([]);
	const [podcasts, setPodcasts] = useState<WpMediaPost[]>([]);
	const [webinars, setWebinars] = useState<WpMediaPost[]>([]);
	const [videoPage, setVideoPage] = useState(0);
	const [podcastPage, setPodcastPage] = useState(0);
	const [webinarPage, setWebinarPage] = useState(0);
	const [hasMoreVideos, setHasMoreVideos] = useState(true);
	const [hasMorePodcasts, setHasMorePodcasts] = useState(true);
	const [hasMoreWebinars, setHasMoreWebinars] = useState(true);
	const [loadingVideos, setLoadingVideos] = useState(false);
	const [loadingPodcasts, setLoadingPodcasts] = useState(false);
	const [loadingWebinars, setLoadingWebinars] = useState(false);
	const [videoError, setVideoError] = useState<string | null>(null);
	const [podcastError, setPodcastError] = useState<string | null>(null);
	const [webinarError, setWebinarError] = useState<string | null>(null);
	const [categories, setCategories] = useState<
		Array<{ id: number; name: string }>
	>([]);
	const [videosCategoryId, setVideosCategoryId] = useState(0);
	const [podcastsCategoryId, setPodcastsCategoryId] = useState(0);
	const [webinarsCategoryId, setWebinarsCategoryId] = useState(0);
	const [loadingCategories, setLoadingCategories] = useState(false);

	const videosLoadedRef = useRef(false);
	const podcastsLoadedRef = useRef(false);
	const webinarsLoadedRef = useRef(false);
	const videoSearchRef = useRef("");
	const podcastSearchRef = useRef("");
	const webinarSearchRef = useRef("");

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		const raw = window.sessionStorage.getItem("ibs-media-tab");
		let nextTab = 0;
		if (raw === "1") nextTab = 1;
		else if (raw === "2") nextTab = 2;
		setTab(nextTab);
		return undefined;
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		window.sessionStorage.setItem("ibs-media-tab", String(tab));
		return undefined;
	}, [tab]);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		const vRaw = window.sessionStorage.getItem("ibs-media-videos-category");
		const pRaw = window.sessionStorage.getItem("ibs-media-podcasts-category");
		const wRaw = window.sessionStorage.getItem("ibs-media-webinars-category");

		const v = vRaw ? parseInt(vRaw, 10) : NaN;
		const p = pRaw ? parseInt(pRaw, 10) : NaN;
		const w = wRaw ? parseInt(wRaw, 10) : NaN;

		if (Number.isFinite(v)) setVideosCategoryId(v);
		if (Number.isFinite(p)) setPodcastsCategoryId(p);
		if (Number.isFinite(w)) setWebinarsCategoryId(w);
		return undefined;
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		window.sessionStorage.setItem(
			"ibs-media-videos-category",
			String(videosCategoryId),
		);
		return undefined;
	}, [videosCategoryId]);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		window.sessionStorage.setItem(
			"ibs-media-podcasts-category",
			String(podcastsCategoryId),
		);
		return undefined;
	}, [podcastsCategoryId]);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		window.sessionStorage.setItem(
			"ibs-media-webinars-category",
			String(webinarsCategoryId),
		);
		return undefined;
	}, [webinarsCategoryId]);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoadingCategories(true);
			try {
				const res = await fetch(
					`${WP_REST_BASE}/categories?page=1&per_page=100`,
				);
				if (!res.ok) throw new Error(`Categories failed: ${res.status}`);
				const data = (await res.json()) as Array<{ id: number; name: string }>;
				if (cancelled) return;
				// Sort A-Z for UX
				const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
				setCategories(sorted);
			} catch {
				// ignore; dropdown will just show "All categories"
			} finally {
				if (!cancelled) setLoadingCategories(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (!searchOpen) return undefined;
		// Wait a tick for TextField to mount
		const t = window.setTimeout(() => {
			searchInputRef.current?.focus();
		}, 0);
		return () => window.clearTimeout(t);
	}, [searchOpen]);

	// Debounce backend search to avoid firing on every keystroke
	useEffect(() => {
		const t = window.setTimeout(() => {
			setDebouncedSearch(searchText.trim());
		}, 1000);
		return () => window.clearTimeout(t);
	}, [searchText]);

	const loadFirstVideos = useCallback(
		async (search: string) => {
			if (videoSearchRef.current !== search) {
				setVideos([]);
				setVideoPage(0);
				setHasMoreVideos(true);
			}
			setLoadingVideos(true);
			setVideoError(null);
			try {
				const { items, totalPages } = await fetchMediaPage(
					"videos",
					1,
					search,
					videosCategoryId,
				);
				setVideos(items);
				setVideoPage(1);
				setHasMoreVideos(hasMoreAfterPage(1, items, totalPages));
				videosLoadedRef.current = true;
				videoSearchRef.current = search;
			} catch (e) {
				setVideoError(e instanceof Error ? e.message : "Failed to load videos");
			} finally {
				setLoadingVideos(false);
			}
		},
		[videosCategoryId],
	);

	const loadFirstPodcasts = useCallback(
		async (search: string) => {
			if (podcastSearchRef.current !== search) {
				setPodcasts([]);
				setPodcastPage(0);
				setHasMorePodcasts(true);
			}
			setLoadingPodcasts(true);
			setPodcastError(null);
			try {
				const { items, totalPages } = await fetchMediaPage(
					"podcasts",
					1,
					search,
					podcastsCategoryId,
				);
				setPodcasts(items);
				setPodcastPage(1);
				setHasMorePodcasts(hasMoreAfterPage(1, items, totalPages));
				podcastsLoadedRef.current = true;
				podcastSearchRef.current = search;
			} catch (e) {
				setPodcastError(
					e instanceof Error ? e.message : "Failed to load podcasts",
				);
			} finally {
				setLoadingPodcasts(false);
			}
		},
		[podcastsCategoryId],
	);

	const loadFirstWebinars = useCallback(
		async (search: string) => {
			if (webinarSearchRef.current !== search) {
				setWebinars([]);
				setWebinarPage(0);
				setHasMoreWebinars(true);
			}
			setLoadingWebinars(true);
			setWebinarError(null);
			try {
				const { items, totalPages } = await fetchMediaPage(
					"webinars",
					1,
					search,
					webinarsCategoryId,
				);
				setWebinars(items);
				setWebinarPage(1);
				setHasMoreWebinars(hasMoreAfterPage(1, items, totalPages));
				webinarsLoadedRef.current = true;
				webinarSearchRef.current = search;
			} catch (e) {
				setWebinarError(
					e instanceof Error ? e.message : "Failed to load webinars",
				);
			} finally {
				setLoadingWebinars(false);
			}
		},
		[webinarsCategoryId],
	);

	// Initial load: Videos when tab first opened
	useEffect(() => {
		if (tab !== 0 || videosLoadedRef.current) {
			return undefined;
		}
		loadFirstVideos("");
		return undefined;
	}, [tab]);

	// Initial load: Podcasts when tab first opened
	useEffect(() => {
		if (tab !== 1 || podcastsLoadedRef.current) {
			return undefined;
		}
		loadFirstPodcasts("");
		return undefined;
	}, [tab]);

	// Initial load: Webinars when tab first opened
	useEffect(() => {
		if (tab !== 2 || webinarsLoadedRef.current) {
			return undefined;
		}
		loadFirstWebinars("");
		return undefined;
	}, [tab]);

	// When search changes, reload current tab from page 1 (backend search param)
	useEffect(() => {
		const s = debouncedSearch;
		if (tab === 0) {
			if (videosLoadedRef.current && videoSearchRef.current === s)
				return undefined;
			loadFirstVideos(s);
		} else if (tab === 1) {
			if (podcastsLoadedRef.current && podcastSearchRef.current === s)
				return undefined;
			loadFirstPodcasts(s);
		} else {
			if (webinarsLoadedRef.current && webinarSearchRef.current === s)
				return undefined;
			loadFirstWebinars(s);
		}
		return undefined;
	}, [
		debouncedSearch,
		tab,
		loadFirstVideos,
		loadFirstPodcasts,
		loadFirstWebinars,
	]);

	const loadMoreVideos = useCallback(async () => {
		if (!hasMoreVideos || loadingVideos) return;
		setLoadingVideos(true);
		setVideoError(null);
		try {
			const next = videoPage + 1;
			const { items, totalPages } = await fetchMediaPage(
				"videos",
				next,
				videoSearchRef.current,
				videosCategoryId,
			);
			setVideos(prev => [...prev, ...items]);
			setVideoPage(next);
			setHasMoreVideos(hasMoreAfterPage(next, items, totalPages));
		} catch (e) {
			setVideoError(
				e instanceof Error ? e.message : "Failed to load more videos",
			);
		} finally {
			setLoadingVideos(false);
		}
	}, [hasMoreVideos, loadingVideos, videoPage, videosCategoryId]);

	const loadMorePodcasts = useCallback(async () => {
		if (!hasMorePodcasts || loadingPodcasts) return;
		setLoadingPodcasts(true);
		setPodcastError(null);
		try {
			const next = podcastPage + 1;
			const { items, totalPages } = await fetchMediaPage(
				"podcasts",
				next,
				podcastSearchRef.current,
				podcastsCategoryId,
			);
			setPodcasts(prev => [...prev, ...items]);
			setPodcastPage(next);
			setHasMorePodcasts(hasMoreAfterPage(next, items, totalPages));
		} catch (e) {
			setPodcastError(
				e instanceof Error ? e.message : "Failed to load more podcasts",
			);
		} finally {
			setLoadingPodcasts(false);
		}
	}, [hasMorePodcasts, loadingPodcasts, podcastPage, podcastsCategoryId]);

	const loadMoreWebinars = useCallback(async () => {
		if (!hasMoreWebinars || loadingWebinars) return;
		setLoadingWebinars(true);
		setWebinarError(null);
		try {
			const next = webinarPage + 1;
			const { items, totalPages } = await fetchMediaPage(
				"webinars",
				next,
				webinarSearchRef.current,
				webinarsCategoryId,
			);
			setWebinars(prev => [...prev, ...items]);
			setWebinarPage(next);
			setHasMoreWebinars(hasMoreAfterPage(next, items, totalPages));
		} catch (e) {
			setWebinarError(
				e instanceof Error ? e.message : "Failed to load more webinars",
			);
		} finally {
			setLoadingWebinars(false);
		}
	}, [hasMoreWebinars, loadingWebinars, webinarPage, webinarsCategoryId]);

	let tabTitle = "Webinars";
	let tabSearchLabel = "webinars";
	if (tab === 0) {
		tabTitle = "Videos";
		tabSearchLabel = "videos";
	} else if (tab === 1) {
		tabTitle = "Podcasts";
		tabSearchLabel = "podcasts";
	}

	const bottomNav = (
		<Paper
			elevation={8}
			square={false}
			sx={{
				position: "fixed",
				bottom: 0,
				left: "50%",
				transform: "translateX(-50%)",
				width: "100%",
				maxWidth: 480,
				borderRadius: "16px 16px 0 0",
				zIndex: t => t.zIndex.appBar,
				overflow: "hidden",
			}}
		>
			<BottomNavigation
				value={tab}
				onChange={(_, v) => setTab(v)}
				showLabels
				sx={{
					"& .MuiBottomNavigationAction-root": {
						minWidth: 0,
						py: 1.25,
					},
				}}
			>
				<BottomNavigationAction label="Videos" icon={<VideoLibraryIcon />} />
				<BottomNavigationAction label="Podcasts" icon={<PodcastsIcon />} />
				<BottomNavigationAction label="Webinars" icon={<SchoolIcon />} />
			</BottomNavigation>
		</Paper>
	);

	const shell = (
		<Box
			sx={{
				/* Body uses overflow:hidden in globals.css — this column must own scrolling */
				height: "100dvh",
				maxHeight: "100dvh",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				bgcolor: "background.default",
				maxWidth: 480,
				mx: "auto",
				width: "100%",
				position: "relative",
				boxSizing: "border-box",
			}}
		>
			<Box
				component="header"
				sx={{
					flexShrink: 0,
					px: searchOpen ? 2 : 4,
					// py: 1.5,
					borderBottom: 1,
					borderColor: "divider",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Box
					sx={{ width: 150, height: 60, display: "flex", alignItems: "center" }}
				>
					<img
						src="https://stg-newibsintelligence-ibsistgapr25.kinsta.cloud/wp-content/themes/ibsi/assets/images/logo.png"
						alt=""
						style={{
							maxWidth: "100%",
							maxHeight: "100%",
							height: "auto",
							width: "auto",
							display: "block",
						}}
					/>
				</Box>
				{searchOpen ? (
					<TextField
						inputRef={searchInputRef}
						value={searchText}
						onChange={e => setSearchText(e.target.value)}
						placeholder={`Search ${tabSearchLabel}…`}
						size="small"
						autoComplete="off"
						sx={{ flex: 1, mx: 0.5 }}
					/>
				) : (
					<Typography variant="h6" component="h1" fontWeight={700}>
						{tabTitle}
					</Typography>
				)}

				<IconButton
					aria-label={searchOpen ? "Close search" : "Search"}
					onClick={() => {
						if (searchOpen) {
							setSearchText("");
							setSearchOpen(false);
						} else {
							setSearchOpen(true);
						}
					}}
				>
					{searchOpen ? <CloseIcon /> : <SearchIcon />}
				</IconButton>
			</Box>

			{/* Category filter (Videos / Podcasts / Webinars) */}
			{tab === 0 || tab === 1 || tab === 2 ? (
				<Box sx={{ px: 2, pt: 1.25, pb: 0.5 }}>
					{(() => {
						let currentCategoryId = webinarsCategoryId;
						if (tab === 0) currentCategoryId = videosCategoryId;
						else if (tab === 1) currentCategoryId = podcastsCategoryId;

						return (
							<FormControl fullWidth size="small">
								<InputLabel id="ibs-media-category-label">Category</InputLabel>
								<Select
									labelId="ibs-media-category-label"
									value={currentCategoryId}
									label="Category"
									onChange={e => {
										const id = Number(e.target.value);
										const nextId = Number.isFinite(id) ? id : 0;

										// Trigger reload from page 1 for current tab
										if (tab === 0) {
											setVideosCategoryId(nextId);
											videosLoadedRef.current = false;
											videoSearchRef.current = "";
											loadFirstVideos(debouncedSearch);
										} else if (tab === 1) {
											setPodcastsCategoryId(nextId);
											podcastsLoadedRef.current = false;
											podcastSearchRef.current = "";
											loadFirstPodcasts(debouncedSearch);
										} else {
											setWebinarsCategoryId(nextId);
											webinarsLoadedRef.current = false;
											webinarSearchRef.current = "";
											loadFirstWebinars(debouncedSearch);
										}
									}}
								>
									<MenuItem value={0}>All categories</MenuItem>
									{categories.map(c => (
										<MenuItem key={c.id} value={c.id}>
											{c.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						);
					})()}
					{loadingCategories ? (
						<Typography variant="caption" color="text.secondary">
							Loading categories…
						</Typography>
					) : null}
				</Box>
			) : null}

			<Box
				id={SCROLL_ID}
				sx={{
					flex: 1,
					minHeight: 0,
					overflowY: "auto",
					overflowX: "hidden",
					WebkitOverflowScrolling: "touch",
					px: 2,
					pt: 2,
					pb: 10,
				}}
			>
				{tab === 0 && (
					<>
						{videoError && (
							<Typography color="error" variant="body2" sx={{ mb: 2 }}>
								{videoError}
							</Typography>
						)}
						{loadingVideos && videos.length === 0 ? (
							<Box display="flex" justifyContent="center" py={6}>
								<CircularProgress color="primary" />
							</Box>
						) : (
							<InfiniteScroll
								dataLength={videos.length}
								next={loadMoreVideos}
								hasMore={hasMoreVideos}
								loader={
									<Box
										display="flex"
										justifyContent="center"
										py={2}
										key="v-loader"
									>
										<CircularProgress size={32} />
									</Box>
								}
								endMessage={
									videos.length > 0 ? (
										<Typography
											align="center"
											color="text.secondary"
											variant="body2"
											py={2}
										>
											You have seen all videos
										</Typography>
									) : (
										<Typography
											align="center"
											color="text.secondary"
											variant="body2"
											py={2}
										>
											No videos to show
										</Typography>
									)
								}
								scrollableTarget={SCROLL_ID}
							>
								{videos.map(p => (
									<VideoCard key={p.id} {...toVideoProps(p)} />
								))}
							</InfiniteScroll>
						)}
					</>
				)}

				{tab === 1 && (
					<>
						{podcastError && (
							<Typography color="error" variant="body2" sx={{ mb: 2 }}>
								{podcastError}
							</Typography>
						)}
						{loadingPodcasts && podcasts.length === 0 ? (
							<Box display="flex" justifyContent="center" py={6}>
								<CircularProgress color="primary" />
							</Box>
						) : (
							<InfiniteScroll
								dataLength={podcasts.length}
								next={loadMorePodcasts}
								hasMore={hasMorePodcasts}
								loader={
									<Box
										display="flex"
										justifyContent="center"
										py={2}
										key="p-loader"
									>
										<CircularProgress size={32} />
									</Box>
								}
								endMessage={
									podcasts.length > 0 ? (
										<Typography
											align="center"
											color="text.secondary"
											variant="body2"
											py={2}
										>
											You have seen all podcasts
										</Typography>
									) : (
										<Typography
											align="center"
											color="text.secondary"
											variant="body2"
											py={2}
										>
											No podcasts to show
										</Typography>
									)
								}
								scrollableTarget={SCROLL_ID}
							>
								{podcasts.map(p => (
									<PodcastCard key={p.id} {...toPodcastProps(p)} />
								))}
							</InfiniteScroll>
						)}
					</>
				)}

				{tab === 2 && (
					<>
						{webinarError && (
							<Typography color="error" variant="body2" sx={{ mb: 2 }}>
								{webinarError}
							</Typography>
						)}
						{loadingWebinars && webinars.length === 0 ? (
							<Box display="flex" justifyContent="center" py={6}>
								<CircularProgress color="primary" />
							</Box>
						) : (
							<InfiniteScroll
								dataLength={webinars.length}
								next={loadMoreWebinars}
								hasMore={hasMoreWebinars}
								loader={
									<Box
										display="flex"
										justifyContent="center"
										py={2}
										key="w-loader"
									>
										<CircularProgress size={32} />
									</Box>
								}
								endMessage={
									webinars.length > 0 ? (
										<Typography
											align="center"
											color="text.secondary"
											variant="body2"
											py={2}
										>
											You have seen all webinars
										</Typography>
									) : (
										<Typography
											align="center"
											color="text.secondary"
											variant="body2"
											py={2}
										>
											No webinars to show
										</Typography>
									)
								}
								scrollableTarget={SCROLL_ID}
							>
								{webinars.map(p => (
									<VideoCard key={p.id} {...toWebinarProps(p)} />
								))}
							</InfiniteScroll>
						)}
					</>
				)}
			</Box>

			{bottomNav}
		</Box>
	);

	return shell;
}
