import { createVuePlugin } from 'vite-plugin-vue2';

const path = require('path');

export default {
    build: {
        outDir: '../dist/sonapp'
    },
    base: './sonapp/',
    resolve: {
        // 添加 '.js'、'.ts' 和 '.vue' 扩展名
        extensions: ['.js', '.ts', '.vue']
    },
    alias: {
        '@': path.resolve(__dirname, 'src')
    },
    server: {
        port: 5001,
        host: '0.0.0.0',
        cors: true,
        strictPort: false,
        fs: {
            allow: ['../../']
        }
    },
    plugins: [createVuePlugin()]
};
