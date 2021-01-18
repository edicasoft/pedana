<template>
  <v-container>
    <canvas id="myCanvas" :width="width" :height="height"> </canvas>
  </v-container>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from "vue";
import { cells } from "@/common/constants";

export default Vue.extend({
  name: "Pedana",
  //float XShift = 1.2f
  data: () => ({
    canvas: null,
    width: 600,
    height: 600,
    zoom: 1,
    //weights: [0, 0, 0, 0, 0, 0],
    weights: [11.6, 12.1, 7.9, 13.2, 14.1, 7.7],
  }),
  computed: {
    totalWeight() {
      return this.weights.reduce((total, weight) => total + weight, 0);
    },
  },
  mounted() {
    const c = document.getElementById("myCanvas");
    this.canvas = c.getContext("2d");
    this.draw();
  },
  methods: {
    drawXAxis() {
      this.canvas.strokeStyle = "#000000";
      this.canvas.moveTo(0, this.height / 2 + 0.5);
      this.canvas.lineTo(this.width, this.height / 2 + 0.5);
      this.canvas.stroke();
    },
    drawYAxis() {
      this.canvas.strokeStyle = "#000000";
      this.canvas.moveTo(this.width / 2 + 0.5, 0);
      this.canvas.lineTo(this.width / 2 + 0.5, this.height);
      this.canvas.stroke();
    },
    drawLeftPlatform() {
      this.canvas.beginPath();
      this.canvas.moveTo(cells[0].x, cells[0].y);
      this.canvas.lineTo(cells[1].x, cells[1].y);
      this.canvas.lineTo(cells[2].x, cells[2].y);
      this.canvas.closePath();
      this.canvas.fillStyle = "blue";
      this.canvas.fill();
    },
    drawRightPlatform() {
      this.canvas.beginPath();
      this.canvas.moveTo(cells[3].x * this.zoom, cells[3].y * this.zoom);
      this.canvas.lineTo(cells[4].x * this.zoom, cells[4].y * this.zoom);
      this.canvas.lineTo(cells[5].x * this.zoom, cells[5].y * this.zoom);
      this.canvas.closePath();
      this.canvas.fillStyle = "blue";
      this.canvas.fill();
    },
    //TODO::move to separate file, weights to the store
    getGeneralBarycenterCoordinates() {
      let sumX = 0;
      let x = 0;
      let y = 0;

      if (this.totalWeight > 0) {
        for (let i = 0; i < cells.length; i++) {
          sumX += cells[i].x * this.weights[i];
        }
        x = sumX / this.totalWeight;
        let sumY = 0;
        for (let i = 0; i < cells.length; i++) {
          sumY += cells[i].y * this.weights[i];
        }
        y = sumY / this.totalWeight;
      }

      return { x, y };
    },
    getLeftBarycenterCoordinates() {
      const { x, y } = this.getGeneralBarycenterCoordinates();
      this.canvas.beginPath();
      this.canvas.arc(x, y, 15);
      this.canvas.stroke();
    },
    getRightBarycenterCoordinates() {
      const { x, y } = this.getGeneralBarycenterCoordinates();
      this.canvas.beginPath();
      this.canvas.arc(x, y, 15);
      this.canvas.stroke();
    },
    drawGeneralBaricanter() {
      const { x, y } = this.getGeneralBarycenterCoordinates();
      this.canvas.fillStyle = "red";
      this.canvas.beginPath();
      this.canvas.arc(x, y, 15, 0, 2 * Math.PI);
      this.canvas.fill();
    },
    displayWeights() {
      this.canvas.fillStyle = "black";
      this.canvas.font = "18px Arial";
      //      this.canvas.setTransform(1, 0, 0, 1, -1, -1);
      // this.canvas.rotate((-180 * Math.PI) / 180);
      // this.canvas.scale(1, 1);
      for (let i = 0; i < cells.length; i++) {
        this.canvas.save();
        let x = this.width / 2 + cells[i].x;
        let y = this.height / 2 - cells[i].y;
        console.log(cells[i].x, cells[i].y);
        // if (cells[i].x < 0 && cells[i].y > 0) {
        //   y -= padding;
        // } else if (cells[i].x < 0 && cells[i].y < 0) {
        //   y += padding;
        // }
        if (cells[i].y < 0) {
          y += 15;
          if (cells[i].x > 0) x += 20;
        } else {
          y -= 15;
        }
        if (cells[i].x < 0) {
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

      this.drawGeneralBaricanter();
    },
  },
});
</script>
