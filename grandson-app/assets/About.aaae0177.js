import{C as i,V as _,n as u}from"./index.017e199b.js";var p=Object.defineProperty,v=Object.getOwnPropertyDescriptor,b=(e,r,t,n)=>{for(var o=n>1?void 0:n?v(r,t):r,s=e.length-1,a;s>=0;s--)(a=e[s])&&(o=(n?a(r,t,o):a(o))||o);return n&&o&&p(r,t,o),o};let l=class extends _{openPage1(){this.$platform.openPage("#/page")}openProgress(){let e=0;const r=setInterval(()=>{this.$platform.updateProgress(e),e===100&&clearInterval(r),e+=10},400)}toLogin(){this.$platform.sessionTimeoutHandler()}};l=b([i({})],l);var f=function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",{staticClass:"about"},[t("button",{on:{click:e.openPage1}},[e._v("\u6253\u5F00\u65B0\u754C\u9762")]),t("br"),t("br"),t("br"),t("br"),t("button",{on:{click:e.openProgress}},[e._v("\u8FDB\u5EA6\u6761")]),e._v(" console\u4F1A\u8F93\u51FA "),t("br"),t("br"),t("br"),t("br"),t("br"),t("button",{on:{click:e.toLogin}},[e._v("\u7236\u5BB9\u5668\u8DF3\u8F6C\u767B\u5F55\u9875")])])},m=[];const c={};var g=u(l,f,m,!1,P,null,null,null);function P(e){for(let r in c)this[r]=c[r]}var d=function(){return g.exports}();export{d as default};
