/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    'postcss-preset-env': {
      features: {
        'custom-properties': false,
      },
    },
  },
};

export default config;