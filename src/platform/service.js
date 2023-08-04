/**
 * platform上的一个sdk，供其他platform调用的
 */

export default class Service {
    constructor (platform) {
        this.platform = platform;
        this.$serviceFns = window.$serviceFns = {};
    }

    /**
     * 当前platform给自己身上注册方法
     * @param fnName 方法名
     * @param fn 对应的方法
     */
    registerService (fnName, fn) {
        this.$serviceFns[fnName] = fn;
    }

    /**
     * 当前platform调用父应用的方法
     * @param fnName 方法名
     * @returns {null|any}
     */
    invokeParentService (fnName) {
        const serviceFns = window?.parent?.$platform?.service?.$serviceFns || {};
        return this.invokeService(serviceFns, fnName);
    }

    /**
     * 当前platform调用子应用的方法
     * @param appId 子应用的id
     * @param fnName 方法名
     * @returns {null|any}
     */
    invokeChildService (appId, fnName) {
        const control = this.platform.getSubApp(appId);
        const serviceFns = control?.iframeWindow?.$platform?.service?.$serviceFns || {};
        return this.invokeService(serviceFns, fnName);
    }

    /**
     * 执行对应的方法
     * @param serviceFns 方法挂载的对象
     * @param fnName 方法名
     * @returns {null|any} 结果
     */
    invokeService (serviceFns, fnName) {
        const serviceFn = serviceFns[fnName];
        if (typeof serviceFn !== 'function') {
            return null;
        }

        const result = serviceFn();
        return this.serializeData(result);
    }

    /**
     * 序列化data
     */
    serializeData (data) {
        if (typeof data === 'function' || data === null) {
            return null;
        }
        return JSON.parse(JSON.stringify(data));
    }
}
