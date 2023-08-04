/**
 * 公共常量
 */

export const PROPS = {
    /**
     * 自动加载control
     */
    autoLoad: {
        type: Boolean,
        default: true,
    },

    /**
     * iframe挂载的节点id
     */
    appId: {
        type: String,
        default: '',
    },

    /**
     * 包裹iframe的div的样式
     */
    contentClass: {
        type: String,
        default: '',
    },

    /**
     * iframe的div的样式
     */
    appClass: {
        type: String,
        default: '',
    },

    /**
     * iframe的src 这个一定要加上hash值，要不然，会导致整个iframe刷新 重写的pushState啥的都会被干掉
     */
    appEntry: {
        type: String,
        default: '',
    },

    /**
     * 用于缓存默认打开子应用的界面url
     */
    appType: {
        type: String,
        default: '',
    },

    /**
     * 父窗口的默认打开的hash值
     */
    mainRouteBase: {
        type: Function | String,
        default: '',
    },

    /**
     * iframe的默认打开的hash值
     */
    iframeRouteBase: {
        type: Function | String,
        default: '',
    },

    /**
     * 操作进度条的回调
     */
    operatorProgress: {
        type: Function,
        default: () => {},
    },

    /**
     * 子应用过期时，父应用的操作
     */
    sessionTimeoutHandler: {
        type: Function,
        default: () => {},
    },

    /**
     * 给子应用的全局的属性
     */
    data: {},

    /**
     * beforeCrate的回调方法
     */
    iframeBeforeCreate: {
        type: Function,
        default: async () => {},
    },

    /**
     * afterCrate的回调方法
     */
    iframeAfterCreate: {
        type: Function,
        default: async () => {},
    },

    /**
     * beforeMount的回调方法
     */
    iframeBeforeMount: {
        type: Function,
        default: async () => {},
    },

    /**
     * mounted的回调方法
     */
    iframeMounted: {
        type: Function,
        default: async () => {},
    },

    /**
     * afterMount的回调方法
     */
    iframeAfterMount: {
        type: Function,
        default: async () => {},
    },

    /**
     * beforeUnmount的回调方法
     */
    iframeBeforeUnmount: {
        type: Function,
        default: async () => {},
    },

    /**
     * afterUnmount的回调方法
     */
    iframeAfterUnmount: {
        type: Function,
        default: async () => {},
    },

    /**
     * 父窗口的操作类实例
     */
    platform: {},
};
