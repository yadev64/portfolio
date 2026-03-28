/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syncopate', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        primary: 'var(--color-primary)',
        textMain: 'var(--color-text-main)',
        textMuted: 'var(--color-text-muted)',
      },
    },
  },
  plugins: [],
}
