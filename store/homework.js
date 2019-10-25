import { firstBy } from "thenby";
import groupBy from "lodash.groupby";
import { isSameWeek, differenceInWeeks, isSameDay, parseISO } from "date-fns";

export const state = () => ({
	homework: []
});

const parseHomeworkDates = homework => ({
	...homework,
	due: parseISO(homework.due)
})

export const getters = {
	all: (state, getters) => getters.order(state.homework),
	one: (state, getters) => (value, prop = "uuid") =>
		getters.homeworks.find(o => o[prop] === value) || null,
	nextWeek: (state, getters, rootState) =>
		getters.all.filter(o => differenceInWeeks(o.due, rootState.now) == 1),
	currentWeek: (state, getters, rootState) =>
		getters.all.filter(o => isSameWeek(o.due, rootState.now)),
	currentOrNextWeek: (state, getters, rootState, rootGetters) => [
		...getters.currentWeek,
		...getters.nextWeek
	],
	pending: (state, getters, rootState) =>
		getters.currentOrNextWeek.filter(o => o.progress != 1),
	order: (state, getters, rootState) => homeworks =>
		[...homeworks].sort(
			firstBy((o1, o2) => o1.due.isBefore(o2.due))
				.thenBy(o => o.subject.weight)
				.thenBy("uuid")
		),
	group: (state, getters, rootState) => homeworks => {
		/* Groups the provided array of homework by due date
		* into an array of groups:
		* [ { due: <date>, homeworks: [ ... ], shown: <bool> }, ... ]
		* the shown bool is computed by getters._needToShowGroup
		*/
		const map = groupBy(homeworks, "due")
		let flat = []
		for (const [due, homeworks] of Object.entries(map)) {
			flat.push({
				due,
				homeworks,
				shown: _needToShowGroup({ due, homeworks })
			})
		}
	},
	_needToShowGroup: (state, getters, rootState, rootGetters) => group => {
		/* Takes a group object ({due, homeworks}) and decides whether this
		* group needs to be shown to the user.
		*/
		const { due, homeworks } = group

    /* Only show...
    - if the group is non-empty, and...
    - - if at least one homework is still not completed, *or*
    - - if any test (completed or not) is present, *or*
    - - if the setting "show completed exercises" is true
    */
    const isEmpty = homeworks.length === 0
    const allHomeworksCompleted = homeworks.filter((o) => o.progress !== 1) < 0
    const hasTests = homeworks.filter((o) => o.graded).length > 0
    const completedExercisesShown = rootGetters['settings/value']('show_completed_exercises')
    
    return (
      !isEmpty 
      && (
        !allHomeworksCompleted 
        || hasTests 
        || completedExercisesShown
      )
    )
  },
  grouped: (state, getters, rootState) => getters.group(getters.all),
  only: (state, getters, rootState) => (what, homeworks = null) => {
    homeworks = homeworks || getters.all
    let isTest = ["test", "tests"].includes(what);
    homeworks.filter(o => o.is_test === isTest);
  },
  exercises: (state, getters, rootState) =>
    getters.only(getters.all, "exercises"),
  tests: (state, getters, rootState) => getters.only(getters.all, "tests"),
  counts: (state, getters, rootState) => ({
    exercises: getters.only(getters.pending, "exercises"),
    tests: getters.only(getters.currentOrNextWeek, "tests"),
  }),
}

export const mutations = {
  SET_HOMEWORKS: (state, homeworks) =>
    state.homeworks = homeworks.map(o => parseHomeworkDates(o)),
  ADD_HOMEWORK: (state, homework) => state.homeworks.push(subject),
  DEL_HOMEWORK: (state, uuid) =>
    (state.homeworks = state.homeworks.filter(o => o.uuid !== uuid)),
  PATCH_HOMEWORK: (state, uuid, modifications) => {
    // Get the requested homework's index in the state array
		let idx = state.homeworks.map(o => o.uuid).indexOf(uuid);
		// Apply modifications
		Object.assign(state.homeworks[idx], modifications);
	}
};

export const actions = {
	async loadHomework({ commit }) {
		try {
			const { data } = await this.$axios.get(`/homework/`);
			console.log(`[from API] GET /homework/: OK`);
			if (data) commit("SET_HOMEWORKS", data);
		} catch (error) {
			console.error(`[from API] GET /homework/: Error`);
			try {
				console.error(error.response.data);
			} catch (_) {
				console.error(error)
			}
		}
	},

	async postHomework({ commit }, homework) {
		try {
			const { data } = await this.$axios.post(`/homework/`, homework);
			if (data) commit("ADD_HOMEWORK", homework);
		} catch (error) {}
	},

	async deleteHomework({ commit }, uuid) {
		try {
			const { data } = await this.$axios.delete(`/homeworks/${uuid}`);
			if (data) commit("DEL_HOMEWORK", uuid);
			console.log(`[from API] DELETE /homeworks/${uuid}: OK`);
		} catch (error) {
			console.error(`[from API] DELETE /homeworks/${uuid}: Error`);
			try {
				console.error(error.response.data);
			} catch (_) {
				console.error(error);
			}
		}
	},

	async patchHomework({ commit }, uuid, modifications) {
		try {
			const { data } = await this.$axios.patch(
				`/homeworks/${uuid}`,
				modifications
			);
			if (data) commit("PATCH_HOMEWORK", uuid, data);
			console.log(`[from API] PATCH /homeworks/${uuid}: OK`);
		} catch (error) {
			console.error(`[from API] PATCH /homeworks/${uuid}: Error`);
			try {
				console.error(error.response.data);
			} catch (_) {
				console.error(error);
			}
		}
	}
};
