import { Point } from "@/entities/Point";
import Canvas from "@/entities/Canvas";

// const width = 55;
// const height = 47;
export class Cell {
  x: number;
  y: number;
  displayX: number;
  displayY: number;

  weight: number;
  constructor(center: Point, weight: number, display: Point) {
    this.x = center.x;
    this.y = center.y;
    this.displayX = display.x;
    this.displayY = display.y;
    this.weight = weight;
  }

  draw(c: Canvas, totalWeight: number) {
    const deviation = this.getDeviation(totalWeight);

    const image = c.images.get(
      `img/triangle-${deviation.color}.png`
    ) as HTMLImageElement;

    const angle = deviation.direction === "up" ? 180 : 0;
    c.ctx.save();
    c.ctx.translate(this.displayX, this.displayY);
    c.ctx.rotate((angle * Math.PI) / 180);

    c.ctx.drawImage(
      image,
      -image.width / 2,
      -image.height / 2,
      image.width,
      image.height
    );
    c.ctx.restore();
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
