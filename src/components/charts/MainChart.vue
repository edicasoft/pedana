<template>
  <div class="small">
    <line-chart
      v-if="generalBarycenterCoordinates.length"
      :chart-data="datacollection"
      :options="options"
    ></line-chart>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import LineChart from "@/common/LineChart.js";
interface User {
  labels: Array<string>;
  datasets: Array<object>;
}
export default Vue.extend({
  name: "MainChart",
  components: {
    LineChart
  },
  data() {
    return {
      datacollection: {} as User,
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              type: "linear",
              position: "bottom"
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
          //   {
          //     label: "Left Barycenter",
          //     backgroundColor: "blue",
          //     data: [this.getRandomInt(), this.getRandomInt()]
          //   },
          {
            label: "Left Barycenter",
            borderColor: "blue",
            pointBackgroundColor: "blue",
            pointRadius: 0,
            fill: false,
            data: this.leftBarycenterCoordinates,
            borderWidth: 1
          },
          {
            label: "General Barycenter",
            borderColor: "red",
            pointBackgroundColor: "red",
            pointRadius: 0,
            fill: false,
            data: this.generalBarycenterCoordinates,
            borderWidth: 1
          }
          //   {
          //     label: "Right Barycenter",
          //     backgroundColor: "blue",
          //     data: [this.getRandomInt(), this.getRandomInt()]
          //   }
        ]
      };
    }
  },
  //TODO::write getter with set get
  watch: {
    generalBarycenterCoordinates() {
      this.fillData();
    }
  },
  computed: {
    ...mapState("pedana", [
      "generalBarycenterCoordinates",
      "leftBarycenterCoordinates"
    ])
  }
});
</script>
