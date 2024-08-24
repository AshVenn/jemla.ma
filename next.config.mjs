/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // This will ignore TypeScript errors during the build
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Match all paths under the Cloudinary domain
      },
    ],
  },
};

export default nextConfig;
