import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050506',
          900: '#0a0a0b',
          800: '#101012',
          700: '#17171a',
          600: '#1f1f24',
        },
        bone: {
          50: '#faf9f6',
          100: '#e8e6df',
          200: '#c7c5be',
          300: '#8f8d86',
          400: '#5e5c56',
        },
        coral: {
          400: '#ff8f73',
          500: '#ff6b4a',
          600: '#e8552f',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        widest: '0.32em',
      },
    },
  },
  plugins: [],
};

export default config;
