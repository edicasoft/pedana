/* eslint-disable */
const state = {
  selectedExams: [],
  exams: []
};
function splitArrayIntoChunksOfLen(arr, len) {
  var chunks = [],
    i = 0,
    n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
}
function convertWeights(weights_data = "") {
  return splitArrayIntoChunksOfLen(
    weights_data.split(",").map(el => parseFloat(el)),
    6
  );
}
const getters = {};
const mutations = {
  SET_SELECTED_EXAMS(store, val) {
    console.log("SET_SELECTED_EXAMS", val);
    store.selectedExams = val;
  },
  SET_EXAMS(store, val) {
    if (val && val.length) {
      val.forEach(
        exam => (exam.weights_data = convertWeights(exam.weights_data))
      );
    }
    console.log("SET_EXAMS", val);
    store.exams = val;
  },
  ADD_EXAM(store, val) {
    val.weights_data = convertWeights(val);
    store.exams.unshift(val);
  }
};
const actions = {
  setSelectedExams({ commit }, payload) {
    commit("SET_SELECTED_EXAMS", payload);
  },
  setExams({ commit }, payload) {
    commit("SET_EXAMS", payload);
  },
  addExam({ commit }, payload) {
    commit("ADD_EXAM", payload);
    commit("SET_SELECTED_EXAMS", [payload]);
  }
};
export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
