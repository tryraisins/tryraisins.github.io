import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm charcoal — not the cold blue-black of v1
        canvas: {
          950: '#0a0908',
          900: '#0d0c0a',
          800: '#141210',
          700: '#1c1a17',
          600: '#26231f',
        },
        ink: {
          50: '#f5f2eb',
          100: '#e8e4d9',
          200: '#c2bcae',
          300: '#8a857a',
          400: '#5c584f',
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
