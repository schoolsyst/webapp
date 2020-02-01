import { firstBy } from 'thenby'
import groupBy from 'lodash.groupby'
import {
  isSameWeek,
  differenceInWeeks,
  isBefore,
  parseISO,
  getUnixTime,
  fromUnixTime,
  isSameDay
} from 'date-fns'
import { getValidator, getMutations } from './index'

export const state = () => ({
  homeworks: [],
  types: [
    { importance: 1, key: 'TOBRING', label: 'À apporter' },
    { importance: 1, key: 'EXERCISE', label: 'Exercice' },
    { importance: 2, key: 'COURSEWORK', label: 'Travail noté' },
    { importance: 3, key: 'TEST', label: 'Contrôle' }
  ],
  loaded: false
})

const parseHomeworkDates = (homework) => {
  if (homework.due && typeof homework.due === 'string')
    homework.due = parseISO(homework.due)
  if (homework.added && typeof homework.added === 'string')
    homework.added = parseISO(homework.added)
  return homework
}

// For comparisons to determinate if homework is late or not.
const getTodayDate = () => {
  const today = new Date()
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)
  return today
}

export const getters = {
  types: ({ types }) => types,
  all: ({ homeworks }, { order }) => order(homeworks),
  one: (_, { all }) => (value, prop = 'uuid') =>
    all.find((o) => o[prop] === value) || null,
  nextWeek: (_, { all }, rootState) =>
    all.filter((o) => differenceInWeeks(o.due, rootState.now) === 1),
  currentWeek: (_, { all }, rootState) =>
    all.filter((o) => isSameWeek(o.due, rootState.now)),
  currentOrNextWeek: (_, { currentWeek, nextWeek }) => [
    ...currentWeek,
    ...nextWeek
  ],
  importanceOf: ({ types }) => (homework) => {
    if (types.map((t) => t.key).includes(homework.type)) {
      return types.find((t) => t.key === homework.type).importance
    }
    return 0
  },
  pending: (_, { currentOrNextWeek }) =>
    currentOrNextWeek.filter((o) => o.progress === 1),
  order: (_, { importanceOf }) => (homeworks) =>
    [...homeworks].sort(
      firstBy((o1, o2) => isBefore(o1.due, o2.due))
        .thenBy((o) => importanceOf(o))
        .thenBy((o) => o.subject.weight)
        .thenBy('uuid')
    ),
  group: (_, { _needToShowGroup }, rootState) => (
    homeworks,
    specialGroups = ['late', 'today']
  ) => {
    /* Groups the provided array of homework by due date
     * into an array of groups:
     * [ { due: <date>, homeworks: [ ... ], shown: <bool> }, ... ]
     * the shown bool is computed by getters._needToShowGroup
     */
    if (homeworks.length < 1) return []
    if (specialGroups.length) {
      homeworks = homeworks.map((hw) => {
        if (
          specialGroups.includes('late') &&
          isBefore(hw.due, getTodayDate()) &&
          !isSameDay(hw.due, getTodayDate())
        ) {
          return { ...hw, due: 'LATE', realDue: getUnixTime(hw.due) }
        } else {
          return { ...hw, due: getUnixTime(hw.due) }
        }
      })
    }
    // Remove done homework from LATE group
    homeworks = homeworks.filter((hw) => {
      if (hw.due === 'LATE') {
        return hw.progress < 1
      }
      return true
    })
    const map = groupBy(homeworks, 'due')
    let flat = []
    for (const [due, homeworks] of Object.entries(map)) {
      flat.push({ due, homeworks })
    }
    // To put the LATE group at the top, we change its value to a negtive number.
    const LATE_DUE_NUMBER = -666 // No reason to use this number, huh. R-really, I-I-I mean... It's 1 AM
    const index = flat.findIndex((g) => g.due === 'LATE')
    if (index !== -1) {
      flat[index].due = LATE_DUE_NUMBER
    }
    flat = flat.sort(firstBy('due'))
    flat = flat.map((g) => ({
      ...g,
      homeworks: g.homeworks.map((h) => ({ ...h, due: h.realDue })),
      due: g.due === LATE_DUE_NUMBER ? 'LATE' : g.due
    }))
    return flat
  },
  _needToShowGroup: () => ({ due, homeworks, showCompleted }) => {
    /* Takes a group object ({due, homeworks}) and decides whether this
     * group needs to be shown to the user.
     */

    /* Only show...
    - if the group is non-empty, and...
		- - in case of a "late" or "today" group...
		- - - if at least one homework is still not completed
    - - if at least one homework is still not completed, *or*
    - - if any test (completed or not) is present, *or*
		- - if the setting "show completed exercises" is true
    */
    const isEmpty = homeworks.length === 0
    const someHomeworkNotCompleted = !!homeworks.filter((o) => o.progress < 1)
      .length
    const hasTests = homeworks.filter((o) => o.graded).length > 0
    // console.log({due, isEmpty, someHomeworkNotCompleted, hasTests, showCompleted})
    if (isEmpty) return false
    if (['LATE', 'TODAY'].includes(due)) {
      return someHomeworkNotCompleted
    }
    return someHomeworkNotCompleted || hasTests || showCompleted
  },
  grouped: (_, { group, all }) => group(all),
  only: (_, { all }) => (what, homeworks = null) => {
    homeworks = homeworks || all
    return homeworks.filter(
      (o) => o.type === what.replace(/(.+)s$/, ($0, $1) => $1).toUpperCase()
    )
  },
  exercises: (_, { only, all }) => only('exercises', all),
  tests: (_, { only, all }) => only('tests', all),
  counts: (_, { only, pending, currentOrNextWeek }) => ({
    exercises: only('exercises', pending),
    tests: only('tests', currentOrNextWeek)
  }),
  verboseType: (_, { types }) => (type) =>
    types.find((t) => t.key === type).label,
  validate: getValidator({
    constraints: {
      required: ['subject', 'name', 'due'],
      minimum: {
        0: ['progress']
      },
      maximum: {
        1: ['progress']
      },
      maxLength: {
        300: ['name', 'room']
      }
    },
    customConstraints: [
      {
        field: 'type',
        message: 'Type de devoir invalide',
        constraint: ({ types }, object) =>
          types.map((t) => t.key).includes(object.type)
      }
    ],
    fieldNames: {
      subject: { gender: 'F', name: 'matière' },
      name: { gender: 'M', name: 'nom' },
      type: { gender: 'M', name: 'type' },
      room: { gender: 'F', name: 'salle' },
      progress: { gender: 'F', name: 'progression' },
      due: { gender: 'F', name: 'date due' }
    },
    resourceName: { gender: 'M', name: 'devoir' }
  })
}

export const mutations = {
  ...getMutations('homework', parseHomeworkDates),
  POSTLOAD: (state) => (state.loaded = true)
}

export const actions = {
  async load({ commit, state }, force = false) {
    if (!force && state.loaded) return
    try {
      const { data } = await this.$axios.get(`/homework/`)
      console.log(`[from API] GET /homework/: OK`)
      if (data) {
        commit('SET', data)
        commit('POSTLOAD')
      }
    } catch (error) {
      console.error(`[from API] GET /homework/: Error`)
      try {
        console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },

  async post({ commit, dispatch, getters }, { homework, force }) {
    force = force || false
    if (!force) {
      const validation = getters.validate(homework)
      if (!validation.validated) return validation
    }
    try {
      if (homework.subject) homework.subject = homework.subject.uuid
      const res = await this.$axios.post(`/homework/`, homework)
      const { data } = await this.$axios.get(`/homework/${res.data.uuid}`)
      if (data) {
        commit('ADD', data)
      }
    } catch (error) {
      // eslint-disable-next-line
      // eslint-disable-next-line
      console.error(error)
    }
  },

  async delete({ commit, dispatch, getters }, { uuid, force, toastMessage }) {
    try {
      console.log(uuid)
      // Stores the note object because we want to be able to cancel the deletion
      const homework = getters.one(uuid)
      //
      await this.$axios.delete(`/homework/${uuid}`)
      commit('DEL', uuid)
      this.$toast.show(toastMessage || 'Devoir supprimé', {
        action: {
          text: 'Annuler',
          onClick: async (e, toast) => {
            await dispatch(`post`, { homework })
            toast.goAway(0)
          }
        },
        duration: 8000
      })
    } catch (error) {
      console.error(error)
    }
  },

  async patch(
    { commit, dispatch, getters },
    { uuid, modifications, force, earlyMutation }
  ) {
    earlyMutation = earlyMutation || false
    force = force || false
    if (!force) {
      let homework = getters.one(uuid)
      if ('due' in modifications && typeof modifications.due === 'number') {
        modifications.due = fromUnixTime(modifications.due)
      }
      homework = { ...homework, ...modifications }
      console.log(homework)
      const validation = getters.validate(homework)
      if (!validation.validated) return validation
    }
    try {
      if (earlyMutation) {
        commit('PATCH', { pk: uuid, modifications })
      }

      if (modifications.subject)
        modifications.subject = modifications.subject.uuid
      await this.$axios.patch(`/homework/${uuid}/`, modifications)
      const { data } = await this.$axios.get(`/homework/${uuid}`)

      if (!earlyMutation && data) {
        commit('PATCH', { pk: uuid, modifications: data })
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  },

  async switchCompletion({ getters, dispatch }, { uuid, value }) {
    const homework = getters.one(uuid)
    let progress
    if (homework === null) {
      this.$toast.error('Erreur interne', { icon: 'error_outline' })
      return null
    }
    if (typeof value === 'number') {
      progress = value
    } else {
      // To "invert" a value in [0; 1], do y = -x + 1
      progress = -homework.progress + 1
    }
    await dispatch('patch', {
      uuid,
      modifications: { progress },
      force: true,
      earlyMutation: true
    })
  }
}
