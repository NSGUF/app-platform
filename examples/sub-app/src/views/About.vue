<template>
  <div class="about">
    <button @click="openPage1">子跳子界面</button>
    <button @click="openPage2">子跳父界面</button>
    <br/>
    <br/>
    <br/>
    <br/>
    <button @click="openProgress">进度条</button> console会输出
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <button @click="toLogin">父容器跳转登录页</button>
    <br/>
    <br/>
    <input @change="changeGgf" type="text" v-model="text"/>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class About extends Vue {
  private text = '';
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
    this.$platform.openParentPage({
      path: '/#/',
      params: {
        test1: 'test1'
      }
    });
  }
  changeGgf () {
    this.$platform.updateData({
      data: this.text
    })
  }
  openProgress() {
    let progress = 0;
    const timeOut = setInterval(() => {
      this.$platform.updateProgress(progress);
      if (progress === 100) {
        clearInterval(timeOut)
      }
      progress += 10;
    }, 400);
  }
  toLogin () {
    this.$platform.sessionTimeoutHandler();
  }

};
</script>
