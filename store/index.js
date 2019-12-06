import { toDate, addDays, isBefore, format } from "date-fns"
import tinycolor from "tinycolor2"
import constantCase from 'constant-case'

export const state = () => ({
	now: toDate(Date.now()), // For time-dependent getters.
  tomorrow: addDays(toDate(Date.now()), 1),
  links: [
    { 
        name: 'Timeline',
        href: '/timeline', 
        icon: 'timeline' ,
        id:   'timeline'
    },
    { 
        name: 'Cours',
        href: '/notes', 
        icon: 'insert_drive_file' ,
        id:   'notes'
    },
    { 
        name: 'Devoirs',
        href: '/homework', 
        icon: 'book' ,
        id:   'homework'
    },
    { 
        name: 'Emploi du temps',
        href: '/schedule', 
        icon: 'today' ,
        id:   'schedule'
    },
    { 
        name: 'Notes',
        href: '/grades', 
        icon: 'school' ,
        id:   'grades'
    },
    { 
        name: 'Sac',
        href: '/bag', 
        icon: 'work_outline',
        id:   'bag'
    },
    'separator',
    {
        name: 'Réglages',
        href: '/settings',
        icon: 'settings',
        id:   'settings'
    },
    {
        name: 'Signaler un bug',
        href: '/bug-report',
        icon: 'bug_report',
        id:   'bug-report'
    }
],
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
  formatTime: (state, getters) => (time) => {
    if (time === null) return null
    return format(time, 'HH:mm')
  },
  drawerLinks: (state) => (state.links),
  sideRailLinks: (state) => {
    let links = state.links
    return links.filter((link) => {
      if (link === 'separator') return false
      return ['timeline', 'notes', 'homework', 'schedule', 'grades'].includes(link.id)
    })
  }
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
  fieldNames,
  customConstraints = []
}) => (getters) => (object) => {
  /* Factory to create a validator.
  Describe constraints on fields, error messages are generated automatically.
  */

  console.group(`[validator] validating resource "${resourceName.name}"`)
  console.log(`Constraints:`)
  console.log({...constraints, ...customConstraints})
  console.log(`Fields:`)
  console.log(Object.fromEntries(
    Object.keys(fieldNames).map((field) => [field, object[field]])
  ))

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
      object.hasOwnProperty(fieldName) && object[fieldName] !== null,
    notEmpty: ({arg, fieldName}) =>
      object[fieldName].length > 0,
    isAHomeworkType: ({arg, fieldName}) =>
      ['TEST', 'DM', 'EXERCISE', 'TOBRING'].includes(object[fieldName]),
    isAWeekType: ({arg, fieldName}) =>
      ['Q1', 'Q2', 'BOTH'].includes(object[fieldName]),
    before: ({arg, fieldName}) =>
      isBefore(object[fieldName], object[arg]),
    isAColor: ({arg, fieldName}) =>
      object[fieldName].match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) !== null,
    isAnEmail: ({arg, fieldName}) =>
      // regex source: https://emailregex.com/
      object[fieldName].match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null
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
    const indeterminateArticle = article(name, fieldIsFeminine, true)
    const argNameWithArticle = article(
      fieldNames[fieldName].name,
      fieldNames[fieldName].gender === 'F',
      false
    ) + fieldNames[fieldName].name
    const fieldNameWithArticle = determinateArticle + name
    return upperFirst({
      maximum: `${fieldNameWithArticle} ne doit pas dépasser ${errorArg}`,
      minimum: `${fieldNameWithArticle} doit être d'au moins ${errorArg}`,
      maxLength: `${fieldNameWithArticle} ne doit pas dépasser ${errorArg} caractère${errorArg === 1 ? '' : 's'}`,
      required: `Veuillez renseigner ${indeterminateArticle}${name}`,
      isAHomeworkType: `${fieldNameWithArticle} doit être un contrôle, un exercice, un DM ou quelque chose à apporter.`,
      isAWeekType: `${fieldNameWithArticle} doit être Q1, Q2 ou les deux.`,
      before: `${fieldNameWithArticle} doit être avant ${argNameWithArticle}`,
      isAColor: `${fieldNameWithArticle} doit être une couleur au format hexadécimal. Exemple: #09f ou #0479cf`,
      notEmpty: `${fieldNameWithArticle} est requis${fieldIsFeminine ? 'e' : ''}`,
      isAnEmail: 
        name === 'adresse email'
          ? `${fieldNameWithArticle} doit être valide`
          : `${fieldNameWithArticle} doit être une adresse email valide`
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

  // Go through custom constraints
  customConstraints.forEach(({message, constraint, field}) => {
    if (!constraint(getters, object)) {
      field = field === null ? 'nonFieldErrors' : field
      if (errorMessages.hasOwnProperty(field)) {
        errorMessages[field].push(message)
      } else {
        errorMessages[field] = [message]
      }
      validated = false
    }
  })

  // returns the object
  const ret = {
    validated,
    errors: errorMessages
  }
  if (ret.validated) {
    console.log('Validated.')
  } else {
    console.log('Errors:')
    Object.entries(ret.errors).forEach(([name, errors]) => {
      if (errors.length) {
        console.log(`    ${name}:`)
        console.log(errors)
      }
    });
  }
  console.groupEnd()

  return ret
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
