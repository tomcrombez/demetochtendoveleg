import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        board: {
          bg: '#f4f7fb',
          card: '#ffffff',
          accent: '#1f5eff',
          muted: '#6b7280',
        },
      },
      boxShadow: {
        soft: '0 4px 18px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
