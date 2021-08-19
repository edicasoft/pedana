<template>
  <v-snackbar
    :timeout="-1"
    :value="snackbar"
    left
    bottom
    color="error"
    transition="scale-transition"
  >
    <v-alert type="error" class="pa-0 ma-0">Pedana is not connected</v-alert>
    <template v-slot:action="{ attrs }">
      <v-btn color="white" v-bind="attrs" @click="snackbar = false" text icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  data() {
    return {
      snackbar: true
    };
  }
};
</script>
