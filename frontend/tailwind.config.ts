import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
      },
      colors: {
        clinical: {
          bg: '#0a0f1c',
          surface: '#111827',
          elevated: '#1a2234',
          border: '#1f2937',
          borderLight: '#374151',
          text: '#f3f4f6',
          muted: '#9ca3af',
          accent: '#22d3ee',
          accentDark: '#0891b2',
          warm: '#fef3c7',
          coral: '#fb7185',
          success: '#34d399',
        },
        // Keep legacy colors for transition
        medical: {
          blue: '#22d3ee',
          purple: '#a78bfa',
          pink: '#fb7185',
          red: '#f87171',
          green: '#34d399',
          cyan: '#22d3ee',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'clinical-gradient': 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
        'clinical-subtle': 'linear-gradient(180deg, #111827 0%, #0a0f1c 100%)',
        'dot-pattern': 'radial-gradient(circle, #374151 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-sm': '24px 24px',
        'dot-md': '32px 32px',
      },
      boxShadow: {
        'clinical': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'clinical-lg': '0 8px 40px rgba(0, 0, 0, 0.5)',
        'accent-glow': '0 0 20px rgba(34, 211, 238, 0.3)',
        'accent-glow-lg': '0 0 40px rgba(34, 211, 238, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-up-delay': 'slideUp 0.6s ease-out 0.1s both',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
