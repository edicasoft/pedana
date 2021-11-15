<template>
  <v-snackbar
    app
    :rounded="false"
    :timeout="-1"
    :value="snackbar"
    left
    bottom
    color="error"
    class="ma-0"
    transition="scale-transition"
    height="30"
  >
    <v-alert type="error" class="pa-0 ma-0">{{ message }}</v-alert>
    <template v-slot:action="{ attrs }">
      <v-btn color="white" v-bind="attrs" @click="snackbar = false" text icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  props: ["message"],
  data() {
    return {
      snackbar: true
    };
  }
};
</script>
