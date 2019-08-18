import axios from "axios";

export const state = () => ({
    notes: [],
    notions: []
})

export const getters = { 
    allNotes (state, getters) {
        return state.notes
    },
    notesOf: (state, getters) => (subject) => {
        return state.notes.filter(note => {
            // Search through the notions of the iterating note, and
            // as soon as one notion of the requested subject is found,
            // add the iterating note to the returned array
            for (const notion of note.notions) {
                if (notion.subject.slug === subject.slug)
                    return true
            }
            return false
        })
    },
    note: (state, getters) => (subject, slug) => {
        note = getters.notesOf(subject).filter(note => note.slug === slug)
        if (note.length > 0) return note[0]
        return null
    }

}

export const mutations = { 
    SET_NOTES (state, notes) {
        state.notes = notes
    },
    ADD_NOTE (state, note) {
        state.notes.push(note)
    }
 }

export const actions = {
    async addNote (store, note) {
        const {data} = await axios.post('http://localhost:8000/api/notes/', note)
        store.commit('ADD_NOTE', note)
    }

 }
