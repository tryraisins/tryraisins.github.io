import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm off-white paper background
        paper: {
          50: '#faf9f4',
          100: '#f3f1e9',
          200: '#e6e2d3',
        },
        // Near-black ink for text
        ink: {
          950: '#0a0908',
          900: '#141210',
          700: '#2a2724',
          500: '#6b6660',
          300: '#a09b91',
          200: '#c5c0b3',
        },
        flame: {
          400: '#ff8f73',
          500: '#ff6b4a',
          600: '#e8552f',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
