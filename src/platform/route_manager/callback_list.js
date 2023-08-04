/**
 * 各种监听拦截的回调操作
 */

export class CallbackList {
    callbackList = [];
    skipNextFlag = false;
    win;

    constructor (win) {
        this.win = win;
    }

    registerCallback (cb) {
        if (typeof cb === 'function') {
            this.callbackList.push(cb);
        } else {
            throw new Error('callback must is function');
        }
    }

    skipNext () {
        this.skipNextFlag = true;
    }

    runCallbacks (...params) {
        if (this.skipNextFlag) {
            this.skipNextFlag = false;
            return;
        }
        this.callbackList.forEach(cb => {
            // eslint-disable-next-line no-useless-catch
            try {
                // eslint-disable-next-line n/no-callback-literal
                cb(...params);
            } catch (err) {
                throw err;
            }
        });
    }

    destroy () {
        this.win = null;
        this.callbackList = [];
    }
}
