// Use the moment-range addon
import groupBy from 'lodash.groupby'
import { parseISO, parse, isValid, formatISO } from 'date-fns'
import uniqBy from 'lodash.uniqby'
import debounce from 'lodash.debounce'
import Vue from 'vue'
import { getMutations } from './index'

export const state = () => ({
  settings: [],
  verboseChoices: {
    LIGHT: 'Clair',
    DARK: 'Sombre',
    AUTO: 'Automatique',
  },
})

export const getters = {
  all: (state, getters) => state.settings,
  fromCategory: (state, getters) => category =>
    state.settings.filter(s => s.category === category),
  one: (state, getters) => (propval, prop = 'key') =>
    state.settings.find(o => o[prop] === propval) || null,
  value: (state, getters) => (propval, fallback = null, prop = 'key') => {
    const setting = getters.one(propval, prop)
    if (setting === null)
      if (fallback !== null) return fallback
      else {
        // eslint-disable-next-line
        console.error(
          `No setting with ${prop}=${propval}. Available ${prop}s: ${getters.all.map(
            o => o[prop]
          )}`
        )
        return
      }
    return setting.value
  },
  group: () => (settings, { removeHidden }) => {
    /* Groups `settings` by category.
     * `removeHidden`: when set to true, categories that match the regex pattern below
     * get filtered out of the returned array:
     * ^__.+__$
     */
    if (removeHidden)
      settings = settings.filter(o => !o.category.match(/^__.+__$/))
    settings = groupBy(settings, 'category')
    return [...Object.entries(settings)]
  },
  grouped: (_, { group, all }) => group(all, { removeHidden: true }),
  userHasSetting: (_, { one }) => (propval, prop = 'key') => {
    const setting = one(propval, prop)
    return setting ? !setting.isDefaultValue : null
  },
}

export const mutations = {
  SET: (state, { definitions, settings }) => {
    /* Set settings for the user, by combining a setting definition (SettinDefinition in the backend)
     * and a value (Setting.value in the backend)
     */
    let hydratedSettings = []
    definitions.forEach(definition => {
      let value, uuid
      let { choices } = definition
      const { category } = definition
      // Attempt to get the user's value for this setting definition
      const setting = settings.find(o => o.setting.key === definition.key)
      // Set `value` property: if setting is undefined, fallback to the default
      // value, else use the one on the found setting
      const isDefaultValue = setting === undefined
      if (isDefaultValue) {
        value = definition.default
        uuid = null
      } else {
        value = setting.value
        uuid = setting.uuid
      }
      const rawValue = value
      // Convert to the appropriate JS representation of the value
      value = parsedValue(value, definition)
      if (choices) {
        choices = choices.split(',')
      }
      const hidden = category.startsWith('__') && category.endsWith('__')

      /* Adds the definition to the state as a setting object + the value prop
       * and a bool to tell if the setting is set to the default value.
       */
      const hydratedDefinition = {
        ...definition,
        choices,
        value,
        isDefaultValue,
        rawValue,
        uuid,
        hidden,
      }

      hydratedSettings.push(hydratedDefinition)
    })
    // Remove duplicate settings (by key)
    hydratedSettings = uniqBy(hydratedSettings, 'key')
    // Replace state's settings
    Vue.set(state, 'settings', hydratedSettings)
  },
  // eslint-disable-next-line
  ...getMutations(
    'setting',
    o => ({ ...o, value: parsedValue(o.value, o) }),
    true,
    ['del', 'add', 'patch'],
    'key',
    true
  ),
  // TODO validator: customConstraints from definitions
  // eg: if (definition.required) /* check if setting is not empty */ else return true
  // eg2: try { parseValue(definition.type, setting.value) } catch (e) { return false }
}

export const actions = {
  async fetchSettings({ commit }) {
    try {
      const { data } = await this.$axios.get(`/settings/`)
      // console.log(`[from API] GET /settings/: OK`)
      return data
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  },
  async fetchDefinitions({ commit }) {
    try {
      const { data } = await this.$axios.get(`/settings-definitions/`)
      // console.log(`[from API] GET /settings-definitions/: OK`)
      return data
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  },
  async load({ commit, state, dispatch }, force = false) {
    /* Computes the settings that should be used (state.settings)
     * from definitions and 'raw' settings returned directly by the API in fetchSettings
     */
    if (!force && state.settings.length) return
    const definitions = (await dispatch('fetchDefinitions')) || []
    const settings = (await dispatch('fetchSettings')) || []
    commit('SET', { definitions, settings })
  },
  async post({ commit }, { setting, early }) {
    early = early || false
    setting = {
      ...setting,
      value: stringifiedValue(setting.value),
      user: this.$auth.user.id,
    }
    if (early) commit('PATCH', { modifications: setting })
    const res = await this.$axios.post('/settings/', setting)
    const { data } = await this.$axios.get(`/settings/${res.data.setting}/`)
    if (data) commit('PATCH', { modifications: data })
    // console.log(`[from API] POST /settings/: OK`)
  },
  async patch({ commit, getters }, { key, modifications, early }) {
    early = early || false
    const type = getters.one(key).type
    if (Object.prototype.hasOwnProperty.call(modifications, 'value')) {
      modifications.value = stringifiedValue({
        value: modifications.value,
        type,
      })
    }
    if (early) {
      commit('PATCH', { pk: key, modifications })
    }
    const res = await this.$axios.patch(`/settings/${key}/`, modifications)
    const { data } = await this.$axios.get(`/settings/${res.data.setting}/`)
    if (data) commit('PATCH', { pk: key, modifications: data })
  },
  async delete({ commit }, key) {
    try {
      const { data } = await this.$axios.delete(`/settings/${key}`)
      if (data) commit('DEL', key)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  },
  async userHasSetting(_, { key }) {
    try {
      await this.$axios.get(`/settings/${key}/`)
      return true
    } catch (error) {
      return false
    }
  },
  setValue: debounce(
    async function({ getters, dispatch }, { key, value, force, early }) {
      force = force || false
      early = early === undefined ? true : early
      try {
        // Check if the value is coherent with the setting's type
        // TODO: put this into a checkValueType function
        if (!force) {
          const type = getters.one(key).type
          let typeIsCorrect = true
          switch (type) {
            case 'DATE':
              typeIsCorrect = isValid(value)
              break

            default:
              break
          }
          if (!typeIsCorrect) {
            console.error(
              `settings#setValue: ${JSON.stringify(value)} should be a ${type}`
            )
          }
        }
        // User already has that setting
        if (await dispatch('userHasSetting', { key })) {
          await dispatch('patch', {
            key,
            modifications: { value },
            early,
          })
          // The setting exist but that user has never set a value
        } else if (getters.one(key)) {
          await dispatch('post', {
            setting: {
              setting: key,
              value,
            },
            early,
          })
          // The setting does not exist
        } else {
          this.$toast.error("Ce réglage n'exsite pas", {
            icon: 'error_outline',
          })
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
      }
    },
    500,
    { trailing: false, leading: true }
  ),
  async toggle({ dispatch, getters }, { key, force }) {
    const setting = getters.one(key)
    if (setting.type !== 'BOOLEAN') {
      console.error(
        `Can't toggle ${key}: ${key} is not a BOOLEAN but a ${setting.type}`
      )
      return
    }
    const value = !setting.value
    await dispatch('setValue', { key, force, value, early: true })
  },
}

const parsedValue = (
  value,
  { type, multiple, positive },
  recursionLevel = 0 // <-- Debug purposes only
) => {
  /* Considers the setting's type to determine how to parse a value.
   * If the type is not known, returns the value as-is.
   *
   * @param value: the setting's value to parse
   * @params {...} : different properties of a SettingDefinition object.
   */
  let parsed
  if (value === null) return null
  if (value.trim() === '') {
    if (multiple) return []
    else return null
  }

  if (multiple) {
    // Handle multiple values
    parsed = value
      .split('\n') // split by newlines
      .map(v => v.replace('\r', '')) // remove windows fuckeries
      .map(v =>
        // parse each value                  ↓ Prevents ∞ recursion
        parsedValue(v, { type, multiple: false, positive }, recursionLevel + 1)
      )
  } else {
    // Handle single values
    switch (type) {
      case 'BOOLEAN':
        parsed = value === 'true'
        break

      case 'DATE':
        if (value.match(/\//g)) {
          parsed = parse(value, 'dd/MM/yyyy', new Date())
        } else {
          parsed = parseISO(value)
        }
        break

      case 'TIME':
        parsed = parse(value, 'HH:mm:ss', new Date())
        break

      case 'DATETIME':
        parsed = parseISO(value)
        break

      case 'DATERANGE': {
        // Gets the start and stop dates.
        let dates = value.split(' - ')
        // Parse each date
        dates = dates.map(date =>
          parsedValue(
            date,
            {
              type: 'DATE',
              multiple: false,
              positive: false,
            },
            recursionLevel + 1
          )
        )
        // If we don't have exactly two dates (start - stop), sets to the first date only. Else, create the range.
        parsed =
          dates.length === 2
            ? { start: dates[0], end: dates[1] }
            : (parsed = dates[0])
        break
      }
      case 'TIMERANGE':
        // TODO
        throw new Error('TIMERANGE setting types are not available yet.')

      case 'JSON':
        parsed = JSON.parse(value)
        break

      case 'FLOAT':
        parsed = parseFloat(value)
        break

      case 'INTEGER':
        parsed = parseInt(value)
        break

      case 'TEXT':
      case 'SELECT':
        parsed = value.trim()
        break

      default:
        parsed = value
    }
  }
  if (typeof parsed === 'number' && positive) parsed = Math.abs(parsed)
  return parsed
}

const stringifiedValue = ({ value, type }) => {
  // TODO: Handle multiple values
  switch (type) {
    case 'DATE':
    case 'TIME':
    case 'DATETIME':
      return formatISO(value, {
        representation: {
          DATE: 'complete',
          TIME: 'time',
          DATETIME: 'complete',
        }[type],
      })

    case 'BOOLEAN':
      return value ? 'true' : 'false'

    default:
      return value
  }
}
