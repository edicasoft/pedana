import Vue from "vue";
import Vuex from "vuex";
import pedana from "./modules/pedana";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    pedana,
  },
});
