/*
* rollup.config.js:
* 注意: 1.输出的文件类型: amd, cjs, es, iife, umd; 2.当入口文件有 export时, umd格式必须
* 指定 name,这样,在通过<script>标签引入时,才能通过 name访问到 export的内容。
*/
import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default [{
    input: './src/platform/index.js', // 要打包的文件(打包入口文件)
    output: [
        {
            file: 'dist/static/js/platform.umd.js',
            format: 'umd',
            name: 'bundle-name',
        },
        {
            file: 'dist/static/js/platform.js',
            format: 'es',
        },
        {
            file: 'dist/static/js/platform.cjs.js',
            format: 'cjs',
        },
    ],
    plugins: [
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
        }),
        // 压缩代码
        uglify(),
    ],
}, {
    input: './src/platform/component/vue/vue-app.vue', // 要打包的文件(打包入口文件)
    output: [
        {
            file: 'dist/static/js/vueapp.umd.js',
            format: 'umd',
            name: 'bundle-name',
        },
        {
            file: 'dist/static/js/vueapp.js',
            format: 'es',
        },
        {
            file: 'dist/static/js/vueapp.cjs.js',
            format: 'cjs',
        },
    ],
    plugins: [
        vue(),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
        }),
        // 压缩代码
        uglify(),
    ],
},
];
