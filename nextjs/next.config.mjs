/** @type {import('next').NextConfig} */

const API_URL = "http://backend:8000";

const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
