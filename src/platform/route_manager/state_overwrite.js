/**
 * history pushState 和 replaceState 的覆写
 */

import { CallbackList } from './callback_list';

export class PushStateOverwrite extends CallbackList {
    originalPushState = null;

    constructor (win) {
        super(win);

        this.initOverwrite(win);
    }

    initOverwrite (win) {
        this.originalPushState = win.history.pushState;
        win.history.pushState = (...params) => {
            this.originalPushState.call(win.history, ...params);
            this.runCallbacks(...params);
        };
    }

    destroy () {
        if (this.callbackList.length <= 0) {
            this.win.history.pushState = this.originalPushState;
            this.originalPushState = null;
            super.destroy();
        }
    }
}

export class ReplaceStateOverwrite extends CallbackList {
    static replaceStateOverwriteMap = new Map();
    originalReplaceState = null;

    constructor (win) {
        super(win);

        this.initOverwrite(win);
    }

    static getReplaceStateOverwrite (win) {
        let overwrite;
        if (ReplaceStateOverwrite.replaceStateOverwriteMap.has(win)) {
            overwrite = ReplaceStateOverwrite.replaceStateOverwriteMap.get(win);
        } else {
            overwrite = new ReplaceStateOverwrite(win);
            ReplaceStateOverwrite.replaceStateOverwriteMap.set(win, overwrite);
        }

        return overwrite;
    }

    initOverwrite (win) {
        this.originalReplaceState = win.history.replaceState.bind(win.history);
        win.history.replaceState = (...params) => {
            this.originalReplaceState(...params);
            this.runCallbacks(...params);
        };
    }

    destroy () {
        if (this.callbackList.length <= 0) {
            this.win.history.replaceState = this.originalReplaceState;
            this.originalReplaceState = null;
            ReplaceStateOverwrite.replaceStateOverwriteMap.delete(this.win);
            super.destroy();
        }
    }
}
