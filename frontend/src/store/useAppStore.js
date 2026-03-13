import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
            // 0 = warm (orange), 100 = cool (blue)
            colorTemp: 0,
            setColorTemp: (temp) => set(() => {
                const clamped = Math.max(0, Math.min(100, temp));
                // Interpolate hue from 15 (warm orange) to 195 (icy blue)
                const hue = 15 + (clamped / 100) * 180;
                const sat = 100;
                const light = 50;
                document.documentElement.style.setProperty('--accent-primary', `hsl(${hue}, ${sat}%, ${light}%)`);
                // Also adjust the glow shadow
                document.documentElement.style.setProperty('--accent-glow', `hsla(${hue}, ${sat}%, ${light}%, 0.4)`);
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
                // Re-apply color temperature on load
                if (state && state.colorTemp !== undefined && state.colorTemp !== 0) {
                    const hue = 15 + (state.colorTemp / 100) * 180;
                    document.documentElement.style.setProperty('--accent-primary', `hsl(${hue}, 100%, 50%)`);
                    document.documentElement.style.setProperty('--accent-glow', `hsla(${hue}, 100%, 50%, 0.4)`);
                }
            }
        }
    )
)

export default useAppStore
