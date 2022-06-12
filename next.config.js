/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.codewars.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/orbanszlrd',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
