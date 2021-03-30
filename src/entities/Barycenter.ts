const radius = 10;
const Hz = 10;
import { Point } from "@/entities/Point";
export default class Barycenter {
  x: number;
  y: number;
  color: string;
  cells: Point[];
  //TODO::add type
  // history: Array<Record<string, any>>;
  xVals: Array<number>;
  yVals: Array<number>;
  weights: Array<Array<number>>;
  constructor(cells: Point[], color: string) {
    this.x = 0;
    this.y = 0;
    this.color = color;
    this.cells = cells;
    // this.history = [];
    this.xVals = [];
    this.yVals = [];
    this.weights = [];
  }
  move(weights: number[]) {
    const totalWeight = weights.reduce((total: number, val) => total + val, 0);
    if (totalWeight > 0) {
      const sumX = this.calculateWeightenedSum("x", weights);
      this.x = Math.round((sumX / totalWeight + Number.EPSILON) * 100) / 100;

      const sumY = this.calculateWeightenedSum("y", weights);
      this.y = Math.round((sumY / totalWeight + Number.EPSILON) * 100) / 100;
      //this.history.push({ x: this.x, y: this.y, weights });
      this.xVals.push(this.x);
      this.yVals.push(this.y);
      this.weights.push(weights);
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = "black";
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  calculateWeightenedSum(coordinateName: "x" | "y", weights: number[]) {
    let sum = 0;
    for (let i = 0; i < this.cells.length; i++) {
      sum += this.cells[i][coordinateName] * weights[i];
    }
    return sum;
  }
  calculateRForma() {
    const maxX = Math.max(...this.xVals);
    const minX = Math.min(...this.xVals);

    const maxY = Math.max(...this.yVals);
    const minY = Math.min(...this.yVals);

    const deltaY = Math.abs(maxY - minY);
    const deltaX = Math.abs(maxX - minX);

    return deltaY === 0 ? 0 : deltaX / deltaY;
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
  calculateVelocityVariation() {
    const count = this.weights.length || 1;
    const V1 = this.weights.reduce((acc, val, i) => {
      if (i === 0) return 0;
      else {
        const ySquare = Math.pow(this.yVals[i] - this.yVals[i - 1], 2);
        const xSquare = Math.pow(this.xVals[i] - this.xVals[i - 1], 2);
        return acc + (Math.sqrt(ySquare + xSquare) * Hz) / count;
      }
    }, 0);

    const val = this.weights.reduce((acc, val, i) => {
      if (i === 0) return 0;
      else {
        const ySquare = Math.pow(this.yVals[i] - this.yVals[i - 1], 2);
        const xSquare = Math.pow(this.xVals[i] - this.xVals[i - 1], 2);
        const V2 = Math.sqrt(ySquare + xSquare) * Hz;
        return acc + Math.pow(V2 - V1, 2) / count;
      }
    }, 0);
    return val;
  }
  reset() {
    this.x = 0;
    this.y = 0;
    this.xVals = [];
    this.yVals = [];
    this.weights = [];
  }
}
