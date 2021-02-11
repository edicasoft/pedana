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
  CLEAR_HISTORY(state) {
    state.weights = [];
    state.generalBarycenterHistory = [];
    state.leftBarycenterHistory = [];
    state.rightBarycenterHistory = [];
  },
  SET_WEIGHTS(state, data) {
    state.weights = data;
    state.weightsHistory.push(data);
  },
  ADD_TO_HISTORY(state, { general, left, right }) {
    state.generalBarycenterHistory.push(general);
    state.leftBarycenterHistory.push(left);
    state.rightBarycenterHistory.push(right);
  }
};
const actions = {
  addToHistory({ commit }, payload) {
    commit("ADD_TO_HISTORY", payload);
  },
  readFromData({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      if (timeout) clearTimeout(timeout);
      // payload.forEach((item, i) => {
      timeout = setTimeout(() => {
        commit("SET_WEIGHTS", payload);
        resolve(payload);
      }, 100);
      // });
      console.log("end read data");
    });
  },
  getMeasurements({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("CLEAR_HISTORY");
      if (timeout) clearTimeout(timeout);
      payload.forEach((item, i) => {
        timeout = setTimeout(() => {
          commit("SET_WEIGHTS", item);
          resolve(item);
        }, i * 100);
      });
    });
  }
};
export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
