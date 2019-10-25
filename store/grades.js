import { firstBy } from "thenby"
import { isBefore, isWithinInterval, parseISO } from "date-fns"
import { getMutations } from "./index"

export const state = () => ({
  grades: [],
})

const parseGradeDates = (grade) => ({
  ...grade,
  added: parseISO(grade.added),
})

export const getters = {
  all: (state, getters) => getters.order(state.grades),
  one: (state, getters) => (value, prop = "uuid") =>
    getters.all.find((o) => o[prop] === value) || null,
  of: (state, getters, rootState, rootGetters) => (value, what) => {
    switch (what) {
      case "trimester":
        const trimester = rootGetters["schedule/trimester"](value)
        if (trimester === null) return []
        // Gets all the grades that have been added within the `value`th trimester
        return getters.all.filter((o) => isWithinInterval(o.added, trimester))

      default:
        return []
    }
  },
  pending: (state, getters) => getters.all.filter((o) => o.obtained === null),
  order: (state, getters) => (grades) => {
    // ↓ Makes a copy of grades to avoid mutating
    return [...grades].sort(firstBy((o1, o2) => isBefore(o1, o2)))
  },
  format: (state, getters, rootState, rootGetters) => (value) => {
    let unit = rootGetters["settings/value"]("grade_max")
    unit = unit === 100 ? "%" : `/${unit}`
    return { value, unit }
  },
  mean: (state, getters) => (grades) => {
    grades = grades.filter((o) => o.obtained !== null)
    if (!grades.length) return null
    const sumOfWeights = grades
      .map((o) => o.weight * o.subject.weight)
      .reduce((acc, cur) => acc + cur)
    const sumOfGrades = grades
      .map((o) => o.obtained * o.weight * o.subject.weight)
      .reduce((acc, cur) => acc + cur)
    return sumOfGrades / sumOfWeights
  },
  evolution: (state, getters) => (grades) => {
    /* Returns a number ∈ [0,1] that represents the relative gap between...
     * - the old mean (mean before the latest grade), and
     * - the new mean (mean with the latest grade)
     *
     * Effectively represents the relative evolution of the mean caused by the latest grade.
     */
    // Just to be sure, sort the grades
    grades = getters.order(grades)
    // Get the current mean (w/ all the grades given)
    const newMean = getters.mean(grades)
    // Get the mean w/o the latest grade
    //                                     ↓ we use .slice, .pop would mutate *the state*, which… no.
    const oldMean = getters.mean(grades.slice(0, -1))
    // Classic relative gap formula
    return (newMean - oldMean) / oldMean
  },
  currentTrimester: (state, getters, rootState, rootGetters) => {
    return getters.of(rootGetters["schedule/currentTrimester"], "trimester")
  },
  currentTrimesterMean: (state, getters, rootState, rootGetters) => {
    getters.mean(getters.currentTrimester)
  },
  currentTrimesterEvolution: (state, getters, rootState, rootGetters) =>
    getters.evolution(getters.currentTrimester),
}

export const mutations = {
  ...getMutations("grade", parseGradeDates),
}

export const actions = {
  async loadGrades({ commit }) {
    try {
      const { data } = await this.$axios.get(`/grades/`)
      // console.log(`[from API] GET /grades/: OK`)
      if (data) commit("SET", data)
    } catch (error) {
      // console.error(`[from API] GET /grades/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async postGrades({ commit }, grade) {
    try {
      const { data } = await this.$axios.get(`/grades/`)
      if (data) commit("ADD", grade)
      // console.log(`[from API] POST /grades/: OK`)
    } catch (error) {
      // console.error(`[from API] POST /grades/: Error`)
      // console.error(error.response.data)
    }
  },
  async patchGrade({ commit }, uuid, modifications) {
    try {
      const { data } = await this.$axios.patch(`/grades/${uuid}`, modifications)
      if (data) commit("PATCH", uuid, data)
      // console.log(`[from API] PATCH /grades/${uuid}: OK`)
    } catch (error) {
      // console.error(`[from API] PATCH /grades/${uuid}: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async deleteGrade({ commit }, uuid) {
    try {
      const { data } = await this.$axios.delete(`/grades/${uuid}`)
      if (data) commit("DEL", uuid)
      // console.log(`[from API] DELETE /grades/${uuid}: OK`)
    } catch (error) {
      // console.error(`[from API] DELETE /grades/${uuid}: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
}
