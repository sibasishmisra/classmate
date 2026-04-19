import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Nostalgic School Theme
        'chalk-white': '#f5f5dc',
        'chalkboard-black': '#1a1a1a',
        'chalk-gray': '#9ca3af',
        'paper-white': '#fefefe',
        'paper-cream': '#faf8f3',
        'ink-black': '#2d3748',
        'ruled-line': '#e5e7eb',
        'margin-red': '#dc2626',
        
        // Accent Colors - Subtle and Warm
        'accent-gold': '#f59e0b',
        'accent-blue': '#3b82f6',
        'accent-green': '#10b981',
        
        // Semantic Colors
        'error-red': '#ef4444',
        'warning-yellow': '#fbbf24',
        'success-green': '#10b981',
      },
      fontFamily: {
        body: ['Lora', 'serif'],
        ui: ['DM Sans', 'sans-serif'],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'chalk': '0 2px 8px rgba(245, 245, 220, 0.2)',
        'paper': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
