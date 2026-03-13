/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // New Neumorphic Theme
                background: 'var(--bg-primary)',
                surface: 'var(--bg-secondary)', // Exact same as background in true Neumorphism
                primary: 'var(--accent-primary)', // Neon Orange
                secondary: 'var(--accent-secondary)', // Bright White
                tertiary: 'var(--accent-tertiary)',
                border: 'var(--border)',
                textMain: 'var(--text-primary)',
                textMuted: 'var(--text-secondary)',

                // Legacy compatibility for other routes (Dashboard, Projects)
                bg: {
                    primary: 'var(--bg-primary)',
                    secondary: 'var(--bg-secondary)',
                    card: 'var(--bg-card)',
                },
                accent: {
                    primary: 'var(--accent-primary)',
                    secondary: 'var(--accent-secondary)',
                    tertiary: 'var(--accent-tertiary)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                }
            },
            boxShadow: {
                neu: '8px 8px 16px #161619, -8px -8px 16px #26262b', // Standard flat extruded card
                'neu-sm': '4px 4px 8px #161619, -4px -4px 8px #26262b', // Smaller elements (sliders, buttons)
                'neu-pressed': 'inset 6px 6px 12px #161619, inset -6px -6px 12px #26262b', // Active/clicked
                'neu-pressed-sm': 'inset 3px 3px 6px #161619, inset -3px -3px 6px #26262b', // Small pressed
                'neu-glow': '0 0 15px var(--accent-glow, rgba(255, 69, 0, 0.4))', // Dynamic accent glow
            },
            fontFamily: {
                display: ['"Space Grotesk"', 'sans-serif'], // Futuristic heading font
                body: ['DM Sans', 'sans-serif'],
                mono: ['"Space Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
}
