import { firstBy } from "thenby"
import { isBefore, parseISO, format } from "date-fns"
import JsSearch from "js-search"
import { getMutations, getValidator } from "./index"

export const state = () => ({
  notes: [],
})

const parseObjectDates = (object) => ({
  ...object,
  modified: parseISO(object.modified),
  added: parseISO(object.added),
  opened: parseISO(object.opened),
})

export const getters = {
  all: (state, getters) => getters.orderBy(state.notes),
  one: (state, getters) => (value, prop = "uuid") =>
    getters.all.find((o) => o[prop] === value) || null,
  of: (state, getters) => (value, what = "subject") => {
    if (what === "subject") {
      return getters.all.filter((o) => o.subject.uuid === value)
    } else {
      return getters.all.filter((o) => o[what] === value)
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
        return []
    }
  },
  validate: getValidator({
    constraints: {
      required: ["subject"],
      maxLength: {
        300: ["name"]
      }
    },
    customConstraints: [
      {
        field: 'format',
        message: 'Format de note non reconnu',
        constraint: (getters, obj) => ['MARKDOWN','HTML'].includes(obj.format)
      }
    ],
    fieldNames: {
      subject:  { gender: "F", name: "matière" },
      name:     { gender: "M", name: "nom" },
      content:  { gender: "M", name: "contenu" },
      format:   { gender: "M", name: "format" },
      modified: { gender: "F", name: "date de modification" },
      added:    { gender: "F", name: "date de création" },
      opened:   { gender: "F", name: "date d'ouverture" },
    },
    resourceName: { gender: "F", name: "prise de notes" }
  }),
}

export const mutations = {
  ...getMutations("note", parseObjectDates),
}

export const actions = {
  async load({ commit, state }, force = false) {
    if (!force && state.notes.length) return
    console.log(`Loading notes :: force=${force}, state.notes.length=${state.notes.length}`)
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
  async post({ commit, dispatch, rootGetters }, { note, force }) {
    force = force || false
    if(!force) {
      const validation = getters.validate()(note)
      console.log(validation)
      if (!validation.validated) return validation
    }
    try {
      const { data } = await this.$axios.post("/notes/", note)
      note = {
        ...data, 
        subject: rootGetters['subjects/all'](data.subject)
      }
      if (data) commit("ADD", note)
      return note
    } catch (error) {
      // console.error("[from API] POST /notes/: Error")
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async patch({ commit, getters, dispatch }, {uuid, modifications, force}) {
    force = force || false
    await dispatch('load')
    const note = {
      ...getters.one(uuid),
      ...modifications
    }
    note.subject = note.subject.uuid
    if(!force) {
      const validation = await getters.validate(note)
      if (!validation.validated) return validation
    }
    try {
      let APIReady = modifications
      APIReady.subject = APIReady.subject.uuid
      const { data } = await this.$axios.patch(`/notes/${uuid}/`, APIReady)
      // console.log(`[from API] PATCH /notes/${uuid}/: OK`)
      if (data) commit("PATCH", {uuid, modifications})
    } catch (error) {
      // console.error(`[from API] PATCH /notes/${uuid}/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async delete({ commit, getters, dispatch }, uuid) {
    try {
      // Stores the note object because we want to be able to cancel the deletion
      const note = getters.one(uuid)
      // 
      await this.$axios.delete(`/notes/${uuid}/`)
      console.log(note)
      commit("DEL", uuid)
      this.$toast.show('Note supprimée', {
        action: {
          text: "Annuler",
          onClick: async (e, toast) => {
            await dispatch(`post`, {note: {...note, subject: note.subject.slug}, force: true})
            toast.goAway(0)
          }
        },
      })
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
  async save(
    { dispatch, getters, rootState },
    { uuid, content, force }
  ) {
    force = force || false
    try {
      const clientNoteContent = content || getters.note(uuid).content
      // If we are force-saving, no need to do any checks.
      if (!force) {
        // Check if the note's content is not "Chargement..." or an empty string
        if (clientNoteContent === "Chargement..." || clientNoteContent === "")
          throw new Error(
            `Error while checking content of note #${uuid}: The note's content is equal to "${clientNoteContent}".`
          )
        await dispatch("patch", {uuid, modifications: {
          content: clientNoteContent,
          modified: rootState.now,
        }})
      }
    } catch (error) {
      // console.error(`[macro-action] saveNote error: ${error}`)
    }
  },
  initSearch({ getters }, indexes = ["name", "subject.name"]) {
    // Init search
    const search = new JsSearch.Search("uuid")
    // Add indexes
    indexes.forEach((index) => search.addIndex(index))
    // Add datasets
    search.addDocuments(getters.notes)
    // Return the object to search with
    return search
  },
  async search({ getters, dispatch }, query, searcher = null, apply = null) {
    /* Uses the object returned by `initNotesSearch` to search queries against.
     * @param searcher: The JsSearch.search object
     * @param query: the string to search the dataset against
     * @param apply: a function that receives the note's uuid and returns a value,
     *               the returned arary of matches will be mapped with the result of this function.
     *               `getters.note` by default.
     */
    searcher = searcher || await dispatch('initSearch')
    apply = apply || getters.note
    return searcher.search(query).map((uuid) => apply(uuid))
  }
}
