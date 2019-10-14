import { toDate } from "date-fns";

export const state = () => ({
  subjects: [],
  now: toDate(Date.now()) // For time-dependent getters.
});

export const getters = {
  subjects: (state, getters) => state.subjects,
  subject: (state, getters) => (value, prop = "uuid") =>
    state.subjects.find(o => o[prop] === value) || null,
  /* Why `(_ = 0) =>` ? To turn the getter into a function
   * and therefore prevent caching.
   */
  requireInitialSetup: (state, getters, rootState, rootGetters) => (_ = 0) => {
    let settings = rootGetters["settings/settings"];
    // Non-optional settings that haven't been set by the user are considered "bad".
    let badSettings = settings.filter(o => o.isDefaultSetting && !o.optional);
    return badSettings.length > 0;
  }
};

export const mutations = {
  UPDATE_TIME: (state, newTime) => (state.now = newTime),
  SET_SUBJECTS: (state, subjects) => (state.subjects = subjects),
  ADD_SUBJECT: (state, subject) => state.subjects.push(subject),
  DEL_SUBJECT: (state, uuid) =>
    (state.subjects = state.subjects.filter(o => o.uuid !== uuid)),
  PATCH_SUBJECT: (state, uuid, modifications) => {
    // Get the requested subject's index in the state array
    let idx = state.subjects.map(o => o.uuid).indexOf(uuid);
    // Apply modifications
    Object.assign(state.subjects[idx], modifications);
  }
};

export const actions = {
  async loadSubjects({ commit }) {
    try {
      const { data } = await this.$axios.get(`/subjects/`);
      console.log(`[from API] GET /subjects/: OK`);
      if (data) commit("SET_SUBJECTS", data);
    } catch (error) {
      console.error(`[from API] GET /subjects/: Error`);
      try {
        console.error(error.response.data);
      } catch (_) {
        console.error(error);
      }
    }
  },

  async postSubject({ commit }, subject) {
    try {
      const { data } = await this.$axios.post(`/subjects/`, subject);
      if (data) commit("ADD_SUBJECT", data);
    } catch (error) {
      console.log(`[from API] POST /subjects/: Error`);
      try {
        console.error(error.response.data);
      } catch (_) {
        console.error(error);
      }
    }
  },

  async nuxtServerInit({ dispatch }) {
    // throw {name: 'TODO', message: "Go see https://date-fns.org/docs/Getting-Started to replace momentjs! Immutability = no headaches :D"}
    await dispatch("settings/loadSettings");
    await dispatch("loadSubjects");
    await dispatch("homework/loadHomework");
    await dispatch("grades/loadGrades");
    await dispatch("schedule/loadEvents");
    await dispatch("schedule/loadMutations");
    await dispatch("notes/loadNotes");
  }
};
