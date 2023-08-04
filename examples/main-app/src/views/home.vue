<template>
    <div class="home">
      <button @click="openPage1">打开子嵌入页</button>
      <button @click="openPage2">打开父界面</button>
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

import { Component, Vue } from 'vue-property-decorator';
import localStorageUtil from '@/assets/util/storage';
import cookieUtil from '@/assets/util/cookie';

@Component({})
export default class Index extends Vue {

    openPage1() {
      this.$platform.openChildPage({
        path: '/#/vue',
        appId: 'subapp',
        subPath: '/sonapp/#/page',
        params: {
          test1: 'test1'
        },
      });
    }
    openPage2() {
      this?.$platform.openParentPage({
        path: '/#/vue',
        params: {
          test1: 'test1'
        }
      });
    }
    private actionList = [{
        text: `写入localStorage：localStorageUtil.set('app', 'parentApp');`,
        action: () => this.setLocalStorage()
    }, {
        text: `读取localStorage：localStorageUtil.get('app');`,
        action: () => this.getLocalStorage()
    }, {
        text: `删除localStorage：localStorageUtil.set('app');`,
        action: () => this.removeLocalStorage()
    }, {
        text: `写入Cookie：cookieUtil.set('app', 'parentApp');`,
        action: () => this.setCookie()
    }, {
        text: `读取Cookie：cookieUtil.get('app');`,
        action: () => this.getCookie()
    }, {
        text: `写入Cookie：cookieUtil.clear('app');`,
        action: () => this.removeCookie()
    }];

    private setLocalStorage () {
        localStorageUtil.set('app', 'parentApp');
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
        cookieUtil.set('app', 'parentApp');
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
