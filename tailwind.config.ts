import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '.625rem',
      },
      fontFamily: {
        'heading': ['var(--font-poppins)', 'sans-serif'],
        'body': ['var(--font-inter)', 'sans-serif']
      },
      colors: {
        darkBlue: {
          800: '#1B263B',
          900: '#0D1B2A'
        },
        turquoise: {
          400: '#4EECD5',
          500: '#40E0D0'
        },
        lightBlue: {
          100: '#778DA9'
        }
      },
    },
  },
  plugins: [],
}
export default config;
