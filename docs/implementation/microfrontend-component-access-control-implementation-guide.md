## VMicroFrontendAccessControl Implementation Guide

### Overview
The `VMicroFrontendAccessControl` component provides an access control layer for microfrontend applications, allowing you to restrict access based on user permissions. By integrating this component, you can easily manage access checks and display customizable loading and access-denied screens.

### Basic Usage
To use `VMicroFrontendAccessControl`, wrap the microfrontend component with it. You must provide `clientId`, `securityServiceAxios`, and `sectionName` props, and optionally override the loading or access-denied components.

### Example Usage

Here’s an example of how to use `VMicroFrontendAccessControl` in a microfrontend wrapper:

```typescript
import { VMicroFrontendAccessControl } from "@vplatform/shared-components";
import { securityServiceAxios } from "@/lib/axios/base-urls";
import { ModuleFedaraionWrapper } from "@/components/ModuleFedarationWrapper";
import VesselDetails from ".";

const VesselDetailsWrapper = (props) => {
  return (
  <ModuleFedaraionWrapper themeMode={darkMode}>
        <VMicroFrontendAccessControl
            clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
            securityServiceAxios={securityServiceAxios}
            sectionName="Vessel Details"
        >
            <VesselDetails {...props} />
        </VMicroFrontendAccessControl>
    </ModuleFedaraionWrapper>
  );
};

export default VesselDetailsWrapper;
```

### Component Props

- **clientId** (string): The client identifier used for the access check. It can be passed dynamically or from an environment variable, e.g., `process.env.NEXT_PUBLIC_CLIENT_ID`.
- **securityServiceAxios** (AxiosInstance): The Axios instance used for making the access check request.
- **sectionName** (string): A descriptive name for the section, displayed on the Access Denied component.
- **LoadingComponent** (ReactNode, optional): Override the default loading component.
- **AccessDeniedComponent** (ReactNode, optional): Override the default access-denied component.

### Customizing Access Denied and Loading Components

The component provides flexibility to override the default implementations of loading and access-denied screens:

```typescript
<VMicroFrontendAccessControl
  clientId="your-client-id"
  securityServiceAxios={securityServiceAxios}
  sectionName="Example Section"
  LoadingComponent={<CustomLoading />}
  AccessDeniedComponent={<CustomAccessDenied  />}
/>
```

### Example Implementation of Custom AccessDenied Component

```typescript
import { FC } from "react";
import { VAccessDeniedProps } from "@/interfaces";

const CustomAccessDenied: FC<VAccessDeniedProps> = ({ onRetry, sectionName }) => (
  <div>
    <h1>{sectionName}</h1>
    <p>You do not have access to this section.</p>
    <button onClick={onRetry}>Retry</button>
  </div>
);
```

### Notes
- Ensure `clientId` and `securityServiceAxios` are correctly set up, as they are required for the access check.
- Use `onRetry` from the Access Denied component to allow users to reattempt access check.