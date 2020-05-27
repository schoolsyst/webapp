import { isBefore } from 'date-fns'
type Gender = 'F' | 'M'
type CheckerName =
  | 'maximum'
  | 'minimum'
  | 'maxLength'
  | 'required'
  | 'notEmpty'
  | 'isAWeekType'
  | 'before'
  | 'isAnEmail'
  | 'isOfType'
  | 'isAColor'

export const getValidator = ({
  constraints,
  resourceName,
  fieldNames,
  customConstraints = [],
  debug,
}: {
  constraints: Record<CheckerName, Record<any, string[]> | string[]>
  resourceName: {
    name: string
    gender: Gender
    article: string | null
    indeterminateArticle: string | null
  }
  fieldNames: Record<string, { name: string; gender: Gender }>
  customConstraints: {
    message: string
    field: string | null
    constraint: (getters: object, object: object) => boolean
  }[]
  debug: boolean
}) => getters => (object: Record<string, any>) => {
  debug = debug || false
  if (process.env.NODE_ENV !== 'development') debug = false
  /* Factory to create a validator.
  Describe constraints on fields, error messages are generated automatically.
  */

  if (debug) {
    console.group(`[validator] validating resource "${resourceName.name}"`) // eslint-disable-line
    console.log(`Constraints:`) // eslint-disable-line
    console.log({ ...constraints, ...customConstraints }) // eslint-disable-line
    console.log(`Fields:`) // eslint-disable-line
    console.log(
      // eslint-disable-line
      Object.fromEntries(
        Object.keys(fieldNames).map(field => [field, object[field]])
      )
    )
  }

  // Article in french
  const article = (noun: string, feminine: boolean, indeterminate = false) => {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y']
    if (vowels.includes(noun[0]) && !indeterminate) return "l'"
    else if (feminine) return indeterminate ? 'une ' : 'la '
    else return indeterminate ? 'un ' : 'le '
  }

  // Resource name article & indeterminate article
  resourceName.article = article(
    resourceName.name,
    resourceName.gender === 'F',
    false
  )
  resourceName.indeterminateArticle = article(
    resourceName.name,
    resourceName.gender === 'F',
    true
  )

  // Uppercase first char
  const upperFirst = (string: string) => string[0].toUpperCase() + string.slice(1)

  // Checkers

  const checkers: {
    [key in CheckerName]: ({
      arg,
      fieldName,
    }: {
      arg: any
      fieldName: string
    }) => boolean
  } = {
    maximum: ({ arg, fieldName }) =>
      object[fieldName] === null ||
      (typeof object[fieldName] === 'number' && object[fieldName] <= arg),
    minimum: ({ arg, fieldName }) =>
      object[fieldName] === null ||
      (typeof object[fieldName] === 'number' && object[fieldName] >= arg),
    maxLength: ({ arg, fieldName }) =>
      typeof object[fieldName] === 'string'
        ? object[fieldName].length <= arg
        : true,
    required: ({ arg, fieldName }) =>
      Object.prototype.hasOwnProperty.call(object, fieldName) &&
      object[fieldName] !== null,
    notEmpty: ({ arg, fieldName }) =>
      object[fieldName] && object[fieldName].trim().length > 0,
    isAWeekType: ({ arg, fieldName }) =>
      ['Q1', 'Q2', 'BOTH'].includes(object[fieldName]),
    before: ({ arg, fieldName }) => isBefore(object[fieldName], object[arg]),
    isAColor: ({ arg, fieldName }) =>
      object[fieldName].match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) !== null,
    isAnEmail: ({ arg, fieldName }) =>
      // regex source: https://emailregex.com/
      typeof object[fieldName] === 'string' &&
      object[fieldName].match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) !== null,
    isOfType: ({ arg, fieldName }) =>
      // eslint-disable-next-line valid-typeof
      typeof object[fieldName] === arg,
  }
  const check = ({
    errorName,
    fieldName,
    errorArg,
  }: {
    errorName: CheckerName
    fieldName: string
    errorArg: any
  }) => {
    // Wrap checkers with object property existential check
    /* Special case for required, which checks if the property exist
       and returnes *false* instead.
    */
    if (
      errorName !== 'required' &&
      !Object.prototype.hasOwnProperty.call(object, fieldName)
    ) {
      return true
    }
    return checkers[errorName]({ arg: errorArg, fieldName })
  }

  // Error messages
  const message = ({
    errorName,
    errorArg,
    fieldName,
  }: {
    errorName: CheckerName
    errorArg: any
    fieldName: string
  }): string => {
    const { gender, name } = fieldNames[fieldName]
    const fieldIsFeminine = gender === 'F'
    const determinateArticle = article(name, fieldIsFeminine, false)
    const indeterminateArticle = article(name, fieldIsFeminine, true)
    const argNameWithArticle =
      article(
        fieldNames[fieldName].name,
        fieldNames[fieldName].gender === 'F',
        false
      ) + fieldNames[fieldName].name
    const fieldNameWithArticle = determinateArticle + name
    return upperFirst(
      {
        maximum: `${fieldNameWithArticle} ne doit pas dépasser ${errorArg}`,
        minimum: `${fieldNameWithArticle} doit être d'au moins ${errorArg}`,
        maxLength: `${fieldNameWithArticle} ne doit pas dépasser ${errorArg} caractère${
          errorArg === 1 ? '' : 's'
          }`,
        required: `Veuillez renseigner ${indeterminateArticle}${name}`,
        isAWeekType: `${fieldNameWithArticle} doit être paire, impaire ou les deux.`,
        before: `${fieldNameWithArticle} doit être avant ${argNameWithArticle}`,
        isAColor: `${fieldNameWithArticle} doit être une couleur au format hexadécimal. Exemple: #09f ou #0479cf`,
        notEmpty: `${fieldNameWithArticle} est requis${
          fieldIsFeminine ? 'e' : ''
          }`,
        isAnEmail:
          name === 'adresse email'
            ? `${fieldNameWithArticle} doit être valide`
            : `${fieldNameWithArticle} doit être une adresse email valide`,
      }[errorName]
    )
  }

  // Stores the errors
  const errorMessages: Record<string, string[]> = {}
  // Fill each field with an empty array
  Object.keys(fieldNames).forEach(field => {
    errorMessages[field] = []
  })
  let validated = true

  // Go through the constraints
  for (const errorName in constraints) {
    if (Object.prototype.hasOwnProperty.call(constraints, errorName)) {
      const fieldsOrArgs = constraints[errorName]
      // No arguments, field names are passed directly
      // eslint-disable-next-line
      if (fieldsOrArgs instanceof Array) {
        fieldsOrArgs.forEach(fieldName => {
          if (!check({ errorName, fieldName, errorArg: null })) {
            // Some error occured, add the error message
            errorMessages[fieldName].push(
              message({ errorName, fieldName, errorArg: null })
            )
            validated = false
          }
        })
      }
      // Error arguments, multiple cases. eg: maximum
      else {
        for (const errorArg in fieldsOrArgs) {
          if (Object.prototype.hasOwnProperty.call(fieldsOrArgs, errorArg)) {
            const fields = fieldsOrArgs[errorArg]
            fields.forEach(fieldName => {
              if (!check({ errorName, fieldName, errorArg })) {
                errorMessages[fieldName].push(
                  message({ errorName, fieldName, errorArg })
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
  customConstraints.forEach(({ message, constraint, field }) => {
    if (!constraint(getters, object)) {
      field = field === null ? 'nonFieldErrors' : field
      if (Object.prototype.hasOwnProperty.call(errorMessages, field)) {
        errorMessages[field].push(message)
      } else {
        errorMessages[field] = [message]
      }
      validated = false
    }
  })

  // Creates a single string that reports all of the errors.
  // Get the total errors count
  let flatErrorMessage = ''
  let errorsCount = 0
  for (const field in errorMessages) {
    if (Object.prototype.hasOwnProperty.call(errorMessages, field)) {
      const errors = errorMessages[field]
      if (errors.length) {
        flatErrorMessage += errors.join(', ') + '\n'
        errorsCount += errors.length
      }
    }
  }

  // returns the object
  const ret = {
    validated,
    errors: errorMessages,
    message: flatErrorMessage,
    count: errorsCount,
  }
  if (debug) {
    if (ret.validated) {
      console.log('Validated.')
    } else {
      console.log('Errors:')
      Object.entries(ret.errors).forEach(([name, errors]) => {
        if (errors.length) {
          console.log(`    ${name}:`)
          console.log(errors)
        }
      })
    }
    console.groupEnd()
  }

  return ret
}

export const getMutations = (
  what,
  mapWith = o => o,
  pure = true,
  verbs = ['add', 'set', 'del', 'patch'],
  primaryKey = 'uuid',
  debug = false
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
   * @param primaryKey: the name of the primary key used for mutations acting on a single object.
   * @param debug: Log every mutation if true
   */

  const mutations = {}
  const WHAT = pure ? '' : '_' + constantCase(what)
  const whats = what + 's'

  if (verbs.includes('set'))
    mutations[`SET${WHAT}${pure ? '' : 'S'}`] = (state, items) => {
      if (debug) {
        console.group(`${whats}/SET`)
        console.log('before:')
        console.log(state[whats])
      }
      Vue.set(state, whats, items.map(mapWith))
      if (debug) {
        console.log('after:')
        console.log(state[whats])
        console.groupEnd()
      }
    }
  if (verbs.includes('add'))
    mutations[`ADD${WHAT}`] = (state, item) => {
      if (debug) {
        console.group(`${whats}/ADD`)
        console.log('item:')
        console.log(item)
        console.log('before:')
        console.log(state[whats])
      }
      Vue.set(state, whats, [...state[whats], mapWith(item)])
      if (debug) {
        console.log('after:')
        console.log(state[whats])
        console.groupEnd()
      }
    }
  if (verbs.includes('del'))
    mutations[`DEL${WHAT}`] = (state, pk) => {
      if (debug) {
        console.group(`${whats}/DEL`)
        console.log('item:')
        console.log(state[whats][pk])
        console.log('before:')
        console.log(state[whats])
      }
      Vue.set(
        state,
        whats,
        state[whats].filter(o => o[primaryKey] !== pk)
      )
      if (debug) {
        console.log('after:')
        console.log(state[whats])
        console.groupEnd()
      }
    }
  if (verbs.includes('patch'))
    mutations[`PATCH${WHAT}`] = (state, { pk, modifications }) => {
      if (debug) {
        console.group(`${whats}/PATCH`)
        console.log('before:')
        console.log(state[whats])
      }
      // Get the requested item's index in the state array
      const idx = state[whats].map(o => o[primaryKey]).indexOf(pk)
      // Apply modifications
      let item = { ...state[whats][idx], ...modifications }
      // Re-run mapWith
      item = mapWith(item)
      // Set in store
      Vue.set(state[whats], idx, item)
      if (debug) {
        console.log('item:')
        console.log(item)
        console.log('after:')
        console.log(state[whats])
        console.groupEnd()
      }
    }

  return mutations
}
