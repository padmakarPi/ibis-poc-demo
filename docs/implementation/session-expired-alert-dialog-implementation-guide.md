# Session Expired Alert Dialog Implementation

Follow these steps to implement a session expired alert dialog in your project.

## Step 1: Add .npmrc File

Create a `.npmrc` file in the root of your project with the following contents:

```plaintext
registry=https://registry.npmjs.org/
always-auth=true
@vplatform:registry=https://pkgs.dev.azure.com/vgroupframework/_packaging/common-utilities/npm/registry/
```

## Step 2: Authenticate with VSTS NPM

Execute the following command at the project level to get the token:

```sh
vsts-npm-auth -config .npmrc
```

## Step 3: Install Shared Components Package

Install the `@vplatform/shared-components` package by running:

```sh
npm i @vplatform/shared-components
```

## Step 4: Modify OIDC Configuration

Remove the following code from `oidc-config.ts|tsx`:

```typescript
userManager.events.addUserSignedOut(async () => {
    console.log("LOGOUT");
    await new AuthService().logout();
});
```

## Step 5: Update _app.tsx

Open `_app.tsx` and add the following code inside the component:

```typescript
import { useEffect, useState } from "react";
import { userManager } from "@/constants/config/oidc.config";
import { VSessionExpiredAlertDialog } from "@vplatform/shared-components";
import AuthService from "@/services/auth.service";

const authService = new AuthService();

const MyApp = ({ Component, pageProps }) => {
    const [sessionExpiredAlertDialogOpen, setSessionExpiredAlertDialogOpen] = useState(false);

    useEffect(() => {
        userManager.events.addUserSignedOut(async () => {
            await userManager.removeUser();
            setSessionExpiredAlertDialogOpen(true);
        });
    }, []);

    const onRetry = async () => {
        await authService.login();
    };

    return (
        <>
            <Component {...pageProps} />
            <VSessionExpiredAlertDialog
                open={sessionExpiredAlertDialogOpen}
                setOpen={setSessionExpiredAlertDialogOpen}
                onRetry={onRetry}
            />
        </>
    );
};

export default MyApp;
```
### Step 6: Update azure-pipelines.yml

Check if `npmAuthenticate` is enabled or not. If not, then enable it like below.

```yaml
stages:
- stage: BuildPublishandDeploy 
  displayName: Build image, publish to DockerHub, and deploy to k8s
  jobs: 
  - template: Pipeline-templates/Jobs/docker_build_publish_deploy.yml@templates
    parameters:
      serviceName: $(serviceName)
      k8sManifestPath: $(k8sManifestPath)
      env_name: $(env)
      chart_Path: $(chart_Path)
      release_Name: $(release_name)
      npmAuthenticate: true # Ensure this option is enabled
      value_File_Path: $(k8sManifestPath)
      runCodescan: true
```

### Step 7: Update Dockerfile

Review your Dockerfile for the following steps and replace them with the updated commands:

```shell
# Replace these two steps
COPY package.json package-lock.json ./
RUN npm install

# With these steps
COPY package.json package-lock.json ./
COPY .npmrc ./
RUN npm ci --force
RUN rm -f .npmrc
```

This code sets up an alert dialog that will appear when the user's session expires, prompting them to log in again. The `VSessionExpiredAlertDialog` component is displayed at the same level as the main `Component` inside the `_app.tsx` file.

## Testing Steps

1. Log into two different applications: Application A (where the above feature is implemented) and Application B.
2. Log out from Application B.
3. After logging out is complete, a "You are not signed in" alert dialog will appear in Application A.
4. Clicking "Retry" on this dialog will take you to the login screen.
5. If you log back into Application B and then return to Application A, clicking the "Retry" button on the "You are not signed in" dialog in Application A should automatically log you back in without needing to re-enter credentials.