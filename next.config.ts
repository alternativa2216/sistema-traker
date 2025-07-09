import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
  serverComponentsExternalPackages: [
    'mysql2',
    'nodemailer',
    'firebase-admin',
    '@genkit-ai/googleai',
    'genkit',
    '@genkit-ai/next',
  ],
};

export default nextConfig;
