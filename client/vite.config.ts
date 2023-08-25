import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return defineConfig({
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5000,
      https: {
        key: process.env.VITE_KEY,
        cert: process.env.VITE_CERT
      }
    }
  })
}
