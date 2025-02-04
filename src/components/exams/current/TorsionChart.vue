<template>
  <v-dialog :value="value" :style="{ zIndex: 1000 }" fullscreen persistent>
    <v-card class="pa-3 screen-bg">
      <div class="d-flex align-center justify-space-between pb-3 px-5">
        <v-card-title class="display-1  primary--text">Torsion</v-card-title>
        <v-btn @click="close" color="primary" class="px-5">
          Close
        </v-btn>
      </div>

      <v-row>
        <v-col>
          <line-chart
            class="mx-auto white chart--white"
            :style="{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              maxHeight: '500px',
              maxWidth: '1000px'
            }"
            :chart-data="datacollection"
            :options="options"
          ></line-chart>
        </v-col>
      </v-row>

      <div class="pa-5 mx-auto w-100" :style="{ maxWidth: '1000px' }">
        <!-- <div>
          Angle opposite of X-axis:
          <strong>{{ oppositeXAngle.toFixed(2) }}</strong>
        </div> -->
        <div class="chart-subtitle">
          Angle next to X-axis
          <strong class="ml-3 chart-value info--text">{{
            nextToXAngle.toFixed(2)
          }}</strong>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import LineChart from "@/common/LineChart.js";
import { ChartData } from "chart.js";
import {
  leftBarycenter,
  rightBarycenter
} from "@/common/barycenters.service.js";
import {
  idealBarycenterLeftX,
  idealBarycenterRightX
} from "@/common/constants.js";
import { mapState } from "vuex";

const minHeight = 200;
const minWidth = 200;

export default Vue.extend({
  name: "TorsionChart",
  props: ["value"],

  components: {
    LineChart
  },
  data() {
    return {
      datacollection: {} as ChartData,
      x1: leftBarycenter.calculateBx(),
      x2: rightBarycenter.calculateBx(),
      y1: leftBarycenter.calculateBy(),
      y2: rightBarycenter.calculateBy(),
      options: {
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
          legend: false
        },
        scales: {
          xAxes: [
            {
              title: "X",
              type: "linear",
              position: "bottom"
            }
          ]
        }
      }
    };
  },
  computed: {
    ...mapState("pedana", ["weights"]),
    oppositeXAngle(): number {
      const deltaX = Math.abs(this.x2 - this.x1);
      const deltaY = Math.abs(this.y2 - this.y1);
      const sqrt = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
      const angle = sqrt ? (Math.acos(deltaX / sqrt) * 180) / Math.PI : 0;
      return this.y2 > this.y1 ? -1 * angle : angle;
    },
    nextToXAngle(): number {
      return 90 - Math.abs(this.oppositeXAngle);
    }
  },
  created() {
    this.fillData();
  },
  watch: {
    weights() {
      this.fillData();
    }
  },
  methods: {
    fillData() {
      this.x1 = leftBarycenter.calculateBx();
      this.y1 = leftBarycenter.calculateBy();
      this.x2 = rightBarycenter.calculateBx();
      this.y2 = rightBarycenter.calculateBy();
      const intersectLineStyle = {
        label: "",
        borderColor: "#27a3a6",
        pointBackgroundColor: "#27a3a6",
        pointRadius: 0,
        fill: false,
        borderWidth: 1,
        borderDash: [5, 5, 2, 5]
      };
      const maxY = Math.max(
        Math.abs(this.y1) + 20,
        minHeight / 2,
        Math.abs(this.y2) + 20
      );
      const maxX = Math.max(
        Math.abs(this.x1) + 20,
        minWidth / 2,
        Math.abs(this.x2) + 20
      );
      const axes = [
        {
          label: "X",
          borderColor: "#005264",
          pointBackgroundColor: "#005264",
          pointRadius: 0,
          fill: false,
          borderWidth: 2,
          data: [
            {
              x: -maxX,
              y: 0
            },
            {
              x: maxX,
              y: 0
            }
          ]
        },
        {
          label: "Y",
          borderColor: "#005264",
          pointBackgroundColor: "#005264",
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
          data: [
            {
              x: 0,
              y: maxY
            },
            {
              x: 0,
              y: -maxY
            }
          ]
        }
      ];

      const ideal = [
        {
          borderColor: "rgb(167, 169, 172)",
          pointBackgroundColor: "rgb(167, 169, 172)",
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
          data: [
            {
              x: idealBarycenterLeftX,
              y: -maxY
            },
            {
              x: idealBarycenterLeftX,
              y: maxY
            }
          ]
        },
        {
          borderColor: "rgb(167, 169, 172)",
          pointBackgroundColor: "rgb(167, 169, 172)",
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
          data: [
            {
              x: idealBarycenterRightX,
              y: -maxY
            },
            {
              x: idealBarycenterRightX,
              y: maxY
            }
          ]
        }
      ];
      this.datacollection = {
        labels: [""],
        datasets: [
          ...axes,
          ...ideal,
          {
            ...intersectLineStyle,
            data: [
              {
                x: -20,
                y: this.y1
              },
              {
                x: -maxX,
                y: this.y1
              }
            ]
          },
          {
            ...intersectLineStyle,
            data: [
              {
                x: this.x1,
                y: maxY
              },
              {
                x: this.x1,
                y: -maxY
              }
            ]
          },
          {
            ...intersectLineStyle,
            data: [
              {
                x: 20,
                y: this.y2
              },
              {
                x: maxX,
                y: this.y2
              }
            ]
          },
          {
            ...intersectLineStyle,
            data: [
              {
                x: this.x2,
                y: maxY
              },
              {
                x: this.x2,
                y: -maxY
              }
            ]
          },
          {
            label: "",
            borderColor: "#008bc4",
            pointBackgroundColor: "#008bc4",
            pointRadius: 0,
            fill: false,
            borderWidth: 2,
            data: [
              {
                x: this.x1,
                y: this.y1
              },
              {
                x: this.x2,
                y: this.y2
              }
            ]
          }
        ]
      };
    },
    close() {
      this.$emit("update:value", false);
    }
  }
});
</script>
