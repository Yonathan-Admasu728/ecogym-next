/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecogym-django-project-bucket.s3.amazonaws.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  productionBrowserSourceMaps: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['react-toastify'] = 'react-toastify'
    }
    return config
  },
};

export default nextConfig;