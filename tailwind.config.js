/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // LEO brand colors
        'leo-yellow': '#F7EF00',
        'leo-dark': '#1E293B',
        'leo-gray': '#64748B',
        'leo-light': '#F5F3EF',
        'leo-blue': '#38BDF8',
      },
    },
  },
  plugins: [],
};
