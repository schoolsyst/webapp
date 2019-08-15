export const state = () => ({
    notes: [],
    notions: []
})

export const getters = { 
    allNotes (state, getters) {
        return state.notes
    },
    notesOf (state, subject) {
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

}

export const mutations = { 


 }

export const actions = {


 }
