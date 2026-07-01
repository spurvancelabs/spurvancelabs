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

  turbopack: {
    root: process.cwd(),
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing',
        permanent: false,
      },
      {
        source: '/about',
        destination: '/landing/about',
        permanent: false,
      },
      {
        source: '/contact',
        destination: '/landing/contact',
        permanent: false,
      },
      {
        source: '/internships',
        destination: '/landing/internships',
        permanent: false,
      },
      {
        source: '/jobs',
        destination: '/landing/jobs',
        permanent: false,
      },
      {
        source: '/products',
        destination: '/landing/products',
        permanent: false,
      },
      {
        source: '/services',
        destination: '/landing/services',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
