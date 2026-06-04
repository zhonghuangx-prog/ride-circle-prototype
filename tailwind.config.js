/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#000000',
        graphite: '#121212',
        titanium: '#f3f4f6',
        aurora: '#d7dde7',
        mist: '#a2acba',
      },
      boxShadow: {
        halo: '0 24px 60px rgba(215, 221, 231, 0.08)',
        glass: '0 10px 40px rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        sans: ['"SF Pro Display"', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        breathe: {
          '0%, 100%': {
            boxShadow:
              '0 0 0 0 rgba(243, 244, 246, 0.05), 0 24px 70px rgba(243, 244, 246, 0.08)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow:
              '0 0 0 16px rgba(243, 244, 246, 0.02), 0 28px 90px rgba(243, 244, 246, 0.14)',
            transform: 'scale(1.015)',
          },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        breathe: 'breathe 4.4s ease-in-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
