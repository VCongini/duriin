import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Allow overriding the base for different hosting targets (e.g., Cloudflare Pages at root).
const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
    plugins: [react()],
    base,
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8787',
                changeOrigin: true,
            },
        },
    },
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
