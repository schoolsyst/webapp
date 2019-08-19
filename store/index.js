export const state = () => ({
    subjects: []
})

export const getters = { 
    subjects: (state, getters) => {
        return state.subjects
    }
}

export const mutations = {
    SET_SUBJECTS: (state, subjects) => {
        state.subjects = subjects
    }
}

export const actions = {

}
