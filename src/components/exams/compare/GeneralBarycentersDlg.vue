<template>
  <v-dialog :value="value" :max-width="1200" fullscreen persistent>
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
              position: 'relative',
              width: '800px'
            }"
            :chart-data="datacollection"
            :options="options"
          ></line-chart>
        </v-col>
        <v-col
          v-for="exam in calculations"
          :key="exam.id"
          :style="{ color: exam.color }"
        >
          <div>{{ exam.type }}</div>
          <div>
            Ammq:
            <strong>{{ exam.Ammq }}</strong>
          </div>
          <div>
            Rfor: <strong>{{ exam.Rfor }}</strong>
          </div>
          <div>
            Vvar: <strong>{{ exam.Vvar }}</strong>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import LineChart from "@/common/LineChart.js";
import { leftPlatformCells, rightPlatformCells } from "@/common/constants.js";
import Barycenter from "@/entities/Barycenter";
import ChartMixin from "@/mixins/ChartMixin";
export default Vue.extend({
  props: ["value"],

  components: {
    LineChart
  },
  mixins: [ChartMixin],
  data() {
    return {
      calculations: [],
      datacollection: {
        labels: [""],
        datasets: []
      },
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
  created() {
    this.calculateFormulas();
    this.fillData();
  },
  methods: {
    calculateFormulas() {
      for (let i = 0; i < this.exams.length; i++) {
        const color = this.colors[i];

        const barycenter = new Barycenter(
          leftPlatformCells.concat(rightPlatformCells),
          color
        );
        this.calcBarycenterCoordinates(barycenter, this.exams[i].weightsData);

        const exam = { color };
        exam.Ammq = barycenter.calculateAMmq().toFixed(2);
        exam.Vvar = barycenter.calculateVelocityVariation().toFixed(2);
        exam.Rfor = barycenter.calculateRForma().toFixed(2);

        exam.x1 = barycenter.calculateBx();
        exam.y1 = barycenter.calculateBy();

        exam.maxY = Math.max(...barycenter.yVals.map(item => Math.abs(item)));
        exam.maxX = Math.max(...barycenter.xVals.map(item => Math.abs(item)));
        exam.history = barycenter.getHistory();
        exam.type = this.exams[i].exam_type;

        this.calculations.push(exam);
      }
    },
    fillData() {
      const maxY = Math.max(
        ...this.calculations.map(item => Math.abs(item.maxY))
      );
      const maxX = Math.max(
        ...this.calculations.map(item => Math.abs(item.maxX))
      );
      this.maxY = this.maxX = Math.max(maxX, maxY);
      this.datacollection.datasets = [...this.axes];

      for (let i = 0; i < this.calculations.length; i++) {
        const exam = this.calculations[i];
        this.intersectLineStyle.borderColor = exam.color;
        this.intersectLineStyle.pointBackgroundColor = exam.color;
        this.datacollection.datasets = this.datacollection.datasets.concat([
          {
            borderColor: exam.color,
            pointBackgroundColor: exam.color,
            data: exam.history,

            pointRadius: 0,
            fill: false,
            borderWidth: 1
          },
          {
            ...this.intersectLineStyle,
            data: [
              {
                x: this.maxX,
                y: exam.y1
              },
              {
                x: -this.maxX,
                y: exam.y1
              }
            ]
          },
          {
            ...this.intersectLineStyle,
            data: [
              {
                x: exam.x1,
                y: this.maxY
              },
              {
                x: exam.x1,
                y: -this.maxY
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
