import ChartJS, { ChartConfiguration, ChartDataSets } from 'chart.js';

export default class Chart {
  private options: ChartConfiguration;
  private chart: ChartJS;

  constructor(color: string) {
    this.options = {
      type: 'line',
      data: {
        datasets: [
          {
            data: [],
            fill: false,
            pointRadius: 0,
            borderColor: color,
          },
        ],
      },
      options: {
        animation: { duration: 0 },
        hover: { animationDuration: 0 },
        responsiveAnimationDuration: 0,
        legend: { display: false },
        tooltips: { enabled: false },
        elements: { line: { tension: 0 } },
        // scales: { yAxes: [{ ticks: { suggestedMin: small ? 0 : -2, suggestedMax: 0 } }] },
      },
    };
  }

  /**
   * push
   */
  public push(time: string, data: number) {
    this.chart.data.labels!.push(time);
    if (this.chart.data.labels!.length > 100) {
      this.chart.data.labels!.shift();
    }

    this.chart.data.datasets!.forEach((dataset: ChartDataSets) => {
      dataset.data!.push(data);
      if (dataset.data!.length > 100) {
        dataset.data!.shift();
      }
    });

    this.chart.update();
  }

  public create(element: HTMLCanvasElement) {
    this.chart = new ChartJS(element, this.options);
  }
}
