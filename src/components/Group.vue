<template>
  <div class="group">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Group extends Vue {}
</script>


<style lang="scss" scoped>
.group {
  display: flex;

  & button {
    margin-right: 0;
    border-radius: 0;
    flex: 1;

    &:first-child {
      border-radius: 4px 0 0 4px;
    }

    &:last-child {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>
