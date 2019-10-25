import { firstBy } from "thenby"
import { isBefore, parseISO } from "date-fns"
import { getMutations } from "./index"

export const state = () => ({
  learndatas: [],
})

const parseObjectDates = (object) => ({
  ...object,
  modified: parseISO(object.modified),
  added: parseISO(object.added),
  opened: parseISO(object.opened),
})

export const getters = {
  orderBy: (state, getters, rootState) => (learndatas, whichDate) =>
    [...learndatas].sort(
      firstBy((o1, o2) => isBefore(o1[whichDate], o2[whichDate]))
        .thenBy("name")
        .thenBy("uuid")
    ),
  all: (state) => state.learndatas,
  one: (state, getters, rootState) => (value, prop = "uuid") =>
    getters.learndatas.find((o) => o[prop] === value) || null,
  of: (state, getters) => (value, prop = "note") => {
    switch (prop) {
      case "note":
        return state.learndatas.filter((o) =>
          // If the requested note's UUID is in
          // the array of UUIDs of notes linked to that learndata
          o.notes.map((n) => n.uuid).includes(value)
        )

      case "subject":
        return state.learndatas.filter((o) => o.subject.uuid === value)

      default:
        // console.error(`[notes/learndatasOf] Unrecognized prop: ${prop}`)
        return []
    }
  },
}

export const mutations = {
  ...getMutations("learndata", parseObjectDates),
}

export const actions = {
  async load({ commit }) {
    try {
      const { data } = await this.$axios.get("/learndata/")
      // console.log("[from API] GET /learndata/: OK")
      if (data) commit("SET", data)
    } catch (error) {
      // console.error("[from API] GET /learndatas/: Error")
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async post({ commit }, learndata) {
    try {
      const { data } = await this.$axios.post("/learndata/", learndata)
      if (data) commit("ADD", data)
      // console.log("[from API] POST /learndata/: OK")
    } catch (error) {
      // console.error("[from API] POST /learndata/: Error")
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async patch({ commit }, uuid, modifications) {
    try {
      const { data } = await this.$axios.patch(
        `/learndata/${uuid}/`,
        modifications
      )
      if (data) commit("PATCH", uuid, data)
      // console.log("[from API] POST /learndata/: OK")
    } catch (error) {
      // console.error("[from API] POST /learndata/: Error")
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async delete({ commit }, uuid) {
    try {
      await this.$axios.delete(`/learndata/${uuid}/`)
      commit("DEL", uuid)
      // console.log(`[from API] DELETE /learndata/${uuid}/: OK`)
    } catch (error) {
      // console.error(`[from API] DELETE /learndata/${uuid}/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
}
