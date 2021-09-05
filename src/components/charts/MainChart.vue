<template>
  <div class="small mt-3">
    <line-chart
      :style="{
        width: '600px',
        position: 'relative'
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
                min: 100,
                max: 100
              },
              gridLines: {
                // tickMarkLength: 50
                //   display: false
              }

              // ticks: {
              //   display: false
              // },
            }
          ],
          yAxes: [
            {
              type: "linear",
              // gridLines: {
              //   display: false
              // },
              ticks: {
                min: 100,
                max: 100
              },
              gridLines: {
                // tickMarkLength: 50
                //   display: false
              }
            }
          ]
        }
      }
    };
  },
  methods: {
    setTicksRange(maxX, maxY) {
      const max = Math.max(maxX, maxY);
      this.options.scales.xAxes[0].ticks.min = Math.floor(-max);
      this.options.scales.xAxes[0].ticks.max = Math.floor(max);
      this.options.scales.yAxes[0].ticks.min = Math.floor(-max);
      this.options.scales.yAxes[0].ticks.max = Math.floor(max);
    },
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
      console.log(maxY, maxX);
      this.setTicksRange(maxX, maxY);
      const max = Math.max(maxX, maxY);

      this.datacollection = {
        labels: [""],
        datasets: [
          {
            label: "X",
            borderColor: "black",
            pointRadius: 0,
            fill: false,
            data: [
              { x: -max, y: 0 },
              { x: max, y: 0 }
            ],
            borderWidth: 1
          },
          {
            label: "Y",
            borderColor: "black",
            pointRadius: 0,
            fill: false,
            data: [
              { x: 0, y: max },
              { x: 0, y: -max }
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
