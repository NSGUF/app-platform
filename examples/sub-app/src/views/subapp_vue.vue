<template>
  <div>
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
      <br/>
      <br/>
      <button @click="toLogin">父容器跳转登录页123</button>
    </div>
    <div class="app-all">
      <vue-app content-class="app-content"
               app-id="son_subapp"
               :app-entry="appEntry"
               :data="globalCfg"
               :iframe-route-base="iframeRouteBase"
               :app-type="appType"
               :main-route-base="mainRouteBase"
               :session-timeout-handler="sessionTimeoutHandler"
               :operator-progress="operatorProgress"
               :iframe-after-mount="iframeAfterMount"
               :platform="$platform"/>
<!--      <div v-if="!appMounted" class="app-loading">loading</div>-->
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { APP_URL, VueApp } from '@/config';

@Component({
  components: {
    VueApp
  }
})
export default class Index extends Vue {
  private appMounted = false;
  private defaultQuery = {
    query: '这里是son 的url的'
  };
  private globalCfg = {
    test: '这里是son 的通信传的'
  };
  private appEntry = APP_URL;
  private appType = 'subapp-cmp';

  private mainRouteBase = () => {
    return `/sonapp${this.getPrefix()}/#/sonapp/`
  };
  private iframeRouteBase = () => {
    return `/grandson-app${this.getPrefix()}/#/`
  }

  getPrefix () {
    const params = window.location.href.split(window.location.host)[1];
    const prefix = params.split('#')[0];
    const preParams = prefix.split('?')[1] || '';
    return preParams ? '?' + preParams : ''
  }

  /**
   * 这里是子应用需要父应用操作进度条得回调
   */
  private operatorProgress(progress: number) {
    console.log('这是son打印的', progress);
  }

  /**
   * 这里是子应用加载完的生命周期
   */
  private iframeAfterMount() {
    this.appMounted = true;
    console.log(4);
  }

  /**
   * 子应用超时的时候，父应用需要做的回调
   * @private
   */
  private sessionTimeoutHandler() {
    window.location.href = '#/login';
  }

  beforeDestroy() {
    console.log('孙子嵌入页销毁');
  }
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
<style lang="stylus">
.app-all {
  position relative
}
.app-content {
  width: 100vw;
  height: calc(100vh - 100px);
  position: relative;

  iframe {
    background gray;
    width: 100vw;
    height: calc(100vh - 100px);
    position: relative;
    border: 0;
  }
}

.app-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  background-color: #fff;
}
</style>
