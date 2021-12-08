/* eslint-disable */
import Vue from "vue";
import { parsetWeights } from "@/common/helpers";
const state = {
  selectedExams: [],
  exams: []
};

const getters = {};
const mutations = {
  SET_SELECTED_EXAMS(store, val) {
    console.log("SET_SELECTED_EXAMS", val);
    store.selectedExams = val;
  },
  SET_EXAMS(store, val) {
    if (val && val.length) {
      val.forEach(
        exam => (exam.weights_data = parsetWeights(exam.weights_data))
      );
    }
    console.log("SET_EXAMS", val);
    store.exams = val;
  },
  ADD_EXAM(store, val) {
    val.weights_data = parsetWeights(val);
    store.exams.unshift(val);
  },
  DELETE_EXAM(store, val) {
    const idx = store.exams.findIndex(item => item.id === val.id);
    const idxSelected = store.selectedExams.findIndex(
      item => item.id === val.id
    );
    console.log("DELETE_EXAM", idx, idxSelected);
    if (idx >= 0) store.exams.splice(idx, 1);
    if (idxSelected >= 0) store.selectedExams.splice(idxSelected, 1);
  },
  UPDATE_EXAM(store, val) {
    const idx = store.exams.findIndex(item => item.id === val.id);
    console.log("UPDATE_EXAM", idx);
    val.weights_data = parsetWeights(val.weights_data);
    if (idx >= 0) Vue.set(store.exams, idx, val);
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
  },
  deleteExam({ commit }, payload) {
    commit("DELETE_EXAM", payload);
    //commit("SET_SELECTED_EXAMS", [payload]);
  },
  updateExam({ commit }, payload) {
    commit("UPDATE_EXAM", payload);
    //commit("SET_SELECTED_EXAMS", [payload]);
  }
};
export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};
