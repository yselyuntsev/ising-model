<template>
  <div class="wrapper">
    <e-sidebar>
      <e-header/>

      <e-card>
        <e-group>
          <e-button
            @click="toggleSimulation()"
            :text="!running ? 'Старт' : 'Стоп'"
            :type="!running ? 'success' : 'danger'"
          ></e-button>
          <e-button @click="reset()" text="Сбросить"></e-button>
          <e-button @click="downloadImage()" text="Скачать"></e-button>
        </e-group>
      </e-card>

      <e-card title="Статистика системы">
        <e-stats title="Энергия:" :value="energy"/>
        <e-stats title="Намагниченность:" :value="magnetic"/>
      </e-card>

      <e-card title="Графики системы">
        <e-chart title="Энергия">
          <canvas id="energy"></canvas>
        </e-chart>
        <e-chart title="Намагниченность">
          <canvas id="magnetic"></canvas>
        </e-chart>
      </e-card>

      <e-card title="Параметры системы">
        <e-select label="Тип структуры" :options="types" v-model="type" id="type"></e-select>
        <e-select label="Размер структуры" :options="sizes" v-model="size" id="size"></e-select>
        <e-slider label="Температура" v-model="temperature" :min="0.001" :max="6" :step="0.001"></e-slider>
        <e-slider label="Скорость обновления" v-model="steps" :min="1" :max="10000"></e-slider>
      </e-card>

      <e-footer/>
    </e-sidebar>

    <e-main>
      <canvas id="ising"></canvas>
    </e-main>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import IsingModel from '../services/ising';
import Charts from '../services/chart';

import { Option } from '../models';

import ESidebar from '../components/Sidebar.vue';
import EMain from '../components/Main.vue';
import EHeader from '../components/Header.vue';
import EFooter from '../components/Footer.vue';
import ESelect from '../components/Select.vue';
import EButton from '../components/Button.vue';
import EGroup from '../components/Group.vue';
import ESlider from '../components/Slider.vue';
import ECard from '../components/Card.vue';
import EStats from '../components/Stats.vue';
import EChart from '../components/Chart.vue';

const ISING_MODEL = new IsingModel();
const ENERGY_CHART = new Charts('#409eff');
const MAGNETIC_CHART = new Charts('#f56c6c');

@Component({
  components: {
    ESelect,
    EButton,
    EGroup,
    ESlider,
    ECard,
    ESidebar,
    EHeader,
    EMain,
    EFooter,
    EStats,
    EChart,
  },
})
export default class HelloWorld extends Vue {
  public types: Option[] = [
    { name: 'Ферромагнитная', value: 1 },
    { name: 'Антиферромагнитная', value: -1 },
  ];

  public size: number = 256;
  public sizes: Option[] = [
    { name: '32x32', value: 32 },
    { name: '64x64', value: 64 },
    { name: '128x128', value: 128 },
    { name: '256x256', value: 256 },
    { name: '512x512', value: 512 },
  ];

  public temperature: number = ISING_MODEL.temperature;
  public steps: number = 10000;
  public energy: number = 0;
  public magnetic: number = 0;
  public type: number = 1;

  public running: boolean = false;

  @Watch('temperature')
  public onChangedTemperature() {
    ISING_MODEL.temperature = this.temperature;
  }

  @Watch('steps')
  public onChangedSteps() {
    ISING_MODEL.stepsPerFrame = this.steps;
  }

  @Watch('type')
  public onChangedType() {
    ISING_MODEL.type = this.type;
  }

  @Watch('size')
  public onChangedSize() {
    this.running = false;
    ISING_MODEL.resize(this.size);
  }

  public mounted() {
    this.$nextTick(() => {
      ISING_MODEL.initialize('ising');

      ENERGY_CHART.create(document.getElementById(
        'energy',
      ) as HTMLCanvasElement);

      MAGNETIC_CHART.create(document.getElementById(
        'magnetic',
      ) as HTMLCanvasElement);

      requestAnimationFrame(this.getEnergy);
      requestAnimationFrame(this.updateCharts);
    });
  }

  public toggleSimulation() {
    ISING_MODEL.toggleSimulation();
    this.running = !this.running;
  }

  public reset() {
    ISING_MODEL.reset();
  }

  public getEnergy() {
    requestAnimationFrame(this.getEnergy);
    this.energy = ISING_MODEL.energy;
    this.magnetic = ISING_MODEL.magnetic;
  }

  public updateCharts() {
    if (this.running) {
      const time: string = ISING_MODEL.time;
      const energy: number = ISING_MODEL.energy;
      const magnetic: number = ISING_MODEL.magnetic;

      ENERGY_CHART.push(time, energy);
      MAGNETIC_CHART.push(time, magnetic);
    }
    requestAnimationFrame(this.updateCharts);
  }

  public downloadImage() {
    ISING_MODEL.download();
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

#ising {
  width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(22, 22, 32, 0.2);
}
</style>
