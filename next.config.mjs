/** @type {import('next').NextConfig} */
const nextConfig = {
    // a configuração de output "standalone" é desnecessária e pode causar problemas
    // com a forma como o PM2 e o Nginx servem a aplicação.
    // output: 'standalone', 
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'i.postimg.cc',
            }
        ],
    },
};

export default nextConfig;
