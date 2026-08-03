import confetti from 'canvas-confetti';

let isRunning = false;
let animationInterval: number | null = null;

export async function start(): Promise<void> {
    const burstCount = 8;
    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            const x = Math.random();
            const y = Math.random() * 0.5;

            confetti({
                particleCount: 100 + Math.random() * 50,
                spread: 360,
                origin: { x, y },
                startVelocity: 30 + Math.random() * 20,
                colors: ['#FF0000', '#F93DB', '#0000FF', '#FFD700', '#FF69B4', '#77D429']
            });

        }, i * 300);
    }

    let randomCount = 0;
    const randomInterval = setInterval(() => {
        if (randomCount < 20) {
            const x = Math.random();
            const y = Math.random() * 0.6;

            confetti({
                particleCount: 50 + Math.random() * 30,
                spread: 180 + Math.random() * 180,
                origin: { x, y },
                startVelocity: 20 + Math.random() * 20
            });
            randomCount++;
        } else {
            clearInterval(randomInterval);
        }
    }, 500);

    isRunning = true;
}

export function stop(): void {
    isRunning = false;
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
}

export function resume(): void {
    if (!isRunning) {
        start();
    }
}

export function triggerBurst(): void {
    confetti({
        particleCount: 150,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FFD700', '#FF69B4']
    });
}