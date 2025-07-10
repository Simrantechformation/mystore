import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true, 
  },
  // basePath: "/mystore",
};

export default nextConfig;
