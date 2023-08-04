/**
 * 常用工具方法
 */

import { Base64 } from 'js-base64';

export const isChrome = (function () {
    const ua = window.navigator.userAgent;
    return ua.indexOf('Chrome') !== -1;
})();

export const isIE = (function () {
    let ua = window.navigator.userAgent;
    ua = (ua || '').toLowerCase();

    function check (regex) {
        return regex.test(ua);
    }

    return !check(/opera/) && (check(/msie/) || check(/trident\/\d\.\d/) || check(/edge\/\d+\.\d+/));
})();

export function isUndefined (value) {
    return typeof value === 'undefined';
}

export function isNull (value) {
    return value === null;
}

export function isUndefinedOrNull (value) {
    return isUndefined(value) || isNull(value);
}

export async function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function execHooksChain (hooks, control) {
    if (hooks.length) {
        return hooks.reduce((chain, hook) => chain.then(() => hook(control)), Promise.resolve());
    }

    return Promise.resolve();
}

export function toArray (array = []) {
    return Array.isArray(array) ? array : [array];
}

export function isBase64 (str = '') {
    if (str === '' || str.trim() === '') {
        return false;
    }
    try {
        return Base64.btoa(Base64.atob(str)) === str;
    } catch (err) {
        return false;
    }
}

/**
 * 当前应用是否有父应用
 * @returns {boolean} 是否有父
 */
export function isHaveParent () {
    return window.parent !== window;
}
