import { isBase64, isUndefinedOrNull } from './tool';
import { Base64 } from 'js-base64';

/**
 * url的各种操作的工具方法
 */
// eslint-disable-next-line no-useless-escape
const PROTOCOL_REG = /^(http|https)\:\/\//;

export function getLocationHref (win) {
    return win?.location?.href;
}

export function getBase (win) {
    const href = getLocationHref(win);
    const hashIndex = href.indexOf('#');

    return hashIndex >= 0 ? href.slice(0, hashIndex) : href;
}

export function getHash (path) {
    let href = path;
    const index = href.indexOf('#');

    if (index < 0) {
        return '';
    }

    href = href.slice(index + 1);

    const searchIndex = href.indexOf('?');
    if (searchIndex < 0) {
        const hashIndex = href.indexOf('#');
        if (hashIndex > -1) {
            href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex);
        } else {
            href = decodeURI(href);
        }
    } else {
        href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex);
    }

    return href;
}

// 获取除去协议部分的url
export function removeUrlProtocol (url) {
    const parsedURL = url.replace(PROTOCOL_REG, '');

    return parsedURL.startsWith('/')
        ? parsedURL
        : parsedURL.indexOf('/') > -1
            ? parsedURL.slice(parsedURL.indexOf('/'))
            : '/';
}

// 获取url查询字符串
export function getSearch (href) {
    const queryIndex = href.indexOf('?');

    return queryIndex >= 0 ? href.slice(queryIndex) : '';
}

// 将querystring解析为对象
export function parseQueryStrToObj (queryString) {
    if (!queryString) {
        return {};
    }

    const str = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    return str.split('&').reduce((res, part) => {
        const [key, value] = part.split('=');
        if (!key) {
            return res;
        }

        if (isUndefinedOrNull(res[key])) {
            res[key] = value;
        }

        return res;
    }, {});
}

// normalize路径差异
export function normalizePath (path) {
    let res = path;
    res = res.replace(/\/+/, '/');
    if (res.length > 1) {
        res = res.endsWith('/') ? res : res + '/';
    }
    return res;
}

// 获取没有查询字符串的路径
export function getPathWithoutSearch (href) {
    const queryIndex = href.indexOf('?');

    return queryIndex >= 0 ? href.slice(0, queryIndex) : href;
}

export function parseURL (url = '', hashMode = true) {
    const protocol = (url.match(PROTOCOL_REG) && url.match(PROTOCOL_REG)[1]) || '';
    const href = removeUrlProtocol(url);

    const hashIndex = href.indexOf('#');
    let path = hashIndex > -1 ? href.slice(0, hashIndex) : href;
    let hash = hashMode ? getHash(href) : hashIndex > -1 ? href.slice(hashIndex + 1) : '';

    const pathQuery = getSearch(path);
    const pathQueryObj = parseQueryStrToObj(pathQuery);

    path = normalizePath(getPathWithoutSearch(path));

    if (!hashMode) {
        return {
            protocol,
            href,
            path,
            query: pathQueryObj,
            hash,
        };
    }

    const hashQuery = getSearch(hash);
    const hashQueryObj = parseQueryStrToObj(hashQuery);

    hash = normalizePath(getPathWithoutSearch(hash));

    return {
        protocol,
        href,
        path,
        query: pathQueryObj,
        hash,
        hashQuery: hashQueryObj,
    };
}

/**
 * 获取子路径
 * @param href
 */
export function getUnbasedRoute (href) {
    const hrefUrlObj = parseURL(href);

    return {
        href,
        unDomainHref: hrefUrlObj.href,
        query: Object.assign({}, hrefUrlObj.hashQuery),
        hash: hrefUrlObj.hash,
    };
}

// 是否支持pushState
export const supportsPushState = (function () {
    const ua = window.navigator.userAgent;

    if (
        (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1
    ) {
        return false;
    }

    return window.history && typeof window.history.pushState === 'function';
})();

export function parseQueryObjToStr (obj) {
    if (!obj || Object.keys(obj).length <= 0) {
        return '';
    }

    return `?${Object.keys(obj).reduce((str, key) => {
        if (str) {
            return `${str}&${key}=${obj[key]}`;
        }

        return `${key}=${obj[key]}`;
    }, '')}`;
}

/**
 * 设置路径以/开头
 * @param path 路径
 * @returns {*|string} 格式化后的路径
 */
export function normalizeCrossbar (path) {
    return path.startsWith('/') ? path : '/' + path;
}

/**
 * 合并路径和参数
 * @param path 路径
 * @param params 参数
 * @returns {string} 格式化后的路径
 */
export function mergePath (path, params) {
    return `${path}${parseQueryObjToStr(params)}`;
}

/**
 * 通过子应用的id获取对应的url
 * @param route 路由数据
 * @param id 子应用id
 * @param base 默认url
 * @return {string} url
 */
export function getHrefById (route, id, base) {
    // 浏览器会有自动encode
    let href = decodeURIComponent(route.query[id] || '');
    href = isBase64(href) ? Base64.decode(href) : base;

    // 对应更新路由的时候，手动加的一个encode
    return decodeURIComponent(href);
}
