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
        if (!userSetting) {
            console.warn(`falling back to default value for setting ${settingKey}(=${defaultSetting.default})`)
            return {
                ...defaultSetting,
                value: defaultSetting.default   
            }
        }
        return Object.assign({}, defaultSetting, userSetting.setting)
    },
    subjectBySlug: (state, getters) => (subjSlug) => {
        return state.subjects.find(subj => subj.slug === subjSlug)
    },
}

export const mutations = {
    SET_SUBJECTS: (state, subjects) => {
        state.subjects = subjects
    },
    SET_SETTING (state, newSetting) {
        state.settings.push(newSetting)
    },
    SET_DEFAULT_SETTINGS (state, defaultSettings) {
        state.defaultSettings = defaultSettings
    },
    SET_SETTINGS (state, settings) {
        state.settings = settings
    },
}

export const actions = {
    async nuxtServerInit({commit}, {app}) {
        console.group('nuxtServerInit')
        let res

        res = await app.$axios.get('/subjects/')
        commit('SET_SUBJECTS', res.data)
        console.log(`${res.data.length} subject(s) set.`)

        res = await app.$axios.get('/default-settings/')
        commit('SET_DEFAULT_SETTINGS', res.data)
        console.log(`${res.data.length} default-setting(s) set.`)

        res = await app.$axios.get('/settings/')
        commit('SET_SETTINGS', res.data)
        console.log(`${res.data.length} setting(s) set.`)

        res = await app.$axios.get("/events/")
        commit("schedule/SET_EVENTS", res.data)
        console.log(`${res.data.length} event(s) set.`)

        res = await app.$axios.get("/event-additions/")
        commit("schedule/SET_ADDITIONS", res.data)
        console.log(`${res.data.length} event-addition(s) set.`)

        res = await app.$axios.get("/event-deletions/")
        commit("schedule/SET_DELETIONS", res.data)
        console.log(`${res.data.length} event-deletion(s) set.`)

        res = await app.$axios.get('/notes/')
        commit('notes/SET_NOTES', res.data)
        console.log(`${res.data.length} note(s) set.`)

        res = await app.$axios.get("/tests/")
        commit("homework/SET_TESTS", res.data)
        console.log(`${res.data.length} test(s) set.`)

        res = await app.$axios.get('/exercises/')
        commit('homework/SET_EXERCISES', res.data)
        console.log(`${res.data.length} exercise(s) set.`)

        res = await app.$axios.get('/grades/')
        commit('homework/SET_GRADES', res.data)
        console.log(`${res.data.length} grade(s) set.`)

        console.groupEnd()
    }
}
