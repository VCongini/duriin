import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Base must match the repo name for GitHub Pages (`https://user.github.io/<repo>/`)
const base = '/duriin/';

export default defineConfig({
    plugins: [react()],
    base,
    build: {
        // Keep the app bundle lean and predictable for faster page loads.
        target: 'es2018',
        sourcemap: false,
        reportCompressedSize: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                },
            },
        },
    },
});
