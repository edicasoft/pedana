<template>
  <v-main>
    <v-app-bar dark color="primary">
      <!--- Streaming from Pedana Play Control --->
      <template v-if="isReady">
        <v-btn
          v-if="isEndStreaming"
          @click="showNewExamDialog"
          class="mx-2"
          color="secondary darken-1"
        >
          <v-icon left>
            mdi-play
          </v-icon>
          New Exam
        </v-btn>
        <v-btn
          v-else
          @click="toggleStreaming"
          class="mx-2"
          color="primary darken-1"
        >
          <v-icon left>mdi-pause </v-icon>
          STOP
        </v-btn>
      </template>

      <!-- EXAM DIALOG-->
      <ExamDialog
        v-if="showExamDialog"
        :value.sync="showExamDialog"
        @create="startNewExam"
      />

      <ImportFileBtn
        v-if="isEndStreaming"
        @imported="onDataImported"
        class="ml-2"
      />
      <ExportToFileBtn v-if="isEndStreaming" class="ml-2" />
      <!-- <v-btn @click="showExamDialog = true">New Exam</v-btn> -->

      <v-spacer></v-spacer>

      <v-toolbar-title v-if="selectedPatient">
        <v-icon>mdi-account</v-icon>
        {{ selectedPatient.fullname }}</v-toolbar-title
      >

      <v-spacer></v-spacer>
      <v-btn
        class="ml-2"
        @click="showPatientsDialog = true"
        color="primary darken-1"
        ><v-icon left>mdi-account-group</v-icon>Patients</v-btn
      >
      <!-- Charts Buttons -->
    </v-app-bar>

    <error-dialog
      v-if="!isConnected && !isReady"
      message="Pedana is not connected."
    />
    <connecting-dialog v-else-if="isConnected && !isReady" />

    <error-dialog v-if="pedanaError" :message="pedanaError" />
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-list subheader two-line flat>
              <v-subheader
                >Current Exam
                <b v-if="exam" class="primary--text">
                  : {{ exam.exam_type }} - {{ exam.created_at }}</b
                ></v-subheader
              >
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
              <!-- CHARTS BUTTONS -->
              <v-toolbar v-if="readingsData.length" flat height="50">
                <v-btn
                  @click="showMainChart = true"
                  class="mr-3"
                  small
                  color="primary"
                >
                  Main
                </v-btn>
                <v-btn
                  @click="showTorsionChart = true"
                  class="mr-3"
                  small
                  color="primary"
                >
                  Torsion
                </v-btn>
                <v-btn
                  @click="showGeneralChart = true"
                  class="mr-3"
                  small
                  color="primary"
                  >General</v-btn
                >
                <v-btn @click="showLeftRightChart = true" small color="primary"
                  >Right & Left</v-btn
                >
              </v-toolbar>
              <!-- CONTROLS -->
              <v-sheet class="d-flex justify-space-between">
                <v-toolbar flat>
                  <template v-if="readingsData.length">
                    <!-- Back -->
                    <v-btn
                      icon
                      @click="back"
                      :disabled="readingsIdx <= 0"
                      color="secondary"
                      ><v-icon large>mdi-skip-previous-circle</v-icon></v-btn
                    >
                    <!-- Read from File Play Control -->
                    <v-btn @click="start" icon color="secondary">
                      <v-icon large>{{
                        isPlaying && readingsIdx > 0
                          ? "mdi-pause-circle"
                          : "mdi-play-circle"
                      }}</v-icon>
                    </v-btn>
                    <!-- Forward -->
                    <v-btn
                      color="secondary"
                      icon
                      @click="next"
                      :disabled="readingsIdx >= readingsData.length - 1"
                      ><v-icon large> mdi-skip-next-circle</v-icon></v-btn
                    >
                  </template>

                  <!--- Timer --->
                  <template v-if="readingsIdx > 0">
                    <v-icon color="success" dark class="ml-5"
                      >mdi-timer-outline</v-icon
                    >
                    <h3 class="primary--text">{{ currentTiming }}</h3>
                  </template>
                </v-toolbar>
                <v-toolbar
                  v-if="readingsData.length"
                  dense
                  flat
                  class="d-flex justify-end"
                >
                  <v-btn icon @click="print" large color="primary">
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                  <v-btn icon @click="saveAsPdf" large color="primary">
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </v-toolbar>
              </v-sheet>

              <!--- END CONTROLS --->

              <!--- PEDANA CANVAS --->
              <v-sheet class="viewport mx-auto" :width="width" :height="height">
                <BackgroundLayer
                  :width="width"
                  :height="height"
                  :id="backgroundCanvasId"
                />
                <canvas id="pedana-main"> </canvas>
              </v-sheet>
              <v-sheet class="mx-auto mt-5" :width="width">
                <RightLeftDiff
                  :left="displayNumber(leftPlatformTotalWeight)"
                  :right="displayNumber(rightPlatformTotalWeight)"
                  :id="diffCanvasId"
              /></v-sheet>
              <!--- END CANVAS --->
            </v-list>
          </v-card>
        </v-col>

        <v-col>
          <ExamsList
            v-if="selectedPatient && exams.length"
            @play="onPlayExam"
            @select="onSelectExam"
          />
        </v-col>
      </v-row>
    </v-container>
    <TorsionChart v-if="showTorsionChart" :value.sync="showTorsionChart" />
    <MainChart v-if="showMainChart" :value.sync="showMainChart" :exam="exam" />
    <GeneralBarycenterChart
      v-if="showGeneralChart"
      :value.sync="showGeneralChart"
    />
    <LeftRightBarycenterChart
      v-if="showLeftRightChart"
      :value.sync="showLeftRightChart"
    />
    <!-- END CHARTS  -->
    <!-- TODO::move  isReady, isEndStreaming etc. states of pedana to vuex store -->
    <Patients
      v-if="showPatientsDialog"
      :value.sync="showPatientsDialog"
      @newExam="showNewExamDialog"
      @imported="onDataImported"
      :isReady="isReady"
      :isEndStreaming="isEndStreaming"
    />

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
import { images, Hz, pedanaHeight, pedanaWidth } from "@/common/constants.js";
import { mapState, mapActions } from "vuex";
import BackgroundLayer from "@/components/pedana/BackgroundLayer.vue";
import {
  generalBarycenter,
  leftBarycenter,
  rightBarycenter
} from "@/common/barycenters.service.js";

import MainChart from "@/components/exams/current/MainChart.vue";
import TorsionChart from "@/components/exams/current/TorsionChart.vue";
import GeneralBarycenterChart from "@/components/exams/current/GeneralBarycenterChart.vue";
import LeftRightBarycenterChart from "@/components/exams/current/LeftRightBarycenterChart.vue";

import ErrorDialog from "@/components/dialogs/ErrorDialog.vue";
import ConnectingDialog from "@/components/dialogs/ConnectingDialog.vue";
import ExamDialog from "@/components/exams/ExamDialog.vue";
import ExamsList from "@/components/exams/ExamsList.vue";
import Patients from "@/components/patients/Patients.vue";

import ImportFileBtn from "@/components/file/ImportFileBtn.vue";
import ExportToFileBtn from "@/components/file/ExportToFileBtn.vue";
import _ from "lodash";
import pedanaCanvasMixin from "@/mixins/PedanaCanvasMixin.vue";
import Vue from "vue";
import RightLeftDiff from "./RightLeftDiff.vue";
/* eslint-disable */
const electron = window.require("electron"),
  ipc = electron.ipcRenderer;

// let c: Canvas;
// let ctx: CanvasRenderingContext2D;

export default Vue.extend({
  mixins: [pedanaCanvasMixin],
  name: "Pedana",
  components: {
    BackgroundLayer,
    MainChart,
    TorsionChart,
    GeneralBarycenterChart,
    LeftRightBarycenterChart,
    ImportFileBtn,
    ExportToFileBtn,
    // Dialogs
    ErrorDialog,
    ConnectingDialog,
    ExamDialog,
    ExamsList,
    Patients,
    RightLeftDiff
  },
  data: () => ({
    showExamDialog: false,
    showPatientsDialog: false,
    showMainChart: false,
    showTorsionChart: false,
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
    ctx: null,
    c: null,
    backgroundCanvasId: "background-layer",
    diffCanvasId: "diff",
    generalBarycenter,
    leftBarycenter,
    rightBarycenter,
    maxExamDuration: null,
    exam: null,
    newExamData: null
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
    ...mapState("pedana", ["weights", "weightsHistory", "isLoading"]),
    ...mapState("patients", ["selectedPatient"]),
    ...mapState("exams", ["exams", "selectedExams"]),
    patient() {
      console.log("patient", this.selectedPatient);
      return this.selectedPatient;
    },
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
    selectedExams: {
      handler(val) {
        console.log("watch selectedExams from pedana cmp", val);
        if (val.length > 0) {
          this.onLoadExam(val[0]);
        } else {
          this.reset();
        }
      }
    },
    currentTiming(val) {
      if (
        this.maxExamDuration !== null &&
        parseFloat(val) >= parseFloat(this.maxExamDuration)
      )
        this.stopStreaming();
    },
    exam(val) {
      console.log("exam", val);
      // if (val) this.setSelectedExams([val]);
      // else this.setSelectedExams([]);
    }
  },
  methods: {
    ...mapActions("exams", ["addExam", "setSelectedExams"]),
    ...mapActions("patients", ["selectPatient"]),
    displayNumber,
    ...mapActions("pedana", [
      "getMeasurements",
      "addBarycentersToHistory",
      "setWeights",
      "simulateReadFromPedana",
      "rewindData",
      "setMeasurements"
    ]),
    onPlayExam(exam) {
      this.onImportExam(exam, this.start);
    },
    onSelectExam(exam) {
      console.log("onSelectExam", exam);
      if (!exam) {
        this.reset();
      }
    },
    startNewExam(exam) {
      this.showPatientsDialog = false;
      if (exam.duration && parseFloat(exam.duration) > 0) {
        this.maxExamDuration = parseFloat(exam.duration);
        this.newExamData = _.cloneDeep(exam);
        this.startStreaming();
      }
    },
    loadExam(exam, callback) {
      this.exam = _.cloneDeep(exam);
      this.maxExamDuration = null;
      this.readingsData = exam.weights_data;
      this.restart();
      while (this.readingsIdx < this.readingsData.length) {
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
      if (callback) callback();
    },
    onLoadExam(exam) {
      console.log("onLoadExam", exam);
      if (!exam || (this.exam && this.exam.id === exam.id)) return;
      this.loadExam(exam);
    },
    onImportExam(exam, callback) {
      if (!exam) return;
      this.loadExam(exam, callback);
      this.setSelectedExams([exam]);
    },
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
      this.exam = null;
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
    stopStreaming() {
      this.isEndStreaming = true;
      //TODO::uncomment, test, duration eventually should be the actual number of seconds passed
      this.readingsData = _.cloneDeep(this.weightsHistory);
      this.isEndReading = true;
      if (this.readingsData.length && this.newExamData) {
        console.log("currentTiming", this.currentTiming);
        const data = {
          ...this.newExamData,
          ...{
            weights_data: this.readingsData,
            patient_id: this.selectedPatient.id,
            duration: this.currentTiming
          }
        };
        ipc.send("create:exam", data);
        ipc.once("create:exam:result", (event, res) => {
          console.log("create:exam:result", res);
          if (res) {
            this.addExam(res);
          }
        });
        ipc.once("create:exam:error", (event, er) => {
          console.log("create:exam:error", er);
        });
      }
      console.log("stopStreaming", this.newExamData);
    },
    showNewExamDialog() {
      if (!this.selectedPatient) {
        alert("Select a patient first");
        return;
      }
      this.showExamDialog = true;
    },
    startStreaming() {
      console.log("start streaming");
      if (!this.isReady) {
        alert("Pedana is not connected");
        return;
      }
      if (!this.selectedPatient) {
        alert("Select a patient first");
        return;
      }

      this.isEndStreaming = false;
      this.reset();
    },
    toggleStreaming() {
      this.isEndStreaming ? this.startStreaming() : this.stopStreaming();
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
        this.leftBarycenter.drawOld(this.c);
        this.generalBarycenter.drawOld(this.c);
        this.rightBarycenter.drawOld(this.c);

        this.drawConnectBarycenters();
        this.leftBarycenter.draw(this.c);
        this.generalBarycenter.draw(this.c);
        this.rightBarycenter.draw(this.c);
      } catch (e) {
        this.error = true;
        console.error(e);
      }
    },
    onDataImported() {
      this.showPatientsDialog = true;
    }
  }
});
</script>
