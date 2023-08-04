<template>
    <div :class="contentClass">
        <div :id="appId"></div>
    </div>
</template>

<script>

import { PROPS } from '../common';

export default {
    name: 'VueApp',

    componentName: 'VueApp',

    props: PROPS,

    data () {
        return {
            control: null,
        };
    },

    async mounted () {
        if (this.autoLoad) {
            this.init();
        }
    },

    methods: {
        async init () {
            if (this.platform) {
                this.control = this.platform.createSubApp(this.appId, {
                    entry: this.appEntry,
                    ID: this.appId,
                    data: this.data,
                    class: this.appClass,
                    mainRouteBase: this.mainRouteBase,
                    iframeRouteBase: this.iframeRouteBase,
                    operatorProgress: this.operatorProgress,
                    sessionTimeoutHandler: this.sessionTimeoutHandler,
                    iframeBeforeCreate: this.iframeBeforeCreate,
                    iframeAfterCreate: this.iframeAfterCreate,
                    iframeMounted: this.iframeMounted,
                    iframeBeforeMount: this.iframeBeforeMount,
                    iframeAfterMount: this.iframeAfterMount,
                    iframeBeforeUnmount: this.iframeBeforeUnmount,
                    iframeAfterUnmount: this.iframeAfterUnmount,
                });
                await this.control.mountIframe(`#${this.appId}`);
            }
        },
    },

    beforeUnmount () {
        this.platform.removeSubApp(this.appId);
    },

};
</script>

<style scoped>
</style>
