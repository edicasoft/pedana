import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#005264",
        secondary: "#27a3a6",
        accent: "#f58241",
        error: "#c91f24",
        success: "#629a34",
        info: "#008bc4",

        warning: "#FFC107",
        blue: "#0000ff"
      }
    }
  }
});
