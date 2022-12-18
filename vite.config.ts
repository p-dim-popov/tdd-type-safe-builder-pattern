/// <reference types="vitest" />
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        'import.meta.vitest': 'undefined',
    },
    test: {
        includeSource: ['src/**/*.{ts,tsx}'],
        coverage: {
            reporter: ['text-summary', 'text'],
        },
        mockReset: true,
        restoreMocks: true,
    },
})
