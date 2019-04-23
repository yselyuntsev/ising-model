export interface CanvasOptions {
  size: number;
  pixel: number;
  colors: [number[], number[]];
}

export interface IsingOptions {
  size: number;
  temperature: number;
  stepsPerFrame: number;
  type: number;
  energy: number;
  magnetic: number;
  time: number;
}

export interface Option {
  name: string;
  value: number;
}
