<template>
  <aside class="sidebar">
    <slot></slot>
  </aside>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Sidebar extends Vue {}
</script>

<style lang="scss" scoped>
.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  max-width: 400px;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;

  padding: 16px 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #ebeef5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #abbadb;
  }
}
</style>
