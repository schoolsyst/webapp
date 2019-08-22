export const state = () => ({
    notes: [],
    notions: []
})

export const getters = { 
    allNotes (state, getters) {
        return state.notes
    },
    notesOf: (state, getters) => (subject) => {
        return getters.allNotes.filter(note => note.subject.slug === subject)
    },
    note: (state, getters) => (subject, filename) => {
        let note = getters.notesOf(subject)
                          .filter(note => 
                            note.slug === `${subject.slug}--${filename}`)
        if (note.length) return note[0]
        return null
    },

}

export const mutations = { 
    SET_NOTES (state, notes) {
        if (notes) {
            state.notes = notes
        } else {
            console.error(`Mutation aborted: given \`notes\` object is truthy`)
        }
    },
    ADD_NOTE (state, note) {
        state.notes.push(note)
    }
 }

export const actions = {


 }
