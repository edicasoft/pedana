const Hz = 10;
import { Point } from "@/entities/Point";
import Canvas from "@/entities/Canvas";

export default class Barycenter {
  x: number;
  y: number;
  cells: Point[];
  xVals: Array<number>;
  yVals: Array<number>;
  weights: Array<Array<number>>;
  Bx: number;
  By: number;
  maxY: number;
  maxX: number;
  minX: number;
  minY: number;
  image: string;
  constructor(cells: Point[], image = "barycenter") {
    // console.log("constructor", image);
    this.x = 0;
    this.y = 0;
    this.cells = cells;
    this.xVals = [];
    this.yVals = [];
    this.weights = [];
    this.Bx = 0;
    this.By = 0;
    this.maxY = 0;
    this.maxX = 0;
    this.minY = 0;
    this.minX = 0;
    this.image = image;
  }
  move(weights: number[]) {
    //console.log("weights", weights);
    const totalWeight = weights.reduce((total: number, val) => total + val, 0);
    if (totalWeight > 0) {
      const sumX = this.calculateWeightenedSum("x", weights);
      this.x = Math.round((sumX / totalWeight + Number.EPSILON) * 100) / 100;

      const sumY = this.calculateWeightenedSum("y", weights);
      this.y = Math.round((sumY / totalWeight + Number.EPSILON) * 100) / 100;
      this.xVals.push(this.x);
      this.yVals.push(this.y);
      this.weights.push(weights);
      //console.log("move", this.xVals, this.weights);
    }
  }
  resetDataToIndex(idx: number) {
    const i = idx < 0 ? 0 : idx;
    this.xVals.length = i;
    this.yVals.length = i;
    this.weights.length = i;
    //console.log("resetDataToIndex", this.weights);
  }

  drawOld(c: Canvas) {
    const image = c.images.get(
      `img/balls/old-${this.image}.png`
    ) as HTMLImageElement;

    for (let i = 0; i < this.xVals.length; i++) {
      c.ctx.save();
      c.ctx.translate(this.xVals[i], this.yVals[i]);
      c.ctx.drawImage(
        image,
        -image.width / 2,
        -image.height / 2,
        image.width,
        image.height
      );
      c.ctx.restore();

      // ctx.save();
      // ctx.fillStyle = "#C0C0C0";
      // ctx.beginPath();
      // ctx.shadowBlur = 3;
      // ctx.shadowOffsetX = 0;
      // ctx.shadowOffsetY = 1;
      // ctx.shadowColor = "#615e5e";
      // ctx.arc(this.xVals[i], this.yVals[i], radius, 0, 2 * Math.PI);
      // ctx.fill();
      // ctx.closePath();
      // ctx.restore();
    }
  }
  draw(c: Canvas) {
    // console.log("draw", c.images, `img/balls/${this.image}.png`);

    const image = c.images.get(
      `img/balls/${this.image}.png`
    ) as HTMLImageElement;
    // console.log("draw", c.images, `img/balls/${this.image}.png`);
    c.ctx.save();
    c.ctx.translate(this.x, this.y);
    c.ctx.drawImage(
      image,
      -image.width / 2,
      -image.height / 2,
      image.width,
      image.height
    );
    c.ctx.restore();
    // ctx.save();
    // ctx.fillStyle = this.color;
    // ctx.beginPath();
    // ctx.shadowBlur = 5;
    // ctx.shadowOffsetX = 0;
    // ctx.shadowOffsetY = 1;
    // ctx.shadowColor = "black";
    // ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.closePath();
    // ctx.restore();
  }
  calculateWeightenedSum(coordinateName: "x" | "y", weights: number[]) {
    let sum = 0;
    for (let i = 0; i < this.cells.length; i++) {
      sum += this.cells[i][coordinateName] * weights[i];
    }
    return sum;
  }
  calculateRForma() {
    if (!this.xVals.length || !this.yVals.length) return 0;
    const maxX = Math.max(...this.xVals);
    const minX = Math.min(...this.xVals);

    const maxY = Math.max(...this.yVals);
    const minY = Math.min(...this.yVals);
    this.maxY = maxY;
    this.maxX = maxX;
    this.minY = minY;
    this.minX = minX;
    const deltaY = Math.abs(maxY - minY);
    const deltaX = Math.abs(maxX - minX);
    return deltaX / deltaY || 0;
  }
  calculateAMmq() {
    return this.weights.reduce((acc, val, i) => {
      if (i === 0) return 0;
      else {
        return (
          acc +
          Math.abs(
            (this.xVals[i] - this.xVals[i - 1]) *
              (this.yVals[i] - this.yVals[i - 1])
          )
        );
      }
    }, 0);
  }
  //VarV. General:  24582.94

  calculateVelocity(fn: Function) {
    const count = this.weights.length || 1;

    return this.weights.reduce((acc, val, i) => {
      if (i === 0) return 0;
      else {
        const ySquare = Math.pow(this.yVals[i] - this.yVals[i - 1], 2);
        const xSquare = Math.pow(this.xVals[i] - this.xVals[i - 1], 2);
        const V = Math.sqrt(ySquare + xSquare) * Hz;
        return acc + fn(V) / count;
      }
    }, 0);
  }
  calculateVelocityVariation() {
    const V1 = this.calculateVelocity((V: number) => V);
    return this.calculateVelocity((V: number) => Math.pow(V - V1, 2));
  }
  calculateBx() {
    this.Bx = this.weights.length
      ? this.xVals.reduce((acc, val) => acc + val) / this.weights.length
      : 0;
    return this.Bx;
  }
  calculateBy() {
    this.By = this.weights.length
      ? this.yVals.reduce((acc, val) => acc + val) / this.weights.length
      : 0;
    return this.By;
  }
  reset() {
    this.x = 0;
    this.y = 0;
    this.xVals = [];
    this.yVals = [];
    this.weights = [];
  }
  getHistory() {
    // console.log(this.xVals);
    return this.xVals.map((x, i) => ({ x, y: this.yVals[i] }));
  }
}
