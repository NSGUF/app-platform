<template>
  <div class="app-all">
    <button @click="openPage1">当前页父跳子跳转</button>
    <button @click="openPage2">新标签页父跳子跳转</button>
    这里是父操作子|
    <button @click="childGo">父操作子</button>
    <vue-app content-class="app-content"
             ref="vueApp"
             :app-id="appId"
             :app-entry="appEntry"
             :data="globalCfg"
             :iframe-before-create="beforeCreate"
             :iframe-after-create="afterCreate"
             :iframe-before-mount="beforeMount"
             :iframe-before-unmount="beforeUnmount"
             :iframe-mounted="iframeMounted"
             :iframe-after-unmount="afterUnmount"
             :app-type="appType"
             :iframe-route-base="iframeRouteBase"
             :main-route-base="mainRouteBase"
             :session-timeout-handler="sessionTimeoutHandler"
             :operator-progress="operatorProgress"
             :iframe-after-mount="iframeAfterMount"
             :platform="$platform"/>
        <div v-if="!appMounted" class="app-loading">loading</div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { APP_URL, VueApp, PlatformAll } from '@/config';

@Component({
  components: {
    VueApp
  }
})
export default class Index extends Vue {

  openPage1() {
    this.$platform.openChildPage({
      path: '/#/vue',
      appId: 'subapp',
      subPath: '/sonapp/#/page',
      params: {
        test1: 'test1'
      }
    });
  }
  openPage2() {
    this.$platform.openChildPage({
      path: '/#/vue',
      appId: 'subapp',
      subPath: '/sonapp/#/page',
      childParams: {
        name: '10.134.48.24（hci3个主机未纳管vm但带vs）',
        id: '41d0e9c0-d201-4529-8716-161ef2306323',
        type: 'cluster'
      },
      target: PlatformAll.OPEN_WINDOW_TARGET.BLANK
    });
  }
  private appMounted = false;
  private appId = 'subapp';
  private globalCfg = {
    test: '这里是通信传的'
  };
  private appEntry = APP_URL;
  private appType = 'subapp-cmp';
  private mainRouteBase = '/#/vue/';
  private iframeRouteBase = '/sonapp/#/';
  private $platform: any;

  /**
   * 这里是子应用需要父应用操作进度条得回调
   */
  private operatorProgress(progress: number) {
    console.log('这是父窗口打印的', progress);
  }

  beforeCreate = () => Promise.resolve().then(() => {
    console.log('beforeCreate called');
  });
  afterCreate = () => Promise.resolve().then(() => {
    console.log('afterCreate called');
  });
  iframeMounted = () => Promise.resolve().then(() => {
    console.log('iframe mounted called');
  });
  beforeMount = () => Promise.resolve().then(() => {
    console.log('beforeMount called');
  });
  beforeUnmount = () => Promise.resolve().then(() => {
    console.log('beforeUnmount called');
  });
  afterUnmount = () => Promise.resolve().then(() => {
    console.log('afterUnmount called');
  });

  /**
   * 这里是子应用加载完的生命周期
   */
  private iframeAfterMount() {
    this.appMounted = true;
    console.log('afterMount called');
    this.appMounted = true;
    Vue.prototype.$platform.registerChild('PARENT_CAN_DO', () => {
      alert('这是子操作父做的自定义操作');
    }, this.control);
  }

  /**
   * 子应用超时的时候，父应用需要做的回调
   * @private
   */
  private sessionTimeoutHandler() {
    window.location.href = '/#/login';
  }

  get control () {
    return this.$refs.vueApp['control'];
  }

  childGo () {
    let result = this.$platform.service.invokeChildService(this.appId, 'showText');
    console.log(result instanceof Object);
  }

  mounted () {
  }

  beforeDestroy() {
    console.log('子嵌入页销毁');
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
    background #fffbf0
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
