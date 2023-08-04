<template>
  <div class="about">
    <h1>This is page</h1>
    <div>
      {{show}}
    </div>
  </div>
</template>
<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Page1 extends Vue {
  private show: string | (string | null)[] = '';
  mounted () {
    this.show = this.$router.currentRoute.query.name;
  }

};
</script>
