import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true, 
  },
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
