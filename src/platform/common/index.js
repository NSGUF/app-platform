/**
 * 父子窗口公用变量
 */

/**
 *
 * @type {
 * {
 * MOUNTED: string,
 * UPDATE_PROGRESS: string
 * }
 * }
 */
export const EVENT_TYPE = {

    // iframe是否已经加载完成
    MOUNTED: 'mounted',

    // 更新父窗口进度条
    UPDATE_PROGRESS: 'update-progress',

    // 子应用登录失效，告诉父应用跳转登录界面
    SESSION_TIME_OUT: 'session_timeout',
};

export const OPEN_WINDOW_TARGET = {
    BLANK: '_blank',
    SELF: '_self',
    PARENT: '_parent',
    TOP: '_top',
};

/**
 * 每个iframe都会有个把appId放到属性上，这样在注销这个iframe的时候，从iframe内部能知道自己是哪个id
 * @type {string}
 */
export const IFRAME_ENTRY_ID = 'entry_id';

export const DEFAULT_KEY = 'DEFAULT';
