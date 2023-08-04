# iframe嵌套的方案

## 父应用
### 1. 引入app-platform；
```
npm i --save app-platform
```
### 2. 新增嵌入页subapp_vue.vue，并在嵌入页中导入VueApp组件
```vue
import  VueApp from 'app-platform/dist/static/js/vueapp.js';
```
这里贴上demo中的使用，如果是业务里面，直接从app-platform/dist/static/js/vueapp.js里import即可，我这里是为了做dev和build的区别，才从config中取；
```vue
  <template>
    <div>
      <vue-app content-class="app-content"
               :default-query="defaultQuery"
               app-id="subapp"
               :app-entry="appEntry"
               :data="globalCfg"
               :app-type="appType"
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
  import { APP_URL, VueApp } from '@/config';

  @Component({
    components: {
      VueApp
    }
  })
  export default class Index extends Vue {
    private appMounted = false;
    private defaultQuery = {
      query: '这里是url的'
    };
    private globalCfg = {
      test: '这里是通信传的'
    };
    private appEntry = APP_URL;
    private appType = 'subapp-cmp';
    private mainRouteBase = '/#/vue/';

    private operatorProgress(progress: number) {
      console.log('这是父窗口打印的', progress);
    }
    private iframeAfterMount() {
      this.appMounted = true;
      console.log(4);
    }
    private sessionTimeoutHandler() {
      window.location.href = '/#/login';
      window.location.reload();
    }
    destroy() {
      console.log('test');
    }
  };
  </script>
  <style lang="stylus">
  .app-content {
    width: 100vw;
    height: calc(100vh - 100px);
    position: relative;

    iframe {
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

```

### 3. 添加路由入口
> 在路由中添加如下；配置嵌入页的路由，注意path中最后面的*号；
```json
{
    path: '/vue*',
    name: 'subappVue',
    component: () =>
    import(/* webpackChunkName: "subapp-vue" */ "../views/subapp_vue.vue")
},
```
### 4. 在项目入口初始化框架层
在项目入口main.ts中添加Platform导入，然后挂载全局；
```javascript
import { Platform } from 'app-platform/dist/static/js/platform.js';

window.$platform = Vue.prototype.$platform = new Platform();
```

如果是打开直接跳转到嵌入界面，则如下；
```
window.location.href = `/#/app-center`;
```

如果是打开新标签页，可以用sessionStorage去传递数据，这部分放到iframeController中去了
调用下面代码嵌入界面中去
```
Vue.prototype.$platform.saveAndOpenAppURL('type', '/#/cluster-c1c71a60-4583-4ccd-b92b-7cd63c615d25', iframe的src)
```

Vue.prototype.$platform.getAppData一下给appEntry即可；

## 子应用
### 1.引入app-platform；
```
npm i --save app-platform
```
### 2. 导入APP挂载全局
在app.vue中mounted中初始化
```javascript
import App from 'app-platform/dist/static/js/app.js';

@Component({})
export default class Home extends Vue {
  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    Vue.prototype.$appUtil = new App({
      router: {
        getPath() {
          return self.$route.path;
        },
        setPath(currentPath) {
          self.$router.push(currentPath);
        }
      }
    });
  }
};
```

ext在入口添加index.js中添加，只不过router的两个方法使用ext的路由的path获取和设置；

## 跑demo需要注意的点
1.


## 打包调试方式
下面的app-platform表示本机对应的项目根路径（绝对路径，根据具体仓库位置补充前缀）
```
server {
    listen 7676;
    server_name localhost;

    location / {
        root app-platform/examples/vue_main_app/dist;
        index index.html;
    }

    location /subapp1/ {
        proxy_pass http://localhost:7777/;
    }

    location /sonapp/ {
        proxy_pass http://localhost:7878/;


    }
}

server {
    listen       7777;
    server_name  localhost;

    location / {
        root app-platform/examples/subapp1/dist;
        index index.html;
    }
}

server {
    listen       7878;
    server_name  localhost;

    location / {
        root app-platform/examples/son_subapp/dist;
        index index.html;
    }
}

```
