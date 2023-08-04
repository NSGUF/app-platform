<template>
    <div class="home">
        Welcome to son_subapp
        <div>执行以下代码后，通过浏览器开发者工具验证效果</div>
        <div v-for="(item, index) in actionList"
             :key="index"
             class="action-item">
            <pre class="action-text">{{ item.text }}</pre>
            <button @click="item.action">执行</button>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue } from "vue-property-decorator";
import localStorageUtil from '@/assets/util/storage';
import cookieUtil from '@/assets/util/cookie';

export default class Index extends Vue {
    private actionList = [{
        text: `写入localStorage：localStorageUtil.set('app', 'subApp');`,
        action: () => this.setLocalStorage()
    }, {
        text: `读取localStorage：localStorageUtil.get('app');`,
        action: () => this.getLocalStorage()
    }, {
        text: `删除localStorage：localStorageUtil.set('app');`,
        action: () => this.removeLocalStorage()
    }, {
        text: `写入Cookie：cookieUtil.set('app', 'subApp');`,
        action: () => this.setCookie()
    }, {
        text: `读取Cookie：cookieUtil.get('app');`,
        action: () => this.getCookie()
    }, {
        text: `写入Cookie：cookieUtil.clear('app');`,
        action: () => this.removeCookie()
    }];

    private setLocalStorage () {
        localStorageUtil.set('app', 'subApp');
        localStorageUtil.save();
    }

    private getLocalStorage () {
        console.log(localStorageUtil.get('app'));
    }

    private removeLocalStorage () {
        localStorageUtil.set('app');
        localStorageUtil.save();
    }

    private setCookie () {
        cookieUtil.set('app', 'subApp');
    }

    private getCookie () {
        console.log(cookieUtil.get('app'));
    }

    private removeCookie () {
        cookieUtil.clear('app');
    }
}
</script>

<style>
    .home {
        margin: 24px;
    }

    .action-item {
        margin: 12px auto 36px;
    }

    .action-text {
        padding: 24px;
        font: 14px Ubuntu;
        color: white;
        background: rgb(48, 42, 42);
    }
</style>
