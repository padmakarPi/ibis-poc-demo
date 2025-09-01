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
  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await primaryInstance.request({
        ...primaryConfig,
        data: mapPrimaryRequest(request),
      });
      return mapPrimaryResponse(res.data);
    } catch (error: any) {
      lastError = error;
      console.warn(`Attempt ${attempt + 1} failed for ${serviceName}: ${error.message}`);
      if (attempt < retries) {
        const backoffDelay = retryDelayMs * Math.pow(2, attempt);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await new Promise(r => setTimeout(r, backoffDelay));
      }
    }
  }

  try {
    const res = await fallbackInstance.request({
      ...fallbackConfig,
      data: mapFallbackRequest(request),
    });
    return mapFallbackResponse(res.data);
  } catch (fallbackError: any) {
    console.error(`Fallback request failed for ${serviceName}: ${fallbackError.message}`);
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
			request,
			serviceName: "contacts",
			primaryInstance: contactCloudfareAxiosInstance,
			primaryConfig: {
				url: "/api/getcontact-list",
				method: "POST",
			},
			mapPrimaryRequest: req => ({
				customerid: customerId,
				environment: APPEnvironment.PROD.toLowerCase(),
				...req,
			}),
			mapPrimaryResponse: res => res,
			fallbackInstance: contactServiceAxios,
			fallbackConfig: {
				url: "/v5/contacts",
				method: "POST",
			},
			mapFallbackRequest: (req) => {

				if(Array.isArray(req.contactIds)) {
					(req.contactIds as any) = req.contactIds.join(',')
				}

				if(Array.isArray(req.userIds)) {
					(req.userIds as any) = req.userIds.join(',')
				}

				return {
					...req,
				};
			},
			mapFallbackResponse: res => res?.result?.result || [],
		});
```

* In this example:

  * Primary API: **Cloudflare contact worker service**.
  * Fallback API: **our internal contact service**.
  * Automatic retry before switching.
  * If both fail, the user will see an **alert popup**.

---

With this approach, our application remains resilient even if external dependencies are unreliable, and users are kept informed through **error popups** when both APIs fail.

