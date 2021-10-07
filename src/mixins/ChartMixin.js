import Vue from "vue";
import { mapState } from "vuex";

const colors = ["blue", "green", "red"];

export default Vue.extend({
  data() {
    return {
      colors,
      intersectLineStyle: {
        label: "",
        borderColor: "blue",
        pointBackgroundColor: "blue",
        pointRadius: 0,
        fill: false,
        borderWidth: 1,
        borderDash: [5, 5, 2, 5]
      },
      maxX: 0,
      maxY: 0
    };
  },
  computed: {
    ...mapState("exams", ["selectedExams"]),
    exams() {
      return this.selectedExams.slice(0, 3);
    },
    axesX() {
      return {
        label: "X",
        borderColor: "black",
        pointBackgroundColor: "black",
        pointRadius: 0,
        fill: false,
        borderWidth: 1,
        data: [
          {
            x: -this.maxX,
            y: 0
          },
          {
            x: this.maxX,
            y: 0
          }
        ]
      };
    },
    axes() {
      return [
        this.axesX,
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
              y: this.maxY
            },
            {
              x: 0,
              y: -this.maxY
            }
          ]
        }
      ];
    }
  },
  methods: {
    rowColor(ev) {
      return `${ev.color}--text`;
    },
    calcBarycenterCoordinates(bar, weights) {
      for (let i = 0; i < weights.length; i++) {
        bar.move(weights[i]);
      }
    },
    nextToXAngle(oppositeXAngle) {
      return 90 - Math.abs(oppositeXAngle);
    },
    oppositeXAngle({ bxL, bxR, byR, byL }) {
      const deltaX = Math.abs(bxR - bxL);
      const deltaY = Math.abs(byR - byL);
      const sqrt = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
      const angle = sqrt ? (Math.acos(deltaX / sqrt) * 180) / Math.PI : 0;
      return byR > byL ? -1 * angle : angle;
    }
  }
});
