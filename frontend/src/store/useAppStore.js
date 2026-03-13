import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
    persist(
        (set) => ({
            xp: 0,
            addXp: (amount) => set((state) => ({ xp: Math.min(state.xp + amount, 100) })),
            sectionsVisited: [],
            addSectionVisit: (section) => set((state) => {
                if (!state.sectionsVisited.includes(section)) {
                    return {
                        sectionsVisited: [...state.sectionsVisited, section],
                        xp: Math.min(state.xp + 10, 100) // 10 XP per unique section
                    }
                }
                return state;
            }),
            authStatus: {
                isAuthenticated: false,
                token: null,
            },
            setAuth: (token) => set({ authStatus: { isAuthenticated: true, token } }),
            logout: () => set({ authStatus: { isAuthenticated: false, token: null } }),
        }),
        {
            name: 'yadev-portfolio-storage',
            partialize: (state) => ({ xp: state.xp, sectionsVisited: state.sectionsVisited }),
        }
    )
)
