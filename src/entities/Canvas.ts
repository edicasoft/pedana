import { Point } from "@/entities/Point";
export default class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  center: Point;
  constructor(id: string, width: number, height: number) {
    this.center = { x: 0, y: 0 };
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.width = width;
    this.height = height;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setScale(x: number, y: number) {
    this.ctx.scale(x, y);
  }

  setCenter(center: Point) {
    this.center = center;
    this.ctx.translate(this.center.x, this.center.y);
  }

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  transdormCoordinates() {
    this.setCenter({ x: this.width / 2, y: this.height / 2 });
    this.setScale(1, -1);
  }

  drawLine(point1: Point, point2: Point, color: string): void {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(point1.x, point1.y);
    this.ctx.lineTo(point2.x, point2.y);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawText(text: string, point: Point, color?: string, font?: string) {
    this.ctx.fillStyle = color || "black";
    this.ctx.font = font || "12px Arial";
    this.ctx.fillText(text, point.x, point.y);
  }
  drawArrowhead(from: Point, to: Point, radius: number): void {
    const xCenter = to.x;
    const yCenter = to.y;

    let angle: number;
    let x: number;
    let y: number;

    this.ctx.beginPath();

    angle = Math.atan2(to.y - from.y, to.x - from.x);
    x = radius * Math.cos(angle) + xCenter;
    y = radius * Math.sin(angle) + yCenter;

    this.ctx.moveTo(x, y);

    angle += (1.0 / 3.0) * (2 * Math.PI);
    x = radius * Math.cos(angle) + xCenter;
    y = radius * Math.sin(angle) + yCenter;

    this.ctx.lineTo(x, y);

    angle += (1.0 / 3.0) * (2 * Math.PI);
    x = radius * Math.cos(angle) + xCenter;
    y = radius * Math.sin(angle) + yCenter;

    this.ctx.lineTo(x, y);

    this.ctx.closePath();

    this.ctx.fill();
  }
}
