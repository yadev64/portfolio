import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Direct interpolation: orange rgb(255, 69, 0) → blue rgb(0, 120, 255)
const lerpColor = (t) => {
    const r = Math.round(255 + t * (0 - 255));
    const g = Math.round(69 + t * (120 - 69));
    const b = Math.round(0 + t * (255 - 0));
    return { r, g, b };
};

const useAppStore = create(
    persist(
        (set) => ({
            // ── Theme ──
            theme: 'dark',
            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'dark' ? 'light' : 'dark';
                if (newTheme === 'light') {
                    document.documentElement.classList.add('light');
                } else {
                    document.documentElement.classList.remove('light');
                }
                return { theme: newTheme };
            }),
            setTheme: (theme) => set(() => {
                if (theme === 'light') {
                    document.documentElement.classList.add('light');
                } else {
                    document.documentElement.classList.remove('light');
                }
                return { theme };
            }),

            // ── Color Temperature ──
            // 0 = warm (orange), 100 = cool (blue) — direct RGB lerp, no in-between hues
            colorTemp: 0,
            setColorTemp: (temp) => set(() => {
                const clamped = Math.max(0, Math.min(100, temp));
                const { r, g, b } = lerpColor(clamped / 100);
                document.documentElement.style.setProperty('--accent-primary', `rgb(${r}, ${g}, ${b})`);
                document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.4)`);
                return { colorTemp: clamped };
            }),

            // ── Gamification ──
            xp: 0,
            addXp: (amount) => set((state) => {
                const newXp = Math.min(state.xp + amount, 100)
                return { xp: newXp }
            }),
            resetXp: () => set({ xp: 0 }),
            easterEggUnlocked: false,
            unlockEasterEgg: () => set({ easterEggUnlocked: true }),

            // ── Auth (Dashboard) ──
            authStatus: {
                isAuthenticated: false,
                token: null,
            },
            setAuth: (token) => set({
                authStatus: { isAuthenticated: true, token }
            }),
            logout: () => set({
                authStatus: { isAuthenticated: false, token: null }
            }),
        }),
        {
            name: 'yadev-portfolio-storage',
            partialize: (state) => ({
                theme: state.theme,
                colorTemp: state.colorTemp,
                xp: state.xp,
                easterEggUnlocked: state.easterEggUnlocked,
                authStatus: state.authStatus,
            }),
            onRehydrateStorage: () => (state) => {
                if (state && state.theme === 'light') {
                    document.documentElement.classList.add('light');
                } else {
                    document.documentElement.classList.remove('light');
                }
                if (state && state.colorTemp !== undefined && state.colorTemp !== 0) {
                    const { r, g, b } = lerpColor(state.colorTemp / 100);
                    document.documentElement.style.setProperty('--accent-primary', `rgb(${r}, ${g}, ${b})`);
                    document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.4)`);
                }
            }
        }
    )
)

export default useAppStore
