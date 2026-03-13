import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
    persist(
        (set) => ({
            // ── Theme ──
            theme: 'dark', // 'dark' | 'light'
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
            }
        }
    )
)

export default useAppStore
