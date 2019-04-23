import { CanvasOptions, IsingOptions } from '../models';

export default class IsingModel {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private image: ImageData;

  private running: boolean;
  private grid: number[][];

  private canvasOptions: CanvasOptions;
  private isingOptions: IsingOptions;

  constructor() {
    this.canvasOptions = {
      size: 512,
      pixel: 0,
      colors: [[255, 255, 255], [32, 32, 32]],
    };

    this.isingOptions = {
      size: 256,
      temperature: 2.269,
      stepsPerFrame: 10000,
      type: 1,
      energy: 0,
      magnetic: 0,
      time: 0,
    };
  }

  public get energy(): number {
    return +this.isingOptions.energy.toFixed(5);
  }

  public get magnetic(): number {
    return +this.isingOptions.magnetic.toFixed(5);
  }

  public get time(): string {
    return this.isingOptions.time.toFixed(0);
  }

  public get type(): number {
    return this.isingOptions.type;
  }

  public set type(value: number) {
    this.resetIsingStats();
    this.isingOptions.type = value;
  }

  public get temperature(): number {
    return this.isingOptions.temperature;
  }

  public set temperature(value: number) {
    this.isingOptions.temperature = value;
  }


  public get stepsPerFrame(): number {
    return this.isingOptions.stepsPerFrame;
  }

  public set stepsPerFrame(value: number) {
    this.isingOptions.stepsPerFrame = value;
  }


  /**
   * Initialise
   */
  public initialize(canvasID: string) {
    this.canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    this.canvas.width = this.canvasOptions.size;
    this.canvas.height = this.canvasOptions.size;

    this.canvasOptions.pixel = this.canvasOptions.size / this.isingOptions.size;

    this.context = this.canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
    this.image = this.context.getImageData(0, 0, this.canvasOptions.size, this.canvasOptions.size);

    this.initGrid();
    this.context.putImageData(this.image, 0, 0);

    this.startSimulate();
  }

  /**
   * startSimulate
   */
  public startSimulate() {
    requestAnimationFrame(this.startSimulate.bind(this));

    if (this.running) {
      for (let step = 0; step < this.isingOptions.stepsPerFrame; step++) {
        const i: number = Math.floor(Math.random() * this.isingOptions.size);
        const j: number = Math.floor(Math.random() * this.isingOptions.size);

        const deltaE: number = this.deltaEnergy(i, j);
        const gibbs: number = Math.exp(-deltaE / this.isingOptions.temperature);

        if (deltaE <= 0 || Math.random() < gibbs) {
          this.grid[i][j] *= -1;
          this.drawPixel(i, j);

          this.isingOptions.energy += 1.0 * deltaE / (this.isingOptions.size ** 2);

          this.isingOptions.magnetic +=
            2.0 * this.grid[i][j] *
            this.grid[this.isingOptions.size - 1][this.isingOptions.size - 1] /
            (this.isingOptions.size ** 2);
        }

        this.isingOptions.time += 1 / this.isingOptions.size ** 2;
      }


      this.context.putImageData(this.image, 0, 0);
    }
  }

  /**
   * toggleSimulation
   */
  public toggleSimulation() {
    this.running = !this.running;
  }

  /**
   * resize
   */
  public resize(size: number) {
    this.running = false;
    this.resetIsingStats();

    this.isingOptions.size = size;
    this.canvasOptions.pixel = this.canvasOptions.size / this.isingOptions.size;

    this.initGrid();
    this.context.putImageData(this.image, 0, 0);
  }

  /**
   * download
   */
  public download() {
    const url = this.canvas.toDataURL();
    this.hiddenLink(
      url,
      `ising_${this.isingOptions.size}x${
      this.isingOptions.size
      }_t=${
      this.isingOptions.temperature
      }_j=${
      this.isingOptions.type
      }.png`,
    );
  }

  /**
   * reset
   */
  public reset() {
    this.isingOptions.energy = 0;
    this.isingOptions.magnetic = 0;
    this.isingOptions.time = 0;
    this.initGrid();
  }

  /**
   * Private methods
   */

  private hiddenLink(uri: string, filename: string) {
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = uri;
    link.style.display = 'none';
    link.download = filename;

    const element: HTMLElement = document.body.appendChild(link);
    element.click();
    document.body.removeChild(element);
  }

  private initGrid() {
    this.grid = new Array(this.isingOptions.size);

    for (let i = 0; i < this.isingOptions.size; i++) {
      this.grid[i] = new Array(this.isingOptions.size);

      for (let j = 0; j < this.isingOptions.size; j++) {
        this.grid[i][j] = 2 * Math.floor(Math.random() * 2) - 1;
        this.drawPixel(i, j);
      }
    }
  }

  private drawPixel(i: number, j: number) {
    const xOffset: number = i * this.canvasOptions.pixel;
    const yOffset: number = j * this.canvasOptions.pixel;

    for (let x = 0; x < this.canvasOptions.pixel; x++) {
      for (let y = 0; y < this.canvasOptions.pixel; y++) {
        const index: number =
          ((yOffset + y) *
            this.isingOptions.size *
            this.canvasOptions.pixel +
            xOffset +
            x) *
          4;

        const color: number[] = this.getColor(this.grid[i][j]);

        this.image.data[index] = color[0];
        this.image.data[index + 1] = color[1];
        this.image.data[index + 2] = color[2];
      }
    }
  }

  private getColor(value: number): number[] {
    return value === -1 ? this.canvasOptions.colors[0] : this.canvasOptions.colors[1];
  }

  private deltaEnergy(i: number, j: number): number {
    let left: number;
    let right: number;
    let top: number;
    let bottom: number;

    const size: number = this.isingOptions.size;

    if (i === 0) { left = this.grid[size - 1][j]; } else { left = this.grid[i - 1][j]; }
    if (i === size - 1) { right = this.grid[0][j]; } else { right = this.grid[i + 1][j]; }
    if (j === 0) { top = this.grid[i][size - 1]; } else { top = this.grid[i][j - 1]; }
    if (j === size - 1) { bottom = this.grid[i][0]; } else { bottom = this.grid[i][j + 1]; }

    return this.isingOptions.type * 2 * this.grid[i][j] * (left + right + top + bottom);
  }

  private resetIsingStats() {
    this.isingOptions.energy = 0;
    this.isingOptions.magnetic = 0;
  }
}
