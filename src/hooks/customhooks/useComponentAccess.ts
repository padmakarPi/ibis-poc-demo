import { useEffect, useState } from "react";
import { VSECURITY } from "@/lib/constant/apiconstant";
import useAxiosInterceptor from "./useAxiosInstance";
import { useRuntimeEnv } from "./useRuntimeEnv";

export const useDynamicCss = () => {
	const [enableSecurityApiCss, setEnableSecurityApiCss] = useState(false);
	const { NEXT_PUBLIC_VSECURITY_BASE_API_URL, NEXT_PUBLIC_CLIENT_ID } =
		useRuntimeEnv();
	const { axBe } = useAxiosInterceptor(NEXT_PUBLIC_VSECURITY_BASE_API_URL);
	const appClientId = NEXT_PUBLIC_CLIENT_ID;
	const elementId = `dynamic-css${appClientId}`;

	useEffect(() => {
		if (typeof window === "undefined") return undefined;

		const targetIdSuffix = `-${appClientId}`;

		const checkForElement = () => {
			const elements = document.querySelectorAll(`[id$="${targetIdSuffix}"]`);
			if (elements.length > 0) {
				setEnableSecurityApiCss(true);
				elements.forEach((el: any) => {
					el.setAttribute("tabindex", "-1");
				});
			}
		};
		checkForElement();
		const observe = new MutationObserver(() => {
			checkForElement();
		});
		observe.observe(document.body, {
			childList: true,
			subtree: true,
		});
		return () => {
			observe.disconnect();
		};
	}, [appClientId]);

	useEffect(() => {
		if (!enableSecurityApiCss) return undefined;

		const fetchAndApplyCss = async () => {
			try {
				const response = await axBe.get(
					`${VSECURITY.COMPONENTACESS}?applicationId=${NEXT_PUBLIC_CLIENT_ID}`,
				);
				if (response && response?.data) {
					const APIdata = response?.data?.result;
					let styleTag = document.getElementById(elementId);
					if (!styleTag) {
						styleTag = document.createElement("style");
						styleTag.id = elementId;
						document.head.appendChild(styleTag);
					}
					const cssContent = APIdata;
					styleTag.textContent = cssContent;

					if (cssContent) {
						const selectors = cssContent
							.split(",")
							.map((sel: string) => sel.trim());

						selectors.forEach((selector: string) => {
							if (selector.startsWith("#")) {
								const elementIds = selector.slice(1);
								const el = document.getElementById(elementIds);
								if (el) {
									el.setAttribute("tabindex", "0");
								}
							}
						});
					}
				}
			} catch (error) {
				console.error("Failed to fetch or apply CSS:", error);
			}
		};

		fetchAndApplyCss();

		return () => {
			const styleTag = document.getElementById(elementId);
			if (styleTag) {
				styleTag.textContent = "";
			}
		};
	}, [enableSecurityApiCss, elementId, axBe]);
};
