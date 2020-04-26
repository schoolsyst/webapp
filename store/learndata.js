import { firstBy } from 'thenby'
import { isBefore, parseISO } from 'date-fns'
import { getMutations, getValidator } from './index'

export const state = () => ({
  learndatas: [],
})

const parseObjectDates = object => ({
  ...object,
  modified: parseISO(object.modified),
  added: parseISO(object.added),
  opened: parseISO(object.opened),
})

export const getters = {
  orderBy: (state, getters, rootState) => (learndatas, whichDate) =>
    [...learndatas].sort(
      firstBy((o1, o2) => isBefore(o1[whichDate], o2[whichDate]))
        .thenBy('name')
        .thenBy('uuid')
    ),
  all: state => state.learndatas,
  one: (state, { all }, rootState) => (value, prop = 'uuid') =>
    all.find(o => o[prop] === value) || null,
  of: ({ learndatas }, getters) => (value, prop = 'note') => {
    switch (prop) {
      case 'note':
        return learndatas.filter(o =>
          // If the requested note's UUID is in
          // the array of UUIDs of notes linked to that learndata
          o.notes.map(n => n.uuid).includes(value)
        )

      case 'subject':
        return learndatas.filter(o => o.subject.uuid === value)

      default:
        // console.error(`[notes/learndatasOf] Unrecognized prop: ${prop}`)
        return []
    }
  },
  validate: getValidator({
    constraints: {
      required: ['subject', 'name', 'data'],
      maxLength: {
        300: ['name'],
      },
      maximum: {
        1: ['progress'],
      },
      minimum: {
        0: ['progress', 'test_tries', 'train_tries'],
      },
    },
    fieldNames: {
      subject: { gender: 'F', name: 'matière' },
      name: { gender: 'M', name: 'nom' },
      data: { gender: 'M', name: 'contenu' },
      progress: { gender: 'F', name: 'progression' },
      test_tries: { gender: 'M', name: 'nombre de tests' },
      train_tries: { gender: 'M', name: "nombre d'entraînements" },
    },
    resourceName: { gender: 'M', name: 'learndata' },
  }),
}

export const mutations = {
  ...getMutations('learndata', parseObjectDates),
}

export const actions = {
  async load({ commit, state }, force = false) {
    if (!force && state.learndatas.length) return
    try {
      const { data } = await this.$axios.get('/learndata/')
      if (data) commit('SET', data)
      return false
    } catch (error) {
      this.$toast.error('Erreur interne lors du chargement', {
        icon: 'error_outline',
      })
      return true
    }
  },
  async post({ commit, dispatch }, learndata, force = false) {
    if (!force) {
      const validation = await dispatch('validate', learndata)
      if (!validation.validated) return validation
    }
    try {
      const { data } = await this.$axios.post('/learndata/', learndata)
      if (data) commit('ADD', data)
      // console.log("[from API] POST /learndata/: OK")
    } catch (error) {
      // console.error("[from API] POST /learndata/: Error")
      try {
        // console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },
  async patch(
    { commit, dispatch, getters },
    uuid,
    modifications,
    force = false
  ) {
    if (!force) {
      let learndata = getters.one(uuid)
      learndata = { ...learndata, ...modifications }
      const validation = await dispatch('validate', learndata)
      if (!validation.validated) return validation
    }
    try {
      const { data } = await this.$axios.patch(
        `/learndata/${uuid}/`,
        modifications
      )
      if (data) commit('PATCH', uuid, data)
      // console.log("[from API] POST /learndata/: OK")
    } catch (error) {
      // console.error("[from API] POST /learndata/: Error")
      try {
        // console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },
  async delete({ commit }, uuid) {
    try {
      await this.$axios.delete(`/learndata/${uuid}/`)
      commit('DEL', uuid)
      // console.log(`[from API] DELETE /learndata/${uuid}/: OK`)
    } catch (error) {
      // console.error(`[from API] DELETE /learndata/${uuid}/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },
}
