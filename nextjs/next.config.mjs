/** @type {import('next').NextConfig} */

// const API_URL = "http://backend:8000";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000" // Local development backend URL
    : "http://backend:8000"; // Docker container backend URL

const nextConfig = {
  reactStrictMode: true,
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