/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat Alternates', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      keyframes: {
        highlight: {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)',
          },
          '50%': {
            transform: 'scale(1.02)',
            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)',
          },
        },
      },
      animation: {
        highlight: 'highlight 1s ease-in-out',
      },
    },
  },
  plugins: [],
};
