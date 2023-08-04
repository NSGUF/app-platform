/**
 * 路由监听重写，在hashchange和popstate事件里面添加我们需要的回调执行
 */

import { CallbackList } from './callback_list';

export class HashChangeListener extends CallbackList {
    constructor (win) {
        super(win);

        this.handler = (...arg) => {
            this.runCallbacks(...arg);
        };
        this.initHashChangeListener(win);
    }

    destroy () {
        this.destroyHashChangeListener(this.win);
        super.destroy();
    }

    initHashChangeListener (win) {
        win.addEventListener('hashchange', this.handler);
    }

    destroyHashChangeListener (win) {
        win.removeEventListener('hashchange', this.handler);
    }
}

export class PopStateListener extends CallbackList {
    constructor (win) {
        super(win);

        this.handler = (...arg) => {
            this.runCallbacks(...arg);
        };
        this.initPopstateListener(win);
    }

    destroy () {
        this.destroyPopStateListener(this.win);
        super.destroy();
    }

    initPopstateListener (win) {
        win.addEventListener('popstate', this.handler);
    }

    destroyPopStateListener (win) {
        win.removeEventListener('popstate', this.handler);
    }
}
