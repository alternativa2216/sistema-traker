import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack(config) {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
  // Adicionado para resolver erros de build com pacotes de servidor.
  // Isso instrui o Next.js a não empacotar esses módulos no lado do cliente.
  serverComponentsExternalPackages: ['mysql2', 'nodemailer'],
};

export default nextConfig;
