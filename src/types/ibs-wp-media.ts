/**
 * Minimal WordPress REST shapes for IBS videos / podcasts listing.
 */

export interface WpRenderedString {
	rendered: string;
}

export interface WpYoastOgImage {
	width?: number;
	height?: number;
	url: string;
	type?: string;
}

export interface WpYoastHeadJson {
	og_title?: string;
	og_description?: string;
	og_image?: WpYoastOgImage[];
}

export interface WpMediaPost {
	id: number;
	slug: string;
	link?: string;
	title: WpRenderedString;
	content: WpRenderedString;
	type: string;
	acf?: {
		video?: string;
		video_?: string;
		[key: string]: unknown;
	};
	yoast_head_json?: WpYoastHeadJson;
}
