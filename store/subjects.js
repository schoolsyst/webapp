import { getMutations, getValidator } from "./index"
import { firstBy, thenBy } from 'thenby'

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
  all: (state, getters) => state.subjects,
  one: (state, getters) => (value, prop = "uuid") =>
    state.subjects.find((o) => o[prop] === value) || null,
  orderBy: (state, getters) => (what = "hue", subjects = null) => {
    subjects = subjects || getters.all
    if(what === 'hue')
      return [...subjects].sort(
        firstBy((o) => tinycolor(o.color).toHsl().h)
          .thenBy('uuid')
      )
    return subjects
  }
}

export const mutations = {
  ...getMutations("subject"),
}

export const actions = {
  validate: getValidator({
    constraints: {
      maxLength: {
        300: ["name", "room"],
        3: ["abbreviation"]
      },
      isAColor: ["color"],
      required: ["name", "color", "abbreviation", "weight"],
      maximum: {
        1: ["goal"]
      },
      minimum: {
        0: ["goal", "weight"],
      }
    },
    customConstraints: [
      {
        message: "Veuillez ne pas mettre d'espaces dans l'abbréviation",
        field: 'abbreviation',
        constraint: (ctx, object) => {
          if (object.abbreviation.length > 3)
            return true
          return object.abbreviation.match(/^[^\s]{,3}$/) !== null
        }
      }
    ],
    fieldNames: {
      color:        { gender: 'F', name: 'couleur' },
      name:         { gender: 'M', name: 'nom' },
      abbreviation: { gender: 'F', name: 'abbréviation' },
      goal:         { gender: 'M', name: 'objectif de moyenne' },
      weight:       { gender: 'M', name: 'coefficient' },
      room:         { gender: 'F', name: 'salle' }
    },
    resourceName: { gender: 'F', name: 'matière' }
  }),
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

  async post({ commit }, subject, force = false) {
    try {
      const { data } = await this.$axios.post(`/subjects/`, subject)
      if (data) commit("ADD", data)
      console.log("[from API] POST /subjects/: OK")
    } catch (error) {
      console.error(`[from API] POST /subjects/: Error`)
      try {
        console.error(error.response.data)
      } catch (_) {
        console.error(error)
      }
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
