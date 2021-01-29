<template>
  <v-container>
    <v-sheet class="viewport" :width="width" :height="height">
      <canvas id="barycenters-layer"> </canvas>
      <BackgroundLayer :width="width" :height="height" />
    </v-sheet>
    <v-sheet :width="width">
      <div class="d-flex justify-space-around align-center">
        <div class="text-left w-100">
          Left: <b>{{ leftPlatformTotalWeight }}</b>
        </div>
        <div class="d-flex align-items-center align-center">
          <v-icon
            color="red"
            v-if="leftPlatformTotalWeight > rightPlatformTotalWeight"
          >
            mdi-menu-left
          </v-icon>

          <div class="text-center w-100">
            Total: <b>{{ totalWeight }}</b>
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
          Right: <b>{{ rightPlatformTotalWeight }}</b>
        </div>
      </div>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
import Barycenter from "@/entities/Barycenter";
import { Cell } from "@/entities/Cell";
import Canvas from "@/entities/Canvas";
import { total } from "@/common/helpers";
import Vue from "vue";
import { leftPlatformCells, rightPlatformCells } from "@/common/constants.js";
import { mapState, mapGetters } from "vuex";
import BackgroundLayer from "@/components/pedana/BackgroundLayer.vue";
const cells = leftPlatformCells.concat(rightPlatformCells);
let c: Canvas;
let ctx: CanvasRenderingContext2D;

export default Vue.extend({
  name: "Pedana",
  components: {
    BackgroundLayer,
  },
  data: () => ({
    width: 600,
    height: 600,
    zoom: 1,
    //****IDEAL WEIGHTS****
    //  leftWeights: [11.1, 11.1, 11.1],
    //rightWeights: [11.1, 11.1, 11.1],

    // leftWeights: [11.6, 12.1, 7.9],
    // rightWeights: [13.2, 14.1, 7.7],

    generalBarycenter: new Barycenter(
      leftPlatformCells.concat(rightPlatformCells),
      "red"
    ),
    leftBarycenter: new Barycenter(leftPlatformCells, "gold"),
    rightBarycenter: new Barycenter(rightPlatformCells, "gold"),
  }),
  computed: {
    ...mapState("pedana", ["measurements", "currentMeasurement"]),
    ...mapGetters("pedana", ["leftWeights", "rightWeights"]),

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
    },
  },
  mounted() {
    c = new Canvas("barycenters-layer", 600, 600);
    ctx = c.ctx;
    window.addEventListener("load", () => {
      this.update();
    });
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
    connectBarycenters() {
      c.drawLine(this.leftBarycenter, this.rightBarycenter, "red");
    },
    displayWeights() {
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
          if (cells[i].y < 0) x -= 10;
        }
        ctx.fillText(this.weights[i].toString(), x, y);
      }
      ctx.restore();
    },
    update(): void {
      c.clear();
      this.displayWeights();

      c.transdormCoordinates();

      // this.drawLeftPlatform();
      // this.drawRightPlatform();

      this.generalBarycenter.move(this.weights);
      this.leftBarycenter.move(this.leftWeights);
      this.rightBarycenter.move(this.rightWeights);
      this.connectBarycenters();

      this.leftBarycenter.draw(ctx);
      this.generalBarycenter.draw(ctx);
      this.rightBarycenter.draw(ctx);

      // requestAnimationFrame(() => {
      //   this.update();
      // });
    },
  },
});
</script>
