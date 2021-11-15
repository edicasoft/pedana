<template>
  <v-snackbar
    :timeout="-1"
    :value="true"
    left
    bottom
    color="info"
    transition="scale-transition"
    height="30"
  >
    <v-alert type="info" class="pa-0 ma-0">
      Connecting...
    </v-alert>
  </v-snackbar>
</template>
