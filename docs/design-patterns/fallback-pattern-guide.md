# Fallback Pattern Guide

## 1. What is the Fallback Pattern?

The **Fallback Pattern** is a **resilience design pattern** used to ensure system reliability when a dependency (such as a third-party API or service) becomes unavailable or fails.

* Instead of failing the request completely, the system falls back to an **alternative source** (like our internal API) to continue serving data.
* This minimizes downtime and ensures users still receive a response, even if it is degraded compared to the primary source.

---

## 2. Why Do We Need It?

We depend on **third-party APIs** to deliver certain functionalities. However, these services may face outages, latency, or rate-limiting issues. Without a fallback mechanism, such failures could directly impact our application and end-user experience.

By implementing the fallback pattern:

* ✅ We improve **system reliability** and **availability**.
* ✅ Users are **shielded from third-party downtime**.
* ✅ We gain control to serve responses from **our own API** when the third-party fails.

---

## 3. Frontend Fallback Utility

We provide a utility function `resilientApiCall` to handle fallback logic in frontend apps.

```ts
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { VHandleError } from "@vplatform/shared-components";
import { ENV_METADATA } from "@/constants/metadata/env.metadata";

interface ResilientOptions<TReq, TRes> {
	request: TReq;
	serviceName: string;
	primaryInstance: AxiosInstance;
	primaryConfig: Omit<AxiosRequestConfig, "data">;
	mapPrimaryRequest?: (req: TReq) => any;
	mapPrimaryResponse?: (res: any) => TRes;
	fallbackInstance: AxiosInstance;
	fallbackConfig: Omit<AxiosRequestConfig, "data">;
	mapFallbackRequest?: (req: TReq) => any;
	mapFallbackResponse?: (res: any) => TRes;
	retries?: number;
	retryDelayMs?: number;
}

// eslint-disable-next-line consistent-return
export async function resilientApiCall<TReq, TRes>({
	request,
	serviceName,
	primaryInstance,
	primaryConfig,
	mapPrimaryRequest = r => r,
	mapPrimaryResponse = r => r,
	fallbackInstance,
	fallbackConfig,
	mapFallbackRequest = r => r,
	mapFallbackResponse = r => r,
	retries = 0,
	retryDelayMs = 200,
}: ResilientOptions<TReq, TRes>): Promise<TRes> {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			// eslint-disable-next-line no-await-in-loop
			const res = await primaryInstance.request({
				...primaryConfig,
				...(primaryConfig.method?.toUpperCase() === "GET"
					? { params: mapPrimaryRequest(request) }
					: { data: mapPrimaryRequest(request) }),
			});
			if (
				typeof res.data === "string" &&
				res.headers["content-type"]?.includes("text/html")
			) {
				throw new Error(`Primary API returned HTML error page`);
			}

			return mapPrimaryResponse(res.data);
		} catch (error: any) {
			const status = error?.response?.status;
			if (attempt < retries && (status === 429 || status === 503 || !status)) {
				const backoffDelay = retryDelayMs * 2 ** attempt;
				// eslint-disable-next-line no-await-in-loop
				await new Promise<void>(resolve => {
					setTimeout(resolve, backoffDelay);
				});
			}
		}
	}

	try {
		const res = await fallbackInstance.request({
			...fallbackConfig,
			...(fallbackConfig.method?.toUpperCase() === "GET"
				? { params: mapFallbackRequest(request) }
				: { data: mapFallbackRequest(request) }),
		});

		if (
			typeof res.data === "string" &&
			res.headers["content-type"]?.includes("text/html")
		) {
			throw new Error(`Fallback API returned HTML error page`);
		}
		return mapFallbackResponse(res.data);
	} catch (fallbackError: any) {
		console.error(
			`Fallback request failed for ${serviceName}: ${fallbackError.message}`,
		);
		VHandleError(
			fallbackError,
			{ service: `${serviceName}-fallback` },
			ENV_METADATA.SUPPRESS_API_TOASTER_ERROR_MESSAGE,
		);
	}
}

```

---

## 4. How It Works

1. **Primary Call Attempted:**

   * Tries the **primary API** (e.g., third-party service).
   * Supports **retries** before failing over.

2. **Fallback Triggered:**

   * If primary fails after all retries, the request is sent to the **fallback API** (e.g., our backend).

3. **Error Handling & Alerts:**

   * If the fallback request also fails, `VHandleError` displays an **error alert popup** to the user.
   * The popup includes the **service name** (e.g., `contacts-fallback`) so users know which service failed.

---

## 5. Example Usage

```ts
const response = await resilientApiCall<
  ContactListCloudfareRequest,
  Array<ContactsCloudfareResponse> | null
>({
  request, // The incoming request object containing all properties required by both APIs
  serviceName: "contacts",
  primaryInstance: contactCloudfareAxiosInstance, // Axios instance for Cloudflare
  primaryConfig: {
    url: "/api/getcontactslist", // Cloudflare endpoint
    method: "POST",
  },
  mapPrimaryRequest: (req) => ({
    // Transform request before sending to Cloudflare
    customerid: customerId,
    environment: APPEnvironment.PROD.toLowerCase(),
    ...req,
  }),
  mapPrimaryResponse: (res) => res, // Transform the Primary response
  fallbackInstance: contactServiceAxios, // Axios instance for internal service
  fallbackConfig: {
    url: "/v5/contacts", // Internal endpoint
    method: "POST",
  },
  mapFallbackRequest: (req) => {
    // Transform request before sending to internal service
    if (Array.isArray(req.contactIds)) {
      req.contactIds = req.contactIds.join(",");
    }

    if (Array.isArray(req.userIds)) {
      req.userIds = req.userIds.join(",");
    }

    return {
      ...req,
    };
  },
  mapFallbackResponse: (res) => res?.result?.result || [] // Transform the fallback response
});

```

* In this example:

  * Primary API: **Cloudflare contact worker service**.
  * Fallback API: **our internal contact service**.
  * Automatic retry before switching.
  * If both fail, the user will see an **alert popup**.

---

With this approach, our application remains resilient even if external dependencies are unreliable, and users are kept informed through **error popups** when both APIs fail.

