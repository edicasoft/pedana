<template>
  <v-dialog :value="true" fullscreen>
    <v-card>
      <div class="d-flex align-center justify-space-between pb-3">
        <v-card-title class="pt-0 pb-0"></v-card-title>
        <v-btn @click="close" icon>
          <v-icon color="error">mdi-close-circle</v-icon></v-btn
        >
      </div>
      <v-row>
        <v-col>
          <PedanaCanvas :readingsData="data" :idx="1" />
        </v-col>
        <v-col>
          <PedanaCanvas :readingsData="data" :idx="2" />
        </v-col>
        <v-col>
          <PedanaCanvas :readingsData="data" :idx="3" />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
import PedanaCanvas from "@/components/pedana/PedanaCanvas.vue";
export default {
  props: ["data"],
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
