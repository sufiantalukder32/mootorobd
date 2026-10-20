/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
        secondary: '#27AE60',
        accent: '#F39C12',
        darkText: '#2C3E50',
        lightBg: '#F8F9FA',
        error: '#E74C3C',
      },
      fontFamily: {
        sans: [
          'Segoe UI',
          'Noto Sans Bengali',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      boxShadow: {
        card: '0 8px 24px rgba(44, 62, 80, 0.08)',
      },
    },
  },
  plugins: [],
};
