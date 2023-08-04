import { createVuePlugin } from 'vite-plugin-vue2'
const path = require('path');

export default {
    base: './',
    build: {
        outDir: '../dist'
    },
    resolve: {
        // 添加 '.js'、'.ts' 和 '.vue' 扩展名
        extensions: ['.js', '.ts', '.vue'],
    },
    alias: {
        '@': path.resolve(__dirname, 'src'),
    },
    server: {
        proxy: {
            '/sonapp': {
                target: 'http://localhost:5001/sonapp',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/sonapp/, '')
            },
            '/grandson-app': {
                target: 'http://localhost:5002/grandson-app',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/grandson-app/, '')
            }
        }
    },
  plugins: [createVuePlugin()]
}
