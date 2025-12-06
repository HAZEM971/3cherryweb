/** @type {import('next').NextConfig} */
const nextConfig = {
  // لأننا على Firebase Hosting، نخلي الصور غير محسّنة من Next
  images: {
    unoptimized: true,
  },

  // 🔥 نتركه undefined حتى لا يستخدم output: "export"
  output: undefined,
};

module.exports = nextConfig;
