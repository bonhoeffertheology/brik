/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/brik',
  assetPrefix: '/brik/',
};

module.exports = nextConfig;
