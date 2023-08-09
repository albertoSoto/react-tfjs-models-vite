import path from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import {nodePolyfills} from 'vite-plugin-node-polyfills'
import nodePolyfills from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
    // define: {
    //     'process.env': process.env ?? {},
    // },
    resolve: {
        alias: {
            util: require.resolve("util/"),
        },
    },
    build: {
        target: "es2020",
        lib: {
            entry: path.resolve(__dirname, 'src/lib/index.jsx'),
            name: 'React Tensorflow Js Models',
            fileName: (format) => `react-tfjs-models.${format}.js`
        },
        rollupOptions: {
            // target: 'esnext',
            rollupOptions: {
                plugins: [
                    nodePolyfills({ crypto: true }),
                ],
            },
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
    plugins: [
        react(),
        // nodePolyfills({
        //     // To exclude specific polyfills, add them to this list.
        //     exclude: [
        //         'fs', // Excludes the polyfill for `fs` and `node:fs`.
        //     ],
        //     // Whether to polyfill specific globals.
        //     globals: {
        //         Buffer: true, // can also be 'build', 'dev', or false
        //         global: true,
        //         process: true,
        //     },
        //     // Whether to polyfill `node:` protocol imports.
        //     protocolImports: true,
        // })
    ],
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                NodeGlobalsPolyfillPlugin({ buffer: true }),
            ],
            target: "es2020",
        }
    },
})
