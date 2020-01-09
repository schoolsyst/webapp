import { getMutations, getValidator } from "./index"
import { firstBy, thenBy } from 'thenby'
import tinycolor from 'tinycolor2'

export const state = () => ({
  subjects: [],
  placeholder: {
    color: "black",
    abbreviation: "...",
    name: "Veuillez sélectionner une matière…",
    _isPlaceholder: true,
  }
})

export const getters = {
  all: (state, getters) => getters.orderBy('hue', state.subjects),
  one: (state, getters) => (value, prop = "uuid") =>
    state.subjects.find((o) => o[prop] === value) || null,
  orderBy: (state, getters) => (what = "hue", subjects = null) => {
    const sorters = {
      hue: firstBy((o) => tinycolor(o.color).toHsl().h),
      weight: firstBy('weight'),
      uuid: firstBy('uuid'),
    }

    if (!sorters.hasOwnProperty(what)) {
      console.warn(`subjects/orderBy: unknown ordering method '${what}': defaulting to UUID sorting`)
      what = 'uuid'
    }

    return [...subjects].sort(sorters[what].thenBy('uuid'))
  },
  lowercaseName: ({}, { one }) => (value, prop = 'uuid') => {
    let subject = one(value, prop)
    if (!subject) return null
    let name = subject.name
    const isAllUppercase = name.toUpperCase() === name
    if (!isAllUppercase) name = name.toLowerCase()
    return name
  },
  validate: getValidator({
    constraints: {
      maxLength: {
        300: ["name", "room"],
      },
      isAColor: ["color"],
      required: ["name", "color", "weight"],
      maximum: {
        1: ["goal"]
      },
      minimum: {
        0: ["goal", "weight"],
      }
    },
    customConstraints: [
      // {
      //   message: "Il y a déjà une matière avec ce nom",
      //   field: 'name',
      //   constraint: (getters, object) => {
      //     return !getters.all.map(s => s.name).includes(object.name)
      //   }
      // }
    ],
    fieldNames: {
      color:        { gender: 'F', name: 'couleur' },
      name:         { gender: 'M', name: 'nom' },
      goal:         { gender: 'M', name: 'objectif de moyenne' },
      weight:       { gender: 'M', name: 'coefficient' },
      room:         { gender: 'F', name: 'salle' }
    },
    resourceName: { gender: 'F', name: 'matière' }
  }),
}

export const mutations = {
  ...getMutations("subject"),
}

export const actions = {
  async load({ commit, state }, force = false) {
    if (!force && state.subjects.length) return
    console.log(window)
    try {
      const { data } = await this.$axios.get(`/subjects/`)
      console.log(`[from API] GET /subjects/: OK`)
      if (data) commit("SET", data)
    } catch (error) {
      console.error(`[from API] GET /subjects/: Error`)
      try {
        console.error(error.response.data)
      } catch (_) {
        console.error(error)
      }
    }
  },

  async post({ commit, getters }, {subject, force}) {
    force = force || false
    if(!force) {
      let validation = getters.validate(subject)
      if (!validation.validated) return validation
    }
    try {
      const res = await this.$axios.post(`/subjects/`, subject)
      const { data } = await this.$axios.get(`/subjects/${res.data.uuid}`)
      if (data) commit("ADD", data)
    } catch (error) {
      console.error(error)
    }
  },

  async patch({ commit }, uuid, modifications, force = false) {
    try {
      const { data } = await this.$axios.patch(
        `/subjects/${uuid}/`,
        modifications
      )
      if (data) commit("PATCH", uuid, data)
      console.log(`[from API] PATCH /subjects/${uuid}/: OK`)
    } catch (error) {
      console.error(`[from API] PATCH /subjects/${uuid}/: Error`)
      try {
        console.error(error.response.data)
      } catch (_) {
        console.error(error)
      }
    }
  },

  async delete({ commit }, uuid) {
    try {
      const { data } = await this.$axios.delete(`/subjects/${uuid}/`)
      if (data) commit("DEL", uuid)
      console.log(`[from API] DELETE /subjects/${uuid}/: OK`)
    } catch (error) {
      console.error(`[from API] DELETE /subjects/${uuid}/: Error`)
      try {
        console.error(error.response.data)
      } catch (_) {
        console.error(error)
      }
    }
  },
}
