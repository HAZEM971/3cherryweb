/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  // 🔥 مهم جداً: تعطيل التصدير الستاتيكي
  output: undefined,
};

module.exports = nextConfig;
