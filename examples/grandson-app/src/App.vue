<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
      |
      <router-link to="/page">Page1</router-link>
      |
      <button @click="handlePushState">pushstate test</button>
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
    window.history.pushState({key: 'page'}, '', '/subapp1/#/page');
  }

  mounted() {
    console.log('子加载完');
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
  beforeDestroy () {
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
    content: 'subapp1';
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
