<template>
  <v-dialog :value="value" fullscreen :style="{ zIndex: 1000 }">
    <v-card class="pa-3">
      <div class="d-flex align-center justify-space-between pb-3">
        <v-card-title class="pt-0 pb-0"></v-card-title>
        <v-btn @click="close" icon>
          <v-icon color="error">mdi-close-circle</v-icon></v-btn
        >
      </div>
      <div v-if="value">
        <div class="d-inline-block mr-3">
          <PedanaCanvas :readingsData="data" :idx="1" :resize="true" />
        </div>
        <div class="d-inline-block mr-3">
          <PedanaCanvas
            :readingsData="data.slice(1, 4)"
            :idx="2"
            :resize="true"
          />
        </div>
        <div class="d-inline-block">
          <PedanaCanvas :readingsData="data" :idx="3" :resize="true" />
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import PedanaCanvas from "@/components/pedana/PedanaCanvasImage.vue";
export default {
  props: ["data", "value"],
  components: {
    PedanaCanvas
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("update:value", false);
    }
  }
};
</script>
