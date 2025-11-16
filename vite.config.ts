import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Base must match the repo name for GitHub Pages (`https://user.github.io/<repo>/`)
const base = '/duriin/';

export default defineConfig({
    plugins: [react()],
    base
});
