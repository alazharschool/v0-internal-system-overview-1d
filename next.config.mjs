/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // وضع وضعية React الصارمة لتحسين الأداء
  experimental: {
    appDir: true, // مفعل لتشغيل مجلد app/
  },
  eslint: {
    ignoreDuringBuilds: true, // تجاهل تحذيرات ESLint أثناء البناء
  },
  typescript: {
    ignoreBuildErrors: true, // تجاهل أخطاء TypeScript أثناء البناء
  },
  images: {
    unoptimized: true, // الصور غير محسّنة لتجنب مشاكل البناء
  },
}

export default nextConfig
