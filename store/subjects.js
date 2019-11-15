import { getMutations } from "./index"
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

  async post({ commit }, subject) {
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

  async patch({ commit }, uuid, modifications) {
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
