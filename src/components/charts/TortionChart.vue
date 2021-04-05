<template>
  <v-dialog :value="value" @click:outside="close">
    <v-btn @click="close">Close</v-btn>

    <v-card :min-height="800">
      <div class="small">
        <line-chart
          :chart-data="datacollection"
          :options="options"
        ></line-chart>
      </div>

      <div class="mt-3">
        Angle opposite of X-axis:
        <strong>{{ oppositeXAngle.toFixed(2) }}</strong>
      </div>
      <div>
        Angle next to X-axis: <strong>{{ nextToXAngle.toFixed(2) }}</strong>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
//TODO::move dialog, open in desktop window, reactivity
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

const minHeight = 200;
const minWidth = 400;

export default Vue.extend({
  name: "TortionChart",
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
        responsive: false,
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
  methods: {
    fillData() {
      this.x1 = leftBarycenter.calculateBx();
      this.y1 = leftBarycenter.calculateBy();
      this.x2 = rightBarycenter.calculateBx();
      this.y2 = rightBarycenter.calculateBy();
      const intersectLineStyle = {
        label: "",
        borderColor: "blue",
        pointBackgroundColor: "blue",
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
          label: "Y",
          borderColor: "black",
          pointBackgroundColor: "black",
          pointRadius: 0,
          fill: false,
          borderWidth: 1,
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
          label: "X",
          borderColor: "black",
          pointBackgroundColor: "black",
          fill: false,
          borderWidth: 1,
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
          borderColor: "orange",
          pointBackgroundColor: "orange",
          fill: false,
          borderWidth: 1,
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
          borderColor: "orange",
          pointBackgroundColor: "orange",
          fill: false,
          borderWidth: 1,
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
            borderColor: "blue",
            pointBackgroundColor: "blue",
            pointRadius: 0,
            fill: false,
            borderWidth: 1,
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
