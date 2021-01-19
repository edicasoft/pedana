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
import Vue from "vue";
import {
  leftPlatformCells,
  rightPlatformCells,
  canvasSmoothCoef,
} from "@/common/constants";
const arrowLength = 5;

export default Vue.extend({
  name: "Pedana",
  data: () => ({
    canvas: null,
    width: 600,
    height: 600,
    zoom: 1,
    //weights: [0, 0, 0, 0, 0, 0],
    leftWeights: [11.6, 12.1, 7.9],
    rightWeights: [13.2, 14.1, 7.7],
  }),
  computed: {
    cells() {
      return leftPlatformCells.concat(rightPlatformCells);
    },
    weights() {
      return this.leftWeights.concat(this.rightWeights);
    },
    totalWeight() {
      return this.total(this.weights);
    },
    leftPlatformTotalWeight() {
      return this.total(this.leftWeights);
    },
    rightPlatformTotalWeight() {
      return this.total(this.rightWeights);
    },
    leftBarycenterCoordinates() {
      return this.calculateBarycenterCoordinates(
        this.leftPlatformTotalWeight,
        leftPlatformCells,
        this.leftWeights
      );
    },
    rightBarycenterCoordinates() {
      console.log(
        "getRightBarycenterCoordinates",
        this.rightPlatformTotalWeight,
        rightPlatformCells,
        this.rightWeights
      );
      return this.calculateBarycenterCoordinates(
        this.rightPlatformTotalWeight,
        rightPlatformCells,
        this.rightWeights
      );
    },
    generalBarycenterCoordinates() {
      return this.calculateBarycenterCoordinates(
        this.totalWeight,
        this.cells,
        this.weights
      );
    },
  },
  mounted() {
    const c = document.getElementById("myCanvas");
    this.canvas = c.getContext("2d");
    this.draw();
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
    //TODO::helper
    total(arr) {
      return arr.reduce((total, val) => total + val, 0);
    },
    drawXAxis() {
      this.canvas.strokeStyle = "#000000";
      const y = this.height / 2 + canvasSmoothCoef;
      const from = { x: 0, y };
      const to = { x: this.width - arrowLength, y };
      this.canvas.moveTo(from.x, from.y);
      this.canvas.lineTo(to.x, to.y);
      this.canvas.stroke();

      this.drawArrowhead(from, to, arrowLength);

      this.canvas.fillStyle = "black";
      this.canvas.font = "12px Arial";
      this.canvas.fillText("X", to.x - 3, to.y - 8);
    },
    drawYAxis() {
      this.canvas.strokeStyle = "#000000";
      const x = this.width / 2 + canvasSmoothCoef;
      const from = { x, y: 0 + arrowLength };
      const to = { x, y: this.height };
      this.canvas.moveTo(from.x, from.y);
      this.canvas.lineTo(to.x, to.y);
      this.canvas.stroke();

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
    calculateBarycenterCoordinates(totalWeight, cells, weights) {
      let x = 0;
      let y = 0;

      if (totalWeight > 0) {
        const sumX = this.calculateSum("x", cells, weights);
        x = sumX / totalWeight;

        const sumY = this.calculateSum("y", cells, weights);
        y = sumY / totalWeight;
      }
      console.log("calculateBarycenterCoordinates", x, y);
      return { x, y };
    },
    //TODO::helper
    calculateSum(coordinateName, cells, weights) {
      console.log("calculateSum", coordinateName);
      let sum = 0;
      for (let i = 0; i < cells.length; i++) {
        console.log(cells[i], weights[i]);
        sum += cells[i][coordinateName] * weights[i];
      }
      console.log("sum", sum);
      return sum;
    },
    drawGeneralBarycenter() {
      const { x, y } = this.generalBarycenterCoordinates;
      this.drawBarycenter(x, y, "red");
    },
    drawLeftBarycenter() {
      const { x, y } = this.leftBarycenterCoordinates;
      this.drawBarycenter(x, y, "yellow");
    },
    drawRightBarycenter() {
      const { x, y } = this.rightBarycenterCoordinates;
      this.drawBarycenter(x, y, "yellow");
    },
    drawBarycentersLine() {
      this.canvas.beginPath();
      this.canvas.strokeStyle = "red";
      this.canvas.moveTo(
        this.leftBarycenterCoordinates.x,
        this.leftBarycenterCoordinates.y
      );
      this.canvas.lineTo(
        this.rightBarycenterCoordinates.x,
        this.rightBarycenterCoordinates.y
      );
      this.canvas.stroke();
      this.canvas.closePath();
    },
    //TODO::helper
    drawBarycenter(x, y, color) {
      this.canvas.fillStyle = color;
      this.canvas.beginPath();
      this.canvas.shadowBlur = 5;
      this.canvas.shadowOffsetX = 0;
      this.canvas.shadowOffsetY = 1;
      this.canvas.shadowColor = "black";
      this.canvas.arc(x, y, 15, 0, 2 * Math.PI);
      this.canvas.fill();
      this.canvas.closePath();
    },
    displayWeights() {
      this.canvas.fillStyle = "black";
      this.canvas.font = "18px Arial";

      for (let i = 0; i < this.cells.length; i++) {
        this.canvas.save();
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
    draw() {
      this.displayWeights();

      this.drawXAxis();
      this.drawYAxis();
      // this.canvas.rotate((-6 * Math.PI) / 180);

      this.canvas.translate(this.width / 2, this.height / 2);
      this.canvas.scale(1, -1);

      this.drawLeftPlatform();
      this.drawRightPlatform();
      this.drawBarycentersLine();

      this.drawGeneralBarycenter();
      this.drawLeftBarycenter();
      this.drawRightBarycenter();
    },
  },
});
</script>
