
const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    reactStrictMode: false,

  webpack(config, options) {
    const { webpack } = options;
    const baseUrl = `${process.env.NEXT_PUBLIC_ORIGIN || ''}${process.env.NEXT_PUBLIC_BASE_PATH || ''}`;

    config.plugins.push(
      new NextFederationPlugin({
        name: 'Template',
        filename: 'static/chunks/remoteEntry.js',
        remotes : {
          VWelcomeApp: `VWelcomeApp@${process.env.NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL}/_next/static/chunks/remoteEntry.js`,
          appbar: `appbar@${process.env.NEXT_PUBLIC_APPBAR}/_next/static/chunks/remoteEntry.js`,
        },
        exposes: {},
  
        shared: {},
        extraOptions: {},
      }),
    );
    if (!config.output) {
      config.output = {};
    }
    config.output.publicPath = `${baseUrl}/_next/`;
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

    return config;
  },
};