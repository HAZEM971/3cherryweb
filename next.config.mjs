/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 🔥 هذا يجعل Next.js ينتج مجلد out تلقائيًا
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
