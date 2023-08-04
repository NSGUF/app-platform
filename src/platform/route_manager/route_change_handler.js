/**
 * 路由管理
 */

import {
    getHrefById,
    getUnbasedRoute,
    supportsPushState,
    getLocationHref,
    getBase,
    parseQueryObjToStr,
} from '../../utils/url';
import { Base64 } from 'js-base64';
import { isChrome, isIE } from '../../utils/tool';
import { PopStateListener, HashChangeListener } from './route_listener';
import { PushStateOverwrite, ReplaceStateOverwrite } from './state_overwrite';

export default class RouteChangeHandler {
    routeChangeCbList = [];
    routeBaseGetter = null;
    win;
    listener = null;
    pushStateOverwrite = null;
    replaceStateOverwrite = null;

    constructor (opts) {
        this.init(opts);

        this.initHandler();
    }

    init ({ win, routeBaseGetter, id, key }) {
        this.routeChangeCbList = [];
        this.win = win;
        this.id = id;
        this.routeBaseGetter = routeBaseGetter || (target => Promise.resolve().then(() => getBase(target)));
        this.key = key;
    }

    initHandler () {
        if (!this.win) {
            return;
        }
        this.initRouteChangeHandler();
        this.initStateOverwrite();

    // this.win.addEventListener('unload', () => {
    //
    //     // 在触发unload事件，即页面跳转之后的下一个事件循环重新绑定路由监听函数
    //     setTimeout(() => {
    //         this.initHandler();
    //     });
    // });
    }

    initRouteChangeHandler () {
        this.listener = supportsPushState && !isIE ? new PopStateListener(this.win) : new HashChangeListener(this.win);
        this.listener.registerCallback(this.getHandlerRouteChange());

        this.compatibleChrome();
    }

    /**
     * 这里是解决chrome 87 版本 在iframe重新创建之后，url变了，但是没有触发popstate导致url和界面不一致问题
     * 从HashChangeEvent中拿到界面跳转的路由，让iframe跳转过去
     */
    compatibleChrome () {
        if (isChrome && this.key === 'main' && !this.hashListener) {
            this.hashListener = new HashChangeListener(this.win);
            this.hashListener.registerCallback((...args) => {
                const hashChangeEvent = args[0];
                if (hashChangeEvent instanceof HashChangeEvent) {
                    const { newURL = '' } = hashChangeEvent;
                    const route = getUnbasedRoute(newURL);
                    route && this.runCallbacks(route);
                }
            });
        }
    }

    initStateOverwrite () {
        if (!supportsPushState) {
            return;
        }

        this.pushStateOverwrite = new PushStateOverwrite(this.win);
        this.replaceStateOverwrite = ReplaceStateOverwrite.getReplaceStateOverwrite(this.win);
        this.pushStateOverwrite.registerCallback(this.getHandlerRouteChange());
        this.replaceStateOverwrite.registerCallback(this.getHandlerRouteChange());
    }

    getHandlerRouteChange () {
        return async () => {
            const route = await this.getUnbasedRoute();
            route && this.runCallbacks(route);
        };
    }

    /**
     * 更新url
     * @param route 当前可以获取的路由的信息
     * @param options isIframe表示当前的router信息是否是iframe的
     * @returns {Promise<void>}
     */
    async updateWindowRoute (route, options = {}) {
        let base = await this.routeBaseGetter(this.win);
        const { isIframe = false, redirect = href => this.redirect(this.win, href) } = options;

        let href;
        if (isIframe) {
            href = getHrefById(route, this.id, base);
        } else {
            base = base.indexOf('#') > -1 ? base : `${base}#`;
            base = base.endsWith('/') ? base.slice(0, base.length - 1) : base;

            const basedRoute = await this.getUnbasedRoute();
            const params = {};
            params[this.id] = Base64.encode(encodeURIComponent(route.unDomainHref));
            href = `${base}${parseQueryObjToStr({
                ...basedRoute.query,
                ...params,
            })}`;
        }

        this.listener.skipNext();
        redirect(href);
    }

    redirect (win, href) {
        if (!win || win.location.href === win.location.origin + href) {
            return;
        }
        win.location.href = href;
    }

    getUnbasedRoute () {
        const href = getLocationHref(this.win);

        return getUnbasedRoute(href);
    }

    registerRouteChangeCallback (callback) {
        this.routeChangeCbList.push(callback);
    }

    runCallbacks (route) {
        this.routeChangeCbList.forEach(cb => {
            try {
                typeof cb === 'function' && cb(route);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
            }
        });
    }

    destroy () {
        this.routeChangeCbList = [];
        this.win = null;
        this.listener.destroy();
        if (supportsPushState) {
            this.pushStateOverwrite?.destroy();
            this.replaceStateOverwrite?.destroy();
        }
        if (isChrome && this.key === 'main' && this.hashListener) {
            this.hashListener.destroy();
        }
    }
}
