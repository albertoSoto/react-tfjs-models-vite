import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {
  //     process: "process/browser",
  //     stream: "stream-browserify",
  //     zlib: "browserify-zlib",
  //     util: 'util'
  //   }
  // },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.jsx'),
      name: 'React Tensorflow Js Models',
      fileName: (format) => `react-tfjs-models.${format}.js`
    },
    rollupOptions: {
      // externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React'
        }
      }
    }
  },
  plugins: [react()]
})
