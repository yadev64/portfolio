import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Direct interpolation: blue rgb(0, 120, 255) → orange rgb(255, 69, 0)
// Slider 0 = cold (blue), 100 = warm (orange)
const lerpColor = (t) => {
    const r = Math.round(0 + t * (255 - 0));
    const g = Math.round(120 + t * (69 - 120));
    const b = Math.round(255 + t * (0 - 255));
    return { r, g, b };
};

const useAppStore = create(
    persist(
        (set, get) => ({
            // --- Auth State ---
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

            // --- Theme State ---
            theme: 'light',
            isExplicitDarkMode: false,
            aesthetic: 'neumorphism',
            setAesthetic: (aesthetic) => set((state) => {
                document.documentElement.setAttribute('data-aesthetic', aesthetic);
                
                // Auto-dark mode logic for Clay
                if (aesthetic === 'clay') {
                    if (state.theme !== 'dark') {
                        document.documentElement.classList.remove('light');
                    }
                    return { aesthetic, theme: 'dark' };
                } else {
                    const targetTheme = state.isExplicitDarkMode ? 'dark' : 'light';
                    if (targetTheme === 'light') {
                        document.documentElement.classList.add('light');
                    } else {
                        document.documentElement.classList.remove('light');
                    }
                    return { aesthetic, theme: targetTheme };
                }
            }),
            setAestheticLive: (aesthetic) => {
                const labels = {
                    'neumorphism': 'NEUMO',
                    'glass': 'GLASS',
                    'brutal': 'BRUTAL',
                    'clay': 'CLAY'
                };
                
                document.documentElement.setAttribute('data-aesthetic', aesthetic);

                const state = get();
                
                // Auto-dark mode logic for Clay with persistence update
                let targetTheme = state.theme;
                if (aesthetic === 'clay') {
                    targetTheme = 'dark';
                    document.documentElement.classList.remove('light');
                } else {
                    targetTheme = state.isExplicitDarkMode ? 'dark' : 'light';
                    if (targetTheme === 'light') {
                        document.documentElement.classList.add('light');
                    } else {
                        document.documentElement.classList.remove('light');
                    }
                }
                
                if (state._commitTimeout) clearTimeout(state._commitTimeout);
                const commitTimeout = setTimeout(() => {
                    set({ aesthetic, theme: targetTheme, _commitTimeout: null });
                }, 150);

                if (state._tempTimeout) clearTimeout(state._tempTimeout);
                const showTimeout = setTimeout(() => {
                    set({ tempDisplayValue: labels[aesthetic] });
                    const hideTimeout = setTimeout(() => {
                        set({ tempDisplayValue: null, _tempTimeout: null });
                    }, 2000);
                    set({ _tempTimeout: hideTimeout });
                }, 300);

                set({ _commitTimeout: commitTimeout, _tempTimeout: showTimeout });
            },
            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'dark' ? 'light' : 'dark';
                if (newTheme === 'light') {
                    document.documentElement.classList.add('light');
                } else {
                    document.documentElement.classList.remove('light');
                }
                return { theme: newTheme, isExplicitDarkMode: newTheme === 'dark' };
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
            // 0 = cold (blue), 100 = warm (orange)
            colorTemp: 100,  // default warm
            tempDisplayValue: null,
            _tempTimeout: null,
            _commitTimeout: null,

            // Lightweight: CSS vars update instantly, store updates are fully debounced
            setColorTempLive: (temp) => {
                const clamped = Math.max(0, Math.min(100, temp));
                const { r, g, b } = lerpColor(clamped / 100);
                // Instant DOM update — no React involved
                document.documentElement.style.setProperty('--accent-primary', `rgb(${r}, ${g}, ${b})`);
                document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.4)`);

                const state = get();

                // Debounce colorTemp persist
                if (state._commitTimeout) clearTimeout(state._commitTimeout);
                const commitTimeout = setTimeout(() => {
                    set({ colorTemp: clamped, _commitTimeout: null });
                }, 150);

                // Debounce temp display on glyph
                const degC = Math.round((clamped / 100) * 50);
                if (state._tempTimeout) clearTimeout(state._tempTimeout);
                const showTimeout = setTimeout(() => {
                    set({ tempDisplayValue: degC });
                    // Auto-hide after 2s of no activity
                    const hideTimeout = setTimeout(() => {
                        set({ tempDisplayValue: null, _tempTimeout: null });
                    }, 2000);
                    set({ _tempTimeout: hideTimeout });
                }, 300);

                // Only store timeout refs — no tempDisplayValue here, avoids re-render
                set({ _commitTimeout: commitTimeout, _tempTimeout: showTimeout });
            },

            clearTempDisplay: () => set({ tempDisplayValue: null, _tempTimeout: null }),

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
                isExplicitDarkMode: state.isExplicitDarkMode,
                aesthetic: state.aesthetic,
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
                if (state && state.aesthetic) {
                    document.documentElement.setAttribute('data-aesthetic', state.aesthetic);
                } else {
                    document.documentElement.setAttribute('data-aesthetic', 'neumorphism');
                }
                if (state && state.colorTemp !== undefined) {
                    const { r, g, b } = lerpColor(state.colorTemp / 100);
                    document.documentElement.style.setProperty('--accent-primary', `rgb(${r}, ${g}, ${b})`);
                    document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.4)`);
                }
            }
        }
    )
)

export default useAppStore
