<template>
  <div>
    <!-- <img v-if="resize" :src="result" /> -->
    <!--- CANVAS --->
    <v-sheet class="viewport" :width="width" :height="height">
      <BackgroundLayer
        :width="width"
        :height="height"
        :id="backgroundCanvasId"
      />
      <canvas :id="`pedana-${idx}`"> </canvas>
    </v-sheet>
    <v-sheet class="mx-auto mt-5" :width="width">
      <RightLeftDiff
        :left="displayNumber(leftPlatformTotalWeight)"
        :right="displayNumber(rightPlatformTotalWeight)"
        :id="diffCanvasId"
    /></v-sheet>
    <!--- END CANVAS --->
  </div>
</template>
<script>
import Canvas from "@/entities/Canvas";
import {
  leftPlatformCells,
  rightPlatformCells,
  images,
  pedanaHeight,
  pedanaWidth
} from "@/common/constants.js";
import BackgroundLayer from "@/components/pedana/BackgroundLayer.vue";
import RightLeftDiff from "@/components/pedana/RightLeftDiff.vue";
import Barycenter from "@/entities/Barycenter";
export const generalBarycenter = new Barycenter(
  leftPlatformCells.concat(rightPlatformCells),
  `general-barycenter`,
  50,
  48
);
export const leftBarycenter = new Barycenter(leftPlatformCells);
export const rightBarycenter = new Barycenter(rightPlatformCells);
import { displayNumber } from "@/common/helpers";

import pedanaCanvasMixin from "@/mixins/PedanaCanvasMixin.vue";
export default {
  mixins: [pedanaCanvasMixin],
  components: {
    BackgroundLayer,
    RightLeftDiff
  },
  props: ["exam", "idx", "patient"],
  data: () => ({
    width: pedanaWidth,
    height: pedanaHeight,
    zoom: 1,
    readingsIdx: 0,
    weights: [],
    ctx: null,
    c: null,
    generalBarycenter,
    leftBarycenter,
    rightBarycenter,
    result: null
  }),
  computed: {
    backgroundCanvasId() {
      return `pedana-bg-${this.idx}`;
    },
    diffCanvasId() {
      return `pedana-diff-${this.idx}`;
    },
    readingsData() {
      return this.exam.weights_data;
    }
  },
  destroyed() {
    this.c.clear();
  },
  mounted() {
    this.c = new Canvas(
      `pedana-${this.idx}`,
      pedanaWidth,
      pedanaHeight,
      images
    );
    this.ctx = this.c.ctx;
    this.c.preloadImages(this.start);
  },
  methods: {
    displayNumber,
    start() {
      while (this.readingsIdx < this.readingsData.length) {
        this.weights = this.readingsData[this.readingsIdx];
        this.moveBarycenters();
        this.readingsIdx++;
      }
      this.draw();
    },
    draw() {
      try {
        this.c.clear();
        this.displayWeights();

        this.c.transdormCoordinates();

        this.drawConnectBarycentersHistory();

        this.leftBarycenter.drawOld(this.c);
        this.generalBarycenter.drawOld(this.c);
        this.rightBarycenter.drawOld(this.c);

        this.drawConnectBarycenters();
        this.leftBarycenter.draw(this.c);
        this.generalBarycenter.draw(this.c);
        this.rightBarycenter.draw(this.c);
        // if (this.resize) {
        //   setTimeout(() => {
        //     this.result = this.combineCanvasesToImage(0.94);
        //     //console.log(this.result);
        //   }, 500);
        // }
      } catch (e) {
        this.error = true;
        console.error(e);
      }
    }
  }
};
</script>
