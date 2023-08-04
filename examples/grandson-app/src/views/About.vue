<template>
  <div class="about">
    <button @click="openPage1">打开新界面</button>
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
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class About extends Vue {
  openPage1() {
    this.$platform.openPage('#/page');
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
