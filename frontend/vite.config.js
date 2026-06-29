import { defineConfig } from 'vite'
// import react from '@vitejs/react-plugin'

export default defineConfig({
  plugins: [react()],
  base: '/', // <-- Ensure this is explicitly set to '/'
})