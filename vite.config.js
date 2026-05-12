import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // GitHub Pages 배포를 위해 상대 경로로 설정
  build: {
    outDir: 'dist',
  }
})
