import { Point } from "@/entities/Point";
const size = 30;
export class Cell {
  x: number;
  y: number;
  weight: number;
  constructor(center: Point, weight: number) {
    this.x = center.x;
    this.y = center.y;
    this.weight = weight;
  }

  draw(ctx: CanvasRenderingContext2D, totalWeight: number) {
    const image = new Image();
    const deviation = this.getDeviation(totalWeight);
    image.src = `img/triangle-${deviation.color}.png`;
    const angle = deviation.direction === "up" ? 180 : 0;
    image.onload = () => {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((angle * Math.PI) / 180);

      ctx.drawImage(image, -size / 2, -size / 2, size, size);
      ctx.restore();
    };
  }
  getDeviation(
    totalWeight: number
  ): { color: string; direction: "up" | "down" } {
    const percentage =
      totalWeight === 0 ? 0 : (this.weight * 100) / totalWeight;
    if (percentage >= 14.667 && percentage < 18.667)
      return percentage >= 16.667
        ? { color: "green", direction: "up" }
        : { color: "green", direction: "down" };
    if (percentage >= 12.667 && percentage < 14.667)
      return { color: "yellow", direction: "down" };
    if (percentage >= 18.667 && percentage < 20.667)
      return { color: "yellow", direction: "up" };
    return percentage >= 20.666 || percentage >= 12.667
      ? { color: "red", direction: "up" }
      : { color: "red", direction: "down" };
  }
}
