import { tsParticles } from "@tsparticles/engine";
import { loadConfettiFallingPreset } from "@tsparticles/preset-confetti-falling";
import type { Container } from "@tsparticles/engine";

let container: Container | undefined;

await loadConfettiFallingPreset(tsParticles);

export async function start(): Promise<void> {
    container?.destroy();

    container = await tsParticles.load({
        id: "tsparticles",
        options: {
            preset: "confettiFalling",
        },
    });
}

export function stop(): void {
    container?.pause();
}

export function resume(): void {
    container?.play();
}