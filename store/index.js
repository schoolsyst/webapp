import { toDate } from "date-fns"
import tinycolor from "tinycolor2"

export const state = () => ({
  now: toDate(Date.now()), // For time-dependent getters.
})

export const getters = {
  /* Why `=> () =>` ? To turn the getter into a function
   * and therefore prevent caching.
   */
  requireInitialSetup: (state, getters, rootState, rootGetters) => () => {
    const settings = rootGetters["settings/all"]
    // Non-optional settings that haven't been set by the user are considered "bad".
    const badSettings = settings.filter(
      (o) => o.isDefaultSetting && !o.optional
    )
    return badSettings.length > 0
  },
  textColor: (state, getters) => (backgroundColor) =>
    /* Returns the corresponding text color most visible
     * on backgroundColor: either 'black' or 'white'.
     */
    tinycolor(backgroundColor).isLight() ? "black" : "white",
}

export const mutations = {
  UPDATE_TIME: (state, newTime) => (state.now = newTime),
}

export const actions = {
  async loadAll({ dispatch }) {
    await dispatch("settings/load")
    await dispatch("subjects/load")
    await dispatch("homework/load")
    await dispatch("grades/load")
    await dispatch("schedule/loadEvents")
    await dispatch("schedule/loadMutations")
    await dispatch("notes/load")
    await dispatch("learndata/load")
  },

  async nuxtServerInit({ dispatch }) {
    await dispatch("loadAll")
  },
}

export const getMutations = (
  what,
  mapWith = (o) => o,
  pure = true,
  verbs = ["add", "set", "del", "patch"]
) => {
  /* Factory to create basic mutations while preserving DRYness of code
   * set, add, del & patch are booleans that—when set to false—disable
   * a particular mutation from being built & returned.
   *
   * @param pure: makes the function return solely the verb as the function name.
   *              useful for store modules consisting of *one* resource only.
   *              example: {SET:..., ADD:... ...} instead of {SET_THINGS:..., ADD_THING:... ...}
   *
   * @param what: the name of the resource. Will be used to calculate the
   *              state's array & mutations' names.
   * @param mapWith: a function to map each object to when putting into the state
   *                 Defaults to `o => o`
   */

  const mutations = {}
  const WHAT = pure ? "" : "_" + constantCase(what)

  if (verbs.includes("set"))
    mutations[`SET${WHAT}${pure ? "" : "S"}`] = (state, items) =>
      (state[what] = items.map(mapWith))
  if (verbs.includes("add"))
    mutations[`ADD${WHAT}`] = (state, item) => state[what].push(mapWith(item))
  if (verbs.includes("del"))
    mutations[`DEL${WHAT}`] = (state, uuid) =>
      (state[what] = state[what].filter((o) => o.uuid !== uuid))
  if (verbs.includes("patch"))
    mutations[`PATCH${WHAT}`] = (state, uuid, modifications) => {
      // Apply mapWith to modifications
      modifications = modifications.map(mapWith)
      // Get the requested item's index in the state array
      let idx = state[what].map((o) => o.uuid).indexOf(uuid)
      // Apply modifications
      Object.assign(state[what][idx], modifications)
    }
}
