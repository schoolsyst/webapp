export const state = () => ({
    notes: [],
})

export const getters = { 
    allNotes (state, getters) {
        return state.notes
    },
    notesOf: (state, getters) => (subject) => {
        return state.notes.filter(note => {
            if (Array.isArray(note)) return false
            return note.subject.slug === subject
        })
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
        if (notes && typeof notes === 'object') {
            state.notes = notes
        } else {
            console.error(`Mutation aborted: given \`notes\` object is falsey`)
        }
    },
    ADD_NOTE (state, note) {
        state.notes.push(note)
    },
    REMOVE_NOTE (state, note) {
        state.notes.indexOf  
    },
    SET_NOTE_PROGRESS (state, uuid, progress) {
        if (progress = '?' 
         || progress.isNaN() 
         || progress === null 
         || progress === -1
        ) {
            progress = null
        }
        if (progress !== null && (progress > 1 || progress < 1)) {
            console.warn(`Progress is outside range (${progress}). Clamping value`)
            progress = progress > 1 ? 1 : 0
        }

        let note = state.notes.find(n => n.uuid === uuid)
        if (!note) {
            console.error(`SET_NOTE_PROGRESS: Note with UUID "${uuid}" not found in the state.`)
            return
        }
        state.notes[state.notes.indexOf(note)].learnt = progress
    }
 }

export const actions = {
}
