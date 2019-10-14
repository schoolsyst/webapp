import { firstBy } from "thenby";
import { isBefore, isWithinInterval, parseISO } from "date-fns";

export const state = () => ({
  grades: []
});

export const getters = {
  all: (state, getters) => getters.order(state.grades),
  one: (state, getters) => (value, prop = "uuid") =>
    getters.all.find(o => o[prop] === value) || null,
  of: (state, getters, rootState, rootGetters) => (value, what) => {
    switch (what) {
      case "trimester":
        let trimester = rootGetters["schedule/trimester"](value);
        if (trimester === null) return [];
        // Gets all the grades that have been added within the `value`th trimester
        return getters.all.filter(o => isWithinInterval(o.added, trimester));

      default:
        return [];
    }
  },
  pending: (state, getters) => getters.all.filter(o => o.obtained === null),
  order: (state, getters) => grades => {
    // ↓ Makes a copy of grades to avoid mutating
    return [...grades].sort(firstBy((o1, o2) => isBefore(o1, o2)));
  },
  mean: (state, getters) => grades => {
    grades = grades.filter(o => o.obtained !== null);
    if (!grades.length) return null;
    let sumOfWeights = grades
      .map(o => o.weight * o.subject.weight)
      .reduce((acc, cur) => acc + cur);
    let sumOfGrades = grades
      .map(o => o.obtained * o.weight * o.subject.weight)
      .reduce((acc, cur) => acc + cur);
    return sumOfGrades / sumOfWeights;
  },
  evolution: (state, getters) => grades => {
    /* Returns a number ∈ [0,1] that represents the relative gap between...
     * - the old mean (mean before the latest grade), and
     * - the new mean (mean with the latest grade)
     *
     * Effectively represents the relative evolution of the mean caused by the latest grade.
     */
    // Just to be sure, sort the grades
    grades = getters.order(grades);
    // Get the current mean (w/ all the grades given)
    let newMean = getters.mean(grades);
    // Get the mean w/o the latest grade
    //                                   ↓ we use .slice, .pop would mutate *the state*, which… no.
    let oldMean = getters.mean(grades.slice(0, -1));
    // Classic relative gap formula
    return (newMean - oldMean) / oldMean;
  },
  currentTrimester: (state, getters, rootState, rootGetters) => {
    return getters.of(rootGetters["schedule/currentTrimester"], "trimester");
  },
  currentTrimesterMean: (state, getters, rootState, rootGetters) => {
    getters.mean(getters.currentTrimester);
  },
  currentTrimesterEvolution: (state, getters, rootState, rootGetters) =>
    getters.evolution(getters.currentTrimester)
};

export const mutations = {
  SET_GRADES: (state, grades) => {
    let _grades = [];
    grades.forEach(grade => {
      _grades.push({
        ...grade,
        added: parseISO(grade.added)
      });
    });
    state.grades = _grades;
  },
  ADD_GRADE: (state, grade) => state.grades.push(subject),
  DEL_GRADE: (state, uuid) =>
    (state.grades = state.grades.filter(o => o.uuid !== uuid)),
  PATCH_GRADE: (state, uuid, modifications) => {
    // Get the requested grade's index in the state array
    let idx = state.grades.map(o => o.uuid).indexOf(uuid);
    // Apply modifications
    Object.assign(state.grades[idx], modifications);
  }
};

export const actions = {
  async loadGrades({ commit }) {
    try {
      const { data } = await this.$axios.get(`/grades/`);
      console.log(`[from API] GET /grades/: OK`);
      if (data) commit("SET_GRADES", data);
    } catch (error) {
      console.error(`[from API] GET /grades/: Error`);
      try {
        console.error(error.response.data);
      } catch (_) {
        console.error(error);
      }
    }
  },
  async postGrades({ commit }, grade) {
    try {
      const { data } = await this.$axios.get(`/grades/`);
      if (data) commit("ADD_GRADES", grade);
      console.log(`[from API] POST /grades/: OK`);
    } catch (error) {
      console.error(`[from API] POST /grades/: Error`);
      console.error(error.response.data);
    }
  }
};
