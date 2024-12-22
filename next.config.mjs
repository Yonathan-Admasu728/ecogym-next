/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecogym-django-project-bucket.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  productionBrowserSourceMaps: true,
  webpack: (config, { dev, isServer }) => {
    // Handle source maps and .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    });

    return config;
  },
}

export default nextConfig;
