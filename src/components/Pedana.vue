<template>
  <v-container>
    <canvas id="myCanvas" :width="width" :height="height"> </canvas>
    <v-row>
      <v-col>{{ leftPlatformTotalWeight }}</v-col>
      <v-col>{{ rightPlatformTotalWeight }}</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
// @ts-nocheck
import { Barycenter } from "@/entities/Barycenter";
import { total } from "@/common/helpers";
import Vue from "vue";
import {
  leftPlatformCells,
  rightPlatformCells,
  canvasSmoothCoef,
  idealBarycenterLeftX,
  idealBarycenterRightX,
} from "@/common/constants";
const arrowLength = 5;

export default Vue.extend({
  name: "Pedana",
  data: () => ({
    canvas: null,
    width: 600,
    height: 600,
    zoom: 1,
    //****IDEAL WEIGHTS****
    //  leftWeights: [11.1, 11.1, 11.1],
    //rightWeights: [11.1, 11.1, 11.1],

    leftWeights: [11.6, 12.1, 7.9],
    rightWeights: [13.2, 14.1, 7.7],

    generalBarycenter: null,
    leftBarycenter: null,
    rightBarycenter: null,
  }),
  computed: {
    cells() {
      return leftPlatformCells.concat(rightPlatformCells);
    },
    weights() {
      return this.leftWeights.concat(this.rightWeights);
    },
    totalWeight() {
      return total(this.weights);
    },
    leftPlatformTotalWeight() {
      return total(this.leftWeights);
    },
    rightPlatformTotalWeight() {
      return total(this.rightWeights);
    },
  },
  mounted() {
    const c = document.getElementById("myCanvas");
    this.canvas = c.getContext("2d");
    this.generalBarycenter = new Barycenter(this.cells, "red");
    this.leftBarycenter = new Barycenter(leftPlatformCells, "gold");
    this.rightBarycenter = new Barycenter(rightPlatformCells, "gold");
    this.update();
  },
  methods: {
    drawArrowhead(from, to, radius) {
      const xCenter = to.x;
      const yCenter = to.y;

      let angle;
      let x;
      let y;

      this.canvas.beginPath();

      angle = Math.atan2(to.y - from.y, to.x - from.x);
      x = radius * Math.cos(angle) + xCenter;
      y = radius * Math.sin(angle) + yCenter;

      this.canvas.moveTo(x, y);

      angle += (1.0 / 3.0) * (2 * Math.PI);
      x = radius * Math.cos(angle) + xCenter;
      y = radius * Math.sin(angle) + yCenter;

      this.canvas.lineTo(x, y);

      angle += (1.0 / 3.0) * (2 * Math.PI);
      x = radius * Math.cos(angle) + xCenter;
      y = radius * Math.sin(angle) + yCenter;

      this.canvas.lineTo(x, y);

      this.canvas.closePath();

      this.canvas.fill();
    },
    drawXAxis() {
      const y = this.height / 2 + canvasSmoothCoef;
      const from = { x: 0, y };
      const to = { x: this.width - arrowLength, y };
      this.drawLine(from, to, "black");

      this.drawArrowhead(from, to, arrowLength);

      this.canvas.fillStyle = "black";
      this.canvas.font = "12px Arial";
      this.canvas.fillText("X", to.x - 3, to.y - 8);
    },
    drawYAxis() {
      const x = this.width / 2 + canvasSmoothCoef;
      const from = { x, y: 0 + arrowLength };
      const to = { x, y: this.height };
      this.drawLine(from, to, "black");

      this.drawArrowhead(to, from, arrowLength);

      this.canvas.fillStyle = "black";
      this.canvas.font = "12px Arial";
      this.canvas.fillText("Y", from.x + 7, from.y + 5);
    },
    drawLeftPlatform() {
      this.canvas.beginPath();
      this.canvas.moveTo(this.cells[0].x, this.cells[0].y);
      this.canvas.lineTo(this.cells[1].x, this.cells[1].y);
      this.canvas.lineTo(this.cells[2].x, this.cells[2].y);
      this.canvas.closePath();
      this.canvas.strokeStyle = "blue";
      this.canvas.stroke();
    },
    drawRightPlatform() {
      this.canvas.beginPath();
      this.canvas.moveTo(
        this.cells[3].x * this.zoom,
        this.cells[3].y * this.zoom
      );
      this.canvas.lineTo(
        this.cells[4].x * this.zoom,
        this.cells[4].y * this.zoom
      );
      this.canvas.lineTo(
        this.cells[5].x * this.zoom,
        this.cells[5].y * this.zoom
      );
      this.canvas.closePath();
      this.canvas.strokeStyle = "blue";
      this.canvas.stroke();
    },
    connectBarycenters() {
      this.drawLine(this.leftBarycenter, this.rightBarycenter, "red");
    },
    drawLine(point1, point2, color) {
      this.canvas.beginPath();
      this.canvas.strokeStyle = color;
      this.canvas.moveTo(point1.x, point1.y);
      this.canvas.lineTo(point2.x, point2.y);
      this.canvas.stroke();
      this.canvas.closePath();
    },
    markIdealBarycenters() {
      const lineLength = 250;
      let x = idealBarycenterLeftX;
      this.drawLine({ x, y: -lineLength }, { x, y: lineLength }, "gold");

      x = idealBarycenterRightX;
      this.drawLine({ x, y: -lineLength }, { x, y: lineLength }, "gold");
    },
    displayWeights() {
      this.canvas.fillStyle = "black";
      this.canvas.font = "18px Arial";
      this.canvas.save();

      for (let i = 0; i < this.cells.length; i++) {
        let x = this.width / 2 + this.cells[i].x;
        let y = this.height / 2 - this.cells[i].y;

        if (this.cells[i].y < 0) {
          y += 15;
          if (this.cells[i].x > 0) x += 20;
        } else {
          y -= 15;
        }
        if (this.cells[i].x < 0) {
          x -= 40;
        }
        this.canvas.fillText(this.weights[i], x, y);
      }
      this.canvas.restore();
    },
    update() {
      this.displayWeights();

      this.drawXAxis();
      this.drawYAxis();

      this.canvas.translate(this.width / 2, this.height / 2);
      this.canvas.scale(1, -1);

      this.drawLeftPlatform();
      this.drawRightPlatform();

      this.generalBarycenter.move(this.weights);
      this.leftBarycenter.move(this.leftWeights);
      this.rightBarycenter.move(this.rightWeights);
      this.connectBarycenters();

      this.leftBarycenter.draw(this.canvas);
      this.generalBarycenter.draw(this.canvas);
      this.rightBarycenter.draw(this.canvas);

      this.markIdealBarycenters();
    },
  },
});
</script>
