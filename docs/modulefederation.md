# Module Federation

Module Federation is a feature in webpack, a popular JavaScript module bundler, that allows you to dynamically share code between multiple webpack builds. The concepts of "host" and "remote" play a crucial role in Module Federation.

### Host:

The host is the webpack build that serves as the main application.
It imports and uses modules from other webpack builds (remotes).
The host defines which modules it wants to consume from the remote builds.

### Remote:

The remote is a separate webpack build that exposes certain modules to be consumed by other builds (hosts).
It decides which modules to share and how they should be exposed.
Remotes can be thought of as external components or micro-frontends that can be dynamically loaded by the host.

## Pre Requisite for module federation

Host and remote projects need in next version - 13.4.19

## Downgrading a project from Next.js version 14 to version 13 involves a few key steps:

**Step 1:** Install next - 13.4.19

**Step 2:** Check next version in package.json 

**Step 3:** In src folder create pages folder if not exist

**Step 4:** Move routing files from the 'app' folder to the 'pages' folder. 

**Step 5:** Rename the routing file to 'index.js'.

**Step 6:** Note: In Next.js 13, a layout file is required in the 'app' folder.

**Step 7:** Also, ensure that in the 'pages' folder, there is an '_app.js' file and an 'index.js' file.

## Model Federation

Install model federation package in host and remote app

Package name - @module-federation/nextjs-mf

Package version - 7.0.8

```bash
npm install @module-federation/nextjs-mf@7.0.8 
```

## Remote

**Step 1:** To meet the requirements for model federation, you need to add your file to the "pages" folder. This file serves as the page that you want to export for model federation purposes.

- Ensure that your file contains the necessary logic or components that you intend to expose for federated use. Once added to the "pages" folder, it will be accessible and exportable for use within your federated application.

**Step 2:** To avoid theme-related issues when using remote components in a federated environment, it's a good practice to wrap the remote component in a wrapper component. This wrapper component can ensure that the remote component is styled consistently with the rest of your application, regardless of the underlying theme differences.

```jsx 
     <ModuleFedaraionWrapper>
        // your component
    </ModuleFedaraionWrapper>
```
- wrapper component 
```jsx 
   export const ModuleFedaraionWrapper = ({
        children,
    }: {
        children: React.ReactNode;
    }) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={lightTheme}>
                    <SnackbarProvider
                        autoHideDuration={3000}
                        anchorOrigin={{
                            horizontal: "right",
                            vertical: "top",
                        }}
                        Components={{
                            success: SuccessAlert,
                        }}
                    >
                        {children}
                    </SnackbarProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
```
**Step 3:** To configure your Next.js application and integrate the remote component with the wrapper component, you can make changes to your next.config.js file. Here's an example of how you can do this:

```jsx
    /** @type {import('next').NextConfig} */

const NextFederationPlugin = require('@module-federation/nextjs-mf');

const nextConfig = {
    webpack(config, options) {
        config.resolve.alias.canvas = false;
        const { isServer } = options;
        const federationConfig = {
          name: 'microfrontend',
          remoteType: 'var',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './compact-file-upload':'./src/pages/compact-file-upload/index',
          },
          shared: {
              react: { singleton: true, eager: true, requiredVersion: false },
              'react-dom': { singleton: true, eager: true, requiredVersion: false },
          },
        }
        config.plugins.push(new NextFederationPlugin(federationConfig));
        return config;
      },
}

module.exports = nextConfig
```
- Certainly! Let's break down the key properties in the `federationConfig` object:

1. **name**:
   - This property defines the name of the federated module. It should be unique and is used to identify the module when it's consumed by other federated modules.

2. **remoteType**:
   - Specifies the type of remote module federation. In this case, `'var'` indicates that the remote modules will be exposed as variables.

3. **filename**:
   - Specifies the path where the remote entry file will be generated. The remote entry file contains the information needed for other modules to consume the federated module.

4. **exposes**:
   - This property defines the modules or components that are exposed by the federated module. It maps the internal module paths to the paths that will be used by other modules to consume them.
   - In the provided example, `./compact-file-upload` is exposed as `./src/pages/compact-file-upload/index`. This means that other federated modules can import `./compact-file-upload` using the specified path.

5. **shared**:
   - Specifies the shared dependencies between modules to prevent duplication and ensure compatibility.
   - In this example, `react` and `react-dom` are specified as shared dependencies with the settings for singleton and eager loading.

By configuring these properties in the `federationConfig` object and using the `NextFederationPlugin`, you're setting up module federation in your Next.js application. This allows you to expose specific components or modules and share dependencies with other federated modules.

## Host

**Step 1:** To ensure that your host project is using Next.js version 13.

**Step 2:**  you need to add a URL to the `.env` file with a key that indicates it's for the micro frontend, specifically for the component named `CompactFileUpload`. Here's how you can add the key-value pair:

```
NEXT_PUBLIC_CompactFileUpload_MICROFRONTEND_BASE_URL=http://example.com/compact-file-upload
```

In this key:

- `NEXT_PUBLIC`: This prefix is used for environment variables that are exposed to the client-side JavaScript code.
- `CompactFileUpload`: This indicates the name of your component, as per your instruction.
- `MICROFRONTEND_BASE_URL`: This suffix indicates that it's the base URL for the micro frontend.

Replace `http://example.com/compact-file-upload` with the actual URL of your micro frontend component.

**Step 3:** To modify the configuration as per the provided instructions, here's how you can update the `next.config.js` file:

```javascript
/** @type {import('next').NextConfig} */
const NextFederationPlugin = require("@module-federation/nextjs-mf");

const nextConfig = {
  reactStrictMode: false,
  webpack(config, options) {
    const { isServer } = options;
    const federationConfig = {
      // Change the name to anything you prefer
      name: 'vchat',
      filename: 'static/chunks/remoteEntry.js',
      remotes: {
        // Add your remote key and value here
        // Replace `microfrontend` with your remote key
        // Use the URL with environment variable
        microfrontend: `microfrontend@${process.env.NEXT_PUBLIC_CompactFileUpload_MICROFRONTEND_BASE_URL}/_next/static/chunks/remoteEntry.js`
      },
    };
    config.plugins.push(new NextFederationPlugin(federationConfig));

    return config;
  },
};

module.exports = withPWA(nextConfig);
```

In this modified configuration:

- The `name` property is set to any name you prefer for your federation.
- Under `remotes`, replace `microfrontend` with the key for your remote.
- Use the URL with the environment variable `${process.env.NEXT_PUBLIC_CompactFileUpload_MICROFRONTEND_BASE_URL}` to dynamically specify the URL of your remote. Make sure the environment variable is set correctly.

**Step 4:** Integration of Remote Component

```javascript
import dynamic from 'next/dynamic';

// Define the dynamic component for FileUploader
const FileUploader = dynamic<IFileUploaderProps>(
  () => import("microfrontend/compact-file-upload"),
  { ssr: false }
);
```

In this step, you use the `dynamic` function from Next.js to dynamically import the remote component `FileUploader` and configure it to prevent server-side rendering (`ssr: false`).

**Step 5:** Usage of Remote Component
```javascript
<FileUploader
 toggleDarkMode={mode}
 reference1={channelNumber.toString()}
 tableName={DB_TABLES.VCHATUSERMESSAGES}
 DstIdSourceType={DST_ID_SOURCE_TYPE.CHAT}
/>
```

In this step, you use the `FileUploader` component just like any other React component, passing the necessary props to it (`toggleDarkMode`, `reference1`, `tableName`, `DstIdSourceType`).

Step 4 and 5 both steps demonstrate the integration and usage of the remote component in your Next.js application.