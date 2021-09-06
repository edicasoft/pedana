<template>
  <v-container fluid>
    <!-- <ComparePedanasDialog :data="readingsData" v-if="readingsData.length" /> -->
    <error-dialog
      v-if="!isConnected && !isReady"
      message="Pedana is not connected."
    />
    <connecting-dialog v-else-if="isConnected && !isReady" />

    <error-dialog v-if="pedanaError" :message="pedanaError" />

    <v-row>
      <v-col>
        <v-sheet>
          <!--- Streaming from Pedana Play Control --->
          <template v-if="isReady">
            <v-btn @click="toggleStreaming" class="mx-2" small>
              <v-icon left>
                {{ isEndStreaming ? "mdi-play" : "mdi-pause" }}
              </v-icon>
              {{ isEndStreaming ? "New Session" : "STOP" }}
            </v-btn>
          </template>
          <!-- Reset ---->
          <v-btn
            v-if="readingsData.length > 0"
            @click="reset"
            color="red"
            small
            rounded
            dark
          >
            <v-icon dark left>mdi-autorenew</v-icon>
            Reset
          </v-btn>
          <span class="ml-auto">
            <ImportFileBtn
              v-if="isEndStreaming"
              @importData="onImport"
              @onLoading="onLoading"
              class="ml-2"
            />
            <ExportToFileBtn
              v-if="readingsData.length && isEndStreaming"
              :data="readingsData"
              class="ml-2"
            />
          </span>
        </v-sheet>
        <v-divider class="mt-3"></v-divider>

        <!-- CONTROLS -->
        <v-sheet class="pa-3 d-flex align-center">
          <template v-if="readingsData.length">
            <!-- Back -->
            <v-btn icon @click="back" :disabled="readingsIdx <= 0"
              ><v-icon>mdi-step-backward</v-icon></v-btn
            >
            <!-- Read from File Play Control -->
            <v-btn @click="start" icon>
              <v-icon>{{
                isPlaying && readingsIdx > 0 ? "mdi-pause" : "mdi-play"
              }}</v-icon>
            </v-btn>
            <!-- Forward -->
            <v-btn
              icon
              @click="next"
              :disabled="readingsIdx >= readingsData.length - 1"
              ><v-icon>mdi-step-forward</v-icon></v-btn
            >
          </template>

          <!--- Timer --->
          <template v-if="readingsIdx > 0">
            <v-icon color="green" dark>mdi-timer-outline</v-icon>
            {{ readingsIdx > 0 ? (readingsIdx / Hz).toFixed(2) : 0 }}
          </template>
        </v-sheet>
        <!--- END CONTROLS --->

        <!--- CANVAS --->
        <v-sheet class="viewport" :width="width" :height="height">
          <canvas id="barycenters-layer"> </canvas>
          <BackgroundLayer
            :width="width"
            :height="height"
            @canvasCreated="onBgCanvasCreated"
            :id="backgroundCanvasId"
          />
        </v-sheet>
        <!--- END CANVAS --->

        <!--- WEIGHTS --->
        <v-sheet :width="width">
          <v-btn icon @click="print">
            <v-icon>mdi-printer</v-icon>
          </v-btn>
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
          <!-- <div>
            <span class="mt-5"
              >Total:
              {{
                (leftPlatformTotalWeight + rightPlatformTotalWeight).toFixed(2)
              }}</span
            >
          </div> -->
        </v-sheet>
      </v-col>
      <!--- END WEIGHTS --->

      <!-- CHARTS  -->
      <v-col v-if="weights.length > 0">
        <!-- Buttons -->
        <div class="d-flex mb-3">
          <v-btn
            @click="showTortionChart = true"
            small
            rounded
            color="blue-grey"
            dark
            class="mr-3"
          >
            <v-icon left>mdi-chart-line</v-icon> Torsion
          </v-btn>
          <v-btn
            @click="showGeneralChart = true"
            small
            dark
            rounded
            color="blue-grey"
            class="mr-3"
            ><v-icon left>mdi-chart-line</v-icon> General</v-btn
          >
          <v-btn
            @click="showLeftRightChart = true"
            small
            dark
            rounded
            color="blue-grey"
            ><v-icon left>mdi-chart-line</v-icon> Right & Left</v-btn
          >
        </div>
        <v-divider class="mt-3"></v-divider>

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
    <!-- END CHARTS  -->
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <canvas id="print" :style="{ display: 'none' }"> </canvas>
  </v-container>
</template>

<script>
//TODO::move player to separate component
import Canvas from "@/entities/Canvas";

import { displayNumber } from "@/common/helpers";
import {
  leftPlatformCells,
  rightPlatformCells,
  images,
  Hz
} from "@/common/constants.js";
import { mapState, mapActions } from "vuex";
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

import ErrorDialog from "@/components/dialogs/ErrorDialog.vue";
import ConnectingDialog from "@/components/dialogs/ConnectingDialog.vue";
// import ComparePedanasDialog from "@/components/dialogs/ComparePedanasDialog.vue";
import ImportFileBtn from "@/components/file/ImportFileBtn.vue";
import ExportToFileBtn from "@/components/file/ExportToFileBtn.vue";
import _ from "lodash";
import pedanaCanvasMixin from "@/mixins/PedanaCanvasMixin.vue";
import Vue from "vue";

/* eslint-disable */
const electron = window.require("electron"),
  ipc = electron.ipcRenderer;

const cells = leftPlatformCells.concat(rightPlatformCells);
// let c: Canvas;
// let ctx: CanvasRenderingContext2D;

export default Vue.extend({
  mixins: [pedanaCanvasMixin],
  name: "Pedana",
  components: {
    BackgroundLayer,
    MainChart,
    TortionChart,
    GeneralBarycenterChart,
    LeftRightBarycenterChart,
    ImportFileBtn,
    ExportToFileBtn,
    // Dialogs
    ErrorDialog,
    ConnectingDialog
    // ComparePedanasDialog
  },
  data: () => ({
    showTortionChart: false,
    showGeneralChart: false,
    showLeftRightChart: false,
    width: 600,
    height: 600,
    zoom: 1,
    error: false,
    isPlaying: false,
    readingsIdx: -1,
    readingsData: [],
    isEndReading: false,
    isConnected: false,
    isEndStreaming: true,
    isReady: false,
    pedanaError: "",
    Hz: Hz,
    isLoading: false,
    ctx: null,
    c: null,
    backgroundCanvasId: "background-layer"
  }),
  destroyed() {
    this.c.clear();
  },
  mounted() {
    this.c = new Canvas("barycenters-layer", 600, 600, images);
    this.ctx = this.c.ctx;
    this.c.preloadImages(this.play);
    ipc.on("is-connected", (event, args) => {
      this.pedanaError = "";
      this.isConnected = args;
      if (!args) {
        this.isReady = false;
      }
      console.log("is-connected", args);
    });
    ipc.on("data", (event, args) => {
      this.isReady = true;
      const total = args.reduce(
        (accumulator, current) => accumulator + current,
        0
      );
      if (total >= 1 && !this.isEndStreaming) this.startReadingPedana(args);
      // console.log("data", args, total);
    });
    ipc.on("is-error", (event, args) => {
      if (args && args.code) {
        switch (args.code) {
          case "INIT_ERROR":
            this.pedanaError = "Please, reconnect your Pedana.";
        }
      }
      //console.log("is-error", args);
    });
  },
  computed: {
    ...mapState("pedana", ["weights", "weightsHistory"])
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
    onLoading(e) {
      this.isLoading = e;
    },
    onImport(data) {
      this.readingsData = data;
      this.restart();
      console.log(data);
      while (this.readingsIdx < this.readingsData.length) {
        console.log(this.readingsIdx);

        const res = this.setWeights(this.readingsData[this.readingsIdx]);
        this.update();
        this.readingsIdx++;
      }
      this.isPlaying = false;
      this.isEndReading = true;
    },
    displayNumber,
    ...mapActions("pedana", [
      "getMeasurements",
      "addBarycentersToHistory",
      "setWeights",
      "simulateReadFromPedana",
      "rewindData",
      "setMeasurements"
    ]),

    back() {
      if (this.readingsIdx <= 0) return;
      this.pause();
      this.readingsIdx--;
      console.log("readingsIdx", this.readingsIdx);
      this.isEndReading = false;
      this.rewind();
    },
    next() {
      if (this.readingsIdx >= this.readingsData.length - 1) return;
      this.pause();
      this.readingsIdx++;
      console.log("readingsIdx", this.readingsIdx);
      this.getWeights();
    },
    pause() {
      this.isPlaying = false;
      // this.play();
    },
    reset() {
      this.readingsData = [];
      this.restart();
    },
    restart() {
      this.readingsIdx = 0;
      this.isEndReading = false;
      this.$store.commit("pedana/CLEAR_HISTORY");
      generalBarycenter.reset();
      leftBarycenter.reset();
      rightBarycenter.reset();
      this.c.clear();
    },
    toggleStreaming() {
      this.isEndStreaming = !this.isEndStreaming;
      if (this.isEndStreaming) {
        this.readingsData = _.cloneDeep(this.weightsHistory);
        this.isEndReading = true;
      } else {
        console.log("start streaming");
        this.reset();
      }
    },
    startReadingPedana(data) {
      this.isEndStreaming = false;

      this.setMeasurements(data);
      requestAnimationFrame(() => {
        this.update();
        this.readingsIdx++;
      });
    },
    start() {
      if (this.isEndReading) this.restart();
      this.isPlaying = !this.isPlaying;
      this.play();
    },
    async rewind() {
      const res = await this.rewindData(this.readingsIdx);

      generalBarycenter.resetDataToIndex(this.readingsIdx);
      leftBarycenter.resetDataToIndex(this.readingsIdx);
      rightBarycenter.resetDataToIndex(this.readingsIdx);
      if (!this.error) {
        requestAnimationFrame(() => {
          this.update();
        });
      }
    },
    async getWeights() {
      const res = await this.simulateReadFromPedana(
        this.readingsData[this.readingsIdx]
      );

      if (res && res.length && !this.error) {
        requestAnimationFrame(() => {
          this.update();
        });
      }
      return res;
    },
    async play() {
      try {
        if (!this.isPlaying) return;
        if (this.readingsIdx < 0) this.readingsIdx = 0;
        if (this.readingsIdx < this.readingsData.length) {
          const res = await this.simulateReadFromPedana(
            this.readingsData[this.readingsIdx]
          );

          if (res && res.length && !this.error) {
            requestAnimationFrame(() => {
              this.update();
              this.readingsIdx++;
              this.play();
            });
          }
        } else {
          this.isPlaying = false;
          this.isEndReading = true;
        }
      } catch (e) {
        console.error(e);
      }
    },
    drawConnectBarycenters() {
      this.c.drawLine(leftBarycenter, rightBarycenter, "red");
    },
    //TODO::make it common along with the PedanaCanvasMixin method
    drawConnectBarycentersHistory() {
      for (let i = 0; i < this.readingsData.length; i++) {
        this.c.drawLine(
          { x: leftBarycenter.xVals[i], y: leftBarycenter.yVals[i] },
          { x: rightBarycenter.xVals[i], y: rightBarycenter.yVals[i] },
          "green"
        );
      }
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
      this.addBarycentersToHistory({ general, left, right });
    },
    update() {
      try {
        this.c.clear();
        this.displayWeights();

        this.c.transdormCoordinates();

        this.moveBarycenters();

        this.drawConnectBarycentersHistory();
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
});
</script>
