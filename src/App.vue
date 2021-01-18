<template>
  <v-app>
    <v-main>
      <Pedana />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Pedana from "./components/Pedana.vue";

export default Vue.extend({
  name: "App",

  components: {
    Pedana
  },

  data: () => ({
    //
  })
});
</script>
