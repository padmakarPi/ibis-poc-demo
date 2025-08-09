## 📘 Environment Variable Management with `env.json` in Next.js

## Overview

This project uses a centralized `env.json` file located in the `public/` directory to store environment variables at runtime. These variables are injected into the application using React Context and made accessible throughout the app using custom hooks.

---

## 🔧 File Structure

```sh
project-root/
├── public/
│      └── env.json
├── src/
│ ├── context/
│ │ └── SecureEnvContext.tsx
| | ── hook/
│ │     └── customhook/
│ │         └── useRuntimeEnv.ts
│ ├── lib/
│ │ └── constant/
│ │     └── env.constant.ts
│ └── pages/
|       └── api/
|            └── env.ts
|       └── _app.tsx
```

---

### 📁 `public/env.json`

This file contains all the environment variables needed by the application. Example:

```json
{
  "NEXT_PUBLIC_CLIENT_ID": "0896c4c3-e70b-4f8e9054-d6b57e5351d2",
  "NEXT_PUBLIC_RESPONSE_TYPE": "code",
  "NEXT_PUBLIC_CLIENT_SCOPE": "openid profile email offline_access",
  "NEXT_PUBLIC_STS_AUTHORITY": "https://vomnichannel.shipsure.com",
  "NEXT_PUBLIC_VSECURITY_BASE_API_URL": "https://dev-microservices.shipsure.com/vsecurity",
  "NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL": "https://dev.shipsure.com/welcome",
  "NEXT_PUBLIC_VDOCUMENT_BASE_API_URL": "https://dev-vdoc.azurewebsites.net/api/Document",
  "BASE_PATH": "<your-application-base-path>",
  "NEXT_PUBLIC_ORIGIN": "http://localhost:3000",
  "NEXT_PUBLIC_APPBAR": "https://dev.shipsure.com/appbar",
  "NEXT_PUBLIC_APP_MANIFEST_ENVIRONMENT": "DEV"
}
```
## 🌐 API Route: `pages/api/env.ts`

```
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const filePath = path.join(process.cwd(), "public", "env.json");

	try {
		const fileContents = fs.readFileSync(filePath, "utf8");
		const json = JSON.parse(fileContents);
		res.status(200).json(json);
	} catch (error) {
		res.status(500).json({ error: "Unable to load env.json" });
	}
}
```


### `Context Setup: SecureEnvContext.tsx`
This file creates a React context to provide the environment variables to the entire app.

```
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

type SecureWrapperProviderType = {
	children: ReactNode;
};

type SecureEnvType = { [key: string]: string };
let cachedEnvData: SecureEnvType | null = null;
export const SecureContext = createContext<SecureEnvType>({});

export const SecureWrapperProvider = ({
	children,
}: SecureWrapperProviderType) => {
	const [envData, setEnvData] = useState<SecureEnvType | null>(cachedEnvData);

	useEffect(() => {
		const fetchEnv = async () => {
			if (cachedEnvData) return;
			const isDev =
					typeof window !== "undefined" &&
					window.location.hostname === "localhost";
				// add base path if your DNS contain the base path else use `/api/env`.
				const url = isDev ? "/api/env" : "/vtask/api/env";

			try {
				const res = await fetch(url, {
					headers: { "Cache-Control": "no-cache" },
				});
				if (!res.ok) throw new Error("Failed to fetch env via API");
				const data = await res.json();
				cachedEnvData = data;
				setEnvData(data);
			} catch (e) {
				console.error("API call to /api/env failed:", e);
				setEnvData({});
			}
		};

		fetchEnv();
	}, []);


	if (!envData || Object.keys(envData).length === 0) {
		return null;
	}
	return (
		<SecureContext.Provider value={envData}>{children}</SecureContext.Provider>
	);
};

export const useSecureEnv = () => useContext(SecureContext);

```

### Runtime Hook: useRuntimeEnv.ts
This hook is used to retrieve and normalize URLs or non-URL keys from the context.
```
import { useContext } from "react";
import { SecureContext } from "@/context/SecureEnvContext"; 
import { NON_URL_KEYS, URL_KEYS } from "@/lib/constant/env.constant";

const normalizeUrl = (url?: string): string | undefined =>
  url?.endsWith("/") ? url : `${url}/`;

export const useRuntimeEnv = () => {
  const env = useContext(SecureContext);
  if (!env) throw new Error("useRuntimeEnv must be used within SecureContext.Provider");

  const urls = URL_KEYS.reduce((acc, key) => {
    acc[key] = normalizeUrl(env[key]);
    return acc;
  }, {} as Record<string, string | undefined>);

  const nonUrls = NON_URL_KEYS.reduce((acc, key) => {
    acc[key] = env[key];
    return acc;
  }, {} as Record<string, string | undefined>);

  return { ...urls, ...nonUrls };
};
```
### Example of URL_KEYS and NON_URL_KEYS:

```
// env.constant.ts
export const URL_KEYS = [
  "NEXT_PUBLIC_VSECURITY_BASE_API_URL",
  "NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL",
  "NEXT_PUBLIC_STS_AUTHORITY"
];

export const NON_URL_KEYS = [
  "NEXT_PUBLIC_CLIENT_ID",
  "NEXT_PUBLIC_RESPONSE_TYPE",
  "NEXT_PUBLIC_CLIENT_SCOPE"
];
```

### Providing Context: _app.tsx:

```
<SecureWrapperProvider>
  <Providers>
    <ThemeContextProvider>
      <AuthProvider>
        <RootLayout>
          <ToastContainer />
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Component {...pageProps} />
          </ErrorBoundary>
        </RootLayout>
      </AuthProvider>
    </ThemeContextProvider>
  </Providers>
</SecureWrapperProvider>
```

### ✅ How to Use in Any Component

```
import { useRuntimeEnv } from "@/hooks/useRuntimeEnv";

const MyComponent = () => {
  const {
    NEXT_PUBLIC_VSECURITY_BASE_API_URL,
    NEXT_PUBLIC_CLIENT_ID
  } = useRuntimeEnv();

  console.log("Base API URL:", NEXT_PUBLIC_VSECURITY_BASE_API_URL);
  console.log("Client ID:", NEXT_PUBLIC_CLIENT_ID);

  return <div>Environment Loaded</div>;
};
```

### 📦 Exporting Pages as Microfrontends with Environment and MicroFrontendAccessControl

When you export pages as microfrontends, it's recommended to wrap them using your environment.

### Example export Component (Checklist.tsx)
```
import { Box } from "@mui/material";
import { ModuleFedaraionWrapper } from "@/components/ModuleFederationWrapper";
import ChecklistComponent from "@/components/ChecklistComponent";
import { IChecklistProps } from "@/types";
import { SecureEnvWrapper } from "@/components/SecureEnvWrapper";
import { SecureWrapperProvider } from "@/context/SecureContext";

const Checklist = (props: IChecklistProps) => {
  const { subTaskId, themeMode = false } = props;

  return (
    <SecureWrapperProvider>
      <SecureEnvWrapper sectionName={"Check list"}>
        <ModuleFedaraionWrapper themeMode={themeMode}>
          <Box padding={4} paddingTop={1}>
            <ChecklistComponent {...props} subTaskId={subTaskId} />
          </Box>
        </ModuleFedaraionWrapper>
      </SecureEnvWrapper>
    </SecureWrapperProvider>
  );
};

export default Checklist;


```

### SecureEnvWrapper Component Example

```
import useAxiosInterceptor from "@/hooks/customhooks/useAxiosInstance";
import { useRuntimeEnv } from "@/hooks/customhooks/useRuntimeEnv";
import { VMicroFrontendAccessControl } from "@vplatform/shared-components";
import React, { ReactNode } from "react";

type SecureEnvWrapperType = {
  children: ReactNode;
  sectionName: string;
};

export const SecureEnvWrapper = ({
  children,
  sectionName,
}: SecureEnvWrapperType) => {
  const { NEXT_PUBLIC_VTASK_APP_CLIENT_ID, NEXT_PUBLIC_VSECURITY_API_URL } =
    useRuntimeEnv();

  const { axBe: securityServiceAxios } = useAxiosInterceptor(
    NEXT_PUBLIC_VSECURITY_API_URL
  );

  return (
    <VMicroFrontendAccessControl
      clientId={NEXT_PUBLIC_VTASK_APP_CLIENT_ID}
      securityServiceAxios={securityServiceAxios}
      sectionName={sectionName}
    >
      {children}
    </VMicroFrontendAccessControl>
  );
};

```

## Update AuthContext.tsx
Note: If you are using new template code then update the AuthContext.tsx file, follow below PR.
```
https://dev.azure.com/vgroupframework/VPlatform-Apps/_git/Vplatform-Frontend-Template/pullrequest/157740
```

## 🐳 Dockerfile Update for env.json Runtime Injection
Add the following to your Dockerfile after installing dependencies:

```
COPY ./generate-env-js.sh ./generate-env-js.sh
RUN rm -f /app/public/env.json && chmod +x ./generate-env-js.sh && chown nextjs:nodejs ./generate-env-js.sh && chown -R nextjs:nodejs ./public && sed -i 's/\r$//' ./generate-env-js.sh

CMD ["/bin/sh", "-c", "./generate-env-js.sh && npm start"]

```
Note :  you can check in template Dockerfile

### ⚠️ Important Notes
- Sometimes URLs in your environment config already end with a slash (/).

- You do NOT need to manually add or check for trailing slashes in your code because the useRuntimeEnv hook  automatically normalizes URLs to always end with a slash.

- This means when you use URLs from useRuntimeEnv, you can safely concatenate paths without worrying about missing or double slashes.

```
const { NEXT_PUBLIC_STS_AUTHORITY } = useRuntimeEnv();

// NEXT_PUBLIC_STS_AUTHORITY is guaranteed to end with '/'
// So simply append your path without adding an extra slash

const redirectUri = `${NEXT_PUBLIC_STS_AUTHORITY}auth/oidc-callback`;

// This is safe and will NOT produce double slashes
OIDC_CONFIG.redirect_uri = redirectUri;
```
- Do NOT Use useRuntimeEnv Hook Outside the SecureWrapperProvider
- Always wrap your component tree (or at least the part where you call useRuntimeEnv) inside SecureWrapperProvider
- Since useRuntimeEnv is a React hook, it can only be used inside functional components or other custom hooks—not in regular constant files. Attempting to access runtime environment variables in such files will not work and may lead to unexpected behavior.
### Benefits of This Approach
✅ All environment variables are centrally managed.

✅ Supports runtime configuration (not baked into the build like .env).

✅ Easily mockable for different environments (dev/sit/uat/prod).

✅ Clear separation between URL-based and non-URL variables.
