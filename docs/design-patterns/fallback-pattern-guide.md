# Fallback Pattern Guide

## 1. What is the Fallback Pattern?

The **Fallback Pattern** is a **resilience design pattern** that ensures system reliability when a dependency (like a third-party API or service) becomes unavailable or fails.

* Instead of letting the entire request fail, the system **falls back to an alternative source** (like an internal API).
* This reduces downtime and ensures users still receive data — even if it’s a degraded response.

---

## 2. Why Do We Need It?

Our applications rely on **external APIs and services** for key functionality. However, these can experience:

* Outages
* High latency
* Rate limiting

Without a fallback mechanism, such failures can **break the user experience**.

By using the fallback pattern:

* We improve **system reliability** and **availability**.
* Users are **shielded from external service downtime**.
* We can serve data from **our internal services** when the primary fails.

---

## 3. Fallback Utility — Now a Shared Package

The fallback logic previously implemented as a frontend utility is now extracted into a shared NPM package:

> **Package:** `@vplatform/resilient-api-call`

This package provides a robust `resilientApiCall` utility that handles:

* Primary + Fallback API logic
* Retries with exponential backoff
* Request/response mapping
* Error handling hooks

Install it with:

```bash
npm install @vplatform/resilient-api-call axios
```

---

## 4. How It Works

1. **Primary Call Attempted:**

   * The request first goes to the **primary API** (e.g., a Cloudflare Worker or third-party service).
   * Supports **automatic retries** with backoff.

2. **Fallback Triggered:**

   * If all retries fail, the request is routed to the **fallback API** (e.g., an internal service).

3. **Error Handling:**

   * Optional custom error handlers can log or show alerts when both APIs fail.

---

## 5. Example Usage

```ts
import { resilientApiCall } from '@vplatform/resilient-api-call';

async function fetchContacts(request) {
  return resilientApiCall({
    request, // The incoming request object containing all properties required by both APIs
    serviceName: 'contacts',

    primary: {
      axiosInstance: contactCloudflareAxios,
      axiosConfig: { 
        url: '/api/getcontactslist',// Cloudflare endpoint 
        method: 'POST' 
      },
      mapRequest: (req) => ({
        // Transform request before sending to Cloudflare
        customerid: req.customerId,
        environment: 'prod',
        ...req,
      }),
      mapResponse: (res) => res, // transform Cloudflare response if needed
    },

    fallback: {
      axiosInstance: contactInternalAxios,
      axiosConfig: { url: '/v5/contacts', method: 'POST' },
      mapRequest: (req) => ({
        ...req,
        contactIds: Array.isArray(req.contactIds)
          ? req.contactIds.join(',')
          : req.contactIds,
        userIds: Array.isArray(req.userIds)
          ? req.userIds.join(',')
          : req.userIds,
      }),
      mapResponse: (res) => res?.result?.result || [],
      onError: (error, { serviceName }) =>
        console.error(`Fallback failed for ${serviceName}:`, error.message),
    },
  });
}

```




