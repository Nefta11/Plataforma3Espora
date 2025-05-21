/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          '50': '#f0f5ff',
          '100': '#e5edff',
          '200': '#cdddff',
          '300': '#a6c1ff',
          '400': '#799cff',
          '500': '#4c74ff',
          '600': '#1e47ff',
          '700': '#0026e6',
          '800': '#0024cc',
          '900': '#001f99',
          '950': '#000f4d',
        },
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float-slow': 'float 20s ease-in-out infinite',
        'move-x-slow': 'moveX 25s ease-in-out infinite',
        'move-y-slow': 'moveY 20s ease-in-out infinite',
        'move-x-fast': 'moveX 15s ease-in-out infinite',
        'move-y-fast': 'moveY 12s ease-in-out infinite',
        'move-x': 'moveX 18s ease-in-out infinite',
        'move-y': 'moveY 15s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translate(0, 0)',
          },
          '50%': {
            transform: 'translate(20px, -20px)',
          },
        },
        moveX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(100px)' },
        },
        moveY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
