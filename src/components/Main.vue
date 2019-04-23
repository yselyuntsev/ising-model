<template>
  <section class="main">
    <div class="ising">
      <slot></slot>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Main extends Vue {}
</script>

<style lang="scss" scoped>
.main {
  padding-left: 400px;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.ising {
  max-width: 544px;
  height: auto;
  width: 100%;
  padding: 16px;
}
</style>
