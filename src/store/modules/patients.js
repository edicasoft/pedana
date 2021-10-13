//TODO::deselect patient if it was deleted
/* eslint-disable */
const state = {
  selectedPatient: null
};
const getters = {};
const mutations = {
  SET_SELECTED_PATIENT(store, val) {
    store.selectedPatient = val;
  }
};
const actions = {
  selectPatient({ commit }, payload) {
    commit("SET_SELECTED_PATIENT", payload);
  }
};
export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
