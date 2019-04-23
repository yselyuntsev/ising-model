<template>
  <div class="card">
    <div class="card__header" v-if="title" @click="toggle">
      <p>{{title}}</p>
      <span class="card__chevron" :class="{'--hide': !show}"></span>
    </div>
    <div class="card__main" v-show="show">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Card extends Vue {
  @Prop() public title: string;

  public show: boolean = true;

  public toggle() {
    this.show = !this.show;
  }
}
</script>

<style scoped lang="scss">
.card {
  border-top: 2px solid #ebeef5;
  border-bottom: 2px solid #ebeef5;
  overflow: hidden;

  &__header {
    padding: 16px;
    position: relative;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
  }
  &__main {
    padding: 16px;
  }

  &__chevron {
    display: inline-flex;
    width: 48px;
    top: 0;
    bottom: 0;
    right: 0;
    position: absolute;

    &:after {
      content: "";
      display: block;
      margin: auto;
      width: 4px;
      height: 4px;
      border-right: 2px solid #606266;
      border-bottom: 2px solid #606266;
      transform: rotate(225deg);
      transition: transform 0.24s ease;
    }

    &.--hide {
      &:after {
        transform: rotate(45deg);
      }
    }
  }
}
</style>
