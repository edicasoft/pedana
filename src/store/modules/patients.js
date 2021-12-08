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
    commit("exams/SET_SELECTED_EXAMS", [], {root: true});

    if(payload === null){
      commit("exams/SET_EXAMS", [], {root: true});
    }
  }
};
export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
