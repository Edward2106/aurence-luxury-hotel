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
        navy: {
          950: '#070C1B',
          900: '#0B132B',
          850: '#131C38',
          800: '#1C2541',
          700: '#2A365C',
          600: '#3A4B7C',
        },
        gold: {
          50: '#FFFDF0',
          100: '#FDF8D9',
          200: '#F9EDA6',
          300: '#F3DD6D',
          400: '#E8C538',
          500: '#D4AF37', // Primary Luxury Gold
          600: '#B58E26',
          700: '#8E6B1B',
          800: '#6E5119',
          900: '#4F3814',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F5F0E6',
          300: '#EBE1D0',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(11, 19, 43, 0.25)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.3)',
        'soft-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
