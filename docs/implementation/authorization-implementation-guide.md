# Authorization Implementation Guide

## Overview
This guide provides a step-by-step implementation process for handling authorization in the application by dynamically injecting CSS styles for UI elements based on user access levels.

---

### **Authorization Workflow**

![Authorization Process](../assets/authorization-workflow.png)

## Step 1: Define CSS for Access Control
Create a CSS file to define styling for action elements that need to be controlled based on user authorization.

### **File Path:**
`public/css/access-control.css`

In this below example 

`#btnUpdateDetails-0896c4c3-e70b-4f84-9054-d6b57e5351d2`,

`#btnUpdateDetails-` is `elementId` and `0896c4c3-e70b-4f84-9054-d6b57e5351d2` is `clientId`.


### **Example CSS:**
```css
#btnUpdateDetails-0896c4c3-e70b-4f84-9054-d6b57e5351d2,
#btnHistoryTab-0896c4c3-e70b-4f84-9054-d6b57e5351d2,
#btnReportingNoteDetails-0896c4c3-e70b-4f84-9054-d6b57e5351d2,
#btnEditResolverGroupTags-0896c4c3-e70b-4f84-9054-d6b57e5351d2,
#btnDeleteResolverGroupTags-0896c4c3-e70b-4f84-9054-d6b57e5351d2,
#btnEditSLATags-0896c4c3-e70b-4f84-9054-d6b57e5351d2,
#btnDeleteSLATags-0896c4c3-e70b-4f84-9054-d6b57e5351d2,
#btnDeleteTicketTypeTags-0896c4c3-e70b-4f84-9054-d6b57e5351d2 {
    pointer-events: none;
    opacity: 0.38;
}
```

---

## Step 2: Assign Dynamic ID in HTML
To ensure IDs are dynamic based on the `CLIENT_ID`, use template literals to construct unique identifiers.

### **Example Usage in React Component:**
```tsx
<Button
    size="small"
    id={`btnUpdateDetails-${process.env.NEXT_PUBLIC_CLIENT_ID}`}
>
    Update
</Button>
```

---

## Step 3: Fetch and Inject CSS Dynamically
On application startup, call a security service API to fetch the CSS configuration dynamically and inject it into the application.

### 1. App


``Old template (where using the service folder for api call)``

- Update the _app.tsx file to include the API call.

```

import React from 'react'
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect,useState } from "react";
import { fetchAndApplyCss } from "@/lib/utils";
import AuthService from "@/services/auth.service";


function App() {
	const [enableSecurityApiCss, setEnableSecurityApiCss] = useState(false);

	const authService = new AuthService();

	useEffect(() => {
		const roleSecurity = async () => {
			try {
				const user = await authService.getUser();
				if (user) {
					await fetchAndApplyCss();
				}
			} catch (error) {
				// empty;
			}
		};
		if (enableSecurityApiCss) {
			roleSecurity();
		}
	}, [enableSecurityApiCss]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const targetIdSuffix = `-${process.env.NEXT_PUBLIC_VLINK_APP_CLIENT_ID}`;

		const applyTabIndexToTargetElements = () => {
			const elements = document.querySelectorAll(`[id$="${targetIdSuffix}"]`);
			if (elements.length > 0) {
				setEnableSecurityApiCss(true);
				elements.forEach((el: any) => {
					el.setAttribute("tabindex", "-1");
				});
			}
		};

		const observer = new MutationObserver(applyTabIndexToTargetElements);

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		applyTabIndexToTargetElements();

		return () => observer.disconnect();
	}, []);

	return (
		<div>
			<Head>
			    {/* /vlink path name will be change with your application path name */}
				<link rel="stylesheet" href="/vlink/css/access-control.css" /> 
			</Head>
		</div>
	);
}

export default App;

```

- Export the utility function that will call the CSS API from vsecurity. You can write this function in the lib/utils.ts file or any other utility file.


```
import { getGenerateCss } from "@/services/security.service";

export const fetchAndApplyCss = async () => {
	const appClientId = process.env.NEXT_PUBLIC_CLIENT_ID;

	if (!appClientId) {
		console.error("Application client ID is not defined");
		return;
	}

	try {
		const response = await getGenerateCss();

		if (!response || !response.data || !response.data.result) {
			console.warn("No CSS data received from API");
			return;
		}

		const elementId = `dynamic-css${appClientId}`;
		let styleTag = document.getElementById(elementId);

		if (!styleTag) {
			styleTag = document.createElement("style");
			styleTag.id = elementId;
			document.head.appendChild(styleTag);
		}

		const cssContent = response.data.result;
		styleTag.textContent = cssContent;

		if (cssContent) {
			const selectors = cssContent.split(",").map((sel: string) => sel.trim());

			selectors.forEach((selector: string) => {
				if (selector.startsWith("#")) {
					const elementId = selector.slice(1);
					const el = document.getElementById(elementId);
					if (el) {
						el.setAttribute("tabindex", "0");
					}
				}
			});
		}
	} catch (error) {
		console.error("Failed to fetch or apply CSS:", error);
	}
};

```
- Call the fetchAndApplyCss into page/oidc-callback/page.tsx file 

```

await fetchAndApplyCss()

```
Note: Call fetchAndApplyCss funciton in getUser function in oidc-callbackpage before setRedirectUrl state.

- Call the CSS API in one of the service file. 

```
// lib/axios/base_url.ts file
export const securityServiceAxios = createAxiosInstance(
	process.env.NEXT_PUBLIC_VSECURITY_BASE_API_URL,
);

// service/security.service.ts file

export const getGenerateCss = () => {
	const url = `v1/application-accessed-css?applicationId=${process.env.NEXT_PUBLIC_CLIENT_ID}`;
	return securityServiceAxios
		.get(url)
		.catch(error =>
			VHandleError(
				error,
				{ service: "get-generatecss" },
				process.env.NEXT_PUBLIC_SUPPRESS_API_TOASTER_ERROR_MESSAGE,
			),
		);
};

```


``New template (where using the useAxiosInstance)``

- In the new template code, the link will be added in the _document.tsx file, and the rolesecurity API will be called in the _app.tsx file. Add link in _app.tsx or _document.tsx. 

- Update `_document.tsx` file with link 	`<link rel="stylesheet" href="/vlink/css/access-control.css" /> `

```
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
				<meta charSet="UTF-8" />
				<meta name="description" content="VTemplate" />
				<meta name="keywords" content="VTemplate" />
				<meta name="author" content="VTemplate" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="VTemplate" />
				<meta name="description" content="VTemplate" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="msapplication-tap-highlight" content="no" />

				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
					rel="stylesheet"
					as="style"
				/>
         		{/* /vlink path name will be change with your application path name */}

         		<link rel="stylesheet" href="/vlink/css/access-control.css" /> 

			</Head>

			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

```

- Update `_app.tsx` file and call useDynamicCss hook. 


```

import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import { AuthProvider } from "@/authcontext/AuthContext";
import "@/../public/css/access-control.css";
import { useDynamicCss } from "@/hooks/customhooks/useComponentAccess";
import RootLayout from "../global/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	useDynamicCss();
	return (
		<Providers>
			<AuthProvider>
				<RootLayout>
					<Component {...pageProps} />
				</RootLayout>
			</AuthProvider>
		</Providers>
	);
}

```
- Call the hook in hook folder. Create new file in src/hooks/customhooks/userComponentAccess.ts

```
import { useEffect, useState } from "react";
import { BASE_URLS } from "@/lib/config/config";
import { VSECURITY } from "@/lib/constant/apiconstant";
import useAxiosInterceptor from "./useAxiosInstance";

export const useDynamicCss = () => {
	const [enableSecurityApiCss, setEnableSecurityApiCss] = useState(false);
	const { axBe } = useAxiosInterceptor(BASE_URLS.VSECURITY);
	const appClientId = process.env.NEXT_PUBLIC_CLIENT_ID;
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
				return;
			}
		};
		checkForElement()
		const observe = new MutationObserver(() => {
			checkForElement()
		})
		observe.observe(document.body, {
			childList:true,
			subtree:true
		})
		return () => {
			observe.disconnect()
		}
	}, [appClientId]);

	useEffect(() => {
		if (!enableSecurityApiCss) return undefined;

		const fetchAndApplyCss = async () => {
			try {
				const response = await axBe.get(`${VSECURITY.COMPONENTACESS}`);
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
```


- Export VSECURITY ("@/lib/constant/apiconstant" file)
```
export const VSECURITY = {
	COMPONENTACESS: `v1/application-accessed-css?applicationId=${process.env.NEXT_PUBLIC_CLIENT_ID}`,
};
```
- Export BaseURL ("@/lib/config/config" file)
```
export const BASE_URLS = {
	VSECURITY: process.env.NEXT_PUBLIC_VSECURITY_BASE_API_URL,
};

```
### 2. Microfrontend

Remember:- 

- Follow the steps above. However, if you export any page as a microfrontend, call the API on that page and import the CSS file there.

Example:- 

page/task-list/index.ts file

```
import "@/../public/css/access-control.css";   
import { useDynamicCss } from "@/hooks/customhooks/useComponentAccess";
import {Box} "@mui/material"

const taskList = () => {
	
	useDynamicCss();

	return (
		<Box> Export task list page </Box>
	);
};

export default taskList;
```

or 

```
import "@/../public/css/access-control.css";   
import {Box} "@mui/material"
import { useEffect } from "react";
import { fetchAndApplyCss } from "@/lib/utils";

const taskList = () => {
	
	useEffect(() => {
		const roleSecurity = async () => {
			try {
        //take user from token
				const user = await getTokenData()
				if (user) {
					await fetchAndApplyCss();
				}
			} catch (error) {
				// empty;
			}
		};
		roleSecurity();
	}, []);

	return (
		<Box> Export task list page </Box>
	);
};

export default taskList;

```

## Step 4: Create a Script for Client ID Replacement
A script should be created to replace the `clientId` in the CSS file before deployment.

### **File Path:**
`scripts/replace-client-id-in-css.js`

in this below need to change the `devClientId` with your clientId.

### **Example Script:**
```javascript
require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

const cssFilePath = path.join(__dirname, '..', 'public', 'css', 'access-control.css');
const devClientId = '0896c4c3-e70b-4f84-9054-d6b57e5351d2';
const newClientId = process.env.NEXT_PUBLIC_CLIENT_ID;

if (!newClientId) {
  console.error('Error: NEXT_PUBLIC_CLIENT_ID is not defined in the .env file');
  process.exit(1);
}

async function updateCssFile() {
  try {
    const data = await fs.readFile(cssFilePath, 'utf8');
    const updatedData = data.replace(new RegExp(devClientId, 'g'), newClientId);
    await fs.writeFile(cssFilePath, updatedData, 'utf8');
    console.log('CSS file updated successfully!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateCssFile();
```
### **Add Npm Script**

add `update-css-client` npm script and call that script in `build` script.

### **File Path:**
`package.json`

```json
"scripts": {
    "build": "npm run update-css-client && next build",
    "update-css-client": "node scripts/replace-client-id-in-css.js"
  }
```

### **Update .eslintignore**

Add this below lines in `.eslintignore`.

```shell
package.json
scripts/*
```

### **Update .prettierignore**

Add this below lines in `.prettierignore`.

```shell
package.json
scripts/*
```

### **Install dotenv**

```shell
npm install dotenv --save-dev
```

---

## Step 5: Configure Business Process in Shipyard
In **Shipyard**, configure the **Business Process** to provide access to specific UI elements.

![Select UIElement in Business Process](../assets/business-process-ui-element.png)

---

