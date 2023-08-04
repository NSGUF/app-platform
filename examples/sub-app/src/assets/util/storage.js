/***
 * 从localStorage中存取数据，数据默认保存到localStorage[VMP]
 * 使用:
 *  set('a.b.c' ,value) 等价于 VMP.a.b.c = value, ，调用save才会保存到localStorage
 *  set('a.b.c) 删除a.b.c，等价于 delete VMP.a.b.c
 *  get('a.b.c') 读取 VMP.a.b.c
 *  get() 读取 VMP
 *  save() 保存set()的修改到localStorage
 *  clearCache() 删除从localStorage[VMP]读取到的保存在内存中的值，调用save才会保存
 *  getAll() 返回 cache[VMP] || localStorage[VMP]
 */

var ls = null;

// ie11某些条件下直接访问localStorage会抛个内部错误的异常，需要进行捕获
try {
    var _mod = 'window.localStorage';
    ls = window.localStorage;
    ls.setItem(_mod, _mod);
    ls.removeItem(_mod);
} catch (e) {
    console.error('the browser don\'t support localStorage');
    // 不支持就重置
    ls = null;
}

var NS = location.pathname;

/* 保存当前操作的localStorage[ns]对象 */
var cache = {};

/**
 * 获取key的值
 * @param key  ==false，返回所有
 * @param ns 一级命名空间，默认VMP
 * @returns {null|mix}
 */
function getKey(key, ns) {
    ns = ns || NS;

    var d = cache[ns] || ls.getItem(ns) && JSON.parse(ls.getItem(ns));
    if(!d) {
        return;
    }

    cache[ns] = d;
    if(!key || !key.length) {
        return cache[ns];
    }

    var arrKey = key.split('.'),
        i = arrKey[0]===ns? 1: 0,
        c = cache[ns];

    for(; i<arrKey.length; i++) {
        if(!c[arrKey[i]] && c[arrKey[i]] !== 0) {
            console.info(arrKey[i]+' is undefined');
            return null;
        } else {
            c = c[arrKey[i]];
        }
    }
    return c;
}

/**
 * 返回命名空间的数据
 * @param ns
 * @returns {null|mix}
 */
function getAll(ns) {
    ns = ns || NS;
    return getKey(false, ns);
}

/**
 * 设置键值，在调用save后才写入localstorage
 * @param key 完整变量名，'console.name' or 'VMP.console.name'，不存在则创建
 * @param value 设置的值，为null or undefined 则删除变量
 * @param ns
 * @returns {undefined | last value}
 */
function setKey(key, value, ns) {
    if(!key) {
        return;
    }

    ns = ns || NS;

    cache[ns] = cache[ns] || {};

    var arrKey = key.split('.'),
        i = arrKey[0]===ns? 1: 0,
        c = cache[ns],
        lv;

    try {
        JSON.stringify(value);
    } catch(e) {
        console.info(value+'is not an illegal value');
        return;
    }

    for(; i<arrKey.length-1; i++) {
        if(!c[arrKey[i]]) {
            if(value===undefined || value===null) {
                console.info(arrKey[i]+' not exist');
                return lv;
            }
            console.info(arrKey[i]+' create {}');
            c[arrKey[i]] = {};
        }
        c = c[arrKey[i]];
    }

    lv = c[arrKey[i]];
    if(value===undefined || value===null) {
        delete c[arrKey[i]];
    } else {
        c[arrKey[i]] = value;
    }

    // delete后只能返回undefined，不能返回删除之前的数据了..
    return lv;
}

/**
 * 保存修改到localStorage
 * @param ns
 */
function saveModify(ns) {
    ns = ns || NS;
    if(cache[ns]) {
        if(ls.getItem(ns)) {
            console.info(ns+' is not defined, create {}');
        }
        ls.setItem(ns, JSON.stringify(cache[ns]));
    } else {
        delete ls[ns];
    }
    // clearCache(ns);
}

function clearCache(ns) {
    ns = ns || NS;
    delete cache[ns];
}

function setDefaultNameSpace(ns) {
    NS = ns;
}

function empty(){}

const str = {
    get: ls ? getKey : empty,
    getAll: ls ? getAll : empty,
    set: ls ? setKey : empty,
    save: ls ? saveModify : empty,
    clearCache: ls ? clearCache : empty,
    setDeafultNameSpace: ls ? setDefaultNameSpace : empty
};

export default str;
