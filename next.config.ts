import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para Docker
  output: 'standalone',
  
  // Deshabilitar telemetría en producción
  productionBrowserSourceMaps: false,
  
  // Optimizaciones
  swcMinify: true,
  
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
};

export default nextConfig;
