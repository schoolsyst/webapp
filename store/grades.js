import { firstBy } from "thenby"
import { isBefore, isWithinInterval, parseISO } from "date-fns"
import { getMutations, getValidator } from "./index"

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
  of: (state, getters, rootState, rootGetters) => (value, what = 'trimester') => {
    switch (what) {
      case "trimester":
        if (![1, 2, 3].includes(value)) return []
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
  mean: (state, getters) => (grades, debug=false) => {
    let ret
    grades = grades.filter((o) => o.obtained !== null)
    if (!grades.length) ret = null
    else {
    const sumOfWeights = grades
      .map((o) => o.weight * o.subject.weight)
      .reduce((acc, cur) => acc + cur)
    const sumOfGrades = grades
      .map((o) => o.obtained * o.weight * o.subject.weight)
      .reduce((acc, cur) => acc + cur)

    ret = sumOfGrades / sumOfWeights
  }
  console.log(`{${new Date().getMilliseconds()}} ${ret}`)
  return ret
  },
  evolution: (state, getters) => (grades) => {
    /* Returns a number ∈ [0,1] that represents the relative gap between...
     * - the old mean (mean before the latest grade), and
     * - the new mean (mean with the latest grade)
     *
     * Effectively represents the relative evolution of the mean caused by the latest grade.
     */
    // Just to be sure, sort the grades
    // Also remove notes that have no `obtained` score (see `const oldMean = `) for why
    grades = getters.order(grades).filter((o) => !!o.obtained)
    if (!grades.length) return null
    // Get the current mean (w/ all the grades given)
    const newMean = getters.mean(grades)
    // Get the mean w/o the latest grade *that has been obtained*
    //                                     ↓ we use .slice, .pop would mutate *the state*, which… no.
    const oldMean = getters.mean(grades.slice(0, -1))
    // Classic relative gap formula
    return (newMean - oldMean) / oldMean
  },
  currentTrimester: (state, getters, rootState, rootGetters) => {
    return getters.of(rootGetters["schedule/currentTrimester"], "trimester")
  },
  currentTrimesterMean: (state, getters, rootState, rootGetters) =>
    getters.mean(getters.currentTrimester),
  currentTrimesterEvolution: (state, getters, rootState, rootGetters) =>
    getters.evolution(getters.currentTrimester),
  display: (state, getters, rootState, rootGetters) => (grade, unit=null, precision=2, abs=false) => {
    if (!grade && grade !== 0) return '—'
    grade = abs ? ~~grade : grade
    unit = unit || rootGetters['settings/value']('grade_max')
    return (grade * unit).toFixed(precision).replace('.', ',')
  },
  absoluteUnit: (state, getters) => (value, unit=null) => {
    unit = unit || rootGetters['settings/value']('grade_max')
    return value / unit
  }
}

export const mutations = {
  ...getMutations("grade", parseGradeDates),
}

export const actions = {
  async load({ commit, state }, force = false) {
    if (!force && state.grades.length) return
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
  async post({ commit, dispatch }, grade, force = false) {
    if(!force) {
      const validation = await dispatch('validate', grade)
      if(!validation.validated) return validation
    }
    try {
      const { data } = await this.$axios.get(`/grades/`)
      if (data) commit("ADD", grade)
      // console.log(`[from API] POST /grades/: OK`)
    } catch (error) {
      // console.error(`[from API] POST /grades/: Error`)
      // console.error(error.response.data)
    }
  },

  validate: getValidator({
    constraints: {
      maxLength: {
        300: ["name"]
      },
      minimum: {
        0: ["obtained", "expected", "goal", "weight"],
        1: ["unit"]
      },
      maximum: {
        1: ["obtained", "expected", "goal"],
      },
      required: ["name"],
    },
    fieldNames: {
      name:     { gender: "M", name: "nom" },
      obtained: { gender: "F", name: "note obtenue" },
      expected: { gender: "F", name: "note estimée" },
      goal:     { gender: "M", name: "objectif" },
      weight:   { gender: "M", name: "coefficient" },
      unit:     { gender: "F", name: "unité" },
    },
    resourceName: { gender: "F", name: "note" }
  }),

  async patch({ commit, dispatch, getters }, uuid, modifications, force = false) {
    if(!force) {
      let grade = getters.one(uuid)
      grade = {...grade, ...modifications}
      const validation = await dispatch('validate', grade)
      if(!validation.validated) return validation
    }
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
  async delete({ commit }, uuid) {
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
