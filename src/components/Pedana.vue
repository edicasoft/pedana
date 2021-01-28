<template>
  <v-container>
    <canvas id="myCanvas" :width="width" :height="height"> </canvas>
    <v-sheet :width="width">
      <div class="d-flex justify-space-around">
        <div class="text-left w-100">
          Left: <b>{{ leftPlatformTotalWeight }}</b>
        </div>
        <div class="text-center w-100">
          Total: <b>{{ totalWeight }}</b>
        </div>
        <div class="text-right w-100">
          Right: <b>{{ rightPlatformTotalWeight }}</b>
        </div>
      </div>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
import { Barycenter } from "@/entities/Barycenter";
import { Point } from "@/entities/Point";
import { Cell } from "@/entities/Cell";
import { total } from "@/common/helpers";
import Vue from "vue";
import {
  leftPlatformCells,
  rightPlatformCells,
  canvasSmoothCoef,
  idealBarycenterLeftX,
  idealBarycenterRightX,
} from "@/common/constants.js";
import { mapState, mapGetters } from "vuex";

const arrowLength = 5;
const cells = leftPlatformCells.concat(rightPlatformCells);
let c: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

export default Vue.extend({
  name: "Pedana",
  data: () => ({
    width: 600,
    height: 600,
    zoom: 1,
    //****IDEAL WEIGHTS****
    //  leftWeights: [11.1, 11.1, 11.1],
    //rightWeights: [11.1, 11.1, 11.1],

    // leftWeights: [11.6, 12.1, 7.9],
    // rightWeights: [13.2, 14.1, 7.7],

    generalBarycenter: new Barycenter(
      leftPlatformCells.concat(rightPlatformCells),
      "red"
    ),
    leftBarycenter: new Barycenter(leftPlatformCells, "gold"),
    rightBarycenter: new Barycenter(rightPlatformCells, "gold"),
  }),
  computed: {
    ...mapState("pedana", ["measurements", "currentMeasurement"]),
    ...mapGetters("pedana", ["leftWeights", "rightWeights"]),

    weights(): number[] {
      return this.leftWeights.concat(this.rightWeights);
    },
    totalWeight(): number {
      return total(this.weights);
    },
    leftPlatformTotalWeight(): number {
      return total(this.leftWeights);
    },
    rightPlatformTotalWeight(): number {
      return total(this.rightWeights);
    },
  },
  mounted() {
    c = document.getElementById("myCanvas") as HTMLCanvasElement;
    ctx = c.getContext("2d") as CanvasRenderingContext2D;
    this.renderPedana();
  },
  methods: {
    drawArrowhead(from: Point, to: Point, radius: number): void {
      const xCenter = to.x;
      const yCenter = to.y;

      let angle;
      let x;
      let y;

      ctx.beginPath();

      angle = Math.atan2(to.y - from.y, to.x - from.x);
      x = radius * Math.cos(angle) + xCenter;
      y = radius * Math.sin(angle) + yCenter;

      ctx.moveTo(x, y);

      angle += (1.0 / 3.0) * (2 * Math.PI);
      x = radius * Math.cos(angle) + xCenter;
      y = radius * Math.sin(angle) + yCenter;

      ctx.lineTo(x, y);

      angle += (1.0 / 3.0) * (2 * Math.PI);
      x = radius * Math.cos(angle) + xCenter;
      y = radius * Math.sin(angle) + yCenter;

      ctx.lineTo(x, y);

      ctx.closePath();

      ctx.fill();
    },
    drawXAxis(): void {
      const y = this.height / 2 + canvasSmoothCoef;
      const from = { x: 0, y };
      const to = { x: this.width - arrowLength, y };
      this.drawLine(from, to, "black");

      this.drawArrowhead(from, to, arrowLength);

      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText("X", to.x - 3, to.y - 8);
    },
    drawYAxis(): void {
      const x = this.width / 2 + canvasSmoothCoef;
      const from = { x, y: 0 + arrowLength };
      const to = { x, y: this.height };
      this.drawLine(from, to, "black");

      this.drawArrowhead(to, from, arrowLength);

      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText("Y", from.x + 7, from.y + 5);
    },
    drawLeftPlatform() {
      ctx.beginPath();
      ctx.moveTo(cells[0].x, cells[0].y);
      ctx.lineTo(cells[1].x, cells[1].y);
      ctx.lineTo(cells[2].x, cells[2].y);
      ctx.closePath();
      ctx.strokeStyle = "blue";
      ctx.stroke();
    },
    drawRightPlatform() {
      ctx.beginPath();
      ctx.moveTo(cells[3].x * this.zoom, cells[3].y * this.zoom);
      ctx.lineTo(cells[4].x * this.zoom, cells[4].y * this.zoom);
      ctx.lineTo(cells[5].x * this.zoom, cells[5].y * this.zoom);
      ctx.closePath();
      ctx.strokeStyle = "blue";
      ctx.stroke();
    },
    connectBarycenters() {
      this.drawLine(this.leftBarycenter, this.rightBarycenter, "red");
    },
    drawLine(point1: Point, point2: Point, color: string): void {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);
      ctx.stroke();
      ctx.closePath();
    },
    markIdealBarycenters() {
      const lineLength = 250;
      let x = idealBarycenterLeftX;
      this.drawLine({ x, y: -lineLength }, { x, y: lineLength }, "orange");

      x = idealBarycenterRightX;
      this.drawLine({ x, y: -lineLength }, { x, y: lineLength }, "gold");
    },
    displayWeights() {
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.save();

      for (let i = 0; i < cells.length; i++) {
        const cell = new Cell(cells[i], this.weights[i]);
        cell.draw(ctx, this.totalWeight);

        let x = this.width / 2 + cells[i].x;
        let y = this.height / 2 - cells[i].y;

        if (cells[i].y < 0) {
          y += 20;
          if (cells[i].x > 0) x += 20;
        } else {
          y -= 20;
        }
        if (cells[i].x < 0) {
          x -= 30;
          if (cells[i].y < 0) x -= 10;
        }
        ctx.fillText(this.weights[i].toString(), x, y);
      }
      ctx.restore();
    },
    renderPedana(): void {
      this.displayWeights();

      this.drawXAxis();
      this.drawYAxis();

      ctx.translate(this.width / 2, this.height / 2);
      ctx.scale(1, -1);

      this.drawLeftPlatform();
      this.drawRightPlatform();

      this.generalBarycenter.move(this.weights);
      this.leftBarycenter.move(this.leftWeights);
      this.rightBarycenter.move(this.rightWeights);
      this.connectBarycenters();

      this.leftBarycenter.draw(ctx);
      this.generalBarycenter.draw(ctx);
      this.rightBarycenter.draw(ctx);

      this.markIdealBarycenters();
    },
  },
});
</script>
