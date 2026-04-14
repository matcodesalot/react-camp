import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  outDir: 'dist',
  deps: {
    alwaysBundle: ['@my-project/shared'],
    onlyBundle: ['@my-project/shared', 'zod'],
  },
})