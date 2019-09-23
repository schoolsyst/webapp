import flatten from 'lodash.flatten'

export const state = () => ({
    subjects: [],
    settings: [],
    defaultSettings: [],
})

export const getters = { 
    subjects: (state, getters) => state.subjects,
    allSettings: (state, getters) => state.settings,
    defaultSettings: (state, getters) => state.defaultSettings,

    setting: (state, getters) => (settingKey) => {
        let defaultSetting = getters.defaultSettings.find(setting => setting.key === settingKey)
        if (!defaultSetting) return null
        let userSetting = getters.allSettings.find(setting => setting.setting.key === settingKey)
        // Convert to boolean
        let defaultSettingDefault
        if (defaultSetting.kind == 'boolean') {
            defaultSettingDefault = defaultSetting.default === 'true' || defaultSetting.default === 'yes'
        } else {
            defaultSettingDefault = defaultSetting.default
        }
        if (!userSetting) {
            // add quotes to know if convertion occured correctly
            let q = typeof defaultSettingDefault === 'string' ? '"' : ''
            console.warn(`falling back to default value for setting ${settingKey}(=${q}${defaultSettingDefault}${q})`)
            return {
                ...defaultSetting,
                value: defaultSettingDefault,
                _is_default: true
            }
        }
        return Object.assign({}, defaultSetting, userSetting, {_is_default: false})
    },
    subjectBySlug: (state, getters) => (subjSlug) => {
        return state.subjects.find(subj => subj.slug === subjSlug)
    },
    requireInitialSetup(state, getters) {
        let ret 
        // Crude check, if not subjects or no settings are set, 
        // we obviously require a setup
        ret = !(state.subjects.length && state.settings.length)
        if(ret) return true

        ret = getters.setting('year_start')._is_default || getters.setting('year_end')._is_default
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
    ADD_SUBJECT (state, data) {
        state.subjects.push(data)
    },
    UPDATE_SUBJECT (state, { uuid, data }) {
        let subject = state.subjects.find(s => s.uuid === uuid)
        state.subjects = state.subjects.filter(s => s.uuid !== uuid)
        Object.assign(subject, data)
        state.subjects.push(subject)
    },
    DELETE_SUBJECT (state, uuid) {
        state.subjects = state.subjects.filter(s => s.uuid !== uuid)
    }
}

export const actions = {
    async nuxtServerInit({commit}, {app}) {
        console.group('----[ nuxtServerInit ]----')
        let res
        
        try {
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

            
            res = await app.$axios.get('/exercises/')
            commit('homework/SET_EXERCISES', res.data)
            console.log(`${res.data.length} exercise(s) set.`)

            res = await app.$axios.get("/tests/")
            commit("homework/SET_TESTS", res.data)
            console.log(`${res.data.length} test(s) set.`)
            
            let grades = flatten(res.data.map(test => test.grades))
            commit('homework/SET_GRADES', grades)
            console.log(`${grades.length} grade(s) set.`)
        } catch (error) {
            console.error(error)
        }

        console.groupEnd()
    }
}
