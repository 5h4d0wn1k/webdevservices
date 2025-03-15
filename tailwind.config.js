/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#818CF8'
        },
        accent: {
          DEFAULT: '#F472B6',
          dark: '#EC4899',
          light: '#F9A8D4'
        },
        neon: {
          blue: '#00F5FF',
          purple: '#FF00FF',
          pink: '#FF1493'
        }
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        glow: {
          'from': {
            'box-shadow': '0 0 20px #6366F1, 0 0 40px #818CF8, 0 0 60px #F472B6',
          },
          'to': {
            'box-shadow': '0 0 30px #4F46E5, 0 0 50px #6366F1, 0 0 70px #EC4899',
          },
        }
      },
      aspectRatio: {
        'w-16': 16,
        'h-9': 9,
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}