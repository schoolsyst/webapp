import { firstBy } from 'thenby'
import tinycolor from 'tinycolor2'
import { getMutations, getValidator } from './index'

export const state = () => ({
  subjects: [],
  placeholder: {
    color: 'black',
    abbreviation: '...',
    name: 'Veuillez sélectionner une matière…',
    _isPlaceholder: true
  }
})

export const getters = {
  all: (state, getters) => getters.orderBy('hue', state.subjects),
  one: (state, getters) => (value, prop = 'uuid') =>
    state.subjects.find((o) => o[prop] === value) || null,
  orderBy: (state, getters) => (what = 'hue', subjects = null) => {
    const sorters = {
      hue: firstBy((o) => tinycolor(o.color).toHsl().h),
      weight: firstBy('weight'),
      uuid: firstBy('uuid')
    }

    if (!sorters.hasOwnProperty(what)) {
      console.warn(
        `subjects/orderBy: unknown ordering method '${what}': defaulting to UUID sorting`
      )
      what = 'uuid'
    }

    return [...subjects].sort(sorters[what].thenBy('uuid'))
  },
  lowercaseName: (_, { one }) => (value, prop = 'uuid') => {
    const subject = one(value, prop)
    if (!subject) return null
    let name = subject.name
    const isAllUppercase = name.toUpperCase() === name
    if (!isAllUppercase) name = name.toLowerCase()
    return name
  },
  validate: getValidator({
    constraints: {
      maxLength: {
        300: ['name', 'room']
      },
      isAColor: ['color'],
      required: ['name', 'color', 'weight'],
      minimum: {
        0: ['goal', 'weight']
      }
    },
    customConstraints: [
      // {
      // message: 'Il y a déjà une matière avec ce nom',
      // field: 'name',
      // constraint: (getters, object) => {
      // return !getters.subjects.map((s) => s.name).includes(object.name)
      // }
      // },
      {
        message: "L'objectif de moyenne est trop grand",
        field: 'goal',
        constraint: (getters, object) => {
          return object.goal <= 1
        }
      }
    ],
    fieldNames: {
      color: { gender: 'F', name: 'couleur' },
      name: { gender: 'M', name: 'nom' },
      goal: { gender: 'M', name: 'objectif de moyenne' },
      weight: { gender: 'M', name: 'coefficient' },
      room: { gender: 'F', name: 'salle' }
    },
    resourceName: { gender: 'F', name: 'matière' },
    debug: true
  })
}

export const mutations = {
  ...getMutations('subject')
}

export const actions = {
  async load({ commit, state }, force = false) {
    if (!force && state.subjects.length) return
    console.log(window)
    try {
      const { data } = await this.$axios.get(`/subjects/`)
      console.log(`[from API] GET /subjects/: OK`)
      if (data) commit('SET', data)
    } catch (error) {
      console.error(`[from API] GET /subjects/: Error`)
      try {
        console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },

  async post({ commit, getters }, { subject, force }) {
    force = force || false
    if (!force) {
      const validation = getters.validate(subject)
      if (!validation.validated) {
        this.$toast.error(
          `Impossible de rajouter cette matière: ${validation.message}`,
          { icon: 'error_outline', duration: 1000 + 700 * validation.count }
        )
        return validation
      }
    }
    try {
      const res = await this.$axios.post(`/subjects/`, subject)
      const { data } = await this.$axios.get(`/subjects/${res.data.uuid}`)
      if (data) commit('ADD', data)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  },

  async patch({ commit }, { uuid, modifications, force }) {
    force = force || false
    if (!force) {
      let subject = getters.one(uuid)
      subject = { ...subject, ...modifications }
      const validation = getters.validate(subject)
      if (!validation.validated) {
        this.$toast.error(
          `Impossible de modifier cette matière: ${validation.message}`,
          { icon: 'error_outline', duration: 1000 + 700 * validation.count }
        )
        return validation
      }
    }
    try {
      await this.$axios.patch(`/subjects/${uuid}/`, modifications)
      const { data } = await this.$axios.get(`/subjects/${uuid}`)
      if (data) commit('PATCH', uuid, data)
    } catch (error) {
      console.error(error)
    }
  },

  async delete({ commit, dispatch }, { uuid, force, toastMessage }) {
    try {
      console.log(uuid)
      // Stores the note object because we want to be able to cancel the deletion
      const subject = getters.one(uuid)
      //
      await this.$axios.delete(`/subjects/${uuid}`)
      commit('DEL', uuid)
      this.$toast.show(toastMessage || 'Matière supprimée', {
        action: {
          text: 'Annuler',
          onClick: async (e, toast) => {
            await dispatch(`post`, { subject })
            toast.goAway(0)
          }
        },
        duration: 8000
      })
    } catch (error) {
      console.error(error)
    }
  }
}
