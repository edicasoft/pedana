import Vue from "vue";
export default Vue.extend({
  data() {
    return {
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
    axes() {
      return [
        {
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
  }
});
