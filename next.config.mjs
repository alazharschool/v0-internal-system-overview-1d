/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['app', 'components', 'lib'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qumeveerinufukgpbcyk.supabase.co',
      },
    ],
  },
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
}

export default nextConfig
