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
  webpack(config, { isServer }) {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    
    if (!isServer) {
      // Polyfill 'process' for the browser environment
      config.plugins.push(
        new (require('webpack').ProvidePlugin)({
          process: 'process/browser',
        })
      );
      
      // Also provide fallbacks for other Node.js modules that shouldn't be in the browser
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        net: false,
        tls: false,
      };
    }
    
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
