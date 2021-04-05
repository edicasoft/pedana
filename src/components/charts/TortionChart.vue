<template>
  <v-dialog :value="value" @click:outside="close">
    <v-card :min-height="800">
      <v-btn @click="close">Close</v-btn>

      <div class="small">
        <line-chart
          :chart-data="datacollection"
          :options="options"
        ></line-chart>
      </div>

      <div>
        Angle opposite of X-axis:
      </div>
      <div>Angle next to X-axis:</div>
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
  created() {
    this.fillData();
  },
  methods: {
    close() {
      this.$emit("update:value", false);
    },
    fillData() {
      const x1 = leftBarycenter.Bx;
      const y1 = leftBarycenter.By;
      const x2 = rightBarycenter.Bx;
      const y2 = rightBarycenter.By;
      const intersectLineStyle = {
        label: "",
        borderColor: "blue",
        pointBackgroundColor: "blue",
        pointRadius: 0,
        fill: false,
        borderWidth: 1,
        borderDash: [5, 5, 2, 5]
      };
      //   const x1 = 500;
      //   const y1 = -200;
      //   const x2 = -500;
      //   const y2 = 70;
      console.log("fillData", x1, y1);
      const maxY = Math.max(
        Math.abs(y1) + 20,
        minHeight / 2,
        Math.abs(y2) + 20
      );
      const maxX = Math.max(Math.abs(x1) + 20, minWidth / 2, Math.abs(x2) + 20);
      console.log(maxX, maxY);
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
      this.datacollection = {
        labels: [""],
        datasets: [
          ...axes,
          {
            ...intersectLineStyle,
            data: [
              {
                x: -20,
                y: y1
              },
              {
                x: -maxX,
                y: y1
              }
            ]
          },
          {
            ...intersectLineStyle,
            data: [
              {
                x: x1,
                y: maxY
              },
              {
                x: x1,
                y: -maxY
              }
            ]
          },
          {
            ...intersectLineStyle,
            data: [
              {
                x: 20,
                y: y2
              },
              {
                x: maxX,
                y: y2
              }
            ]
          },
          {
            ...intersectLineStyle,
            data: [
              {
                x: x2,
                y: maxY
              },
              {
                x: x2,
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
                x: x1,
                y: y1
              },
              {
                x: x2,
                y: y2
              }
            ]
          }
        ]
      };
    }
  }
});
</script>
