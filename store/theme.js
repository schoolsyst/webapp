import SunCalc from 'suncalc'
import { isBefore, isAfter, format } from 'date-fns'

export const state = () => ({
  current: 'LIGHT'
})

export const getters = {
  current: (state) => state.current,
  resolveAuto: (state, getters, rootState) => {
    const {latitude, longitude} = rootState.location
    const now = rootState.now
    const {sunrise, sunset} = SunCalc.getTimes(now, latitude, longitude)

    if (isBefore(now, sunset) && isAfter(now, sunrise)) {
      return 'LIGHT'
    } else {
      return 'DARK'
    }
  }
}

export const mutations = {
  SET: (state, newTheme) => {
    state.current = newTheme
  }
}

export const actions = {
  async set({commit, dispatch, rootState, rootGetters, getters}) {
    // Load settings
    await dispatch('settings/load', null, { root: true })
    // Get theme setting
    let theme = rootGetters['settings/value']('theme')
    // If the theme is 'AUTO', further processing is required.
    if (theme === 'AUTO') {
      // Acquire geolocation
      await dispatch('acquireLocation', null, { root: true })
      // Resolve the theme
      theme = getters.resolveAuto
    }
    // Set the theme
    commit('SET', theme)
    // Attach the theme to <body>
    document.body.setAttribute('theme', theme)
  }
}
