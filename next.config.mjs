/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // Local development
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/**',
            },
            // Production — ganti dengan domain backend production
            {
                protocol: 'https',
                hostname: 'server-sh3.cloud', // ← ganti dengan domain asli
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;