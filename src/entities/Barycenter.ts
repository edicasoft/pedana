const radius = 10;
import { Point } from "@/entities/Point";
export default class Barycenter {
  x: number;
  y: number;
  color: string;
  cells: Point[];
  constructor(cells: Point[], color: string) {
    this.x = 0;
    this.y = 0;
    this.color = color;
    this.cells = cells;
  }
  move(weights: number[]) {
    const totalWeight = weights.reduce((total: number, val) => total + val, 0);
    if (totalWeight > 0) {
      const sumX = this.calculateWeightenedSum("x", weights);
      this.x = sumX / totalWeight;

      const sumY = this.calculateWeightenedSum("y", weights);
      this.y = sumY / totalWeight;
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
}
