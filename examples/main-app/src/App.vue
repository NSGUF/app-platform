<template>
    <div id="app">
        <div>
            <button @click="back">后退</button>
            <button @click="forward">前进</button>
            <button @click="reload">刷新</button>
        </div>
        <div id="nav">
            <router-link :to="{ path: '/' }">首页</router-link> |
            <router-link :to="{ path: '/vue?subapp=L3NvbmFwcC8jL3BhZ2U=' }">vue子应用</router-link> |
            <router-link :to="{ path: '/ext/' }">ext子应用</router-link>
        </div>
        <router-view />
    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import { Platform } from '@/config';

@Component({})
export default class Home extends Vue {
    mounted() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        Vue.prototype.$platform = new Platform({
            id: 'main',
            router: {
                getPath() {
                    return self.$route.path;
                },
                setPath(currentPath) {
                    self.$router.push(currentPath);
                }
            }
        });
        window.$platform = Vue.prototype.$platform
    }

    back() {
        window.history.back();
    }

    forward() {
        window.history.forward();
    }


    reload() {
        window.location.reload();
    }

    beforeDestroy () {
        Vue.prototype.$platform.destroy();
    }
};
</script>

<style lang="stylus">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

body {
    margin: 0;
}

#nav {
    padding: 30px;
    width: 100%;
    background-color: #2c3e50;
    box-sizing: border-box;

    a {
        font-weight: bold;
        color: #fff;

        &.router-link-active {
            color: #42b983;
        }
    }
}
</style>
