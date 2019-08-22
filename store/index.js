export const state = () => ({
    subjects: [],
    requireInitialSetup: false,
    settings: [],
    user: {}
})

export const getters = { 
    subjects: (state, getters) => {
        return state.subjects
    },
    allSettings: (state, getters) => state.settings,

    setting: (state, getters) => (settingName) => {
        let matchedSetting = getters.allSettings.filter(setting => setting.key === settingName)
        if (matchedSetting.length < 1)
            return null
        else
            return matchedSetting[0]
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
    }
}

export const actions = {

}
