/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5cb85c',
          dark: '#449d44',
          light: '#80c780',
        },
      },
    },
  },
  plugins: [],
}
