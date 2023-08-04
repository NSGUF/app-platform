<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about?test=范德萨">About</router-link>
      |
      <router-link to="/page">Page1</router-link>
      |
      <router-link to="/sonapp">sonapp</router-link>
      |
      <button @click="handlePushState">pushstate test</button>
      |
      <button @click="handleZi">子操作父</button>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">

import { Platform } from '@/config';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {
  handlePushState() {
    window.history.pushState({key: 'page'}, '', '/grandson-app/#/page');
  }

  handleZi() {
    Vue.prototype.$platform.emit('PARENT_CAN_DO');
  }

  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    console.log('son加载完成');
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
    window.$platform = Vue.prototype.$platform;

    Vue.prototype.$platform.registerParent('CHILD_CAN_DO', () => {
      alert('这是父操作子做的自定义操作');
    });

    Vue.prototype.$platform.service.registerService('showText', this.showText);

  }

  showText() {
    const a = {
      b: null
    };
    const b = {
      c: 1
    };
    a.b = b;
    return a;
  }

  beforeDestroy() {
    Vue.prototype.$platform.destroy();
  }
};
</script>

<style lang="stylus">
#app {
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
}

#app:before {
  content: 'sonapp';
  font-size: 18px;
  position: absolute;
  top: 24px;
  right: 24px;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
