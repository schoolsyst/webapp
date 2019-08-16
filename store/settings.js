export const state = () => ({
    settings: []
})

export const getters = { 
    allSettings(state, getters) {
        return state.settings
    },
    setting: (state, getters) => (key) => {
        return getters.allSettings.filter(setting => setting.key === key)[0]
    },
    getTrimesterStartDate: (state, getters) => (trimester) => {
        switch (trimester) {
            case 1:
                return Date.parse(getters.setting('schedule/start'))
            case 2:
                return Date.parse(getters.setting('schedule/trimester2start'))
            case 3:
                return Date.parse(getters.setting('schedule/trimester3start'))
            // This is intentional, see the rest of the getter function to know why
            case 4:
                return Date.parse(getters.setting('schedule/end'))
        }
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
