export const state = () => ({
    subjects: [],
    requireInitialSetup: false,
    settings: [],
    defaultSettings: [],
    user: {} //TODO: uncomment this to see if it still works
})

export const getters = { 
    subjects: (state, getters) => state.subjects,
    allSettings: (state, getters) => state.settings,
    defaultSettings: (state, getters) => state.defaultSettings,

    setting: (state, getters) => (settingKey) => {
        let defaultSetting = getters.defaultSettings.find(setting => setting.key === settingKey)
        if (!defaultSetting) return null
        let userSetting = getters.allSettings.find(setting => setting.setting.key === settingKey)
        if (!userSetting) return defaultSetting
        return Object.assign({}, defaultSetting, userSetting.setting)
    },
}

export const mutations = {
    SET_SUBJECTS: (state, subjects) => {
        state.subjects = subjects
    },
    SET_SETTING (state, newSetting) {
        state.settings.push(newSetting)
    },
    SET_SETTINGS (state, settings) {
        state.settings = settings
    },
    SET_DEFAULT_SETTINGS (state, defaultSettings) {
        state.defaultSettings = defaultSettings
    },
}

export const actions = {
    async nuxtServerInit({commit}, {app}) {
        let res

        res = await app.$axios.get('/subjects/')
        commit('SET_SUBJECTS', res.data)

        res = await app.$axios.get('/default-settings/')
        commit('SET_DEFAULT_SETTINGS', res.data)

        res = await app.$axios.get('/settings/')
        commit('SET_SETTINGS', res.data)
    }
}
