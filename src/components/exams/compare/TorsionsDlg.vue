<template>
  <v-dialog :value="value" :style="{ zIndex: 1000 }" fullscreen persistent>
    <v-card class="pa-3">
      <div class="d-flex align-center justify-space-between pb-3">
        <v-card-title class="pt-0 pb-0">Torsion</v-card-title>
        <v-btn @click="close" icon>
          <v-icon color="error">mdi-close-circle</v-icon></v-btn
        >
      </div>

      <v-row>
        <v-col>
          <line-chart
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

      <div class="pa-5">
        <v-data-table
          :headers="headers"
          :items="calculations"
          hide-default-footer
          :disable-sort="true"
          :item-class="rowColor"
        ></v-data-table>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import LineChart from "@/common/LineChart.js";
import {
  idealBarycenterLeftX,
  idealBarycenterRightX,
  leftPlatformCells,
  rightPlatformCells
} from "@/common/constants.js";
import ChartMixin from "@/mixins/ChartMixin";
import Barycenter from "@/entities/Barycenter";

const minHeight = 200;

export default Vue.extend({
  props: ["value"],
  components: {
    LineChart
  },
  mixins: [ChartMixin],
  data() {
    return {
      headers: [
        { text: "", value: "type" },
        { text: "Angle next to X-axis", value: "nextToXAngle" }
      ],
      datacollection: { labels: [""], datasets: [] },
      calculations: [],
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
              position: "center"
              // ticks: {
              //   min: 50,
              //   max: 50
              // }
            }
          ],
          yAxes: [
            {
              title: "Y"
              // ticks: {
              //   min: 50,
              //   max: 50
              // }
            }
          ]
        }
      }
    };
  },
  created() {
    this.calculateFormulas();
    this.fillData();
  },
  methods: {
    // setTicksRange() {
    //   const minX = Math.min(
    //     ...this.calculations.map(item =>
    //       Math.min(item.bxL, item.bxR, -minHeight / 2)
    //     )
    //   );
    //   this.options.scales.xAxes[0].ticks.min = Math.floor(minX);

    //   const maxX = Math.max(
    //     ...this.calculations.map(item =>
    //       Math.max(item.bxL, item.bxR, minHeight / 2)
    //     )
    //   );
    //   this.options.scales.xAxes[0].ticks.max = Math.ceil(maxX);

    //   const minY = Math.min(
    //     ...this.calculations.map(item =>
    //       Math.min(item.byL, item.byR, -minHeight / 2)
    //     )
    //   );
    //   this.options.scales.yAxes[0].ticks.min = Math.floor(minY);

    //   const maxY = Math.max(
    //     ...this.calculations.map(item =>
    //       Math.max(item.byL, item.byR, minHeight / 2)
    //     )
    //   );
    //   this.options.scales.yAxes[0].ticks.max = Math.ceil(maxY);
    //   console.log(minY, maxY);
    //   //console.log(minY, maxY);
    // },
    calculateFormulas() {
      for (let i = 0; i < this.exams.length; i++) {
        const color = this.colors[i];

        const barycenterLeft = new Barycenter(leftPlatformCells, color);
        const barycenterRight = new Barycenter(rightPlatformCells, color);

        const leftWeights = this.exams[i].weightsData.map(item =>
          item.slice(0, 3)
        );
        const rightWeights = this.exams[i].weightsData.map(item =>
          item.slice(3, 6)
        );

        this.calcBarycenterCoordinates(barycenterLeft, leftWeights);
        this.calcBarycenterCoordinates(barycenterRight, rightWeights);

        const exam = { color };
        exam.type = this.exams[i].exam_type;
        exam.bxR = barycenterRight.calculateBx();
        exam.byR = barycenterRight.calculateBy();
        exam.bxL = barycenterLeft.calculateBx();
        exam.byL = barycenterLeft.calculateBy();
        exam.oppositeXAngle = this.oppositeXAngle(exam).toFixed(2);
        exam.nextToXAngle = this.nextToXAngle(exam.oppositeXAngle).toFixed(2);
        this.calculations.push(exam);
      }
    },
    fillData() {
      const maxY = Math.max(
        ...this.calculations.map(item =>
          Math.max(Math.abs(item.byL), Math.abs(item.byR), minHeight / 2)
        )
      );
      const maxX = Math.max(
        ...this.calculations.map(item =>
          Math.max(Math.abs(item.bxL), Math.abs(item.bxR), minHeight / 2)
        )
      );
      // const minX = Math.min(
      //   ...this.calculations.map(item =>
      //     Math.min(item.bxL, item.bxR, -minWidth / 2)
      //   )
      // );

      // const maxX = Math.max(
      //   ...this.calculations.map(item =>
      //     Math.max(item.bxL, item.bxR, minWidth / 2)
      //   )
      // );

      // const minY = Math.min(
      //   ...this.calculations.map(item =>
      //     Math.min(item.byL, item.byR, -minHeight / 2)
      //   )
      // );

      // const maxY = Math.max(
      //   ...this.calculations.map(item =>
      //     Math.max(item.byL, item.byR, minHeight / 2)
      //   )
      // );
      this.maxY = this.maxX = Math.max(maxX, maxY) + 20;

      // this.setTicksRange();

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
              y: -this.maxY
            },
            {
              x: idealBarycenterLeftX,
              y: this.maxY
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
              y: -this.maxY
            },
            {
              x: idealBarycenterRightX,
              y: this.maxY
            }
          ]
        }
      ];
      this.datacollection.datasets = [...this.axes, ...ideal];

      for (let i = 0; i < this.calculations.length; i++) {
        const exam = this.calculations[i];
        this.intersectLineStyle.borderColor = exam.color;
        this.intersectLineStyle.pointBackgroundColor = exam.color;
        this.datacollection.datasets = this.datacollection.datasets.concat([
          {
            ...this.intersectLineStyle,
            data: [
              {
                x: -20,
                y: exam.byL
              },
              {
                x: -this.maxX,
                y: exam.byL
              }
            ]
          },
          {
            ...this.intersectLineStyle,
            data: [
              {
                x: exam.bxL,
                y: this.maxY
              },
              {
                x: exam.bxL,
                y: -this.maxY
              }
            ]
          },
          {
            ...this.intersectLineStyle,
            data: [
              {
                x: 20,
                y: exam.byR
              },
              {
                x: this.maxX,
                y: exam.byR
              }
            ]
          },
          {
            ...this.intersectLineStyle,
            data: [
              {
                x: exam.bxR,
                y: this.maxY
              },
              {
                x: exam.bxR,
                y: -this.maxY
              }
            ]
          },
          {
            borderColor: exam.color,
            pointBackgroundColor: exam.color,
            pointRadius: 0,
            fill: false,
            borderWidth: 1,
            data: [
              {
                x: exam.bxL,
                y: exam.byL
              },
              {
                x: exam.bxR,
                y: exam.byR
              }
            ]
          }
        ]);
      }
    },
    close() {
      this.$emit("update:value", false);
    }
  }
});
</script>
