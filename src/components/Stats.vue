<template>
  <div class="stats">
    <p>{{title}}</p>
    <span>{{value}}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Stats extends Vue {
  @Prop() public title: string;
  @Prop() public value: number;
}
</script>

<style lang="scss" scoped>
.stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #606266;
  position: relative;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &:before {
    content: "";
    width: 100%;
    height: 1px;
    margin-top: 2px;
    position: absolute;
    z-index: 2;
    background-color: #ebeef5;
  }

  p {
    font-size: 14px;
    padding-right: 16px;
    z-index: 3;
    background-color: #fff;
  }

  span {
    font-size: 14px;
    font-weight: 700;
    padding-left: 16px;
    background-color: #fff;
    color: #409eff;
    z-index: 3;
  }

  &:last-child span {
    color: #f56c6c;
  }
}
</style>
