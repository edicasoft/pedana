<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet class="viewport" :width="width" :height="height">
          <canvas id="barycenters-layer"> </canvas>
          <BackgroundLayer :width="width" :height="height" />
        </v-sheet>
        <v-sheet :width="width">
          <div class="d-flex justify-space-around align-center">
            <div class="text-left w-100">
              Left: <b>{{ toFixed2(leftPlatformTotalWeight) }}</b>
            </div>
            <div class="d-flex align-items-center align-center">
              <v-icon
                color="red"
                v-if="leftPlatformTotalWeight > rightPlatformTotalWeight"
              >
                mdi-menu-left
              </v-icon>

              <div class="text-center w-100">
                Total: <b>{{ toFixed2(totalWeight) }}</b>
              </div>
              <v-icon
                large
                color="red"
                v-if="rightPlatformTotalWeight > leftPlatformTotalWeight"
              >
                mdi-menu-right</v-icon
              >
            </div>

            <div class="text-right w-100">
              Right: <b>{{ toFixed2(rightPlatformTotalWeight) }}</b>
            </div>
          </div>
        </v-sheet>
      </v-col>
      <v-col>
        <main-chart></main-chart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Barycenter from "@/entities/Barycenter";
import { Cell } from "@/entities/Cell";
import Canvas from "@/entities/Canvas";
import { total, toFixed2 } from "@/common/helpers";
import Vue from "vue";
import { leftPlatformCells, rightPlatformCells } from "@/common/constants.js";
import { mapState, mapGetters, mapActions } from "vuex";
import BackgroundLayer from "@/components/pedana/BackgroundLayer.vue";
import MainChart from "@/components/charts/MainChart.vue";

const cells = leftPlatformCells.concat(rightPlatformCells);
let c: Canvas;
let ctx: CanvasRenderingContext2D;

export default Vue.extend({
  name: "Pedana",
  components: {
    BackgroundLayer,
    MainChart
  },
  data: () => ({
    width: 600,
    height: 600,
    zoom: 1
    //****IDEAL WEIGHTS****
    //  leftWeights: [11.1, 11.1, 11.1],
    //rightWeights: [11.1, 11.1, 11.1],

    // leftWeights: [11.6, 12.1, 7.9],
    // rightWeights: [13.2, 14.1, 7.7],

    // generalBarycenter: new Barycenter(
    //   leftPlatformCells.concat(rightPlatformCells),
    //   "red"
    // ),
    // leftBarycenter: new Barycenter(leftPlatformCells, "gold"),
    // rightBarycenter: new Barycenter(rightPlatformCells, "gold")
  }),
  computed: {
    ...mapGetters("pedana", ["leftWeights", "rightWeights"]),
    ...mapState("pedana", [
      "generalBarycenter",
      "leftBarycenter",
      "rightBarycenter",
      "generalBarycenterCoordinates"
    ]),

    weights(): number[] {
      return this.leftWeights.concat(this.rightWeights);
    },
    totalWeight(): number {
      return total(this.weights);
    },
    leftPlatformTotalWeight(): number {
      return total(this.leftWeights);
    },
    rightPlatformTotalWeight(): number {
      return total(this.rightWeights);
    }
  },
  watch: {
    generalBarycenterCoordinates(val) {
      // console.log(val);
      // this.update();
    }
  },
  async mounted() {
    c = new Canvas("barycenters-layer", 600, 600);
    ctx = c.ctx;
    try {
      const res = await this.getMeasurement();
      window.addEventListener("load", () => {
        this.update();
      });
    } catch (e) {
      console.log(e);
    }

    // (function() {
    //   const requestAnimationFrame =
    //     window.requestAnimationFrame ||
    //     window.mozRequestAnimationFrame ||
    //     window.webkitRequestAnimationFrame ||
    //     window.msRequestAnimationFrame;

    //   window.requestAnimationFrame = requestAnimationFrame;

    //   const cvs = new CVS();
    // })();
  },
  methods: {
    toFixed2,
    ...mapActions("pedana", ["getMeasurement"]),
    connectBarycenters() {
      c.drawLine(this.leftBarycenter, this.rightBarycenter, "red");
    },
    displayWeights() {
      if (this.weights.length === 0) return;
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.save();

      for (let i = 0; i < cells.length; i++) {
        const cell = new Cell(cells[i], this.weights[i]);
        cell.draw(ctx, this.totalWeight);

        let x = this.width / 2 + cells[i].x;
        let y = this.height / 2 - cells[i].y;

        if (cells[i].y < 0) {
          y += 20;
          if (cells[i].x > 0) x += 20;
        } else {
          y -= 20;
        }
        if (cells[i].x < 0) {
          x -= 30;
          if (cells[i].y < 0) x -= 20;
        }
        ctx.fillText(this.toFixed2(this.weights[i]).toString(), x, y);
      }
      ctx.restore();
    },
    update(): void {
      c.clear();
      this.displayWeights();

      c.transdormCoordinates();

      // this.drawLeftPlatform();
      // this.drawRightPlatform();

      //  this.generalBarycenter.move(this.weights);
      // this.leftBarycenter.move(this.leftWeights);
      // this.rightBarycenter.move(this.rightWeights);

      this.connectBarycenters();
      console.log("draw");
      this.leftBarycenter.draw(ctx);
      this.generalBarycenter.draw(ctx);
      this.rightBarycenter.draw(ctx);

      // requestAnimationFrame(() => {
      //   this.update();
      // });
    }
  }
});
</script>
