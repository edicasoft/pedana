<template>
  <canvas :id="id"> </canvas>
</template>
<script lang="ts">
import Canvas from "@/entities/Canvas";
import Vue from "vue";
import {
  leftPlatformCells,
  rightPlatformCells,
  canvasSmoothCoef,
  idealBarycenterLeftX,
  idealBarycenterRightX,
  pedanaWidth,
  pedanaHeight
} from "@/common/constants.js";
const arrowLength = 5;
const cells = leftPlatformCells.concat(rightPlatformCells);
let c: Canvas;
let ctx: CanvasRenderingContext2D;

export default Vue.extend({
  name: "BackgrounfLayer",
  props: ["width", "height", "id"],
  mounted() {
    c = new Canvas(this.id, pedanaWidth, pedanaHeight);
    //this.$emit("canvasCreated", c);
    ctx = c.ctx;
    this.drawBg();
  },
  methods: {
    drawBg() {
      const background = new Image();
      background.src = "img/pedana-bg.png";

      // Make sure the image is loaded first otherwise nothing will draw.
      background.onload = () => {
        ctx.drawImage(
          background,
          0,
          0,
          background.width,
          background.height,
          0,
          0,
          pedanaWidth,
          pedanaHeight
        );
        this.draw();
      };
    },

    drawXAxis(): void {
      const y = this.height / 2 + canvasSmoothCoef;
      const from = { x: 0, y };
      const to = { x: this.width - arrowLength, y };
      c.drawLine(from, to, "rgb(0, 82, 100)", 2);

      // c.drawArrowhead(from, to, arrowLength);

      // c.drawText("X", {
      //   x: to.x - 3,
      //   y: to.y - 8
      // });
    },
    drawYAxis(): void {
      const x = this.width / 2 + canvasSmoothCoef;
      const from = { x, y: 0 + arrowLength };
      const to = { x, y: this.height };
      c.drawLine(from, to, "rgb(0, 82, 100)", 2);

      // c.drawArrowhead(to, from, arrowLength);
      // c.drawText("Y", {
      //   x: from.x + 7,
      //   y: from.y + 5
      // });
    },
    // drawLeftPlatform() {
    //   ctx.beginPath();
    //   ctx.moveTo(cells[0].x, cells[0].y);
    //   ctx.lineTo(cells[1].x, cells[1].y);
    //   ctx.lineTo(cells[2].x, cells[2].y);
    //   ctx.closePath();
    //   ctx.strokeStyle = "blue";
    //   ctx.stroke();
    // },
    // drawRightPlatform() {
    //   ctx.beginPath();
    //   ctx.moveTo(cells[3].x, cells[3].y);
    //   ctx.lineTo(cells[4].x, cells[4].y);
    //   ctx.lineTo(cells[5].x, cells[5].y);
    //   ctx.closePath();
    //   ctx.strokeStyle = "blue";
    //   ctx.stroke();
    // },

    markIdealBarycenters() {
      const lineLength = 250;
      let x = idealBarycenterLeftX;
      c.drawLine(
        { x, y: -lineLength },
        { x, y: lineLength },
        "rgb(167, 169, 172)",
        2
      );

      x = idealBarycenterRightX;
      c.drawLine(
        { x, y: -lineLength },
        { x, y: lineLength },
        "rgb(167, 169, 172)",
        2
      );
    },
    draw(): void {
      ctx.save();
      c.transdormCoordinates();
      //this.drawLeftPlatform();
      //this.drawRightPlatform();
      this.markIdealBarycenters();
      ctx.restore();
      this.drawXAxis();
      this.drawYAxis();
    }
  }
});
</script>
