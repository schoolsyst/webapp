import { firstBy } from "thenby";
import groupBy from "lodash.groupby";
import { isSameWeek, differenceInWeeks, parse, parseISO } from "date-fns";

export const state = () => ({
  homework: []
});

export const getters = {
  all: (state, getters) => getters.order(state.homework),
  one: (state, getters) => (value, prop = "uuid") =>
    getters.homeworks.find(o => o[prop] === value) || null,
  nextWeek: (state, getters, rootState) =>
    getters.all.filter(o => differenceInWeeks(o.due, rootState.now) == 1),
  currentWeek: (state, getters, rootState) =>
    getters.all.filter(o => isSameWeek(o.due, rootState.now)),
  currentOrNextWeek: (state, getters, rootState, rootGetters) => [
    ...getters.currentWeek,
    ...getters.nextWeek
  ],
  pending: (state, getters, rootState) =>
    getters.currentOrNextWeek.filter(o => o.progress != 1),
  order: (state, getters, rootState) => homeworks =>
    [...homeworks].sort(
      firstBy((o1, o2) => o1.due.isBefore(o2.due))
        .thenBy(o => o.subject.weight)
        .thenBy("uuid")
    ),
  group: (state, getters, rootState) => homeworks => groupBy(homeworks, "due"),
  grouped: (state, getters, rootState) => getters.group(getters.all),
  only: (state, getters, rootState) => (homeworks, what) => {
    let isTest = ["test", "tests"].includes(what);
    homeworks.filter(o => o.is_test === isTest);
  },
  exercises: (state, getters, rootState) =>
    getters.only(getters.all, "exercises"),
  tests: (state, getters, rootState) => getters.only(getters.all, "tests"),
  counts: (state, getters, rootState) => ({
    exercises: getters.only(getters.pending, "exercises"),
    tests: getters.only(getters.currentOrNextWeek, "tests")
  })
};

export const mutations = {
  SET_HOMEWORKS: (state, homeworks) =>
    (state.homeworks = homeworks.forEach(
      o => (o.due = parseISO(o.due))
    )),
  ADD_HOMEWORK: (state, homework) => state.homeworks.push(subject),
  DEL_HOMEWORK: (state, uuid) =>
    (state.homeworks = state.homeworks.filter(o => o.uuid !== uuid)),
  PATCH_HOMEWORK: (state, uuid, modifications) => {
    // Get the requested homework's index in the state array
    let idx = state.homeworks.map(o => o.uuid).indexOf(uuid);
    // Apply modifications
    Object.assign(state.homeworks[idx], modifications);
  }
};

export const actions = {
  async loadHomework({ commit }) {
    try {
      const { data } = await this.$axios.get(`/homework/`);
      console.log(`[from API] GET /homework/: OK`);
      if (data) commit("SET_HOMEWORKS", data);
    } catch (error) {
      console.error(`[from API] GET /homework/: Error`);
      try {
        console.error(error.response.data);
      } catch (_) {
        console.error(error)
      }
    }
  },

  async postHomework({ commit }, homework) {
    try {
      const { data } = await this.$axios.post(`/homework/`, homework);
      if (data) commit("ADD_HOMEWORK", homework);
    } catch (error) {}
  }
};
