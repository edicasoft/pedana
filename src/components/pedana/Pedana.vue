<template>
  <v-container fluid>
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
        </v-sheet>

        <v-sheet v-if="readingData.length" class="mt-5">
          <v-btn icon @click="back" :disabled="readingsIdx <= 0"
            ><v-icon>mdi-step-backward</v-icon></v-btn
          >

          <v-btn @click="start" icon>
            <v-icon>{{
              isProcessing && readingsIdx > 0 ? "mdi-pause" : "mdi-play"
            }}</v-icon>
          </v-btn>

          <v-btn
            icon
            @click="next"
            :disabled="readingsIdx >= readingData.length - 1"
            ><v-icon>mdi-step-forward</v-icon></v-btn
          >
          {{ readingsIdx }}
        </v-sheet>
      </v-col>
      <v-col>
        <div class="d-flex mb-3">
          <v-btn
            @click="showTortionChart = true"
            small
            color="primary"
            class="mr-3"
            >Torsion</v-btn
          >
          <v-btn
            @click="showGeneralChart = true"
            small
            color="primary"
            class="mr-3"
            >General</v-btn
          >
          <v-btn @click="showLeftRightChart = true" small color="primary"
            >Right & Left</v-btn
          >
        </div>

        <MainChart />
      </v-col>
    </v-row>
    <TortionChart v-if="showTortionChart" :value.sync="showTortionChart" />
    <GeneralBarycenterChart
      v-if="showGeneralChart"
      :value.sync="showGeneralChart"
    />
    <LeftRightBarycenterChart
      v-if="showLeftRightChart"
      :value.sync="showLeftRightChart"
    />
  </v-container>
</template>

<script lang="ts">
//TODO::move player to separate component
//ts for store files
import { Cell } from "@/entities/Cell";
import Canvas from "@/entities/Canvas";

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
import {
  generalBarycenter,
  leftBarycenter,
  rightBarycenter
} from "@/common/barycenters.service.js";

import TortionChart from "@/components/charts/TortionChart.vue";
import GeneralBarycenterChart from "@/components/charts/GeneralBarycenterChart.vue";
import LeftRightBarycenterChart from "@/components/charts/LeftRightBarycenterChart.vue";

const cells = leftPlatformCells.concat(rightPlatformCells);
let c: Canvas;
let ctx: CanvasRenderingContext2D;

export default Vue.extend({
  name: "Pedana",
  components: {
    BackgroundLayer,
    MainChart,
    TortionChart,
    GeneralBarycenterChart,
    LeftRightBarycenterChart
  },
  data: () => ({
    showTortionChart: false,
    showGeneralChart: false,
    showLeftRightChart: false,
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

    readingData: data,
    isEndReading: false
  }),
  destroyed() {
    c.clear();
  },
  mounted() {
    c = new Canvas("barycenters-layer", 600, 600, images);
    ctx = c.ctx;
    c.preloadImages(this.play);
  },
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

  methods: {
    displayNumber,
    ...mapActions("pedana", [
      "getMeasurements",
      "addToHistory",
      "readFromData",
      "rewindData"
    ]),

    back() {
      if (this.readingsIdx <= 0) return;
      this.pause();
      this.readingsIdx--;
      this.getPrevReadings();
    },
    next() {
      if (this.readingsIdx >= this.readingData.length - 1) return;
      this.pause();
      this.readingsIdx++;
      this.getReadings();
    },
    pause() {
      this.isProcessing = false;
      this.play();
    },
    restart() {
      this.readingsIdx = 0;
      this.isEndReading = false;
      this.$store.commit("pedana/CLEAR_HISTORY");
      generalBarycenter.reset();
      leftBarycenter.reset();
      rightBarycenter.reset();
      c.clear();
    },
    start() {
      if (this.isEndReading) this.restart();
      this.isProcessing = !this.isProcessing;
      this.play();
    },
    async getPrevReadings() {
      const res = await this.rewindData(this.readingsIdx);

      if (res && res.length && !this.error) {
        requestAnimationFrame(() => {
          this.update();
        });
      }
    },
    async getReadings() {
      const res = await this.readFromData(this.readingData[this.readingsIdx]);

      if (res && res.length && !this.error) {
        requestAnimationFrame(() => {
          this.update();
        });
      }
      return res;
    },
    async play() {
      try {
        if (!this.isProcessing) return;
        if (this.readingsIdx < this.readingData.length) {
          const res = await this.readFromData(
            this.readingData[this.readingsIdx]
          );

          if (res && res.length && !this.error) {
            requestAnimationFrame(() => {
              this.update();
              this.readingsIdx++;
              this.play();
            });
          }
        } else {
          this.isProcessing = false;
          this.isEndReading = true;
        }
      } catch (e) {
        console.error(e);
      }
    },
    connectBarycenters() {
      c.drawLine(leftBarycenter, rightBarycenter, "red");
    },
    displayWeights() {
      if (this.weights.length === 0) return;
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.save();
      for (let i = 0; i < cells.length; i++) {
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
          x -= 30;
          if (cells[i].y < 0) x -= 20;
        }
        ctx.fillText(this.displayNumber(this.weights[i]).toString(), x, y);
      }
      ctx.restore();
    },
    update(): void {
      try {
        //        console.log("update");
        c.clear();
        this.displayWeights();

        c.transdormCoordinates();

        generalBarycenter.move(this.weights);
        leftBarycenter.move(this.leftWeights);
        rightBarycenter.move(this.rightWeights);

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
        this.addToHistory({ general, left, right });

        this.connectBarycenters();
        leftBarycenter.draw(ctx);
        generalBarycenter.draw(ctx);
        rightBarycenter.draw(ctx);
      } catch (e) {
        this.error = true;
        console.error(e);
      }
    }
  }
});
</script>
