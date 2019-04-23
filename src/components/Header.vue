<template>
  <header class="header">
    <h1>Модель Изинга</h1>
    <p>Cимуляция идеализированного двумерного магнитного материала, в котором каждая частица может иметь только два возможных спина, представленных двумя цветами.</p>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {}
</script>

<style lang="scss" scoped>
.header {
  border-bottom: 2px solid #ebeef5;
  padding: 16px;

  h1 {
    font-size: 32px;
    font-weight: 400;
    color: #363636;
    margin-bottom: 24px;
  }

  p {
    font-size: 14px;
    line-height: 1.4;
    color: #606266;
    margin-bottom: 16px;
  }
}
</style>
