export const state = () => ({
  notes: []
});

export const getters = {
  all: (state, getters) => state.notes,
  one: (state, getters) => (value, prop = "uuid") =>
    getters.notes.find(o => o[prop] === value) || null
};

export const mutations = {
  SET_NOTES: (state, notes) => (state.notes = notes),
  ADD_NOTE: (state, note) => state.notes.push(subject),
  DEL_NOTE: (state, uuid) =>
    (state.notes = state.notes.filter(o => o.uuid !== uuid)),
  PATCH_NOTE: (state, uuid, modifications) => {
    // Get the requested note's index in the state array
    let idx = state.notes.map(o => o.uuid).indexOf(uuid);
    // Apply modifications
    Object.assign(state.notes[idx], modifications);
  }
};

export const actions = {
  async loadNotes({ commit }) {
    try {
      const { data } = await this.$axios.get(`/notes/`);
      console.log(`[from API] GET /notes/: OK`);
      if (data) commit("SET_NOTES", data);
    } catch (error) {
      console.error(`[from API] GET /notes/: Error`);
      try {
        console.error(error.response.data);
      } catch (_) {
        console.error(error);
      }
    }
  }
};
