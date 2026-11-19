import { defineConfig } from 'vite';

export default defineConfig({
  // 相対パスで出力して、GitHub Pages（/myPortfolioSite/）と tokurin.dev（/）の両方で動くようにする
  base: './',
});
