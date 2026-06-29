import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <-- Make sure this is precisely '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', 
})