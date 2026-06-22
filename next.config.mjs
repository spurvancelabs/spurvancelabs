/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  reactCompiler: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },

   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:'cdn3d.iconscout.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
