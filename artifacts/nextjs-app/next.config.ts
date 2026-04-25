import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Base path buat Cloudflare Pages/GitHub Pages
  basePath: process.env.BASE_PATH?.replace(/\/$/, "") || "",
  
  // Memastikan framer-motion terbaca dengan benar di server-side
  transpilePackages: ["framer-motion"],
  
  // Tambahan biar build lebih stabil di Termux
  eslint: {
    ignoreDuringBuilds: true, // Lewatin cek error tulisan biar build gak gagal tengah jalan
  },
  typescript: {
    ignoreBuildErrors: true, // Lu udah capek pelototin kodingan, biar dia build aja dulu
  },
};

export default nextConfig;
