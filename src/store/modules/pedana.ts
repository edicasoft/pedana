let timeout;

const state = {
  weights: [],
  weightsHistory: [],
  generalBarycenterHistory: [],
  leftBarycenterHistory: [],
  rightBarycenterHistory: []
};
const getters = {
  leftWeights: state => state.weights.slice(0, 3),
  rightWeights: state => state.weights.slice(3, 6)
};
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
  //TODO::check interval on desktop app
  readFromData({ commit }, payload) {
    return new Promise(resolve => {
      if (timeout) clearTimeout(timeout);
      // payload.forEach((item, i) => {
      timeout = setTimeout(() => {
        commit("SET_WEIGHTS", payload);
        resolve(payload);
      }, 1000 / 10);
      // });
      //console.log("end read data");
    });
  }
  // getMeasurements({ commit }, payload) {
  //   return new Promise((resolve, reject) => {
  //     commit("CLEAR_HISTORY");
  //     if (timeout) clearTimeout(timeout);
  //     payload.forEach((item, i) => {
  //       timeout = setTimeout(() => {
  //         commit("SET_WEIGHTS", item);
  //         resolve(item);
  //       }, i * 100);
  //     });
  //   });
  // }
};
export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
