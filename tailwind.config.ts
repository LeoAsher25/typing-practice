import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        finger: {
          LL: '#FCA5A5',
          LR: '#FBCFE8',
          LM: '#FDE68A',
          LI: '#86EFAC',
          TH: '#E5E7EB',
          RI: '#93C5FD',
          RM: '#C7D2FE',
          RR: '#DDD6FE',
          RL: '#FBCFE8',
        },
      },
    },
  },
  plugins: [],
};

export default config;

