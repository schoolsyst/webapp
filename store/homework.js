import { firstBy } from 'thenby'
import groupBy from 'lodash.groupby'
import {
  isSameWeek,
  differenceInWeeks,
  isBefore,
  parseISO,
  getUnixTime,
  fromUnixTime
} from 'date-fns'
import { getValidator, getMutations } from './index'

export const state = () => ({
  homeworks: [],
  types: [
    { key: 'EXERCISE', label: 'Exercice' },
    { key: 'TEST', label: 'Contrôle' },
    { key: 'COURSEWORK', label: 'Travail noté' },
    { key: 'TOBRING', label: 'À apporter' }
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
  pending: (_, { currentOrNextWeek }) =>
    currentOrNextWeek.filter((o) => o.progress === 1),
  order: () => (homeworks) =>
    [...homeworks].sort(
      firstBy((o1, o2) => isBefore(o1.due, o2.due))
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
        if (specialGroups.includes('late') && isBefore(hw.due, Date.now())) {
          return { ...hw, due: 'LATE' }
        } else {
          return { ...hw, due: getUnixTime(hw.due) }
        }
      })
    }
    console.log("GROUPPING HW's")
    const map = groupBy(homeworks, 'due')
    let flat = []
    for (const [due, homeworks] of Object.entries(map)) {
      flat.push({ due, homeworks })
    }

    flat = flat.sort(firstBy('due'))
    flat = flat.map((g) => ({
      ...g,
      due: typeof g.due === 'number' ? fromUnixTime(g.due) : g.due
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

  async delete({ commit }, uuid) {
    try {
      const { data } = await this.$axios.delete(`/homeworks/${uuid}`)
      if (data) commit('DEL', uuid)
      console.log(`[from API] DELETE /homeworks/${uuid}: OK`)
    } catch (error) {
      console.error(`[from API] DELETE /homeworks/${uuid}: Error`)
      try {
        console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
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
      homework = { ...homework, ...modifications }
      const validation = getters.validate()(homework)
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
