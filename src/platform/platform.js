/**
 * 父应用的操作类封装，以及管理子应用
 */

import Event from '../event/index';
import Controller from './controller';
import { EVENT_TYPE, IFRAME_ENTRY_ID, OPEN_WINDOW_TARGET } from './common/index';
import { isIE, isHaveParent } from '../utils/tool';
import { normalizeCrossbar, mergePath } from '../utils/url';
import Service from './service';
import { Base64 } from 'js-base64';

export default class Platform {
    constructor (opts) {
        this.controllers = {};
        this.opts = opts;
        this.data = {};

        this.initService();
        this.initEvent();
        this.appMounted();
    }

    initService () {
        this.service = new Service(this);
    }

    /**
     * 当前应用加载完成后调用的方法
     */
    appMounted () {
        if (isIE && this.opts.router) {
            // ie下 hash改变的时候 不会触发popstate事件，所以需要手动触发一下
            window.addEventListener(
                'hashchange',
                () => {
                    const currentPath = window.location.hash.slice(1);

                    // 每种框架的路由操作不同，所以需要从项目中将getPath和setPath作为参数传进来
                    // 固定操作，将router传入进来
                    // router: {
                    //     getPath () {
                    //         return self.$route.path;
                    //     },
                    //     setPath (currentPath) {
                    //         self.$router.push(currentPath);
                    //     }
                    // }
                    if (this.opts.router.getPath() !== currentPath) {
                        this.opts.router.setPath(currentPath);
                    }
                },
                false,
            );
        }

        this.emit(EVENT_TYPE.MOUNTED);
    }

    /**
     * 当前app设置路由
     * @param path 路由路径
     */
    setPath (path) {
        this.opts.router.setPath(path);
    }

    // region 管理子应用  ======================

    /**
     * 创建一个controller
     * @param key 当前这个controller对应的key
     * @param options 创建controller的参数
     * @returns {*} controller
     */
    createSubApp (key, options) {
        this.controllers[key] = new Controller({
            options,
            $platform: this,
        });
        return this.controllers[key];
    }

    /**
     * 通过key找到对应的controller
     * @param key 键
     * @returns {*} controller
     */
    getSubApp (key) {
        return this.controllers[key];
    }

    getApps () {
        return this.controllers;
    }

    /**
     * 移除某个controller
     * @param key controller对应的key
     */
    removeSubApp (key) {
        const controller = this.getSubApp(key);
        controller && controller.destroy();
        delete this.controllers[key];

        // 清空当前子应用在父应用上注册的监听
        this.event.removeAppEvent(key);
    }

    // endregion

    // region 事件相关 =======================

    /**
     * 初始化通信实例的单例
     */
    initEvent () {
        if (!this.event) {
            this.event = new Event(this.opts);
        }

        // 注册事件 加入父的方法
        const controls = window.parent?.$platform?.getApps() || {};
        for (const control of Object.values(controls)) {
            const events = control.events || {};
            const keys = Object.keys(events);
            for (const key of keys) {
                this.on(key, events[key]);
            }
        }
    }

    on (eventName, callback, appId) {
        this.event.on(eventName, callback, appId);
    }

    /**
     * 触发自身的某个事件
     * @param eventName 事件名
     * @param appId 子应用的id 如果是触发父注册的，那就传null
     * @param arg 参数
     */
    emit (eventName = '', appId = null, ...arg) {
        if (appId) {
            this.event.emitApp(eventName, appId, ...arg);
        } else {
            this.event.emitDefault(eventName, ...arg);
        }
    }

    /**
     * 注销事件 如果appId存在就是注销某个子的，没有就是默认注销default的
     * @param eventName 事件名
     * @param appId 对应子的id
     */
    off (eventName, appId) {
        this.event.off(eventName, appId);
    }

    /**
     * 注册事件到父身上
     * @param name 事件ID
     * @param handler 事件回调
     */
    registerParent (name, handler) {
        if (isHaveParent()) {
            // 获取当前iframe的appId 注册到父身上的事件可能有很多 父是不知道是哪个子的 这里是标志一下注册的是谁身上的方法
            const appId = window.frameElement.getAttribute(IFRAME_ENTRY_ID);

            // 父去绑定监听
            window.parent.$platform?.on(name, handler, appId);
        }
    }

    /**
     * 解除父上的事件
     * @param name 事件ID
     */
    deregisterParent (name) {
        if (isHaveParent()) {
            // 获取当前iframe的appId 注册到父身上的事件可能有很多 父是不知道是哪个子的 这里是标志一下注册的是谁身上的方法
            const appId = window.frameElement.getAttribute(IFRAME_ENTRY_ID);

            window.parent.$platform?.off(name, appId);
        }
    }

    /**
     * 注册事件到自身的某个子身上
     * @param name 事件ID
     * @param handler 事件回调
     * @param control 对应子的control
     */
    registerChild (name, handler, control) {
        if (control && control.iframeWindow) {
            // 子去绑定监听
            control.iframeWindow?.$platform?.on(name, handler);
        }
    }

    /**
     * 解除子上的事件
     * @param name 事件ID
     * @param control 对应子的control
     */
    deregisterChild (name, control) {
        if (control && control.iframeWindow) {
            control.iframeWindow?.$platform?.off(name);
        }
    }

    // endregion

    // region 封装的各种操作 针对父和孙子应用的===

    /**
     * 获取自己身上想要传给父或者子的数据
     */
    getData () {
        return this.data;
    }

    /**
     * 更新数据，只支持传json
     * @param data 更新的数据
     */
    updateData (data) {
        try {
            data = JSON.parse(JSON.stringify(data));
            this.data = {
                ...this.data,
                ...data,
            };
        } catch (err) {
            throw new Error('data must is json');
        }
    }

    /**
     * 打开父窗口的页面
     * @param path 父应用的url
     * @param params 参数
     * @param target 打开方式
     */
    openParentPage ({ path = '', params = {}, target = OPEN_WINDOW_TARGET.SELF }) {
        path = normalizeCrossbar(path);
        path = mergePath(path, params);
        window.parent.open(path, target);
    }

    /**
     * 打开某个嵌入页
     * @param path 路径
     * @param appId 嵌入页的appId
     * @param subPath 嵌入页的路径
     * @param params 父应用的路径参数
     * @param childParams 子应用的路径参数
     * @param target 打开方式
     */
    openChildPage ({
        path = '',
        appId = '',
        subPath = '',
        params = {},
        childParams = {},
        target = OPEN_WINDOW_TARGET.SELF,
    }) {
        subPath = mergePath(subPath, childParams);

        // 使用这个方法的是子本身
        if (isHaveParent() && target !== OPEN_WINDOW_TARGET.BLANK) {
            subPath = subPath.split('#')[1];
            subPath = `#${subPath}`;
            window.open(subPath, target);
            return;
        }

        // 使用这个方法的是在父中，切有当前嵌入页的
        if (Object.keys(this.controllers).length && target !== OPEN_WINDOW_TARGET.BLANK) {
            const con = this.getSubApp(appId);
            con.openPage(subPath, target);
            return;
        }

        // 使用这个方法是在父中没有嵌入页的界面
        params[appId] = Base64.encode(encodeURIComponent(subPath));
        let url = mergePath(path, params);
        url = normalizeCrossbar(url);
        window.open(url, target);
    }

    /**
     * 向父应用发送信息，告诉父应用，子应用会话已经过期了
     */
    sessionTimeoutHandler () {
        this.emit(EVENT_TYPE.SESSION_TIME_OUT);
    }

    /**
     * 更新父窗口的整体进度条
     * @param {number} process 进度数字
     */
    updateProgress (process) {
        this.emit(EVENT_TYPE.UPDATE_PROGRESS, null, process);
    }

    // endregion

    destroy () {
        this.data = null;
        this.event.destroy();

        this.controllers &&
            this.controllers.forEach(item => {
                item.destroy();
            });
        this.controllers = null;
    }
}
