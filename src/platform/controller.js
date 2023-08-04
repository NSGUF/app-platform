/**
 * ext和vue封装的组件的共同逻辑
 */

import { EVENT_TYPE, IFRAME_ENTRY_ID } from './common/index';
import RouteChangeHandler from './route_manager/route_change_handler';
import { getBase, getHrefById, getUnbasedRoute } from '../utils/url';
import { execHooksChain, sleep, toArray } from '../utils/tool';
import { ASYNC_NOOP } from './const';
import { ReplaceStateOverwrite } from './route_manager/state_overwrite';

export default class Controller {
    beforeMountHooks = [];
    afterMountHooks = [];
    beforeUnmountHooks = [];
    afterUnmountHooks = [];

    constructor ({ options, $platform }) {
        this.options = options;

        // 这个参数用来保存父的方法 可被子注册监听 放在controller中，是因为有参数需要从createSubApp中传过来
        this.events = {};

        this.$platform = $platform;
        this.initOptions();

        this.createFunToChild();

        // 将数据保存，以便于其他应用获取当前应用的数据
        this.$platform.updateData(this.options?.data || {});
    }

    /**
     * 初始化参数
     */
    initOptions () {
        let { mainRouteBase, iframeRouteBase, entry, ID } = this.options;
        if (typeof mainRouteBase === 'function') {
            mainRouteBase = mainRouteBase();
        }
        if (typeof iframeRouteBase === 'function') {
            iframeRouteBase = iframeRouteBase();
        }
        entry = entry || iframeRouteBase;

        // 确保 / 开头
        mainRouteBase = mainRouteBase.startsWith('/') ? mainRouteBase : '/' + mainRouteBase;

        // 确保 / 结尾
        iframeRouteBase = iframeRouteBase.endsWith('/') ? iframeRouteBase : iframeRouteBase + '/';
        this.options = {
            ...this.options,
            mainRouteBase,
            iframeRouteBase,
            entry,
        };

        this.routeBaseGetter = mainRouteBase
            ? async () => mainRouteBase
            : win => Promise.resolve().then(() => getBase(win));
        this.iframeRouteBase = iframeRouteBase
            ? async () => iframeRouteBase
            : win => Promise.resolve().then(() => getBase(win));

        this.id = ID || entry;
    }

    /**
     * 将iframe挂载到el的位置
     */
    async mountIframe (el) {
        const {
            entry,
            iframeBeforeCreate = ASYNC_NOOP,
            iframeAfterCreate = ASYNC_NOOP,
            iframeMounted = ASYNC_NOOP,
        } = this.options;
        this.registerControlHooks(this.options);
        await execHooksChain(toArray(iframeBeforeCreate));
        this.iframeElement = document.createElement('iframe');
        await execHooksChain(toArray(iframeAfterCreate));

        await this.initIframe(el, entry);

        // 当iframe mounted之后 再去做初始化路由等操作
        this.createFun(EVENT_TYPE.MOUNTED, async () => {
            await iframeMounted();

            this.initRouteChangeHandler();
            await this.initIframeUrl();

            // 等待子应用跳转到对应页面
            await sleep(100);
            await execHooksChain(this.afterMountHooks);
        });
        return this;
    }

    /**
     * 初始化iframe
     * @param el iframe挂载的节点
     * @param entry iframe的src
     */
    async initIframe (el, entry) {
        const replaceElement = el instanceof HTMLElement ? el : document.querySelector(el);

        if (!replaceElement) {
            throw new Error('el does not exist');
        }

        if (!replaceElement.parentElement) {
            throw new Error('el must have a parentElement');
        }

        await execHooksChain(this.beforeMountHooks);

        this.replaceElement = replaceElement;
        replaceElement.insertAdjacentElement('afterend', this.iframeElement);
        replaceElement.parentElement.removeChild(replaceElement);

        this.iframeWindow = this.iframeElement.contentWindow;
        this.iframeDocument = this.iframeElement.contentDocument;

        this.options.class && this.iframeElement.classList.add(this.options.class);
        this.iframeElement.setAttribute(IFRAME_ENTRY_ID, this.id);

        const router = getUnbasedRoute(window.location.href);
        this.iframeElement.src = getHrefById(router, this.id, entry);
    }

    /**
     * 初始化路由控制
     */
    initRouteChangeHandler () {
        if (!this.mainRouteChangeHandler) {
            this.mainRouteChangeHandler = new RouteChangeHandler({
                win: window,
                routeBaseGetter: this.routeBaseGetter,
                id: this.id,
                key: 'main',
            });
        }

        if (!this.iframeRouteChangeHandler) {
            this.iframeRouteChangeHandler = new RouteChangeHandler({
                win: this.iframeWindow,
                routeBaseGetter: this.iframeRouteBase,
                id: this.id,
                key: 'iframe',
            });
        }

        this.iframeRouteChangeHandler.registerRouteChangeCallback(route => {
            this.mainRouteChangeHandler.updateWindowRoute(route, {
                redirect: href =>
                    ReplaceStateOverwrite.getReplaceStateOverwrite(window).originalReplaceState(null, '', href),
            });
        });

        this.mainRouteChangeHandler.registerRouteChangeCallback(route => {
            this.iframeRouteChangeHandler.updateWindowRoute(route, {
                isIframe: true,
            });
        });
    }

    /**
     * 第一次进入嵌入页时，需要计算url获取到iframe的url，然后更新iframe
     */
    async initIframeUrl () {
        const currentMainRoute = await this.mainRouteChangeHandler.getUnbasedRoute();
        if (currentMainRoute) {
            this.iframeRouteChangeHandler.updateWindowRoute(currentMainRoute, {
                isIframe: true,
            });
        }
    }

    /**
     * 卸载iframe
     */
    async unmountIframe () {
        await execHooksChain(this.beforeUnmountHooks);

        this.iframeElement.insertAdjacentElement('afterend', this.replaceElement);
        this.iframeElement.parentElement.removeChild(this.iframeElement);
        this.replaceElement = null;

        await execHooksChain(this.afterUnmountHooks);
        return this;
    }

    /**
     * 当前子应用打开界面
     * @param path 路径
     * @param target 打开方式
     */
    openPage (path, target) {
        this.iframeWindow.open(path, target);
    }

    // region 注册生命周期
    registerControlHooks (opts) {
        const {
            iframeBeforeMount = ASYNC_NOOP,
            iframeAfterMount = ASYNC_NOOP,
            iframeBeforeUnmount = ASYNC_NOOP,
            iframeAfterUnmount = ASYNC_NOOP,
        } = opts;

        this.registerBeforeMountHooks(iframeBeforeMount);
        this.registerAfterMountHooks(iframeAfterMount);
        this.registerBeforeUnmountHooks(iframeBeforeUnmount);
        this.registerAfterUnmountHooks(iframeAfterUnmount);
    }

    registerBeforeMountHooks (hooks) {
        this.beforeMountHooks.push(...toArray(hooks));
    }

    registerAfterMountHooks (hooks) {
        this.afterMountHooks.push(...toArray(hooks));
    }

    registerBeforeUnmountHooks (hooks) {
        this.beforeUnmountHooks.push(...toArray(hooks));
    }

    registerAfterUnmountHooks (hooks) {
        this.afterUnmountHooks.push(...toArray(hooks));
    }

    // endregion

    // region 子应用操作父应用 将这些方法注册到子身上

    /**
     * 创建所有注册到子监听的方法，保存到events，以便子去获取
     */
    createFunToChild () {
        this.updateProgressFun();
        this.timeOutFun();
    }

    createFun (name, handler) {
        if (this.events[name]) {
            this.events[name].push(handler);
        } else {
            this.events[name] = [handler];
        }
    }

    /**
     * 进度条显示 0-100
     */
    updateProgressFun () {
        this.createFun(EVENT_TYPE.UPDATE_PROGRESS, process => {
            this.options.operatorProgress && this.options.operatorProgress(process);
        });
    }

    /**
     * 父应用监听子应用过期时，所需要的操作
     */
    timeOutFun () {
        this.createFun(EVENT_TYPE.SESSION_TIME_OUT, () => {
            this.options.sessionTimeoutHandler && this.options.sessionTimeoutHandler();
        });
    }

    // endregion

    destroy () {
        this.events = null;
        this.mainRouteChangeHandler?.destroy();
        this.iframeRouteChangeHandler?.destroy();
        this.unmountIframe();
    }
}
