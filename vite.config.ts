import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, 'sitemap.xml'),
          dest: '' // 目标目录，留空表示复制到 dist 根目录
        }
      ]
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
