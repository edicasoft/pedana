<template>
  <div>
    <!--- CANVAS --->
    <v-sheet :width="width" :height="height">
      <canvas :id="`barycenters-layer${idx}`"> </canvas>
      <BackgroundLayer :width="width" :height="height" />
    </v-sheet>
    <!--- END CANVAS --->

    <!--- WEIGHTS --->
    <v-sheet :width="width">
      <div class="d-flex justify-space-around align-center">
        <div class="text-left w-100">
          Left: <b>{{ displayNumber(leftPlatformTotalWeight) }}</b>
        </div>
        <div class="d-flex align-items-center align-center">
          <v-icon
            color="red"
            v-if="leftPlatformTotalWeight > rightPlatformTotalWeight"
          >
            mdi-menu-left
          </v-icon>

          <div class="text-center w-100">
            Diff:
            <b>{{
              displayNumber(
                Math.abs(rightPlatformTotalWeight - leftPlatformTotalWeight)
              )
            }}</b>
          </div>
          <v-icon
            large
            color="red"
            v-if="rightPlatformTotalWeight > leftPlatformTotalWeight"
          >
            mdi-menu-right</v-icon
          >
        </div>

        <div class="text-right w-100">
          Right: <b>{{ displayNumber(rightPlatformTotalWeight) }}</b>
        </div>
      </div>
      <div>
        <span class="mt-5"
          >Total:
          {{
            (leftPlatformTotalWeight + rightPlatformTotalWeight).toFixed(2)
          }}</span
        >
      </div>
    </v-sheet>
  </div>
</template>
<script>
import { Cell } from "@/entities/Cell";
import Canvas from "@/entities/Canvas";
import {
  leftPlatformCells,
  rightPlatformCells,
  images
} from "@/common/constants.js";
import BackgroundLayer from "@/components/pedana/BackgroundLayer.vue";
import Barycenter from "@/entities/Barycenter";
export const generalBarycenter = new Barycenter(
  leftPlatformCells.concat(rightPlatformCells),
  "red"
);
export const leftBarycenter = new Barycenter(leftPlatformCells, "gold");
export const rightBarycenter = new Barycenter(rightPlatformCells, "gold");
import { displayNumber } from "@/common/helpers";

import PedanaMixin from "@/mixins/PedanaCanvasMixin.vue";
let c;
export default {
  mixins: [PedanaMixin],
  components: {
    BackgroundLayer
  },
  props: ["readingsData", "idx"],
  data: () => ({
    width: 600,
    height: 600,
    zoom: 1,
    readingsIdx: 0,
    weights: [],
    ctx: null
  }),
  destroyed() {
    c.clear();
  },
  mounted() {
    c = new Canvas(`barycenters-layer${this.idx}`, 600, 600, images);
    this.ctx = c.ctx;
    c.preloadImages(this.start);
  },
  methods: {
    displayNumber,
    drawConnectBarycenters() {
      c.drawLine(leftBarycenter, rightBarycenter, "red");
    },
    drawHistory() {
      c.drawLine(leftBarycenter, rightBarycenter, "grey");
    },
    moveBarycenters() {
      console.log("moveBarycenters");
      generalBarycenter.move(this.weights);
      leftBarycenter.move(this.leftWeights);
      rightBarycenter.move(this.rightWeights);
      console.log("move", this.weights);

      const general = {
        x: generalBarycenter.x,
        y: generalBarycenter.y
      };
      const left = {
        x: leftBarycenter.x,
        y: leftBarycenter.y
      };
      const right = {
        x: rightBarycenter.x,
        y: rightBarycenter.y
      };
    },
    start() {
      while (this.readingsIdx < this.readingsData.length) {
        console.log(this.readingsIdx);

        this.weights = this.readingsData[this.readingsIdx];
        this.draw();
        this.readingsIdx++;
      }
    },
    draw() {
      try {
        c.clear();
        this.displayWeights();

        c.transdormCoordinates();

        this.moveBarycenters();

        leftBarycenter.drawOld(this.ctx);
        generalBarycenter.drawOld(this.ctx);
        rightBarycenter.drawOld(this.ctx);

        this.drawConnectBarycenters();
        leftBarycenter.draw(this.ctx);
        generalBarycenter.draw(this.ctx);
        rightBarycenter.draw(this.ctx);
      } catch (e) {
        this.error = true;
        console.error(e);
      }
    }
  }
};
</script>
