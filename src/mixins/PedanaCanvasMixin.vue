<script>
import { total } from "@/common/helpers";
const cells = leftPlatformCells.concat(rightPlatformCells);

export default {
  computed: {
    leftWeights() {
      return this.weights.slice(0, 3);
    },
    rightWeights() {
      return this.weights.slice(3, 6);
    },
    totalWeight() {
      return total(this.weights);
    },
    leftPlatformTotalWeight() {
      return total(this.leftWeights);
    },
    rightPlatformTotalWeight() {
      return total(this.rightWeights);
    }
  },
  methods: {
    displayWeights() {
      if (this.weights.length === 0) return;
      this.ctx.fillStyle = "black";
      this.ctx.font = "16px Arial";
      this.ctx.save();
      for (let i = 0; i < cells.length; i++) {
        this.$nextTick(() => {
          const cell = new Cell(cells[i], this.weights[i]);
          cell.draw(c, this.totalWeight);
        });

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
        this.ctx.fillText(this.displayNumber(this.weights[i]).toString(), x, y);
      }
      this.ctx.restore();
    }
  }
};
</script>
