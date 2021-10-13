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
          <v-sheet :max-width="500" class="px-7 py-3">
            <div>
              Ammq:
              <strong>{{ AmmqL }}</strong>
            </div>
            <div>
              Rfor: <strong>{{ RforL }}</strong>
            </div>
            <div>
              Vvar: <strong>{{ VvarL }}</strong>
            </div>
          </v-sheet>
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
          <v-sheet :max-width="500" class="px-7 py-3">
            <div>
              Ammq:
              <strong>{{ AmmqR }}</strong>
            </div>
            <div>
              Rfor: <strong>{{ RforR }}</strong>
            </div>
            <div>
              Vvar: <strong>{{ VvarR }}</strong>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import LineChart from "@/common/LineChart.js";
import {
  leftBarycenter,
  rightBarycenter
} from "@/common/barycenters.service.js";
import { mapState } from "vuex";
import {
  idealBarycenterLeftX,
  idealBarycenterRightX
} from "@/common/constants.js";
import ChartMixin from "@/mixins/ChartMixin";
import _ from "lodash";

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
  name: "LeftRightBarycenterChart",
  props: ["value"],

  components: {
    LineChart
  },
  mixins: [ChartMixin],

  data() {
    return {
      datacollectionLeft: {},
      datacollectionRight: {},
      bxL: 0,
      byL: 0,
      AmmqL: "",
      VvarL: "",
      RforL: "",
      xR: 0,
      yR: 0,
      AmmqR: "",
      VvarR: "",
      RforR: "",
      optionsLeft: _.cloneDeep(initialOptions),
      optionsRight: _.cloneDeep(initialOptions)
    };
  },
  watch: {
    weights() {
      this.fillData();
    }
  },
  computed: {
    ...mapState("pedana", [
      "rightBarycenterHistory",
      "leftBarycenterHistory",
      "weights"
    ])
  },
  created() {
    this.fillData();
  },
  methods: {
    setTicksRange() {
      this.optionsLeft.scales.xAxes[0].ticks.min = Math.floor(
        leftBarycenter.minX
      );
      this.optionsLeft.scales.xAxes[0].ticks.max = Math.ceil(
        leftBarycenter.maxX
      );
      this.optionsLeft.scales.yAxes[0].ticks.min = Math.floor(
        leftBarycenter.minY
      );
      this.optionsLeft.scales.yAxes[0].ticks.max = Math.ceil(
        leftBarycenter.maxY
      );

      this.optionsRight.scales.xAxes[0].ticks.min = Math.floor(
        rightBarycenter.minX
      );
      this.optionsRight.scales.xAxes[0].ticks.max = Math.ceil(
        rightBarycenter.maxX
      );
      this.optionsRight.scales.yAxes[0].ticks.min = Math.floor(
        rightBarycenter.minY
      );
      this.optionsRight.scales.yAxes[0].ticks.max = Math.ceil(
        rightBarycenter.maxY
      );
    },
    fillData() {
      this.AmmqL = leftBarycenter.calculateAMmq().toFixed(2);
      this.VvarL = leftBarycenter.calculateVelocityVariation().toFixed(2);
      this.RforL = leftBarycenter.calculateRForma().toFixed(2);
      this.bxL = leftBarycenter.calculateBx();
      this.byL = leftBarycenter.calculateBy();

      this.AmmqR = rightBarycenter.calculateAMmq().toFixed(2);
      this.VvarR = rightBarycenter.calculateVelocityVariation().toFixed(2);
      this.RforR = rightBarycenter.calculateRForma().toFixed(2);
      this.xR = rightBarycenter.calculateBx();
      this.yR = rightBarycenter.calculateBy();

      const maxYL = Math.max(
        ...leftBarycenter.yVals.map(item => Math.abs(item))
      );
      const maxXL = Math.max(
        ...leftBarycenter.xVals.map(item => Math.abs(item))
      );

      const maxYR = Math.max(
        ...rightBarycenter.yVals.map(item => Math.abs(item))
      );
      const maxXR = Math.max(
        ...rightBarycenter.xVals.map(item => Math.abs(item))
      );

      this.maxY = Math.max(maxYL, maxYR);
      this.maxX = Math.max(maxXL, maxXR);

      this.setTicksRange();

      const axesYLeft = [
        {
          label: "Y",
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
          label: "X",
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

      this.datacollectionLeft = {
        labels: [""],
        datasets: [
          {
            label: "Left Barycenter",
            borderColor: "blue",
            pointBackgroundColor: "blue",
            pointRadius: 0,
            fill: false,
            data: this.leftBarycenterHistory,
            borderWidth: 1
          },
          this.axesX,
          ...axesYLeft,
          {
            ...this.intersectLineStyle,
            data: [
              {
                x: this.maxX,
                y: this.byL
              },
              {
                x: -this.maxX,
                y: this.byL
              }
            ]
          },
          {
            ...this.intersectLineStyle,
            data: [
              {
                x: this.bxL,
                y: this.maxY
              },
              {
                x: this.bxL,
                y: -this.maxY
              }
            ]
          }
        ]
      };
      this.datacollectionRight = {
        labels: [""],
        datasets: [
          {
            label: "Right Barycenter",
            borderColor: "blue",
            pointBackgroundColor: "blue",
            pointRadius: 0,
            fill: false,
            data: this.rightBarycenterHistory,
            borderWidth: 1
          },
          this.axesX,
          ...axesYRight,
          {
            ...this.intersectLineStyle,
            data: [
              {
                x: this.maxX,
                y: this.yR
              },
              {
                x: -this.maxX,
                y: this.yR
              }
            ]
          },
          {
            ...this.intersectLineStyle,
            data: [
              {
                x: this.xR,
                y: this.maxY
              },
              {
                x: this.xR,
                y: -this.maxY
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
