import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Update `base` to '/<repo-name>/' before deploying to GitHub Pages
export default defineConfig({
    plugins: [react()],
    base: '/',
});
