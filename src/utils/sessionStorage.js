/**
 * sessionStorage的各种操作的工具方法
 */

const ss = window.sessionStorage;
const URL_KEY = 'APP_URL_KEY_';

/**
 * 保存嵌入的数据
 * @param {string} type 嵌入的类型
 * @param {string} data 对应的数据
 */
export function saveAppData (type, data) {
    ss.setItem(URL_KEY + type, data);
}

/**
 * 获取嵌入的数据
 * @param {string} type 嵌入的类型
 * @returns {string} 嵌入的数据
 */
export function getAppData (type) {
    return ss.getItem(URL_KEY + type);
}

/**
 * 保存数据并打开嵌入界面
 * @param {string} type 类型
 * @param {string} url 嵌入界面的url
 * @param {string} data 嵌入界面需要用到的数据，如iframe的src链接
 */
export function saveAndOpenAppURL (type, url, data) {
    data && this.saveAppData(type, data);
    window.open(url);
}
