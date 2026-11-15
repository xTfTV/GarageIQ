import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['Tests/**/*.test.ts'],
    testTimeout: 10000,
    clearMocks: true,
    restoreMocks: true
  }
})
