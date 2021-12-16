<template>
  <v-dialog :value="value" :style="{ zIndex: 1000 }" fullscreen persistent>
    <v-card class="pa-3 screen-bg">
      <div class="d-flex align-center justify-space-between pb-3 px-5">
        <v-card-title class="display-1  primary--text"
          >Center of Gravity</v-card-title
        >
        <v-btn @click="close" color="primary" class="px-5">
          Close
        </v-btn>
      </div>

      <v-row>
        <v-col>
          <line-chart
            class="chart--white white mx-auto pa-3"
            :style="{
              height: '600px',
              position: 'relative',
              width: '600px'
            }"
            :chart-data="datacollection"
            :options="options"
          ></line-chart>
        </v-col>
        <v-col>
          <div>
            <div class="chart-subtitle first-col">
              Barycenter area mm<sup>2</sup>
            </div>
            <strong class="ml-3 chart-value info--text"> {{ Ammq }}</strong>
          </div>
          <div>
            <div class="chart-subtitle first-col">
              Oscilation relation
            </div>
            <strong class="ml-3 chart-value info--text">{{ Rfor }}</strong>
          </div>
          <div>
            <div class="chart-subtitle first-col">Comfort level</div>
            <strong class="ml-3 chart-value info--text">{{ Vvar }}</strong>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import LineChart from "@/common/LineChart.js";
import { ChartData } from "chart.js";
import { generalBarycenter } from "@/common/barycenters.service.js";
import { mapState } from "vuex";

export default Vue.extend({
  name: "GeneralBarycenterChart",
  props: ["value"],

  components: {
    LineChart
  },
  data() {
    return {
      datacollection: {} as ChartData,
      x1: 0,
      y1: 0,
      Ammq: "",
      Vvar: "",
      Rfor: "",
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
  watch: {
    weights() {
      this.fillData();
    }
  },
  computed: {
    ...mapState("pedana", ["generalBarycenterHistory", "weights"])
  },
  created() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.Ammq = generalBarycenter.calculateAMmq().toFixed(2);
      this.Vvar = generalBarycenter.calculateVelocityVariation().toFixed(2);
      this.Rfor = generalBarycenter.calculateRForma().toFixed(2);
      this.x1 = generalBarycenter.calculateBx();
      this.y1 = generalBarycenter.calculateBy();
      const intersectLineStyle = {
        label: "",
        borderColor: "#27a3a6",
        pointBackgroundColor: "#27a3a6",
        pointRadius: 0,
        fill: false,
        borderWidth: 1,
        borderDash: [5, 5, 2, 5]
      };
      const maxY =
        Math.max(...generalBarycenter.yVals.map(item => Math.abs(item))) + 5;
      const maxX =
        Math.max(...generalBarycenter.xVals.map(item => Math.abs(item))) + 5;
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

      this.datacollection = {
        labels: [""],
        datasets: [
          {
            label: "General Barycenter",
            borderColor: "#f58241",
            pointBackgroundColor: "#f58241",
            pointRadius: 0,
            fill: false,
            data: this.generalBarycenterHistory,
            borderWidth: 2
          },
          ...axes,
          {
            ...intersectLineStyle,
            data: [
              {
                x: maxX,
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
