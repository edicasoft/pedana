<template>
  <v-dialog :value="value" @click:outside="close" :max-width="1200" fullscreen>
    <v-card class="pa-3">
      <div class="d-flex align-center justify-space-between pb-3">
        <v-card-title class="pt-0 pb-0">General Barycenter</v-card-title>
        <v-btn @click="close" icon>
          <v-icon color="error">mdi-close-circle</v-icon></v-btn
        >
      </div>

      <v-row>
        <v-col>
          <line-chart
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
            Ammq:
            <strong>{{ Ammq }}</strong>
          </div>
          <div>
            Rfor: <strong>{{ Rfor }}</strong>
          </div>
          <div>
            Vvar: <strong>{{ Vvar }}</strong>
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
        borderColor: "blue",
        pointBackgroundColor: "blue",
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
          label: "Y",
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
          {
            label: "General Barycenter",
            borderColor: "red",
            pointBackgroundColor: "red",
            pointRadius: 0,
            fill: false,
            data: this.generalBarycenterHistory,
            borderWidth: 1
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
