<template>
  <v-dialog :value="value" :style="{ zIndex: 1000 }" persistent fullscreen>
    <v-card class="pa-3 screen-bg">
      <div class="d-flex align-center justify-space-between pb-3 px-5">
        <v-card-title class="primary--text"
          ><h2 class="display-1">Main Chart</h2></v-card-title
        >
        <v-card-subtitle class="mt-3 title primary--text">
          <b>{{ selectedPatient.fullname }}</b> {{ exam.exam_type }} -
          {{ exam.created_at }}
        </v-card-subtitle>
        <v-btn @click="close" color="primary" class="px-5">
          Close
        </v-btn>
      </div>
      <line-chart
        class="mx-auto white chart--white"
        :style="{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          height: '600px',
          width: '1000px'
        }"
        :chart-data="datacollection"
        :options="options"
      ></line-chart>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
//TODO::setTicksRange is not reactive
import Vue from "vue";
import { mapState } from "vuex";
import LineChart from "@/common/LineChart.js";
import { ChartData } from "chart.js";
import {
  leftBarycenter,
  rightBarycenter,
  generalBarycenter
} from "@/common/barycenters.service.js";
import {
  idealBarycenterLeftX,
  idealBarycenterRightX
} from "@/common/constants.js";
const defalutRange = 150;
export default Vue.extend({
  name: "MainChart",
  components: {
    LineChart
  },
  props: ["value", "exam"],
  data() {
    return {
      datacollection: {} as ChartData,
      margin: 10,
      options: {
        plugins: {
          legend: false
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [
            {
              type: "linear",
              ticks: {
                min: -defalutRange,
                max: defalutRange,
                display: false
              },
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              type: "linear",
              gridLines: {
                display: false
              },
              ticks: {
                min: -defalutRange,
                max: defalutRange,
                display: false
              }
            }
          ]
        }
      }
    };
  },
  methods: {
    // setTicksRange(max) {
    //   console.log("setTicksRange", max);
    //   this.options.scales.xAxes[0].ticks.min = Math.floor(-max);
    //   this.options.scales.xAxes[0].ticks.max = Math.floor(max);
    //   this.options.scales.yAxes[0].ticks.min = Math.floor(-max);
    //   this.options.scales.yAxes[0].ticks.max = Math.floor(max);
    // },
    close() {
      this.$emit("update:value", false);
    },
    fillData() {
      const bxL = leftBarycenter.calculateBx();
      const byL = leftBarycenter.calculateBy();
      const bxR = rightBarycenter.calculateBx();
      const byR = rightBarycenter.calculateBy();
      const bxG = generalBarycenter.calculateBx();
      const byG = generalBarycenter.calculateBy();

      const maxYL = Math.max(
        ...this.leftBarycenterHistory.map(item => Math.abs(item.y))
      );
      const maxXL = Math.max(
        ...this.leftBarycenterHistory.map(item => Math.abs(item.x))
      );

      const maxYR = Math.max(
        ...this.rightBarycenterHistory.map(item => Math.abs(item.y))
      );
      const maxXR = Math.max(
        ...this.rightBarycenterHistory.map(item => Math.abs(item.x))
      );

      const maxY = Math.max(maxYL, maxYR);
      const maxX = Math.max(maxXL, maxXR);
      let max = Math.max(maxX, maxY);
      if (max < defalutRange) max = defalutRange;
      //this.setTicksRange(max + this.margin);
      const idealLeft = [
        {
          label: "Ideal Left",
          borderColor: "rgb(167, 169, 172)",
          pointBackgroundColor: "rgb(167, 169, 172)",
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
          data: [
            {
              x: idealBarycenterLeftX,
              y: max
            },
            {
              x: idealBarycenterLeftX,
              y: -max
            }
          ]
        }
      ];

      const idealRight = [
        {
          label: "Ideal Right",
          borderColor: "rgb(167, 169, 172)",
          pointBackgroundColor: "rgb(167, 169, 172)",
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
          data: [
            {
              x: idealBarycenterRightX,
              y: max
            },
            {
              x: idealBarycenterRightX,
              y: -max
            }
          ]
        }
      ];
      const intersectLineStyle = {
        label: "",
        borderColor: "#27a3a6",
        pointBackgroundColor: "#27a3a6",
        pointRadius: 0,
        fill: false,
        borderWidth: 1
      };
      const fullWidth = 2 * (max + this.margin);
      this.datacollection = {
        labels: [""],
        datasets: [
          {
            label: "X",
            borderColor: "#005264",
            pointRadius: 0,
            fill: false,
            data: [
              { x: -max - this.margin, y: 0 },
              { x: max + this.margin, y: 0 }
            ],
            borderWidth: 2
          },
          {
            label: "Y",
            borderColor: "#005264",
            pointRadius: 0,
            fill: false,
            data: [
              { x: 0, y: max + this.margin },
              { x: 0, y: -max - this.margin }
            ],
            borderWidth: 2
          },
          {
            label: "Left Barycenter",
            borderColor: "#008bc4",
            pointBackgroundColor: "#008bc4",
            pointRadius: 0,
            fill: false,
            data: this.leftBarycenterHistory,
            borderWidth: 1
          },
          {
            label: "General Barycenter",
            borderColor: "#f58241",
            pointBackgroundColor: "#f58241",
            pointRadius: 0,
            fill: false,
            data: this.generalBarycenterHistory,
            borderWidth: 1
          },
          {
            label: "Right Barycenter",
            borderColor: "#008bc4",
            pointBackgroundColor: "#008bc4",
            pointRadius: 0,
            fill: false,
            data: this.rightBarycenterHistory,
            borderWidth: 1
          },
          ...idealRight,
          ...idealLeft,
          {
            ...intersectLineStyle,
            data: [
              {
                x: -fullWidth / 2 + fullWidth / 3,
                y: byL
              },
              {
                x: -fullWidth / 2,
                y: byL
              }
            ]
          },
          {
            ...intersectLineStyle,
            data: [
              {
                x: bxL,
                y: max
              },
              {
                x: bxL,
                y: -max
              }
            ]
          },
          {
            ...intersectLineStyle,
            data: [
              {
                x: fullWidth / 2,
                y: byR
              },
              {
                x: fullWidth / 2 - fullWidth / 3,
                y: byR
              }
            ]
          },
          {
            ...intersectLineStyle,
            data: [
              {
                x: bxR,
                y: max
              },
              {
                x: bxR,
                y: -max
              }
            ]
          },
          {
            label: "",
            borderColor: "rgb(243, 203,45)",
            pointBackgroundColor: "rgb(243, 203,45)",
            pointRadius: 0,
            fill: false,
            borderWidth: 1,
            data: [
              {
                x: fullWidth / 2 - fullWidth / 3,
                y: byG
              },
              {
                x: -fullWidth / 2 + fullWidth / 3,
                y: byG
              }
            ]
          },
          {
            label: "",
            borderColor: "rgb(243, 203,45)",
            pointBackgroundColor: "rgb(243, 203,45)",
            pointRadius: 0,
            fill: false,
            borderWidth: 1,
            data: [
              {
                x: bxG,
                y: max
              },
              {
                x: bxG,
                y: -max
              }
            ]
          }
        ]
      };
    }
  },
  //TODO::write getter with set get
  watch: {
    generalBarycenterHistory: {
      handler(val) {
        this.fillData();
        console.log(val);
      },
      immediate: true
    }
  },
  computed: {
    ...mapState("pedana", [
      "generalBarycenterHistory",
      "leftBarycenterHistory",
      "rightBarycenterHistory"
    ]),
    ...mapState("patients", ["selectedPatient"])
  }
});
</script>
