<template>
  <v-dialog :value="value" :style="{ zIndex: 1000 }" fullscreen persistent>
    <v-card class="pa-3">
      <div class="d-flex align-center justify-space-between pb-3">
        <v-card-title class="pt-0 pb-0"
          >Left and Right Barycenters</v-card-title
        >
        <v-btn @click="close" icon>
          <v-icon color="error">mdi-close-circle</v-icon></v-btn
        >
      </div>

      <v-row>
        <v-col>
          <line-chart
            :style="{
              position: 'relative',
              width: '550px'
            }"
            :chart-data="datacollectionLeft"
            :options="optionsLeft"
          ></line-chart>
          <v-data-table
            :headers="headersLeft"
            :items="calculations"
            hide-default-footer
            :disable-sort="true"
            :item-class="rowColor"
          ></v-data-table>
        </v-col>
        <v-col>
          <line-chart
            :style="{
              position: 'relative',
              width: '550px'
            }"
            :chart-data="datacollectionRight"
            :options="optionsRight"
          ></line-chart>
          <v-data-table
            :headers="headersRight"
            :items="calculations"
            hide-default-footer
            :disable-sort="true"
            :item-class="rowColor"
          ></v-data-table>
        </v-col>
      </v-row>
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

const initialOptions = {
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
        position: "center",
        ticks: {
          min: 100,
          max: 100
        }
      }
    ],
    yAxes: [
      {
        title: "Y",
        ticks: {
          min: 100,
          max: 100
        }
      }
    ]
  }
};
export default Vue.extend({
  props: ["value"],
  mixins: [ChartMixin],
  components: {
    LineChart
  },
  data() {
    return {
      headersLeft: [
        { text: "", value: "type" },
        { text: "Ammq", value: "AmmqL" },
        { text: "Rfor", value: "RforL" },
        { text: "Vvar", value: "VvarL" }
      ],
      headersRight: [
        { text: "", value: "type" },
        { text: "Ammq", value: "AmmqR" },
        { text: "Rfor", value: "RforR" },
        { text: "Vvar", value: "VvarR" }
      ],
      calculations: [],
      datacollectionLeft: { labels: [""], datasets: [] },
      datacollectionRight: { labels: [""], datasets: [] },
      optionsLeft: _.cloneDeep(initialOptions),
      optionsRight: _.cloneDeep(initialOptions)
    };
  },
  created() {
    this.calculateFormulas();
    this.fillData();
  },
  methods: {
    calculateFormulas() {
      for (let i = 0; i < this.exams.length; i++) {
        const color = this.colors[i];

        const barycenterLeft = new Barycenter(leftPlatformCells);
        const barycenterRight = new Barycenter(rightPlatformCells);

        const leftWeights = this.exams[i].weights_data.map(item =>
          item.slice(0, 3)
        );
        const rightWeights = this.exams[i].weights_data.map(item =>
          item.slice(3, 6)
        );

        this.calcBarycenterCoordinates(barycenterLeft, leftWeights);
        this.calcBarycenterCoordinates(barycenterRight, rightWeights);

        const exam = { color };
        exam.AmmqL = barycenterLeft.calculateAMmq().toFixed(2);
        exam.VvarL = barycenterLeft.calculateVelocityVariation().toFixed(2);
        exam.RforL = barycenterLeft.calculateRForma().toFixed(2);

        exam.bxL = barycenterLeft.calculateBx();
        exam.byL = barycenterLeft.calculateBy();

        exam.AmmqR = barycenterRight.calculateAMmq().toFixed(2);
        exam.VvarR = barycenterRight.calculateVelocityVariation().toFixed(2);
        exam.RforR = barycenterRight.calculateRForma().toFixed(2);

        exam.bxR = barycenterRight.calculateBx();
        exam.byR = barycenterRight.calculateBy();

        exam.minXL = barycenterLeft.minX;
        exam.maxXL = barycenterLeft.maxX;
        exam.minXR = barycenterRight.minX;
        exam.maxXR = barycenterRight.maxX;

        exam.minYL = barycenterLeft.minY;
        exam.maxYL = barycenterLeft.maxY;
        exam.minYR = barycenterRight.minY;
        exam.maxYR = barycenterRight.maxY;

        exam.leftBarycenterHistory = barycenterLeft.getHistory();
        exam.rightBarycenterHistory = barycenterRight.getHistory();
        exam.type = this.exams[i].exam_type;

        this.calculations.push(exam);
      }
    },
    setTicksRange() {
      const minXL = Math.min(...this.calculations.map(item => item.minXL));
      this.optionsLeft.scales.xAxes[0].ticks.min = Math.floor(minXL);

      const maxXL = Math.max(...this.calculations.map(item => item.maxXL));
      this.optionsLeft.scales.xAxes[0].ticks.max = Math.ceil(maxXL);

      const minYL = Math.min(...this.calculations.map(item => item.minYL));
      this.optionsLeft.scales.yAxes[0].ticks.min = Math.floor(minYL);

      const maxYL = Math.max(...this.calculations.map(item => item.maxYL));
      this.optionsLeft.scales.yAxes[0].ticks.max = Math.ceil(maxYL);

      const minXR = Math.min(...this.calculations.map(item => item.minXR));
      this.optionsRight.scales.xAxes[0].ticks.min = Math.floor(minXR);

      const maxXR = Math.max(...this.calculations.map(item => item.maxXR));
      this.optionsRight.scales.xAxes[0].ticks.max = Math.ceil(maxXR);

      const minYR = Math.min(...this.calculations.map(item => item.minYR));
      this.optionsRight.scales.yAxes[0].ticks.min = Math.floor(minYR);

      const maxYR = Math.max(...this.calculations.map(item => item.maxYR));
      this.optionsRight.scales.yAxes[0].ticks.max = Math.ceil(maxYR);
    },
    fillData() {
      const maxYL = Math.max(
        ...this.calculations.map(item =>
          Math.max(Math.abs(item.maxYL), Math.abs(item.minYL))
        )
      );
      const maxXL = Math.max(
        ...this.calculations.map(item =>
          Math.max(Math.abs(item.maxXL), Math.abs(item.minXL))
        )
      );

      const maxYR = Math.max(
        ...this.calculations.map(item =>
          Math.max(Math.abs(item.maxYR), Math.abs(item.minYR))
        )
      );
      const maxXR = Math.max(
        ...this.calculations.map(item =>
          Math.max(Math.abs(item.maxXR), Math.abs(item.minXR))
        )
      );

      this.maxY = this.maxX = Math.max(maxYL, maxYR, maxXL, maxXR);

      this.setTicksRange();

      const axesYLeft = [
        {
          borderColor: "black",
          pointBackgroundColor: "black",
          fill: false,
          borderWidth: 1,
          pointRadius: 0,
          data: [
            {
              x: idealBarycenterLeftX,
              y: this.maxY
            },
            {
              x: idealBarycenterLeftX,
              y: -this.maxY
            }
          ]
        }
      ];
      const axesYRight = [
        {
          borderColor: "black",
          pointBackgroundColor: "black",
          fill: false,
          borderWidth: 1,
          pointRadius: 0,
          data: [
            {
              x: idealBarycenterRightX,
              y: this.maxY
            },
            {
              x: idealBarycenterRightX,
              y: -this.maxY
            }
          ]
        }
      ];
      for (let i = 0; i < this.calculations.length; i++) {
        const exam = this.calculations[i];
        this.intersectLineStyle.borderColor = exam.color;
        this.intersectLineStyle.pointBackgroundColor = exam.color;
        this.datacollectionLeft.datasets = this.datacollectionLeft.datasets.concat(
          [
            {
              borderColor: exam.color,
              pointBackgroundColor: exam.color,
              pointRadius: 0,
              fill: false,
              data: exam.leftBarycenterHistory,
              borderWidth: 1
            },
            this.axesX,
            ...axesYLeft,
            {
              ...this.intersectLineStyle,
              data: [
                {
                  x: this.maxX,
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
            }
          ]
        );
        this.datacollectionRight.datasets = this.datacollectionRight.datasets.concat(
          [
            {
              borderColor: exam.color,
              pointBackgroundColor: exam.color,
              pointRadius: 0,
              fill: false,
              data: exam.rightBarycenterHistory,
              borderWidth: 1
            },
            this.axesX,
            ...axesYRight,
            {
              ...this.intersectLineStyle,
              data: [
                {
                  x: this.maxX,
                  y: exam.byR
                },
                {
                  x: -this.maxX,
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
            }
          ]
        );
      }
    },
    close() {
      this.$emit("update:value", false);
    }
  }
});
</script>
