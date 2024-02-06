import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json' assert { type: 'json' } // Node >=17

import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        crx({ manifest })
    ],
    server:{ port: 20001 },
    define:{
        "_NAME_": JSON.stringify(pkg.description)
    },
    build:{
        chunkSizeWarningLimit: 1024*1024
    }
})
