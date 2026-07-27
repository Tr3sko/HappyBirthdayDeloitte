import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            '@tsparticles/engine': 'node_modules/@tsparticles/engine',
            '@tsparticles/slim': 'node_modules/@tsparticles/slim'
        }
    },
    server: {
        port: 5173,
        open: true
    }
});