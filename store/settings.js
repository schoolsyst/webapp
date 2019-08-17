export const state = () => ({
    settings: []
})

export const getters = { 
    allSettings(state, getters) {
        return state.settings
    },
    setting: (state, getters) => (key) => {
        let matchedSetting = getters.allSettings.filter(setting => setting.key === key)
        if (matchedSetting.length < 1)
            return null
        else
            return matchedSetting[0]
    },
    getTrimesterStartDate: (state, getters) => (trimester) => {
        switch (trimester) {
            case 1:
                return Date.parse(getters.setting('schedule/start'))
            case 2:
                return Date.parse(getters.setting('schedule/trimester2'))
            case 3:
                return Date.parse(getters.setting('schedule/trimester3'))
            // This is intentional, see the rest of the getter function to know why
            case 4:
                return Date.parse(getters.setting('schedule/end'))
        }
    },
    isSetup(state, getters) {
        return (
                getters.setting('schedule/start')
            &&  getters.setting('schedule/trimester2')
            &&  getters.setting('schedule/trimester3')
            &&  getters.setting('schedule/end')
            &&  getters.setting('schedule/offdays')
            &&  getters.setting('schedule/hours')
            &&  getters.setting('schedule/start_week_type')
            &&  getters.setting('defaults/grade_max')
            &&  getters.setting('defaults/grade_weight')
        )
    }
    
}

export const mutations = { 
    SET_SETTING (state, newSetting) {
        state.settings.push(newSetting)
    },
    SET_SETTINGS (state, settings) {
        state.settings = settings
    }
}

export const actions = {
    setSetting (store, setting) {
        store.commit('settings/SET_SETTING', setting)
    },
    setSettings(store, settings) {
        store.commit('settings/SET_SETTINGS', settings)
    }
}
