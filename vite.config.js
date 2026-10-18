import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => ({
  base: '/taiwanese-learn-vietnamese/',
  plugins: [react(), ...(mode === 'singlefile' ? [viteSingleFile()] : [])],
}));
