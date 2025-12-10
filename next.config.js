
const NextFederationPlugin = require('@module-federation/nextjs-mf');
const { withSentryConfig } = require("@sentry/nextjs");
const path = require('path')


module.exports = withSentryConfig({
  basePath: process.env.NODE_ENV === "production" ?  '':"",
  reactStrictMode: false,
  webpack(config, options) {
    const { webpack } = options;

    if (!config.output) {
      config.output = {};
    }
 if (!options.isServer) {
    config.output.publicPath = "auto";
  }    
  config.plugins.push(
      new NextFederationPlugin({
        name: 'Template',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {},

        shared: {},
        extraOptions: {},
       
      }),
    );
    
    config.module.rules.push(
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          "css-loader",
          "sass-loader",
        ],
      }
    );
    config.resolve.alias = {
  ...(config.resolve.alias || {}),
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
};
    return config;
  },
},
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: process.env.NEXT_PUBLIC_SENTRY_ORG,
    project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,

    authToken: process.env.SENTRY_AUTH_TOKEN,

    // Only print logs for uploading source maps in CI
    silent: false,

    sourcemaps: {
      disable: !(!!process.env.SENTRY_AUTH_TOKEN),
    },

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: false,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: false,
  });



