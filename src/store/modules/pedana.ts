let timeout;

const state = {
  weights: [],
  weightsHistory: [],
  generalBarycenterHistory: [],
  leftBarycenterHistory: [],
  rightBarycenterHistory: [],
  isLoading: false
};
const getters = {};
const mutations = {
  REWIND(state, idx: number) {
    //set new weights and weightsHistory
    state.weights = state.weightsHistory[idx];
    state.weightsHistory.length = idx + 1;
    //move two steps back, because later we will move one step forward with move()
    // -1 = -2 + 1
    state.generalBarycenterHistory.length = idx;
    state.leftBarycenterHistory.length = idx;
    state.rightBarycenterHistory.length = idx;
  },
  CLEAR_HISTORY(state) {
    state.weights = [];
    state.weightsHistory = [];
    state.generalBarycenterHistory = [];
    state.leftBarycenterHistory = [];
    state.rightBarycenterHistory = [];
  },
  SET_WEIGHTS(state, data) {
    state.weights = data;
    state.weightsHistory.push(data);
    console.log("SET_WEIGHTS", state.weightsHistory);
  },
  ADD_BARYCENTERS_TO_HISTORY(state, { general, left, right }) {
    state.generalBarycenterHistory.push(general);
    state.leftBarycenterHistory.push(left);
    state.rightBarycenterHistory.push(right);
  },
  SET_IS_LOADING(state, val) {
    state.isLoading = val;
  }
};
const actions = {
  addBarycentersToHistory({ commit }, payload) {
    commit("ADD_BARYCENTERS_TO_HISTORY", payload);
  },
  rewindData({ commit, state }, idx) {
    commit("REWIND", idx);
    return state.weightsHistory;
  },
  setWeights({ commit }, payload) {
    console.log("setWeights action");
    commit("SET_WEIGHTS", payload);
  },
  //TODO::check interval on desktop app
  simulateReadFromPedana({ commit }, payload) {
    console.log("simulateReadFromPedana");

    return new Promise(resolve => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        commit("SET_WEIGHTS", payload);
        resolve(payload);
      }, 1000 / 10);
      //console.log("end read data");
    });
  },
  setMeasurements({ commit }, payload) {
    console.log("setMeasurements");
    commit("SET_WEIGHTS", payload);
  },
  setIsLoading({ commit }, payload) {
    commit("SET_IS_LOADING", payload);
  }
};
export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
