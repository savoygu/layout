import { fileURLToPath, URL } from 'node:url'
import { resolve as _resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'

const resolve = (...dirs: string[]) => _resolve(__dirname, ...dirs)

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve('src/index.ts'),
      name: 'LayoutVueNext',
      fileName: (format) => `layout-vue-next.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'pinia', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          'vue-router': 'VueRouter'
        }
      }
    }
  },
  plugins: [vue(), vueJsx(), dts()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'node:path': 'rollup-plugin-node-polyfills/polyfills/path'
    }
  }
})
