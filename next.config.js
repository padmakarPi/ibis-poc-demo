
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
        exposes: {
          // './defect-app': './src/components/DefectBox/index',
        },
  
        shared: {},
        extraOptions: {},
      }),
    );
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