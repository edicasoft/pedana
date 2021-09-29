<template>
  <v-main>
    <v-app-bar dark>
      <!--- Streaming from Pedana Play Control --->
      <template v-if="isReady">
        <v-btn @click="toggleStreaming" class="mx-2" small>
          <v-icon left>
            {{ isEndStreaming ? "mdi-play" : "mdi-pause" }}
          </v-icon>
          {{ isEndStreaming ? "New Exam" : "STOP" }}
        </v-btn>
      </template>

      <!-- EXAM DIALOG-->
      <ExamDialog
        v-if="showExamDialog"
        :value.sync="showExamDialog"
        @close="setExamDuration"
      />

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
      <v-btn @click="showExamDialog = true">New Exam</v-btn>

      <v-btn @click="showCompareDlg = true">Compare</v-btn>
      <v-spacer></v-spacer>

      <v-toolbar-title>
        <v-icon>mdi-account</v-icon> Solange Di Rocca</v-toolbar-title
      >

      <v-spacer></v-spacer>
      <v-btn class="ml-2"
        ><v-icon left>mdi-account-group</v-icon>Patients</v-btn
      >
      <!-- Charts Buttons -->
    </v-app-bar>
    <ComparePedanasDialog
      v-if="showCompareDlg"
      :data="readingsData"
      :value.sync="showCompareDlg"
    />
    <error-dialog
      v-if="!isConnected && !isReady"
      message="Pedana is not connected."
    />
    <connecting-dialog v-else-if="isConnected && !isReady" />

    <error-dialog v-if="pedanaError" :message="pedanaError" />
    <v-container fluid>
      <v-row>
        <v-col>
          <!-- Reset ---->
          <!-- <v-btn
            v-if="readingsData.length > 0"
            @click="reset"
            color="red"
            small
            rounded
            dark
          >
            <v-icon dark left>mdi-autorenew</v-icon>
            Reset
          </v-btn> -->
          <!-- CONTROLS -->
          <v-toolbar flat>
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
              {{ currentTiming }}
            </template>
          </v-toolbar>
          <!--- END CONTROLS --->

          <!--- CANVAS --->
          <v-sheet class="viewport" :width="width" :height="height">
            <BackgroundLayer
              :width="width"
              :height="height"
              :id="backgroundCanvasId"
            />
            <canvas id="pedana-main"> </canvas>
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
                      Math.abs(
                        rightPlatformTotalWeight - leftPlatformTotalWeight
                      )
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
            <v-toolbar dense flat>
              <v-btn icon @click="print">
                <v-icon>mdi-printer</v-icon>
              </v-btn>
              <v-btn icon @click="saveAsPdf">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-toolbar>
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
        <v-col>
          <v-toolbar v-if="readingsData.length" flat>
            <v-btn @click="showMainChart = true" class="mr-3" small>
              Main
            </v-btn>
            <v-btn @click="showTortionChart = true" class="mr-3" small>
              Torsion
            </v-btn>
            <v-btn @click="showGeneralChart = true" class="mr-3" small
              >General</v-btn
            >
            <v-btn @click="showLeftRightChart = true" small>Right & Left</v-btn>
          </v-toolbar>
        </v-col>
      </v-row>
    </v-container>
    <TortionChart v-if="showTortionChart" :value.sync="showTortionChart" />
    <MainChart v-if="showMainChart" :value.sync="showMainChart" />
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
  </v-main>
</template>

<script>
//TODO::move player to separate component
import Canvas from "@/entities/Canvas";

import { displayNumber } from "@/common/helpers";
import {
  leftPlatformCells,
  rightPlatformCells,
  images,
  Hz,
  pedanaHeight,
  pedanaWidth
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
import ComparePedanasDialog from "@/components/dialogs/ComparePedanasDialog.vue";
import ExamDialog from "@/components/exams/ExamDialog.vue";

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
    ConnectingDialog,
    ComparePedanasDialog,
    ExamDialog
  },
  data: () => ({
    showExamDialog: false,
    showMainChart: false,
    showTortionChart: false,
    showGeneralChart: false,
    showLeftRightChart: false,
    width: pedanaWidth,
    height: pedanaHeight,
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
    backgroundCanvasId: "background-layer",
    generalBarycenter,
    leftBarycenter,
    rightBarycenter,
    showCompareDlg: false,
    examDuration: 15
  }),
  destroyed() {
    this.c.clear();
  },
  mounted() {
    this.c = new Canvas("pedana-main", pedanaWidth, pedanaHeight, images);
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
    ...mapState("pedana", ["weights", "weightsHistory"]),
    currentTiming() {
      return this.readingsIdx > 0 ? (this.readingsIdx / Hz).toFixed(2) : 0;
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
  watch: {
    currentTiming(val) {
      if (val >= parseFloat(this.examDuration)) this.toggleStreaming();
    }
  },
  methods: {
    setExamDuration(val) {
      if (val && val > 0) this.examDuration = parseFloat(val);
    },
    onLoading(e) {
      this.isLoading = e;
    },
    onImport(data) {
      this.readingsData = data;
      this.restart();
      while (this.readingsIdx < this.readingsData.length) {
        console.log(this.readingsIdx);

        const res = this.setWeights(this.readingsData[this.readingsIdx]);
        if (this.readingsIdx !== this.readingsData.length - 1) {
          this.moveBarycenters();
          this.saveBarycentersHistory();
        }
        this.readingsIdx++;
      }
      this.update();
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
      this.leftBarycenter.reset();
      this.rightBarycenter.reset();
      this.c.clear();
    },
    toggleStreaming() {
      this.isEndStreaming = !this.isEndStreaming;
      if (this.isEndStreaming) {
        this.readingsData = _.cloneDeep(this.weightsHistory);
        this.isEndReading = true;
        //TODO::save to db
      } else {
        console.log("start streaming");
        this.reset();
        this.showExamDialog = true;
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

      this.generalBarycenter.resetDataToIndex(this.readingsIdx);
      this.leftBarycenter.resetDataToIndex(this.readingsIdx);
      this.rightBarycenter.resetDataToIndex(this.readingsIdx);
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
    saveBarycentersHistory() {
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
      this.addBarycentersToHistory({ general, left, right });
    },
    update() {
      try {
        this.c.clear();
        this.displayWeights();

        this.c.transdormCoordinates();

        this.moveBarycenters();
        this.saveBarycentersHistory();

        this.drawConnectBarycentersHistory();
        this.leftBarycenter.drawOld(this.ctx);
        this.generalBarycenter.drawOld(this.ctx);
        this.rightBarycenter.drawOld(this.ctx);

        this.drawConnectBarycenters();
        this.leftBarycenter.draw(this.ctx);
        this.generalBarycenter.draw(this.ctx);
        this.rightBarycenter.draw(this.ctx);
      } catch (e) {
        this.error = true;
        console.error(e);
      }
    }
  }
});
</script>
