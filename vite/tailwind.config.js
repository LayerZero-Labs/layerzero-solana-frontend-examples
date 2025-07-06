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
          dark: '#0F0F0F',
          gray: {
            950: '#050505',
            900: '#111111',
            800: '#1A1A1A',
            700: '#2A2A2A',
            600: '#404040',
            500: '#666666',
            400: '#888888',
            300: '#AAAAAA',
            200: '#CCCCCC',
            100: '#E5E5E5',
            50: '#F5F5F5',
          },
          white: '#FFFFFF',
          purple: {
            500: '#8B5CF6',
            400: '#A78BFA',
          }
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.1' }],
        'sm': ['0.875rem', { lineHeight: '1.2' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.4' }],
        'xl': ['1.25rem', { lineHeight: '1.3' }],
        '2xl': ['1.5rem', { lineHeight: '1.25' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.1' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['4rem', { lineHeight: '1' }],
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
      },
      backgroundSize: {
        'grid': '24px 24px',
      }
    },
  },
  plugins: [],
} 