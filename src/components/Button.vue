<template>
  <button role="button" class="button" :class="[type, size]" @click="$emit('click')">{{text}}</button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Prop() public text: string;
  @Prop() public type: string;
  @Prop() public size: string;
}
</script>

<style lang="scss" scoped>
.button {
  margin-right: 16px;
  outline: none;
  border: none;
  border-radius: 4px;
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
  color: #fff;
  background-color: #909399;

  &:hover {
    background: #a6a9ad;
  }
  &:active {
    background: #82848a;
  }

  &.success {
    background-color: #67c23a;
    &:hover {
      background: #85ce61;
    }
    &:active {
      background: #5daf34;
    }
  }

  &.danger {
    background-color: #f56c6c;
    &:hover {
      background: #f78989;
    }
    &:active {
      background: #dd6161;
    }
  }
}
</style>
