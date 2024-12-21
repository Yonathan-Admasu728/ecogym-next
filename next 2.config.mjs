/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ecogym-django-project-bucket.s3.amazonaws.com',
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    // Add a rule to handle .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Ignore source map warnings in development
    if (dev && !isServer) {
      config.ignoreWarnings = [
        { module: /node_modules\/react-toastify/ },
      ];
    }

    return config;
  },
};

export default nextConfig;