<template>
  <div class="slider">
    <p class="label" v-if="label">{{label}}</p>

    <div class="slider-bar">
      <div class="runway" @click="barClick" ref="runway">
        <div class="bar" :style="{ width: position + 'px' }"></div>
        <div
          class="button-wrapper"
          :style="{ left: position + 'px' }"
          ref="button"
          @mousedown="dragStart"
        >
          <span class="button" :class="{'dragging': dragging}"></span>
        </div>

        <span class="min">{{this.min}}</span>
        <span class="max">{{this.max}}</span>

        <span
          class="tooltip"
          v-show="dragging"
          :style="{ left: position - 24 + 'px' }"
          ref="tooltip"
        >{{this.value}}</span>
      </div>

      <div class="counter">
        <button class="action decrease" @click="decrease" :disabled="disabledDecrease">-</button>
        <button class="action increase" @click="increase" :disabled="disabledIncrease">+</button>
        <input
          class="input"
          type="text"
          v-model="inputValue"
          @blur="changeInputValue"
          @keypress.enter="changeInputValue"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';

@Component
export default class Slider extends Vue {
  get disabledDecrease(): boolean {
    return this.value <= this.min;
  }
  get disabledIncrease(): boolean {
    return this.value >= this.max;
  }

  get precision(): number {
    const demical: string = ('' + this.step).split('.')[1];
    return demical ? demical.length : 0;
  }
  @Prop() public label: string;
  @Prop() public value: number;
  @Prop({ default: 0 }) public min: number;
  @Prop({ default: 100 }) public max: number;
  @Prop({ default: 1 }) public step: number;

  public position: number = 0;
  public dragging: boolean = false;
  public width: number = 0;
  public offset: number = 0;
  public inputValue: number = 0;

  @Watch('value')
  public onChangedValue() {
    this.inputValue = this.value;
    this.changeValue(this.value);
  }

  @Emit('input')
  public emitEvents(value: number) {
    return value;
  }

  public mounted() {
    this.$nextTick(() => {
      this.resize();
      this.inputValue = this.value;

      this.changeInputValue();

      document.addEventListener('mousemove', this.drag);
      document.addEventListener('mouseup', this.dragEnd);
      window.addEventListener('resize', this.resize);

      (this.$refs.button as HTMLElement).addEventListener(
        'touchstart',
        this.dragStart,
      );
      document.addEventListener('touchend', this.dragEnd);
      document.addEventListener('touchmove', this.drag);
    });
  }

  public resize() {
    const runway = this.$refs.runway as HTMLElement;
    this.width = runway.offsetWidth;
    this.offset = runway.getBoundingClientRect().left;
  }

  public getBarPosition(event: any): number {
    const e = event.targetTouches ? event.targetTouches[0] : event;
    return e.clientX - this.offset;
  }

  public calcPosition(value: number, step = 0): number {
    return ((value + step) / this.max) * this.width;
  }

  public decrease() {
    if (this.value > this.min) {
      this.changeValue(this.value, -this.step);
    }
  }

  public increase() {
    if (this.value < this.max) {
      this.changeValue(this.value, this.step);
    }
  }

  public setPrecision(value: number): number {
    return +Number(value).toFixed(this.precision);
  }

  public changeInputValue() {
    let value: number = this.setPrecision(this.inputValue);
    if (!isNaN(value)) {
      if (value > this.max) {
        value = this.max;
      }
      if (value < this.min) {
        value = this.min;
      }
      this.inputValue = value;
      this.changeValue(value);
    } else {
      this.inputValue = this.value;
    }
  }

  public setPosition(position: number): number {
    let value: number = this.setPrecision((position / this.width) * this.max);
    if (value < this.min) {
      this.position = value = this.min;
    } else if (value > this.max) {
      value = this.max;
      this.position = this.width;
    } else {
      this.position = position;
    }
    return this.setPrecision(value);
  }

  public barClick(e: MouseEvent | TouchEvent) {
    this.changeValue(this.setPosition(this.getBarPosition(e)));
  }

  public dragStart() {
    this.dragging = true;
  }

  public drag(e: MouseEvent | TouchEvent) {
    if (!this.dragging) {
      return;
    }
    this.changeValue(this.setPosition(this.getBarPosition(e)));
  }

  public dragEnd(e: MouseEvent | TouchEvent) {
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    if (e.type === 'touchend') {
      return;
    }
    this.changeValue(this.setPosition(this.getBarPosition(e)));
  }

  private changeValue(value: number, step = 0) {
    this.emitEvents(this.setPosition(this.calcPosition(value, step)));
  }
}
</script>

<style lang="scss" scoped>
.slider {
  position: relative;
  display: flex;
  margin-bottom: 32px;
  flex-direction: column;
  user-select: none;
}

.label {
  font-size: 14px;
  margin-bottom: 8px;
  color: #606266;
}

.slider-bar {
  display: flex;
  position: relative;
}

.min,
.max {
  position: absolute;
  margin-top: 12px;
  font-size: 10px;
}

.min {
  left: 0;
}
.max {
  right: 0;
}

.tooltip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 24px;
  background: #363636;
  color: #ffffff;
  font-size: 10px;
  position: absolute;
  bottom: 0;
  margin-bottom: 20px;
  border-radius: 4px;
  &:after,
  &:before {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  &:after {
    border-top-color: #363636;
    border-width: 4px;
    margin-left: -4px;
  }
}

.counter {
  position: relative;
  margin-left: 32px;
}

.action {
  display: inline-flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #f5f7fa;
  border: none;
  outline: none;
  font-size: 16px;
  margin-top: 1px;

  &:hover {
    color: #409eff;
    & ~ .input {
      border-color: #409eff;
    }
  }

  &:disabled {
    cursor: not-allowed;
  }
}

.increase {
  right: 1px;
  border-radius: 0 4px 4px 0;
  border-left: 1px solid #dcdfe6;
}

.decrease {
  left: 1px;
  border-radius: 4px 0 0 4px;
  border-right: 1px solid #dcdfe6;
}

.input {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 32px;
  width: 128px;
  padding: 0 40px;
  text-align: center;
  outline: none;
  color: #606266;

  &:hover {
    border-color: #c0c4cc;
  }

  &:focus {
    border-color: #409eff;
  }
}

.runway {
  flex: 1;
  position: relative;
  height: 6px;
  background-color: #e4e7ed;
  border-radius: 2px;
  cursor: pointer;
  margin: 16px 0;
}

.bar {
  display: flex;
  background-color: #409eff;
  height: 6px;
  border-radius: 2px 0 0 2px;
  position: absolute;
  left: 0;
  width: 40%;
}

.button-wrapper {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -15px;
  transform: translateX(-50%);
  background-color: transparent;
  z-index: 22;
}

.button {
  width: 16px;
  height: 16px;
  display: inline-flex;
  background: #ffffff;
  border-radius: 50%;
  border: 2px solid #409eff;
  transition: 0.16s transform;
}

.dragging {
  transform: scale(1.25);
}
</style>
