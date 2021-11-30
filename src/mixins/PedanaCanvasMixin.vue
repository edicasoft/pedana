<template>
  <canvas id="print"> </canvas>
</template>
<script>
import { total } from "@/common/helpers";
import {
  leftPlatformCells,
  rightPlatformCells,
  leftDisplayCells,
  rightDisplayCells,
  pedanaWidth,
  pedanaHeight
} from "@/common/constants.js";
import { Cell } from "@/entities/Cell";
import Canvas from "@/entities/Canvas";
const cells = leftPlatformCells.concat(rightPlatformCells);
const cellsDisplay = leftDisplayCells.concat(rightDisplayCells);
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
    combineCanvasesToImage() {
      //TODO::destroy canvas
      const width = pedanaWidth;
      const height = pedanaHeight;
      const printC = new Canvas("print", width, height + 40 + 30);
      printC.clear();
      const bg = document.getElementById(this.backgroundCanvasId);
      const diff = document.getElementById(this.diffCanvasId);
      console.log("combineCanvasesToImage");
      printC.ctx.drawImage(bg, 0, 0, width, height);
      printC.ctx.drawImage(this.c.canvas, 0, 0, width, height);
      printC.ctx.drawImage(diff, 0, height + 30, width, 40);

      return printC.canvas.toDataURL();
    },
    saveAsPdf() {
      // console.log(
      //   "saveAsPdf",
      //   [
      //     {
      //       ...this.exam,
      //       image: this.combineCanvasesToImage()
      //     }
      //   ],
      //   this.patient.fullname
      // );
      ipcRenderer.send(
        "canvas:pdf",
        [
          {
            ...this.exam,
            image: this.combineCanvasesToImage()
          }
        ],
        this.patient ? this.patient.fullname : ""
      );
    },
    print() {
      ipcRenderer.send(
        "canvas:print",
        [
          {
            ...this.exam,
            image: this.combineCanvasesToImage()
          }
        ],
        this.patient ? this.patient.fullname : ""
      );
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
          "rgb(167, 169, 172)"
        );
      }
    },
    drawConnectBarycenters() {
      this.c.drawLine(
        this.leftBarycenter,
        this.rightBarycenter,
        "rgb(245, 130, 65)",
        4
      );
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
      this.ctx.fillStyle = "#005264";
      this.ctx.font = "bold 16px Arial";
      this.ctx.save();
      for (let i = 0; i < cells.length; i++) {
        this.$nextTick(() => {
          const cell = new Cell(cells[i], this.weights[i], cellsDisplay[i]);
          cell.draw(this.c, this.totalWeight);
        });

        const x = this.width / 2 + cells[i].x;
        const y = this.height / 2 - cells[i].y;

        if (i === 0 || i === 3) {
          y -= 35;
          x -= 18;
        }
        if (i === 1) {
          y -= 33;
          x += 10;
        }
        if (i === 4) {
          y -= 34;
          x -= 48;
        }
        if (i === 2 || i === 5) {
          y -= 10;
        }
        if (i === 2) x -= 40;
        if (i === 5) x += 5;
        this.ctx.fillText(this.displayNumber(this.weights[i]).toString(), x, y);
      }
      this.ctx.restore();
    }
  }
});
</script>
