/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Paksa semua output jadi static tanpa prerender yang aneh-aneh
  output: 'standalone', 
};

export default nextConfig;
