/**
 * 事件相关
 */

import { DEFAULT_KEY } from '../platform/common/index';

export default class Event {
    constructor (opts) {
        this.opts = opts;

        // 存储的所有事件
        this.events = {};
    }

    /**
     * 注册事件
     * @param eventName 事件名
     * @param callback 事件回调
     * @param appId 对应的子应用 这个只针对子应用把事件注册到父应用上面，当父卸载某个子的时候，可通过这个字段找到所有的事件并注销掉
     */
    on (eventName, callback, appId) {
        if (!Array.isArray(callback)) {
            callback = [callback];
        }

        let appEvent;

        // 如果传了appId 就挂载这个上面 没有的默认用default
        if (appId) {
            this.events[appId] = this.events[appId] || {};
            appEvent = this.events[appId];
        } else {
            this.events[DEFAULT_KEY] = this.events[DEFAULT_KEY] || {};
            appEvent = this.events[DEFAULT_KEY];
        }

        if (appEvent[eventName]) {
            appEvent[eventName] = appEvent[eventName].concat(callback);
        } else {
            appEvent[eventName] = callback;
        }
    }

    /**
     * 卸载当前app所有注册在父上的事件
     * @param appId 应用的id
     */
    removeAppEvent (appId) {
        if (appId) {
            this.events[appId] = null;
        }
    }

    /**
     * 如果传了appId 就卸载对应的子的 没有的默认用default
     * @param eventName 事件名
     * @param appId 子应用id
     */
    off (eventName, appId) {
        if (appId) {
            this.events[appId][eventName] = null;
        } else {
            this.events[DEFAULT_KEY][eventName] = null;
        }
    }

    /**
     * 触发事件
     * @param eventName 事件名
     * @param events 事件列表
     * @param args 参数
     */
    emit (eventName, events, ...args) {
        const eventList = events?.[eventName] || [];
        eventList.forEach(item => {
            item(...args);
        });
    }

    /**
     * 触发对应的子的
     * @param eventName 事件名
     * @param appId 子应用id
     * @param args 参数
     */
    emitApp (eventName, appId, ...args) {
        const events = this.events[appId] || {};
        this.emit(eventName, events, ...args);
    }

    /**
     * 触发默认
     * @param eventName 事件名
     * @param args 参数
     */
    emitDefault (eventName, ...args) {
        const events = this.events[DEFAULT_KEY] || {};
        this.emit(eventName, events, ...args);
    }

    destroy () {
        this.events = null;
    }
}
