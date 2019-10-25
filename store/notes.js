import { firstBy } from "thenby"
import { isBefore, parseISO } from "date-fns"
import JsSearch from "js-search"
import { getMutations } from "./index"

export const state = () => ({
  notes: [],
  learndatas: [],
})

const parseObjectDates = (object) => ({
  ...object,
  modified: parseISO(object.modified),
  added: parseISO(object.added),
  opened: parseISO(object.opened),
})

export const getters = {
  all: (state, getters) => state.notes,
  one: (state, getters) => (value, prop = "uuid") =>
    getters.notes.find((o) => o[prop] === value) || null,
  of: (state, getters) => (value, what = "subject") => {
    if (what === "subject") {
      return getters.notes.all.filter((o) => o.subject.uuid === value)
    } else {
      return getters.notes.all.filter((o) => o[what] === value)
    }
  },
  currentSubject: (state, getters, rootState, rootGetters) => {
    const currentCourse = rootGetters["schedule/currentCourse"]
    if (currentCourse === null) return null
    return getters.of(currentCourse.subject, "subject")
  },
  orderBy: (state, getters, rootState) => (notesOrLearndatas, whichDate) =>
    [...notesOrLearndatas].sort(
      firstBy((o1, o2) => isBefore(o1[whichDate], o2[whichDate]))
        .thenBy("name")
        .thenBy("uuid")
    ),
  learndatas: (state) => state.learndatas,
  learndata: (state, getters, rootState) => (value, prop = "uuid") =>
    getters.learndatas.find((o) => o[prop] === value) || null,
  latest: (state, getters) => (notesOrLearndatas, by = "modified") => {
    const sorted = getters.orderBy(notesOrLearndatas, by)
    if (sorted.length) return sorted[0]
    return null
  },
  learndatasOf: (state, getters) => (value, prop = "note") => {
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
  ...getMutations("note", parseObjectDates),
}

export const actions = {
  async loadNotes({ commit }) {
    try {
      const { data } = await this.$axios.get(`/notes/`)
      // console.log(`[from API] GET /notes/: OK`)
      if (data) commit("SET", data)
    } catch (error) {
      // console.error(`[from API] GET /notes/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async loadLearndatas({ commit }) {
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
  async postLearndata({ commit }, learndata) {
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
  async patchLearndata({ commit }, uuid, modifications) {
    try {
      const { data } = await this.$axios.patch(
        `/learndata/${uuid}/`,
        modifications
      )
      if (data) commit("PATCH", data)
      // console.log("[from API] PATCH /learndata/: OK")
    } catch (error) {
      // console.error("[from API] PATCH /learndata/: Error")
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async deleteLearndata({ commit }, uuid) {
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
  async postNote({ commit }, note) {
    try {
      const { data } = await this.$axios.post("/notes/", note)
      // console.log("[from API] POST /notes/: OK")
      if (data) commit("SET", data)
    } catch (error) {
      // console.error("[from API] POST /notes/: Error")
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async patchNote({ commit, getters }, uuid, modifications) {
    try {
      const { data } = await this.$axios.patch(`/notes/${uuid}`, {
        ...getters.one(uuid),
        modified: new Date(),
        ...modifications,
      })
      // console.log(`[from API] PATCH /notes/${uuid}/: OK`)
      if (data) commit("PATCH", uuid, modifications)
    } catch (error) {
      // console.error(`[from API] PATCH /notes/${uuid}/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async deleteNote({ commit, getters }, uuid) {
    try {
      await this.$axios.delete(`/notes/${uuid}/`)
      commit("DEL", uuid)
      // console.log(`[from API] DELETE /notes/${uuid}/: OK`)
    } catch (error) {
      // console.error(`[from API] DELETE /notes/${uuid}/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async saveNote(
    { dispatch, getters, rootState },
    uuid,
    content = null,
    force = false
  ) {
    try {
      const clientNoteContent = content || getters.note(uuid).content
      // If we are force-saving, no need to do any checks.
      if (!force) {
        // Check if the note's content is not "Chargement..." or an empty string
        if (clientNoteContent === "Chargement..." || clientNoteContent === "")
          throw new Error(
            `Error while checking content of note #${uuid}: The note's content is equal to "${clientNoteContent}".`
          )
        await dispatch("patchNote", uuid, {
          content: clientNoteContent,
          modified: rootState.now,
        })
      }
    } catch (error) {
      // console.error(`[macro-action] saveNote error: ${error}`)
    }
  },
  initNotesSearch({ getters }, indexes = ["name", "subject.name"]) {
    // Init search
    const search = new JsSearch.Search("uuid")
    // Add indexes
    indexes.forEach((index) => search.addIndex(index))
    // Add datasets
    search.addDocuments(getters.notes)
    // Return the object to search with
    return search
  },
  searchNotes({ getters }, searcher, query, apply = null) {
    /* Uses the object returned by `initNotesSearch` to search queries against.
     * @param searcher: The JsSearch.search object
     * @param query: the string to search the dataset against
     * @param apply: a function that receives the note's uuid and returns a value,
     *               the returned arary of matches will be mapped with the result of this function.
     *               `getters.note` by default.
     */
    apply |= getters.note
    return searcher.search(query).map((uuid) => apply(uuid))
  },
}
