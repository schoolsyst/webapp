// Use the moment-range addon
import groupBy from "lodash.groupby"
import { parseISO, parse } from "date-fns"
import { getMutations } from "./index"

export const state = () => ({
  settings: [],
})

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

  if (multiple) {
    // Handle multiple values
    parsed = value
      .split("\n") // split by newlines
      .map((v) => v.replace("\r", "")) // remove windows fuckeries
      .map((v) =>
        // parse each value                  ↓ Prevents ∞ recursion
        parsedValue(v, { type, multiple: false, positive }, recursionLevel + 1)
      )
  } else {
    // Handle single values
    switch (type) {
      case "BOOLEAN":
        parsed = value === "true"
        break

      case "DATE":
        if (value.match(/\//g)) {
          parsed = parse(value, "dd/MM/yyyy", new Date())
        } else {
          parsed = parseISO(value)
        }
        break

      case "TIME":
        parsed = parse(value, "HH:mm:ss", new Date())
        break

      case "DATETIME":
        parsed = parseISO(value)
        break

      case "DATERANGE":
        // Gets the start and stop dates.
        let dates = value.split(" - ")
        // Parse each date
        dates = dates.map((date) =>
          parsedValue(
            date,
            {
              type: "DATE",
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

      case "TIMERANGE":
        // TODO
        throw new Error("TIMERANGE setting types are not available yet.")

      case "JSON":
        parsed = JSON.parse(value)
        break

      case "FLOAT":
        parsed = parseFloat(value)
        break

      case "INTEGER":
        parsed = parseInt(value)
        break

      case "TEXT":
      case "SELECT":
        parsed = value.trim()
        break

      default:
        parsed = value
    }
  }
  if (typeof parsed === "number" && positive) parsed = Math.abs(parsed)
  return parsed
}

export const getters = {
  all: (state, getters) => state.settings,
  one: (state, getters) => (propval, prop = "key") =>
    state.settings.find((o) => o[prop] === propval) || null,
  value: (state, getters) => (propval, prop = "key") => {
    const setting = getters.one(propval, prop)
    if (setting === null)
      throw new Error(
        `No setting with ${prop}=${propval}. Available ${prop}s: ${getters.all.map(
          (o) => o[prop]
        )}`
      )
    return setting.value
  },
  group: (state, getters) => (settings, { removeHidden }) => {
    /* Groups `settings` by category.
     * `removeHidden`: when set to true, categories that match the regex pattern below
     * get filtered out of the returned array:
     * ^__.+__$
     */
    if (removeHidden)
      settings = settings.filter((o) => !o.category.match(/^__.+__$/))
    settings = groupBy(settings, "category")
    return settings
  },
  grouped: (state, getters) =>
    getters.group(getters.all, { removeHidden: true }),
}

export const mutations = {
  SET: (state, { definitions, settings }) => {
    /* Set settings for the user, by combining a setting definition (SettinDefinition in the backend)
     * and a value (Setting.value in the backend)
     */
    definitions.forEach((definition) => {
      let value
      // Attempt to get the user's value for this setting definition
      const setting = settings.find((o) => o.setting.key === definition.key)
      // Set `value` property: if setting is undefined, fallback to the default
      // value, else use the one on the found setting
      const isDefaultValue = setting === undefined
      if (isDefaultValue) {
        value = definition.default
      } else {
        value = setting.value
      }
      // Convert to the appropriate JS representation of the value
      value = parsedValue(value, definition)
      /* Adds the definition to the state as a setting object + the value prop
       * and a bool to tell if the setting is set to the default value.
       */
      const hydratedDefinition = { ...definition, value, isDefaultValue }
      state.settings.push(hydratedDefinition)
    })
  },
  ...getMutations("setting", parsedValue, true, ["del", "add", "patch"]),
}

export const actions = {
  async fetchSettings({ commit }) {
    try {
      const { data } = await this.$axios.get(`/settings/`)
      // console.log(`[from API] GET /settings/: OK`)
      return data
    } catch (error) {
      // console.error(`[from API] GET /settings/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
      return null
    }
  },
  async fetchDefinitions({ commit }) {
    try {
      const { data } = await this.$axios.get(`/settings-definitions/`)
      // console.log(`[from API] GET /settings-definitions/: OK`)
      return data
    } catch (error) {
      // console.error(`[from API] GET /settings-definitions/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
      return null
    }
  },
  async loadSettings({ commit, state, dispatch }) {
    /* Computes the settings that should be used (state.settings)
     * from definitions and 'raw' settings returned directly by the API in fetchSettings
     */
    const definitions = (await dispatch("fetchDefinitions")) || []
    const settings = (await dispatch("fetchSettings")) || []
    commit("SET", { definitions, settings })
  },
  async postSetting({ commit }, setting) {
    try {
      const { data } = await this.$axios.post("/settings/", setting)
      if (data) commit("ADD", data)
      // console.log(`[from API] POST /settings/: OK`)
    } catch (error) {
      // console.error("[from API] POST /settings/: Error")
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async patchSetting({ commit }, uuid, modifications) {
    try {
      const { data } = await this.$axios.patch(
        `/settings/${uuid}`,
        modifications
      )
      if (data) commit("PATCH", uuid, data)
      // console.log(`[from API] PATCH /settings/${uuid}: OK`)
    } catch (error) {
      // console.error(`[from API] PATCH /settings/${uuid}: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
  async deleteSetting({ commit }, uuid) {
    try {
      const { data } = await this.$axios.delete(`/settings/${uuid}`)
      if (data) commit("DEL", uuid)
      // console.log(`[from API] DELETE /settings/${uuid}: OK`)
    } catch (error) {
      // console.error(`[from API] DELETE /settings/${uuid}: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // console.error(error)
      }
    }
  },
}
