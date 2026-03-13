import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { useAppStore } from '../../store/useAppStore'

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export const GlobalGamification = () => {
    const { xp, addXp } = useAppStore()

    useEffect(() => {
        let keyIndex = 0

        const handleKeyDown = (e) => {
            if (e.key === KONAMI_CODE[keyIndex]) {
                keyIndex++
                if (keyIndex === KONAMI_CODE.length) {
                    triggerEasterEgg()
                    keyIndex = 0
                }
            } else {
                keyIndex = 0
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const triggerEasterEgg = () => {
        toast.success("🏍️ Easter egg found. Respect.", {
            style: { background: 'var(--bg-card)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }
        })
        addXp(50)

        // Konami explosion effect
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6EF7C4', '#F7A26E', '#A26EF7']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6EF7C4', '#F7A26E', '#A26EF7']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }

    useEffect(() => {
        if (xp === 100) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#6EF7C4', '#F7A26E', '#A26EF7']
            })
            toast("You've unlocked Yadev's full profile. Legend.", {
                icon: '🏆',
            })
        }
    }, [xp])

    return (
        <div className="fixed bottom-0 left-0 w-full h-1 bg-white/10 z-[100]">
            <div
                className="h-full bg-accent-primary transition-all duration-500 ease-out"
                style={{ width: `${xp}%` }}
            />
        </div>
    )
}
