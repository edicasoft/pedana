<template>
  <v-dialog :value="value" fullscreen :style="{ zIndex: 1000 }" persistent>
    <v-card class="pa-3">
      <v-toolbar dense flat>
        <v-btn icon>
          <v-icon>mdi-printer</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-spacer />
        <v-btn @click="close" icon>
          <v-icon color="error">mdi-close-circle</v-icon></v-btn
        >
      </v-toolbar>
      <div
        v-if="value"
        class="d-flex align-items-center justify-space-around pl-1"
      >
        <div v-for="(exam, idx) in selectedExams" :key="idx" class="pr-2">
          <PedanaCanvas :readingsData="exam.weightsData" :idx="idx" />
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import PedanaCanvas from "@/components/pedana/PedanaCanvasImage.vue";
import { mapState } from "vuex";
export default {
  props: ["value"],
  components: {
    PedanaCanvas
  },
  computed: {
    ...mapState("exams", ["selectedExams"])
  },
  methods: {
    close() {
      this.$emit("update:value", false);
    }
  }
};
</script>
