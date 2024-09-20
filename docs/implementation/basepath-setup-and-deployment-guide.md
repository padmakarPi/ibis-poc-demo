### Step-by-Step Guide for Deploying Next.js App with Path-Based Base URL

### 1. **Omni Client Changes**

Update the Omni Client with the correct redirect URLs for each environment:

- **DEV**:  
  - `http://localhost:3000/<basepath>`
  - `https://dev.shipsure.com/<basepath>`

- **SIT**:  
  - `https://sit.shipsure.com/<basepath>`

- **UAT**:  
  - `https://uat.shipsure.com/<basepath>`

- **PROD**:  
  - `https://app.shipsure.com/<basepath>`

Provide a script to the build team so that they can apply these redirect URLs for each environment against that OMNI Client.

---

### 2. **Dockerfile Changes**

Update the `Dockerfile` with the following lines to ensure the Next.js app builds correctly with the base path:

```dockerfile
COPY --from=builder /app/next.config.js ./ # Add this line
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
```

These commands ensure all necessary files are included during the Docker build process.

---

### 3. **Next.js Configuration**

#### Base Path Setup in `next.config.js`

```javascript
const NextFederationPlugin = require('@module-federation/nextjs-mf');
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
}

module.exports = nextConfig;
```

#### Module Federation (if applicable)

If you're using module federation, set the `publicPath`:

```javascript
const NextFederationPlugin = require('@module-federation/nextjs-mf');
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  webpack(config, options) {
    const baseUrl = `${process.env.NEXT_PUBLIC_ORIGIN || ''}${process.env.NEXT_PUBLIC_BASE_PATH || ''}`;
    
    // Set public path for module federation
    config.output.publicPath = `${baseUrl}/_next/`; 
    return config;
  }
}

module.exports = nextConfig;
```

This configuration dynamically sets the `basePath` and `publicPath` based on environment variables.

---

### 4. **OIDC (OpenID Connect) Configuration**

Update the OIDC configuration to use the base path:

```javascript
const baseUrl = `${process.env.NEXT_PUBLIC_ORIGIN || ''}${process.env.NEXT_PUBLIC_BASE_PATH || ''}`;

OIDC_CONFIG.redirect_uri = `${baseUrl}/auth/oidc-callback`;
OIDC_CONFIG.post_logout_redirect_uri = `${baseUrl}/signout-callback-oidc`;
```

This ensures that the `redirect_uri` and `post_logout_redirect_uri` include the base path.

---

### 5. **Environment Variables**

Set the following environment variables and provide them to the DevOps team:

```bash
NEXT_PUBLIC_BASE_PATH = "<your-application-base-path>"

# Based on environment change the URL
NEXT_PUBLIC_ORIGIN = 'https://dev.shipsure.com'

# For local development (update port if necessary):
# NEXT_PUBLIC_ORIGIN = 'http://localhost:3000'
```

These variables control the app’s base path and origin URL dynamically based on the environment.

---

### 6. **Kubernetes Manifest Changes**

#### **Liveness & Readiness Probes**
Prefix the base path in the health check URLs and ensure the health check pages (`/health/live` and `/health/ready`) exist in the app:

```yaml
livenessProbe:
  httpGet:
    path: /<your-application-base-path>/health/live  # Add base path
    port: 3000

readinessProbe:
  httpGet:
    path: /<your-application-base-path>/health/ready  # Add base path
    port: 3000
```

#### **Ingress Rules**
Define specific ingress rules to include the base path:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: <app-name>-app
spec:
  ingressClassName: nginx
  rules:
  - host: dev.shipsure.com
    http:
      paths:
      - path: /<your-application-base-path>  # Add base path
        pathType: Prefix
        backend:
          service:
            name: <app-name>-app
            port:
              number: 3000
```

---

### Conclusion

By following these steps, you ensure that your Next.js application is correctly configured to be deployed with a path-based URL (`/<your-application-base-path>`). This guide includes all necessary changes for Omni client updates, Dockerfile, Next.js configuration, OIDC, environment variables, and Kubernetes manifests.

---