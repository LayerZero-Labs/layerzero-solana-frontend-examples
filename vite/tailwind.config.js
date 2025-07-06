/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        layerzero: {
          black: '#000000',
          dark: '#0A0A0A',
          gray: {
            900: '#1A1A1A',
            800: '#2A2A2A',
            700: '#3A3A3A',
            600: '#4A4A4A',
            500: '#6A6A6A',
            400: '#8A8A8A',
            300: '#AAAAAA',
            200: '#CCCCCC',
            100: '#E6E6E6',
          },
          white: '#FFFFFF',
          blue: {
            500: '#0052FF',
            600: '#0040CC',
          }
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        'sans': ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      }
    },
  },
  plugins: [],
} 