/** @type {import('next').NextConfig} */

const nextConfig = {
  // ENABLE BASE PATH: Uncomment base path config.
    // basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    experimental: {
        optimizePackageImports: ["@vplatform/shared-components"]
      },
    
    // webpack(config) {
    //     const baseUrl = `${process.env.NEXT_PUBLIC_ORIGIN || ''}${process.env.NEXT_PUBLIC_BASE_PATH || ''}`;
        
    //     // Set public path for module federation
    //     config.output.publicPath = `${baseUrl}/_next/`; 
    //     return config;
    //   },
}

module.exports = nextConfig