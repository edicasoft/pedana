<template>
  <v-dialog :value="value" fullscreen :style="{ zIndex: 1000 }" persistent>
    <v-card class="pa-3">
      <v-toolbar dense flat>
        <v-btn icon @click="print">
          <v-icon>mdi-printer</v-icon>
        </v-btn>
        <v-btn icon @click="saveAsPdf">
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
        <div v-for="(exam, idx) in exams" :key="idx" class="pr-2">
          <PedanaCanvas
            ref="exam"
            :exam="exam"
            :idx="idx"
            :patient="selectedPatient"
          />
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import PedanaCanvas from "@/components/pedana/PedanaCanvasImage.vue";
import { mapState } from "vuex";
import { ipcRenderer } from "electron";

export default {
  props: ["value"],
  components: {
    PedanaCanvas
  },
  computed: {
    ...mapState("exams", ["selectedExams"]),
    ...mapState("patients", ["selectedPatient"]),
    exams() {
      return this.selectedExams.slice(0, 3);
    }
  },
  methods: {
    close() {
      this.$emit("update:value", false);
    },
    prepareData() {
      const res = [];
      for (let i = 0; i < this.exams.length; i++) {
        const image = this.$refs.exam[i].combineCanvasesToImage();
        res.push({
          ...this.exams[i],
          image
        });
      }
      return res;
    },
    saveAsPdf() {
      ipcRenderer.send(
        "canvas:pdf",
        this.prepareData(),
        this.selectedPatient ? this.selectedPatient.fullname : ""
      );
    },
    print() {
      ipcRenderer.send(
        "canvas:print",
        this.prepareData(),
        this.selectedPatient ? this.selectedPatient.fullname : ""
      );
      console.log("print");
    }
  }
};
</script>
