import { getValidator, getMutations } from './index'
import { formatISO } from 'date-fns'
const UAParser = require('ua-parser-js')

export const state = () => ({
  reports: []
})

export const getters = {
  all: ({reports}) => reports,
  validate: getValidator({
    fieldNames: {
      type:     { gender: 'M', name: 'type de demande' },
      title:    { gender: 'M', name: 'titre'           },
      content:  { gender: 'M', name: 'message'         },
      happened: { gender: 'M', name: 'date' }
    },
    resourceName:{ gender: 'M', name: 'Rapport' },
    constraints: {
      notEmpty: ['title', 'type', 'content'],
    },
    debug: true
  })
}

export const mutations = {
  ...getMutations('report')
}

export const actions = {
  post({ getters, commit }, { data, force }) {
    force = force || false
    let { browser, cpu, os  } = UAParser(window.userAgent)
    if ('happened' in data) data.happened = formatISO(data.happened)
    data = {
      user: this.$auth.user.id,
      browser: `${browser.name}/${browser.version}`,
      os: `${cpu.architecture}/${os.name}/${os.version}`,
      language: 'fr',
      ...data
    }
    if(!force) {
      const validation = getters.validate(data)
      if (!validation.validated) return false
    }
    try {
      const res = this.$axios.post('reports/', data)
    } catch (error) {
      console.error(error)
    }
  }
}
