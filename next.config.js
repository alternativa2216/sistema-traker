/** @type {import('next').NextConfig} */
const nextConfig = {
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
      config.plugins.push(
        new (require('webpack').ProvidePlugin)({
          process: 'process/browser',
        })
      );

      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'node:process': 'process/browser',
        'process': 'process/browser',
      };
      
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
    '@genkit-ai/googleai',
    'genkit',
    '@genkit-ai/next',
  ],
};

module.exports = nextConfig;
