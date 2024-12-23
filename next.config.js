/** @type {import('next').NextConfig} */

const nextConfig = {
  // ENABLE BASE PATH: Uncomment base path config.
    // basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    experimental: {
        optimizePackageImports: ["@vplatform/shared-components"]
      },
}

module.exports = nextConfig