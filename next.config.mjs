/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
     images: {
      domains: ["127.0.0.1", "localhost"],
      dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
