/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lab: {
          bg: '#080C14',
          card: '#0F172A',
          cardLight: '#1E293B',
          cardBorder: '#334155',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          accentBlue: '#3B82F6',
          accentBlueGlow: '#60A5FA',
          accentPurple: '#8B5CF6',
          accentPurpleGlow: '#A855F7',
          accentCyan: '#06B6D4',
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          textMuted: '#94A3B8',
          textSubtle: '#64748B',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px -3px rgba(59, 130, 246, 0.4)',
        'glow-purple': '0 0 20px -3px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.4)',
        'glow-success': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
