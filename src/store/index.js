import Vue from "vue";
import Vuex from "vuex";
import pedana from "./modules/pedana";
import exams from "./modules/exams";
import patients from "./modules/patients";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    pedana,
    exams,
    patients
  }
});
