
const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  basePath: process.env.NODE_ENV === 'production' ? '/pathname' : '',
  reactStrictMode: false,

  webpack(config, options) {
    const { webpack } = options;

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
    config.output.publicPath = `${process.env.NEXT_PUBLIC_ORIGIN}/_next/`;
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