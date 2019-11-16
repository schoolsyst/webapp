import { toDate, addDays } from "date-fns"
import tinycolor from "tinycolor2"
import constantCase from 'constant-case'

export const state = () => ({
	now: toDate(Date.now()), // For time-dependent getters.
	tomorrow: addDays(toDate(Date.now()), 1)
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
    /* returns the corresponding text color most visible
     * on backgroundColor: either 'black' or 'white'.
     */
    tinycolor(backgroundColor).isLight() ? "black" : "white",
}

export const mutations = {
  UPDATE_TIME: (state, newTime) => {
    state.now = newTime
    state.tomorrow = addDays(newTime, 1)
  },
}

export const actions = {
  async loadAll({ dispatch }) {
    await dispatch("settings/load")
    await dispatch("subjects/load")
    await dispatch("homework/load")
    await dispatch("grades/load")
    await dispatch("schedule/load")
    await dispatch("notes/load")
    await dispatch("learndata/load")
  },

  async nuxtServerInit({ dispatch }) {
    await dispatch("settings/load")
    await dispatch("subjects/load")
  },
}

export const getValidator = ({ 
  constraints,
  resourceName,
  fieldNames
}) => async ({getters}, object) => {
  /* Factory to create a validator.
  Describe constraints on fields, error messages are generated automatically.
  */

  // Article in french
  const article = (noun, feminine, indeterminate = false) => {
    const vowels = ["a", "e", "i", "o", "u", "y"]
    if (vowels.includes(noun[0]) && !indeterminate)
      return "l'"
    else if (feminine)
      return indeterminate ? "une " : "la "
    else
      return indeterminate ? "un " : "le "
  }

  // Resource name article & indeterminate article
  resourceName.article = article(resourceName.name, resourceName.gender === 'F', false)
  resourceName.indeterminateArticle = article(resourceName.name, resourceName.gender === 'F', true)

  // Uppercase first char
  const upperFirst = (string) => string[0].toUpperCase() + string.slice(1)

  // Checkers
  const checkers = {
    maximum: ({arg, fieldName}) => 
      object[fieldName] <= arg,
    minimum: ({arg, fieldName}) => 
      object[fieldName] >= arg,
    maxLength: ({arg, fieldName}) => 
      object[fieldName].length <= arg,
    required: ({arg, fieldName}) => 
      object.hasOwnProperty(fieldName) && object[fieldName] !== null
  }
  const check = ({errorName, fieldName, errorArg}) => {
    // Wrap checkers with object property existential check
    /* Special case for required, which checks if the property exist
       and returnes *false* instead.
    */
    if (errorName !== 'required' 
        && !object.hasOwnProperty(fieldName)) {
        return true
    }
    return checkers[errorName]({arg: errorArg, fieldName})
  }

  // Error messages
  const message = ({errorName, errorArg, fieldName}) => {
    const {gender, name} = fieldNames[fieldName]
    const fieldIsFeminine = gender === 'F'
    const determinateArticle = article(name, fieldIsFeminine, false)
    const indeterminateArticle = article(fieldIsFeminine, fieldIsFeminine, true)
    return upperFirst({
      maximum: `${determinateArticle}${name} ne doit pas dépasser ${errorArg}`,
      minimum: `${determinateArticle}${name} doit être d'au moins ${errorArg}`,
      maxLength: `${determinateArticle}${name} est trop long${fieldIsFeminine ? "ue" : ""}. (Taille maximale: ${errorArg})`,
      required: `Veuillez donner ${indeterminateArticle}${name} à ${resourceName.article}${resourceName.name}`
    }[errorName])
  }

  // Stores the errors
  let errorMessages = {}
  // Fill each field with an empty array
  Object.keys(fieldNames).forEach((field) => {errorMessages[field] = []})
  let validated = true

  // Go through the constraints
  for (const errorName in constraints) {
    if (constraints.hasOwnProperty(errorName)) {
      const fieldsOrArgs = constraints[errorName];
      // No arguments, field names are passed directly
      if (fieldsOrArgs instanceof Array) {
        fieldsOrArgs.forEach(fieldName => {
          if (!check({errorName, fieldName, errorArg: null})) {
            // Some error occured, add the error message
            errorMessages[fieldName].push(
              message({errorName, fieldName, errorArg: null})
            )
            validated = false
          }
        });
      } 
      // Error arguments, multiple cases. eg: maximum
      else {
        for (const errorArg in fieldsOrArgs) {
          if (fieldsOrArgs.hasOwnProperty(errorArg)) {
            const fields = fieldsOrArgs[errorArg];
            fields.forEach((fieldName) => {
              if (!check({errorName, fieldName, errorArg})) {
                errorMessages[fieldName].push(
                  message({errorName, fieldName, errorArg})
                )
                validated = false
              }
            })
          }
        }
      }
    }
  }

  // returns the object
  return {
    validated,
    errors: errorMessages
  }
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
  const whats = what + 's'

  if (verbs.includes("set"))
    mutations[`SET${WHAT}${pure ? "" : "S"}`] = (state, items) =>
      (state[whats] = items.map(mapWith))
  if (verbs.includes("add"))
    mutations[`ADD${WHAT}`] = (state, item) => state[whats].push(mapWith(item))
  if (verbs.includes("del"))
    mutations[`DEL${WHAT}`] = (state, uuid) =>
      (state[whats] = state[whats].filter((o) => o.uuid !== uuid))
  if (verbs.includes("patch"))
    mutations[`PATCH${WHAT}`] = (state, uuid, modifications) => {
      // Apply mapWith to modifications
      modifications = modifications.map(mapWith)
      // Get the requested item's index in the state array
			let idx = state[whats].map((o) => o.uuid).indexOf(uuid)
			// Apply modifications
			Object.assign(state[whats][idx], modifications)
		}

		return mutations
}
