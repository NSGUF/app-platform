declare module Vue {}

export interface ParentRouter {
    path: string;
    params?: Object;
    target?: string;
}

export enum OPEN_WINDOW_TARGET {
    BLANK = '_blank',
    SELF = '_self',
    PARENT = '_parent',
    TOP = '_top',
}

/**
 * platform去操作路由方式的参数
 */
export interface IframeRouterParams extends ParentRouter{
    appId: string;
    subPath: string;
    childParams?: Object;
}

export type IframeRouter = {
    target: OPEN_WINDOW_TARGET.SELF,
    appId: string,
    subPath: string,
    childParams?: object
} | IframeRouterParams;

// @ts-ignore
export declare class VueApp extends Vue {

    /**
     * 自动加载control
     */
    readonly autoLoad: boolean;

    /**
     * iframe挂载的节点id
     */
    readonly appId: string;

    /**
     * 包裹iframe的div的样式
     */
    readonly contentClass: string;


    /**
     * iframe的div的样式
     */
    readonly appClass: string;

    /**
     * iframe的src
     */
    readonly appEntry: string;

    /**
     * 当前插入界面的类型，用于缓存默认打开子应用的界面url
     */
    readonly appType: string;

    /**
     * 父窗口的默认打开的hash值
     */
    readonly mainRouteBase: string;

    /**
     * iframe的默认打开的hash值
     */
    readonly iframeRouteBase: string;

    /**
     * 操作进度条的回调
     */
    readonly operatorProgress: (progress: number) => void;

    /**
     * 子应用过期时，父应用的操作
     */
    readonly sessionTimeoutHandler: (progress: number) => void;

    /**
     * 给子应用的全局的属性
     */
    readonly data: any;

    /**
     * 给url的参数
     */
    readonly defaultQuery: any;


    /**
     * beforeCrate的回调方法
     */
    readonly iframeBeforeCreate: () => void;

    /**
     * afterCrate的回调方法
     */
    readonly iframeAfterCreate: () => void;

    /**
     * beforeMount的回调方法
     */
    readonly iframeBeforeMount: () => void;

    /**
     * afterMount的回调方法
     */
    readonly iframeAfterMount: () => void;

    /**
     * beforeUnmount的回调方法
     */
    readonly iframeBeforeUnmount: () => void;

    /**
     * afterUnmount的回调方法
     */
    readonly iframeAfterUnmount: () => void;

    /**
     * 父窗口的操作类实例
     */
    readonly platform: Platform;

}

interface IOptions {
    entry: string
    ID: string
    data: any
    class: string
    mainRouteBase: string | Function | Promise<Function>
    iframeRouteBase: string | Function | Promise<Function>
    operatorProgress: Function
    sessionTimeoutHandler: Function
    iframeBeforeCreate: Function
    iframeAfterCreate: Function
    iframeMounted: Function
    iframeBeforeMount: Function
    iframeAfterMount: Function
    iframeBeforeUnmount: Function
    iframeAfterUnmount: Function
}
/**
 * platform上的一个sdk，供其他platform调用的
 */
export declare class Service {
    constructor(platform: any);
    /**
     * 当前platform给自己身上注册方法
     * @param fnName 方法名
     * @param fn 对应的方法
     */
    registerService(fnName: string, fn: Function): void;
    /**
     * 当前platform调用父应用的方法
     * @param fnName 方法名
     * @returns {null|any}
     */
    invokeParentService(fnName: string): any;
    /**
     * 当前platform调用子应用的方法
     * @param appId 子应用的id
     * @param fnName 方法名
     * @returns {null|any}
     */
    invokeChildService(appId: string, fnName: string): any;
    /**
     * 执行对应的方法
     * @param serviceFns 方法挂载的对象
     * @param fnName 方法名
     * @returns {null|any} 结果
     */
    invokieService(serviceFns: Function, fnName: string): any;
    /**
     * 序列化data
     */
    serializeData(data: any): any;
}
/**
 * ext和vue封装的组件的共同逻辑
 */
export declare class Controller {
    beforeMountHooks: Function[];
    afterMountHooks: Function[];
    beforeUnmountHooks: Function[];
    afterUnmountHooks: Function[];

    constructor({ options, $platform  }: {
        options: IOptions;
        $platform: Platform;
    });
    /**
     * 将iframe挂载到el的位置
     */
    mountIframe(el: any): Promise<this>;

    /**
     * 卸载iframe
     */
    unmountIframe(): Promise<this>;

}

/**
 * 父应用的操作类封装，以及管理子应用
 */
export declare class Platform {
    readonly service: Service;

    constructor(opts: any);

    /**
     * 当前app设置路由
     * @param path 路由路径
     */
    setPath (path: string): void;

    /**
     * 创建一个controller
     * @param key 当前这个controller对应的key
     * @param options 创建controller的参数
     * @returns {*} controller
     */
    createSubApp(key: string, options: any): Controller;
    /**
     * 通过key找到对应的controller
     * @param key 键
     * @returns {*} controller
     */
    getSubApp(key: string): any;
    getApps(): Controller;
    /**
     * 移除某个controller
     * @param key controller对应的key
     */
    removeSubApp(key: string): void;

    on(eventName: string, callback: Function, appId: string): void;
    /**
     * 触发自身的某个事件
     * @param eventName 事件名
     * @param appId 子应用的id 如果是触发父注册的，那就传null
     * @param arg 参数
     */
    emit(eventName?: string, appId?: string | null, ...arg: any[]): void;
    /**
     * 注销事件 如果appId存在就是注销某个子的，没有就是默认注销default的
     * @param eventName 事件名
     * @param appId 对应子的id
     */
    off(eventName: string, appId?: string | null): void;
    /**
     * 注册事件到父身上
     * @param name 事件ID
     * @param handler 事件回调
     */
    registerParent(name: string, handler: Function): void;
    /**
     * 解除父上的事件
     * @param name 事件ID
     */
    deregisterParent(name: string): void;
    /**
     * 注册事件到自身的某个子身上
     * @param name 事件ID
     * @param handler 事件回调
     * @param control 对应子的control
     */
    registerChild(name: string, handler: Function, control: Controller): void;
    /**
     * 解除子上的事件
     * @param name 事件ID
     * @param control 对应子的control
     */
    deregisterChild(name: string, control: Controller): void;
    /**
     * 获取自己身上想要传给父或者子的数据
     */
    getData(): Object;
    /**
     * 更新数据，只支持传json
     * @param data 更新的数据
     */
    updateData(data: Object): void;
    /**
     * 打开父窗口的新tab页，然后子窗口是这里传过去的url界面
     * @param {string} url 子窗口需要打开的路径
     */
    openPage(router: ParentRouter): void;

    /**
     * 打开某个嵌入页
     * @param path 路径
     * @param appId 嵌入页的appId
     * @param subPath 嵌入页的路径
     * @param params 父应用的路径参数
     * @param childParams 子应用的路径参数
     * @param target 打开方式
     */
    openChildPage(router: ParentRouter): void;

    /**
     * 向父应用发送信息，告诉父应用，子应用会话已经过期了
     */
    sessionTimeoutHandler(): void;

    /**
     * 更新父窗口的整体进度条
     * @param {number} process 进度数字
     */
    updateProgress(process: number): void;

}
