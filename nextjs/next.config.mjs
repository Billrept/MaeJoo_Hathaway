/** @type {import('next').NextConfig} */

// const API_URL = "http://backend:8000";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000" // Local development backend URL
    : "http://backend:8000"; // Docker container backend URL


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
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 800,
      aggregateTimeout: 300,
    }
    return config
  },
};

export default nextConfig;