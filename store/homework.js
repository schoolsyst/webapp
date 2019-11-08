import { firstBy } from "thenby";
import groupBy from "lodash.groupby";
import { isSameWeek, differenceInWeeks, isBefore, parseISO } from "date-fns";

export const state = () => ({
	homeworks: []
});

const parseHomeworkDates = homework => ({
	...homework,
	due: parseISO(homework.due),
	created: parseISO(homework.created)
})

export const getters = {
	all: (state, getters) => getters.order(state.homeworks),
	one: (state, getters) => (value, prop = "uuid") =>
		getters.all.find(o => o[prop] === value) || null,
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
			firstBy((o1, o2) => isBefore(o1.due, o2.due))
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
				shown: getters._needToShowGroup({ due, homeworks })
			})
		}
		return flat
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
    return homeworks.filter(o => o.type === what.replace(/(.+)s$/, ($0, $1) => $1).toUpperCase());
  },
  exercises: (state, getters, rootState) =>
    getters.only("exercises", getters.all),
  tests: (state, getters, rootState) => getters.only("tests", getters.all),
  counts: (state, getters, rootState) => ({
    exercises: getters.only("exercises", getters.pending),
    tests: getters.only("tests", getters.currentOrNextWeek),
  }),
}

export const mutations = {
  SET: (state, homeworks) =>
    state.homeworks = homeworks.map(o => parseHomeworkDates(o)),
  ADD: (state, homework) => state.homeworks.push(subject),
  DEL: (state, uuid) =>
    (state.homeworks = state.homeworks.filter(o => o.uuid !== uuid)),
  PATCH: (state, uuid, modifications) => {
    // Get the requested homework's index in the state array
		let idx = state.homeworks.map(o => o.uuid).indexOf(uuid);
		// Apply modifications
		Object.assign(state.homeworks[idx], modifications);
	}
};

export const actions = {
	async load({ commit, state }, force = false) {
		if (!force && state.homeworks.length) return
		try {
			const { data } = await this.$axios.get(`/homework/`);
			console.log(`[from API] GET /homework/: OK`);
			if (data) commit("SET", data);
		} catch (error) {
			console.error(`[from API] GET /homework/: Error`);
			try {
				console.error(error.response.data);
			} catch (_) {
				console.error(error)
			}
		}
	},

	async validate({ getters, rootGetters }, homework) {
		homework = {
			subject: {uuid: null},
			name: "",
			type: "",
			room: "",
			progress: 0,
			...homework
		}
		if (!homework.subject.uuid)
			return "Veuillez préciser une matière"
		if (!rootGetters['subject/all'].map((o) => o.uuid).includes(homework.subject.uuid))
			return "La matière sélectionnée n'existe pas"
		if (homework.name.length > 300)
			return "Le nom du devoir est trop long"
		if (!['TEST', 'DM', 'EXERCISE', 'TOBRING'].includes(homework.type))
			return "Veuillez choisir un type de devoir"
		if (homework.room.length > 300)
			return "Le nom de la salle est trop long"
		if (homework.progress > 1 || homework.progress < 0)
			return "Valeur d'avancement incorrecte"
		return true
	},

	async post({ commit, dispatch }, homework, force = false) {
		if(!force) {
			const validation = await dispatch('validate', homework)
			if (validation !== true) return validation
		}
		try {
			const { data } = await this.$axios.post(`/homework/`, homework);
			if (data) commit("ADD", homework);
		} catch (error) {}
	},

	async delete({ commit }, uuid) {
		try {
			const { data } = await this.$axios.delete(`/homeworks/${uuid}`);
			if (data) commit("DEL", uuid);
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

	async patch({ commit, dispatch, getters }, uuid, modifications, force = false) {
		if(!force) {
			let homework = getters.one(uuid)
			homework = {...homework, ...modifications}
			const validation = await dispatch('validate', homework)
			if(validation !== true) return validation
		}
		try {
			const { data } = await this.$axios.patch(
				`/homeworks/${uuid}`,
				modifications
			);
			if (data) commit("PATCH", uuid, data);
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
