/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mint: '#7ED3BF',
        pink: '#FF9EA9',
        cream: '#FDF0EC',
        ink: '#2D3748',
        coral: '#FF8A80',
        azure: '#8ECAE6',
      },
    },
  },
  plugins: [],
}

