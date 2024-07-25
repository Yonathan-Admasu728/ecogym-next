import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '.625rem',
      },
      colors: {
        turquoise: '#40E0D0', // You can adjust this hex code to match your desired shade of turquoise
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config;
