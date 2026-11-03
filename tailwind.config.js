/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        alabaster: '#FAF9F6',
        charcoal: '#18181B',
        forest: {
          DEFAULT: '#1E3A2F',
          light: '#2A5041',
          dark: '#142820',
          muted: '#EBF1EE',
        },
        stone: {
          beige: '#E5E0D8',
          warm: '#F2EFE9',
          border: '#DCD6CC',
          text: '#57534E',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 50px -12px rgba(24, 24, 27, 0.06)',
        'luxury-hover': '0 25px 60px -12px rgba(30, 58, 47, 0.12)',
        'card': '0 4px 24px -4px rgba(24, 24, 27, 0.04)',
      },
    },
  },
  plugins: [],
};
