import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const basenameProd = '/rank-master'

// https://vite.dev/config/
export default defineConfig(({ command })=>{
  const isProd = command === 'build'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      global: {
        basename: isProd ? basenameProd : '',
      },
    },
  }

})
