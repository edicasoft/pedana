<template>
  <!-- <div class="d-flex justify-space-around align-center">
    <div class="text-left w-100">
      Left: <b>{{ displayNumber(leftPlatformTotalWeight) }}</b>
    </div>
    <div class="d-flex align-items-center align-center">
      <v-icon
        color="red"
        v-if="leftPlatformTotalWeight > rightPlatformTotalWeight"
      >
        mdi-menu-left
      </v-icon>

      <div class="text-center w-100">
        Diff:
        <b>{{
          displayNumber(
            Math.abs(rightPlatformTotalWeight - leftPlatformTotalWeight)
          )
        }}</b>
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
      Right: <b>{{ displayNumber(rightPlatformTotalWeight) }}</b>
    </div>
  </div> -->
  <canvas :id="id"> </canvas>
</template>
<script>
import Canvas from "@/entities/Canvas";
import Vue, { VueConstructor } from "vue";
import { displayNumber } from "@/common/helpers";
import Pedana from "@/components/pedana/Pedana.vue";

import {
  canvasSmoothCoef,
  pedanaWidth,
  pedanaHeight
} from "@/common/constants.js";

export default Vue.extend({
  name: "BackgrounfLayer",
  props: ["left", "right", "id"],
  watch: {
    difference: {
      handler() {
        this.draw();
      }
    }
  },
  data: () => ({
    c: null
  }),
  mounted() {
    console.log(this.id);

    this.c = new Canvas(this.id, pedanaWidth, 40, ["img/triangle-orange.png"]);
    this.c.preloadImages(this.draw);

    console.log(this.c);
  },
  computed: {
    difference() {
      if (this.right != null && this.left != null)
        return Math.abs(this.right - this.left);
      else return null;
    }
  },
  methods: {
    drawTrianlge() {
      if (this.left == this.right) return;
      const image = this.c.images.get(`img/triangle-orange.png`);
      console.log(image);

      this.c.ctx.save();
      const width = 26;
      const height = 23;
      if (this.right > this.left) {
        this.c.ctx.translate(pedanaWidth / 2 + 90, 13);
        this.c.ctx.rotate(Math.PI / 180);
      } else if (this.left > this.right) {
        this.c.ctx.translate(pedanaWidth / 2 - 90, 13);
        this.c.ctx.rotate((-180 * Math.PI) / 180);
      }

      this.c.ctx.drawImage(image, -width / 2, -height / 2, width, height);
      this.c.ctx.restore();
    },
    draw() {
      if (this.difference == null) return;
      this.c.clear();
      this.c.drawText(
        `Left: `,
        {
          x: 20,
          y: 20
        },
        "black",
        "600 16px Arial"
      );
      this.c.drawText(
        `${this.left}`,
        {
          x: 60,
          y: 20
        },
        "black",
        "16px Arial"
      );
      this.c.drawText(
        `Overload: `,
        {
          x: pedanaWidth / 2 - 50,
          y: 20
        },
        "black",
        "600 16px Arial"
      );
      this.c.drawText(
        `${displayNumber(this.difference)}`,
        {
          x: pedanaWidth / 2 + 30,
          y: 20
        },
        "black",
        "16px Arial"
      );
      this.drawTrianlge();

      this.c.drawText(
        `Right: `,
        {
          x: pedanaWidth - 110,
          y: 20
        },
        "black",
        "600 16px Arial"
      );
      this.c.drawText(
        `${this.right}`,
        {
          x: pedanaWidth - 60,
          y: 20
        },
        "black",
        "16px Arial"
      );
      console.log("draw");
    }
  }
});
</script>
