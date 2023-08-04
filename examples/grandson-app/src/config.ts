/**
 * 配置，如果是dev，取的是源码，如果是build，取的是打包后的；
 */

export const APP_URL = '/sonapp/#/';

import * as VueAppDev from '../../../src/platform/component/vue/vue-app.vue';
import * as VueAppBuild from '../../../dist/static/js/vueapp.js';

import * as PlatformDev from '../../../src/platform';
import * as PlatformBuild from '../../../dist/static/js/platform.js';

// const isDev = false;
const isDev = process.env.NODE_ENV === 'development';

export const VueApp = isDev ?  VueAppDev.default: VueAppBuild.default;
export const Platform = isDev ?  PlatformDev.Platform: PlatformBuild.Platform;
export const PlatformAll = isDev ?  PlatformDev: PlatformBuild;
