import { firstBy } from "thenby";
import groupBy from "lodash.groupby";
import { isSameWeek, differenceInWeeks, isBefore, parseISO } from "date-fns";
import { getValidator } from "./index"

export const state = () => ({
	homeworks: [],
	types: [
		{ key: "EXERCISE", label: "Exercice"      },
		{ key: "TEST",     label: "Contrôle"      },
		{ key: "DM",       label: "Devoir maison" },
		{ key: "TOBRING",  label: "À apporter"    },
	],
	loaded: false
});

const parseHomeworkDates = homework => ({
	...homework,
	due: parseISO(homework.due),
	added: parseISO(homework.added)
})

export const getters = {
	types: ({ types }) => types,
	all: ({ homeworks }, { order }) => order(homeworks),
	one: ({}, { all }) => (value, prop = "uuid") =>
		all.find(o => o[prop] === value) || null,
	nextWeek: ({}, { all }, rootState) =>
		all.filter(o => differenceInWeeks(o.due, rootState.now) == 1),
	currentWeek: ({}, { all }, rootState) =>
		all.filter(o => isSameWeek(o.due, rootState.now)),
	currentOrNextWeek: ({}, {currentWeek, nextWeek}) => 
		[...currentWeek, ...nextWeek],
	pending: ({}, { currentOrNextWeek }) =>
		currentOrNextWeek.filter(o => o.progress != 1),
	order: () => homeworks =>
		[...homeworks].sort(
			firstBy((o1, o2) => isBefore(o1.due, o2.due))
				.thenBy(o => o.subject.weight)
				.thenBy("uuid")
		),
	group: ({}, { _needToShowGroup },) => homeworks => {
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
		return flat
	},
	_needToShowGroup: ({}, {}, {}, rootGetters) => group => {
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
	validate: getValidator({
		constraints: {
			required: ["subject", "name", "due"],
			minimum: {
				0: ["progress"]
			},
			maximum: {
				1: ["progress"]
			},
			maxLength: {
				300: ["name", "room"]
			}
		},
		customConstraints: [
			{
				field: 'type',
				message: "Type de devoir invalide",
				constraint: ({ types }, object) => 
					types.map(t => t.key).includes(object.type)
			}
		],
		fieldNames: {
			subject:  { gender: "F", name: "matière" },
			name:     { gender: "M", name: "nom" },
			type:     { gender: "M", name: "type" },
			room:     { gender: "F", name: "salle" },
			progress: { gender: "F", name: "progression" },
			due:			{ gender: "F", name: "date due" },
		},
		resourceName: { gender: "M", name: "devoir" },
		debug: true
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
	},
	POSTLOAD: (state) => state.loaded = true
};

export const actions = {
	async load({ commit, state }, force = false) {
		if (!force && state.loaded) return
		try {
			const { data } = await this.$axios.get(`/homework/`);
			console.log(`[from API] GET /homework/: OK`);
			if (data) {
				commit("SET", data);
				commit('POSTLOAD')
			}
		} catch (error) {
			console.error(`[from API] GET /homework/: Error`);
			try {
				console.error(error.response.data);
			} catch (_) {
				console.error(error)
			}
		}
	},

	async post({ commit, dispatch, getters }, {homework, force}) {
		force = force || false
		if(!force) {
			const validation = getters.validate(homework)
			if (!validation.validated) return validation
		}
		try {
			if(homework.subject) homework.subject = homework.subject.uuid
			const res = await this.$axios.post(`/homework/`, homework);
			const { data } = await this.$axios.get(`/homework/${res.data.uuid}`)
			if (data) {
				commit("ADD", homework);
			}
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
			const validation = getters.validate()(homework)
			if (!validation.validated) return validation
		}
		try {
			if (modifications.subject)
				modifications.subject = modifications.subject.uuid
			await this.$axios.patch(
				`/homeworks/${uuid}`,
				modifications
			);
			const { data } = await this.$axios.get(`/homeworks/${uuid}`)
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
