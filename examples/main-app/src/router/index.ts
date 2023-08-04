import Vue from 'vue';
import Home from '../views/home.vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: '/vue*',
        name: 'subappVue',
        component: () =>
            import(/* webpackChunkName: "subapp-vue" */ "../views/subapp_vue.vue")
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import(/* webpackChunkName: "subapp-vue" */ "../views/login.vue")
    },
    // {
    //   path: "/ext*",
    //   name: "subappExt",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "subapp-ext" */ "../views/subapp_ext.vue")
    // }
];

const router = new VueRouter({
    routes,
});

export default router;
