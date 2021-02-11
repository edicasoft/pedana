<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet class="viewport" :width="width" :height="height">
          <canvas id="barycenters-layer"> </canvas>
          <BackgroundLayer :width="width" :height="height" />
        </v-sheet>

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
                Total: <b>{{ displayNumber(totalWeight) }}</b>
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
        </v-sheet>

        <v-sheet>
          <v-btn @click="start" color="primary" small class="mt-5">{{
            isProcessing || readingsIdx > 0 ? "Stop" : "Start"
          }}</v-btn>
        </v-sheet>
      </v-col>
      <v-col>
        <main-chart></main-chart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Cell } from "@/entities/Cell";
import Canvas from "@/entities/Canvas";
import Barycenter from "@/entities/Barycenter";

import { total, displayNumber } from "@/common/helpers";
import Vue from "vue";
import {
  leftPlatformCells,
  rightPlatformCells,
  images,
  data
} from "@/common/constants.js";
import { mapState, mapGetters, mapActions } from "vuex";
import BackgroundLayer from "@/components/pedana/BackgroundLayer.vue";
import MainChart from "@/components/charts/MainChart.vue";

const cells = leftPlatformCells.concat(rightPlatformCells);
let c: Canvas;
let ctx: CanvasRenderingContext2D;

export default Vue.extend({
  name: "Pedana",
  components: {
    BackgroundLayer,
    MainChart
  },
  data: () => ({
    width: 600,
    height: 600,
    zoom: 1,
    error: false,
    isProcessing: false,
    readingsIdx: 0,
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
    rightBarycenter: new Barycenter(rightPlatformCells, "gold")
  }),
  computed: {
    ...mapGetters("pedana", ["leftWeights", "rightWeights"]),
    ...mapState("pedana", ["weights"]),

    totalWeight(): number {
      return total(this.weights);
    },
    leftPlatformTotalWeight(): number {
      return total(this.leftWeights);
    },
    rightPlatformTotalWeight(): number {
      return total(this.rightWeights);
    }
  },
  // watch: {
  //   weights(val) {
  //     if (val && val.length && !this.error) {
  //       requestAnimationFrame(() => {
  //         this.update();
  //       });
  //     }
  //   }
  // },
  destroyed() {
    c.clear();
  },
  mounted() {
    c = new Canvas("barycenters-layer", 600, 600, images);
    ctx = c.ctx;
    c.preloadImages(this.onReady);
  },
  methods: {
    pause() {
      this.isProcessing = false;
    },
    start() {
      this.isProcessing = !this.isProcessing;
      this.onReady();
    },
    async onReady() {
      try {
        if (!this.isProcessing) return;

        const res = await this.readFromData(data[this.readingsIdx]);

        if (res && res.length && !this.error) {
          requestAnimationFrame(() => {
            this.update();
          });
        }
        console.log(this.readingsIdx);
        if (this.readingsIdx < data.length - 1) {
          this.readingsIdx++;
          this.onReady();
        } else {
          this.isProcessing = false;
          this.readingsIdx = 0;
        }
      } catch (e) {
        console.error(e);
      }
    },
    displayNumber,
    ...mapActions("pedana", [
      "getMeasurements",
      "addToHistory",
      "readFromData"
    ]),

    connectBarycenters() {
      c.drawLine(this.leftBarycenter, this.rightBarycenter, "red");
    },
    displayWeights() {
      if (this.weights.length === 0) return;
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.save();
      for (let i = 0; i < cells.length; i++) {
        //TODO::check values
        this.$nextTick(() => {
          const cell = new Cell(cells[i], this.weights[i]);
          cell.draw(c, this.totalWeight);
        });

        let x = this.width / 2 + cells[i].x;
        let y = this.height / 2 - cells[i].y;

        if (cells[i].y < 0) {
          y += 20;
          if (cells[i].x > 0) x += 20;
        } else {
          y -= 20;
        }
        if (cells[i].x < 0) {
          x -= 40;
          if (cells[i].y < 0) x -= 20;
        }
        ctx.fillText(this.displayNumber(this.weights[i]).toString(), x, y);
      }
      ctx.restore();
    },
    update(): void {
      try {
        console.log("update");
        c.clear();
        this.displayWeights();

        c.transdormCoordinates();

        this.generalBarycenter.move(this.weights);
        this.leftBarycenter.move(this.leftWeights);
        this.rightBarycenter.move(this.rightWeights);

        const general = {
          x: this.generalBarycenter.x,
          y: this.generalBarycenter.y
        };
        const left = {
          x: this.leftBarycenter.x,
          y: this.leftBarycenter.y
        };
        const right = {
          x: this.rightBarycenter.x,
          y: this.rightBarycenter.y
        };
        this.addToHistory({ general, left, right });

        this.connectBarycenters();
        this.leftBarycenter.draw(ctx);
        this.generalBarycenter.draw(ctx);
        this.rightBarycenter.draw(ctx);
      } catch (e) {
        this.error = true;
        console.error(e);
      }
    }
  }
});
</script>
