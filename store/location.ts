import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'

export const state: () => {
  latitude: number | null
  longitude: number | null
} = () => ({
  latitude: null,
  longitude: null,
})

export type LocationState = ReturnType<typeof state>

export const actions: ActionTree<LocationState, RootState> = {
  acquireLocation({ commit, state }) {
    if (state.longitude === null || state.latitude === null)
      navigator.geolocation.getCurrentPosition(
        pos => {
          commit('UPDATE_LOCATION', pos.coords)
        },
        // eslint-disable-next-line
        err => {
          // eslint-disable-next-line
          this.$toast.error("Impossible d'obtenir la localisation")
        }
      )
  },
}

export const mutations: MutationTree<LocationState> = {
  UPDATE_LOCATION: (state, newLocation: typeof state) => {
    state = { ...state, ...newLocation }
  },
}
