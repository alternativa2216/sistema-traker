/** @type {import('next').NextConfig} */

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
    ],
  },
};

module.exports = nextConfig;
