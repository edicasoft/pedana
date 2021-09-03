<template>
  <div class="small">
    <line-chart
      :style="{
        height: '350px',
        position: 'relative',
        maxHeight: '600px',
        maxWidth: '1200px'
      }"
      :chart-data="datacollection"
      :options="options"
    ></line-chart>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import LineChart from "@/common/LineChart.js";
import { ChartData } from "chart.js";

export default Vue.extend({
  name: "MainChart",
  components: {
    LineChart
  },
  data() {
    return {
      datacollection: {} as ChartData,
      options: {
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "linear"
              // ticks: {
              //   display: false
              // },
            }
          ],
          yAxes: [
            {
              type: "linear"
            }
          ]
        }
      }
    };
  },
  methods: {
    fillData() {
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
      this.datacollection = {
        labels: [""],
        datasets: [
          {
            label: "X",
            borderColor: "black",
            pointRadius: 0,
            fill: false,
            data: [
              { x: -maxX, y: 0 },
              { x: maxX, y: 0 }
            ],
            borderWidth: 1
          },
          {
            label: "Y",
            borderColor: "black",
            pointRadius: 0,
            fill: false,
            data: [
              { x: 0, y: -maxY },
              { x: 0, y: maxY }
            ],
            borderWidth: 1
          },
          {
            label: "Left Barycenter",
            borderColor: "blue",
            pointBackgroundColor: "blue",
            pointRadius: 0,
            fill: false,
            data: this.leftBarycenterHistory,
            borderWidth: 1
          },
          {
            label: "General Barycenter",
            borderColor: "red",
            pointBackgroundColor: "red",
            pointRadius: 0,
            fill: false,
            data: this.generalBarycenterHistory,
            borderWidth: 1
          },
          {
            label: "Right Barycenter",
            borderColor: "blue",
            pointBackgroundColor: "blue",
            pointRadius: 0,
            fill: false,
            data: this.rightBarycenterHistory,
            borderWidth: 1
          }
        ]
      };
    }
  },
  //TODO::write getter with set get
  watch: {
    generalBarycenterHistory: {
      handler() {
        this.fillData();
      },
      immediate: true
    }
  },
  computed: {
    ...mapState("pedana", [
      "generalBarycenterHistory",
      "leftBarycenterHistory",
      "rightBarycenterHistory"
    ])
  }
});
</script>
