import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: resolve(
                fileURLToPath(new URL('.', import.meta.url)),
                'src/index.tsx'
            ),
            name: 'M3Ripple',
            formats: ['es', 'cjs'],
            fileName: (format) => {
                if (format === 'es') return 'index.js'

                return `index.${format}.js`
            }
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        }
    }
})
