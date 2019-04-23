<template>
  <div class="select">
    <p class="label" v-if="label">{{label}}</p>
    <div @click="toggleMenu()" class="toggle" :class="{'--active': show}">
      {{ this.selected.name }}
      <span class="caret"></span>
    </div>

    <transition name="select">
      <ul class="menu" v-show="show">
        <li v-for="option in options" :key="option.value" @click="updateOption(option)">
          <span>{{ option.name }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { Option } from '../models';

@Component
export default class Select extends Vue {
  @Prop() public options: [];
  @Prop() public value: number;
  @Prop() public label: string;

  public show: boolean = false;
  public selected: Option | undefined = { name: '', value: 0 };

  @Watch('value')
  public onChangedValue(value: number) {
    this.updateSelected();
  }

  @Emit('input')
  public updateValue(value: number) {
    return value;
  }

  public mounted() {
    this.$nextTick(() => {
      this.updateSelected();
    });
  }

  public toggleMenu() {
    this.show = !this.show;
  }

  public updateOption(option: Option) {
    this.show = false;
    this.updateSelected();
    this.updateValue(option.value);
  }

  public updateSelected() {
    this.selected = this.options.find((e: Option) => e.value === this.value);
  }
}
</script>

<style lang="scss" scoped>
.select-enter-active {
  transition: all 0.16s ease;
}
.select-leave-active {
  transition: all 0.16s ease;
}
.select-enter {
  transform: translateY(-50px);
  opacity: 0;
}
.select-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}

.select {
  position: relative;
  display: flex;
  margin-bottom: 32px;
  flex-direction: column;
}

.label {
  font-size: 14px;
  margin-bottom: 8px;
  color: #606266;
}

.toggle {
  background: #ffffff;
  display: flex;
  width: 100%;
  position: relative;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 0 15px;
  overflow: hidden;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  color: #606266;

  &:hover {
    border-color: #c0c4cc;
    cursor: pointer;
  }
}

.--active,
.--active:hover {
  border-color: #409eff;
}

.menu {
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 45;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 8px 0;
  padding: 8px 0;
  list-style: none;

  &:after,
  &:before {
    bottom: 100%;
    left: 32px;
    border: solid transparent;
    content: " ";
    position: absolute;
    pointer-events: none;
  }

  &:after {
    border-bottom-color: #ffffff;
    border-width: 4px;
    margin-left: -4px;
  }

  &:before {
    border-bottom-color: #e4e7ed;
    border-width: 5px;
    margin-left: -5px;
  }

  & > li > span {
    display: flex;
    height: 40px;
    padding: 0 24px;
    font-size: 14px;
    color: #606266;
    align-items: center;
    white-space: nowrap;
    text-decoration: none;

    &:hover {
      background: #f5f7fa;
      color: #606266;
      cursor: pointer;
    }
  }
}

.caret {
  position: relative;
  margin-left: 2px;
  border-top: 4px dashed;
  border-top: 4px solid #dcdfe6;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}
</style>
