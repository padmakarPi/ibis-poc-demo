# Step-by-Step Guide for Deploying Next.js App on Path-Based URLs

## 1. Omni Client Updates

Update the Omni Client with the correct redirect URLs for each environment:

- **DEV**:  
  - `http://localhost:3000/<your-application-base-path>`  
  - `https://dev.shipsure.com/<your-application-base-path>`
  
- **SIT**:  
  - `https://sit.shipsure.com/<your-application-base-path>`
  
- **UAT**:  
  - `https://uat.shipsure.com/<your-application-base-path>`
  
- **PROD**:  
  - `https://app.shipsure.com/<your-application-base-path>`

Ensure the build team is provided with the appropriate redirect URLs for each environment.

---

## 2. Dockerfile Changes

Update the `Dockerfile` to ensure the Next.js app builds correctly with the base path:

```dockerfile
COPY --from=builder /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
```

These commands ensure all necessary files are included during the Docker build process.

---

## 3. Next.js Configuration

### Base Path Setup in `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH,
};

module.exports = nextConfig;
```

### Module Federation Configuration (if applicable)

If your app uses module federation, configure the `publicPath` as follows:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH,
  webpack(config) {
    const baseUrl = `${process.env.NEXT_PUBLIC_ORIGIN || ''}${process.env.NEXT_PUBLIC_BASE_PATH || ''}`;
    
    // Set public path for module federation
    config.output.publicPath = `${baseUrl}/_next/`; 
    return config;
  },
};

module.exports = nextConfig;
```

This configuration dynamically sets the `basePath` and `publicPath` based on environment variables.

---

## 4. OIDC (OpenID Connect) Configuration

Ensure OIDC uses the base path for proper redirection:

```javascript
const baseUrl = `${process.env.NEXT_PUBLIC_ORIGIN || ''}${process.env.NEXT_PUBLIC_BASE_PATH || ''}`;

OIDC_CONFIG.redirect_uri = `${baseUrl}/auth/oidc-callback`;
OIDC_CONFIG.post_logout_redirect_uri = `${baseUrl}/signout-callback-oidc`;
```

This ensures that the `redirect_uri` and `post_logout_redirect_uri` include the base path.

---

## 5. Environment Variables

Provide the following environment variables for each environment:

```bash
NEXT_PUBLIC_BASE_PATH = "<your-application-base-path>"
BASE_PATH = "<your-application-base-path>"

# Based on environment, set the origin URL
NEXT_PUBLIC_ORIGIN = 'https://dev.shipsure.com'

# For local development:
# NEXT_PUBLIC_ORIGIN = 'http://localhost:3000'
```

These variables dynamically control the app’s base path and origin URL.

---

## 6. Middleware Changes

If your project includes a `middleware.tsx` file, modify it as follows:

### Update Middleware Redirect Logic

Replace:

```javascript
return NextResponse.redirect(new URL("/", req.url));
```

with:

```javascript
return NextResponse.redirect(new URL(`${req.nextUrl.basePath || ""}/`, req.url));
```

### Health Page Skips

Ensure the middleware skips health check routes:

```javascript
req.nextUrl.pathname === "/health/live" ||
req.nextUrl.pathname === "/health/ready"
```

For more details on where to apply this logic, refer to the [middleware configuration in the template project](https://dev.azure.com/vgroupframework/VPlatform-Apps/_git/Vplatform-Frontend-Template?path=/src/middleware.tsx&version=GBDEV_1.2&line=10&lineEnd=11&lineStartColumn=3&lineEndColumn=43&lineStyle=plain&_a=contents).

If the health check pages are missing, you can copy them from the [Azure DevOps health page template](https://dev.azure.com/vgroupframework/VPlatform-Apps/_git/Vplatform-Frontend-Template?path=/src/pages/health&version=GBDEV_1.2&_a=contents).


---

## 7. Kubernetes Manifest Changes

### Liveness & Readiness Probes

Update the probes to include the base path:

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

### Ingress Rules

Ensure the base path is part of the ingress rules:

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

### Docker Compose (Optional)

If using `docker-compose.yaml`, add the base path:

```yaml
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - BASE_PATH=<your-application-base-path>
```

---

## 8. Example Kubernetes Manifest

Here's an example of a Kubernetes manifest file with a path-based base URL configuration:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: purchaseorder-app
data:
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: purchaseorder-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: purchaseorder-app
  template:
    metadata:
      annotations:
        kubectl.kubernetes.io/restartedAt: ""
      labels:
        app: purchaseorder-app
    spec:
      nodeSelector:
        kubernetes.io/os: linux
      imagePullSecrets:
        - name: dockerhub-secret
      containers:
      - name: purchaseorder-app
        image: vgroupvplatform/purchaseorderapp:DEV-latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
        livenessProbe:                
          initialDelaySeconds: 30
          periodSeconds: 20
          failureThreshold: 3
          timeoutSeconds: 15
          httpGet:
            path: /purchaseorder/health/live
            port: 3000
        readinessProbe:
          initialDelaySeconds: 30
          periodSeconds: 20
          successThreshold: 2
          failureThreshold: 2
          timeoutSeconds: 15
          httpGet:
            path: /purchaseorder/health/ready
            port: 3000
        env:
          - name: BASE_PATH
            value: "/purchaseorder"            
        envFrom:
          - configMapRef:
              name: common-configmap
          - configMapRef:
              name: purchaseorder-app
          
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: purchaseorder-app
spec:
  ingressClassName: nginx
  rules:
  - host: dev.shipsure.com
    http:
      paths:
      - path: /purchaseorder
        pathType: Prefix
        backend:
          service:
            name: purchaseorder-app
            port:
              number: 3000  
---
apiVersion: v1
kind: Service
metadata:
  name: purchaseorder-app
spec:
  selector:
    app: purchaseorder-app
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  type: ClusterIP
```

---

## Conclusion

By following these steps, your Next.js application will be correctly configured for deployment using a path-based URL (`/<your-application-base-path>`). This guide outlines the necessary changes for Omni client, Dockerfile, Next.js configuration, OIDC, environment variables, middleware, Kubernetes, and Docker Compose.

---