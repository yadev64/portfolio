/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
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
                },
                border: 'var(--border)',
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
