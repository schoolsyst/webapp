import { toDate, addDays } from 'date-fns'
import { getAccessorType } from 'nuxt-typed-vuex'
import { GetterTree, ActionTree, MutationTree } from 'vuex'

import * as homework from '~/store/homework'
import * as auth from '~/store/auth'
import * as bag from '~/store/bag'
import * as grades from '~/store/grades'
import * as learndata from '~/store/learndata'
import * as location from '~/store/location'
import * as navigation from '~/store/navigation'
import * as notes from '~/store/notes'
import * as reports from '~/store/reports'
import * as settings from '~/store/settings'
import * as subjects from '~/store/subjects'
import * as theme from '~/store/theme'
import * as schedule from '~/store/schedule'

export const state: () => {
  now: Date
  tomorrow: Date
  today: Date
} = () => ({
  now: toDate(Date.now()), // For time-dependent getters.
  tomorrow: addDays(toDate(Date.now()), 1),
  today: new Date(),
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  UPDATE_TIME: (state, newTime) => {
    state.now = newTime
    state.tomorrow = addDays(newTime, 1)
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async loadAll({ dispatch }) {
    await dispatch('settings/load')
    await dispatch('subjects/load')
    await dispatch('homework/load')
    await dispatch('grades/load')
    await dispatch('schedule/load')
    await dispatch('notes/load')
    await dispatch('learndata/load')
  },

  async nuxtServerInit({ dispatch }) {
    await dispatch('settings/load')
    await dispatch('subjects/load')
  },
}

export const accessorType = getAccessorType({
  state,
  mutations,
  actions,
  modules: {
    homework,
    auth,
    bag,
    grades,
    learndata,
    location,
    navigation,
    notes,
    reports,
    schedule,
    settings,
    subjects,
    theme,
  },
})
