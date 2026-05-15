/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        background: '#0F172A', // slate-900
        card: '#1E293B', // slate-800
        primary: '#8B5CF6', // violet-500
        success: '#10B981', // emerald-500
        danger: '#EF4444', // red-500
        warning: '#F59E0B', // amber-500
        textMuted: '#94A3B8', // slate-400
      }
    },
  },
  plugins: [],
}
