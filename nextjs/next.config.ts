import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
    // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
    dirs: ['pages', 'utils'],
  },
};

export default nextConfig;
