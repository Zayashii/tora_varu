/** @type {import('next').NextConfig} */

// Vercel HTTPS дээр ажилладаг тул browser-ээс http:// IP хаяг руу шууд
// хандвал "mixed content" алдаа гарна. Иймд backend-ийг /api/backend/*
// замаар Vercel-ээр дамжуулна (API_ORIGIN орчны хувьсагч).
const API_ORIGIN = process.env.API_ORIGIN;

module.exports = {
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  async rewrites() {
    if (!API_ORIGIN) return [];
    return [
      {
        source: '/api/backend/:path*',
        destination: `${API_ORIGIN.replace(/\/$/, '')}/:path*`,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
