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
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "linear"
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
      this.datacollection = {
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
