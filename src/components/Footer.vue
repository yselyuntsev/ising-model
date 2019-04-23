<template>
  <footer class="footer">
    <p>Селюнцев Юрий / ДВФУ М8118</p>
    <span>Репозиторий:</span>
    <a
      href="https://bitbucket.org/YSelyuntsev/ising-model"
    >https://bitbucket.org/YSelyuntsev/ising-model</a>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {}
</script>

<style lang="scss" scoped>
.footer {
  border-top: 2px solid #ebeef5;
  padding: 16px;

  p {
    font-size: 14px;
    line-height: 1.4;
    color: #606266;
    margin-bottom: 16px;
    margin-top: 16px;
  }

  a {
    font-size: 14px;
    color: #606266;

    &:hover {
      color: #409eff;
    }
  }

  span {
    display: block;
    font-size: 12px;
    color: #606266;
  }
}
</style>
