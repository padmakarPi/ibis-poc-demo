import type { WpMediaPost } from "@/types/ibs-wp-media";

export function getOgImageUrl(post: WpMediaPost): string | undefined {
	const images = post.yoast_head_json?.og_image;
	if (Array.isArray(images) && images[0]?.url) {
		return images[0].url;
	}
	return undefined;
}

export function stripHtmlToExcerpt(html: string, maxLen = 140): string {
	const text = html
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	if (text.length <= maxLen) return text;
	return `${text.slice(0, maxLen).trim()}…`;
}

export function stripHtmlTags(text: string): string {
	return text.replace(/<[^>]+>/g, "");
}

export function decodeWpEntities(text: string): string {
	if (typeof window === "undefined") {
		return text
			.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
			.replace(/&#x([\da-fA-F]+);/g, (_, h) =>
				String.fromCharCode(parseInt(h, 16)),
			)
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#039;/g, "'");
	}
	const ta = document.createElement("textarea");
	ta.innerHTML = text;
	return ta.value;
}
