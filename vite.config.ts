import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: './', // 相対パスでリソースを読み込むよう設定。これがないとビルド後画面真っ白になる
})
