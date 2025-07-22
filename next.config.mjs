/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['s3.amazonaws.com'],
      },
  async rewrites() {
    return [
      {
        source: '/api/staking/:path*',
        destination: 'https://scan.platon.network/browser-server/staking/:path*',
      },
    ]
  },
};

export default nextConfig;
