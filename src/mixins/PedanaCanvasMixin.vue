<template>
  <canvas id="print"> </canvas>
</template>
<script>
import { total } from "@/common/helpers";
import {
  leftPlatformCells,
  rightPlatformCells,
  pedanaWidth,
  pedanaHeight
} from "@/common/constants.js";
import { Cell } from "@/entities/Cell";
import Canvas from "@/entities/Canvas";
const cells = leftPlatformCells.concat(rightPlatformCells);
import Vue from "vue";
import { ipcRenderer } from "electron";

export default Vue.extend({
  computed: {
    leftWeights() {
      return this.weights.slice(0, 3);
    },
    rightWeights() {
      return this.weights.slice(3, 6);
    },
    totalWeight() {
      return total(this.weights);
    },
    leftPlatformTotalWeight() {
      return total(this.leftWeights);
    },
    rightPlatformTotalWeight() {
      return total(this.rightWeights);
    }
  },
  methods: {
    combineCanvasesToImage(k = 1) {
      //TODO::destroy canvas
      const width = k * pedanaWidth;
      const height = k * pedanaHeight;
      const printC = new Canvas("print", width, height);
      printC.clear();
      const bg = document.getElementById(this.backgroundCanvasId);
      printC.ctx.drawImage(bg, 0, 0, width, height);
      printC.ctx.drawImage(this.c.canvas, 0, 0, width, height);
      return printC.canvas.toDataURL();
    },
    saveAsPdf() {
      console.log("save");
      ipcRenderer.send("canvas:pdf", [
        { image: this.combineCanvasesToImage() }
      ]);
      console.log("saveAsPdf");
    },
    print() {
      ipcRenderer.send("canvas:print", [
        { image: this.combineCanvasesToImage() }
      ]);
      console.log("print");
    },
    drawConnectBarycentersHistory() {
      for (let i = 0; i < this.readingsData.length; i++) {
        this.c.drawLine(
          { x: this.leftBarycenter.xVals[i], y: this.leftBarycenter.yVals[i] },
          {
            x: this.rightBarycenter.xVals[i],
            y: this.rightBarycenter.yVals[i]
          },
          "green"
        );
      }
    },
    drawConnectBarycenters() {
      this.c.drawLine(this.leftBarycenter, this.rightBarycenter, "red");
    },
    moveBarycenters() {
      //console.log("moveBarycenters");
      this.generalBarycenter.move(this.weights);
      this.leftBarycenter.move(this.leftWeights);
      this.rightBarycenter.move(this.rightWeights);
      //console.log("move", this.weights);
    },
    displayWeights() {
      if (this.weights.length === 0) return;
      this.ctx.fillStyle = "black";
      this.ctx.font = "16px Arial";
      this.ctx.save();
      for (let i = 0; i < cells.length; i++) {
        this.$nextTick(() => {
          const cell = new Cell(cells[i], this.weights[i]);
          cell.draw(this.c, this.totalWeight);
        });

        let x = this.width / 2 + cells[i].x;
        let y = this.height / 2 - cells[i].y;

        if (cells[i].y < 0) {
          y += 20;
          if (cells[i].x > 0) x += 20;
        } else {
          y -= 20;
          if (cells[i].x > 0) x -= 5;
        }
        if (cells[i].x < 0) {
          x -= 30;
          if (cells[i].y < 0) x -= 20;
        }
        this.ctx.fillText(this.displayNumber(this.weights[i]).toString(), x, y);
      }
      this.ctx.restore();
    }
  }
});
</script>
