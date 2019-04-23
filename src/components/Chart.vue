<template>
  <div class="chart">
    <p>{{title}}</p>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Chart extends Vue {
  @Prop() public title: string;
}
</script>

<style lang="scss" scoped>
.chart {
  &:not(:last-child) {
    padding-bottom: 24px;
    border-bottom: 1px solid #ebeef5;
  }

  &:last-child {
    padding-top: 24px;
  }
  p {
    font-size: 14px;
    text-align: center;
    margin-bottom: 8px;
  }
}
</style>
