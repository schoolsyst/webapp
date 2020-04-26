/*
 CLARIFICATION: event(s) vs course(s)
 - events are "base" events as returned by the /events/ API endpoint.
   They describe a normal week of the year
 - courses are events, with deletions, additions and offdays applied.
   They have a `date` attribute and describe a *particular* week, 
   and thus are tied to a date range, a specific week of the year.
*/

// Use moment-range
import { firstBy } from 'thenby'
import {
  parseISO,
  startOfWeek,
  endOfWeek,
  getISODay,
  getISOWeek,
  isWithinInterval,
  eachDayOfInterval,
  isBefore,
  isSameDay,
  isSameMinute,
  isDate,
  isAfter,
  setMinutes,
  setSeconds,
  setHours,
  endOfDay,
  startOfDay,
  addWeeks,
  parse,
  isEqual,
  formatISO,
  setDate,
  setMonth,
  setYear,
} from 'date-fns'
import { getMutations, getValidator } from './index'

export const state = () => ({
  events: [],
  mutations: [],
  loadedMutations: false,
})

const _mergeDateAndTime = (date, time) => {
  // Assuming `time` uses the ISO format "HH:mm:ss"
  const [hours, minutes, seconds] = time.split(':')
  date = setHours(date, hours)
  date = setMinutes(date, minutes)
  date = setSeconds(date, seconds)
  return date
}

export const getters = {
  events: ({ events }) => events,
  mutations: ({ mutations }) => mutations,
  event: (state, { events }) => (value, prop = 'uuid') =>
    events.find(o => o[prop] === value) || null,
  mutation: (state, { mutations }) => (value, prop = 'uuid') =>
    mutations.find(o => o[prop] === value) || null,
  course: (state, { currentWeekCourses }) => (value, prop = 'uuid') =>
    currentWeekCourses.find(o => o[prop] === value) || null,
  trimester: (state, getters, rootState, rootGetters) => idx => {
    /*
     *  Returns an Interval to test dates against using isWithinInterval(date, Interval)
     */
    // Bounds
    const yearStart = rootGetters['settings/value']('year_start')
    const trimester2start = rootGetters['settings/value']('trimester_2_start')
    const trimester3start = rootGetters['settings/value']('trimester_3_start')
    const yearEnd = rootGetters['settings/value']('year_end')
    // Ranges
    const trimester1 = { start: yearStart, end: trimester2start }
    const trimester2 = { start: trimester2start, end: trimester3start }
    const trimester3 = { start: trimester3start, end: yearEnd }
    // Choose which interval to return
    if (idx === 1) return trimester1
    if (idx === 2) return trimester2
    if (idx === 3) return trimester3
    // Invalid index
    throw new Error(`Trimester #${idx} does not exist.`)
  },
  isOffday: (state, getters, rootState, rootGetters) => date => {
    /* Check if the given `date` is an offday, by using the
     * `offdays` setting.
     */
    // Loop through each date/dateinterval in the `offdays` settings
    const offdays = rootGetters['settings/value']('offdays') || []
    offdays.forEach(dateOrInterval => {
      if (isDate(dateOrInterval)) {
        // If it's a regular date, check if they're the same day
        if (isSameDay(date, dateOrInterval)) return true
      } else {
        // If it's a range, check if the given date is within it
        try {
          if (isWithinInterval(date, dateOrInterval)) return true
        } catch (error) {
          // eslint-disable-next-line
          console.error(error)
        }
      }
    })
    /* At this point, if no value was returned, it means that
     * nothing was found in the list of offdays: return false
     */
    return false
  },
  currentTrimester: (state, { trimester }, { now }) =>
    /* Returns the index of the current trimester.
     * Returns null if the current date is outside any trimester
     */
    [1, 2, 3]
      .map(idx => trimester(idx))
      .find(trimester => isWithinInterval(now, trimester)) || null,
  mutationsOf: (state, { mutations }) => ({ event, date }) => {
    /* Provided an event and a date, returns either a schedule mutation object
     * or null if no mutation matches the arguments given.
     */
    if (event) {
      // Filter by the given event.
      mutations = mutations.filter(o => o.event.uuid === event.uuid)
    }
    if (date) {
      /* Filter with the provided date, whether the events are...
       * - rescheduled to that week, or
       * - deleted from that week
       */
      mutations = mutations.filter(o => {
        let ret = false
        // If the mutation's deleted field is not null, compare deletion date & current date
        if (o.deleted) ret = isSameDay(o.deleted, date)
        // If the mutation's rescheduled field is not null, compare reschedule date & current date
        if (o.rescheduled) ret = ret || isSameDay(o.rescheduled, date)
        return ret
      })
    }
    return mutations
  },
  mutationsIn: (state, { mutations }) => (start, end = null) => {
    if (end === null) {
      start = startOfDay(start)
      end = endOfDay(start)
    }
    return mutations.filter(mutation => {
      let addedInRange = false
      let deletedInRange = false
      if (mutation.added_start && mutation.added_end) {
        addedInRange =
          isAfter(mutation.added_start, start) &&
          isBefore(mutation.added_end, end)
      }
      if (mutation.deleted_start && mutation.deleted_end) {
        deletedInRange =
          isAfter(mutation.deleted_start, start) &&
          isBefore(mutation.deleted_end, end)
      }
      return addedInRange || deletedInRange
    })
  },
  currrentWeekMutations: (state, { mutationsOf }, rootState) => {
    const mutations = []
    const week = {
      start: startOfWeek(rootState.now),
      end: endOfWeek(rootState.now),
    }
    eachDayOfInterval(week).forEach(day => {
      mutations.push(...mutationsOf({ date: day, event: null }))
    })
  },
  orderCourses: (state, getters, rootState, rootGetters) => courses =>
    /* Sort courses objects by day & starting date
     */
    [...courses].sort(
      firstBy('day').thenBy((o1, o2) => isAfter(o1.start, o2.start))
    ),

  isDeleted: (state, getters) => (course, mutation) => {
    if (!mutation.hasOwnProperty('event')) return false
    if (course.uuid !== mutation.event.uuid) return false
    if (!mutation.deleted_start || !mutation.deleted_end) return false
    return (
      isBefore(mutation.deleted_start, course.start) &&
      isAfter(mutation.deleted_end, course.end)
    )
  },
  isAdded: (state, getters) => (course, mutation) => {
    if (!mutation.hasOwnProperty('event')) return false
    if (course.uuid !== mutation.event.uuid) return false
    if (!mutation.added_start || !mutation.added_end) return false
    return (
      isBefore(mutation.added_start, course.start) &&
      isAfter(mutation.added_end, course.end)
    )
  },

  coursesIn: (state, getters, rootState, rootGetters) => (
    start,
    end = null,
    opts = { includeDeleted: false, includeBothWeekTypes: false }
  ) => {
    const includeDeleted = opts.includeDeleted || false
    const includeBothWeekTypes = opts.includeBothWeekTypes || false
    if (end === null) {
      start = startOfDay(start)
      end = endOfDay(start)
    }
    let courses = []
    for (const day of eachDayOfInterval({ start, end })) {
      // If this day is an offday, it doesn't contain any events
      if (getters.isOffday(day)) continue
      // Get the events for that day
      const events = getters.events.filter(
        o =>
          o.day === getISODay(day) &&
          (includeBothWeekTypes ||
            [getters.weekType(day), 'BOTH'].includes(o.week_type))
      )
      courses = [
        ...courses,
        ...events.map(event => ({
          ...event,
          start: _mergeDateAndTime(day, event.start),
          end: _mergeDateAndTime(day, event.end),
        })),
      ]
    }
    getters.mutationsIn(start, end).forEach(mutation => {
      let courseIdx, course
      if (mutation.event) {
        courseIdx = courses.findIndex(o => o.uuid === mutation.event.uuid)
        course = courses[courseIdx]
      }
      switch (mutation.type) {
        case 'RES':
          courses[courseIdx] = {
            ...course,
            deleted: getters.isDeleted(course, mutation),
            added: getters.isAdded(course, mutation),
          }
          break

        case 'EDT':
          course[courseIdx] = {
            ...course,
            ...mutation,
            deleted: false,
            added: false,
          }
          break

        case 'DEL':
          course[courseIdx] = {
            ...course,
            deleted: getters.isDeleted(course, mutation),
            added: false,
          }
          break

        case 'ADD':
          courses.push({
            ...mutation,
            start: parseISO(mutation.added_start),
            end: parseISO(mutation.added_end),
            added: true,
            deleted: false,
          })
          break
      }
    })
    if (!includeDeleted) {
      courses = courses.filter(course => !course.deleted)
    }
    return getters.orderCourses(courses)
  },
  currentWeekCourses: (state, getters, rootState) =>
    /* Gets courses in the current week.
     */
    getters.coursesIn(startOfWeek(rootState.now), endOfWeek(rootState.now)),
  weekType: (state, getters, rootState, rootGetters) => date => {
    // TODO: explain this better, can't understand the logic I've written (it works tho)
    date = date || rootState.now
    // get base Q1/Q2
    const base = rootGetters['settings/value']('starting_week_type')
    const start = rootGetters['settings/value']('year_start')
    // convert to week-of-year number, and get if its even or odd.
    // tested date will be [base] (Q1 or Q2) if its also even.
    const startingWeekIsEven = getISOWeek(start) % 2 === 0
    const other = base === 'Q1' ? 'Q2' : 'Q1'
    return getISOWeek(date) % 2 === 0 && startingWeekIsEven ? base : other
  },
  courseOrPlaceholder: (state, getters, rootState, rootGetters) => course => {
    /* If the given course is null, return a placeholder course.
      Useful in some cases where we want to access a course's subject
      no matter if it exists or not (eg. current courses's subject, fall back to placeholder)
    */
    if (course) return course

    return {
      subject: rootGetters['subjects/placeholder'],
      placeholder: true,
    }
  },
  currentCourse: (state, getters, rootState, rootGetters) => {
    const course = getters.currentWeekCourses.find(
      o =>
        // Is the same day
        isSameDay(o.start, rootState.now) &&
        // Has started before now
        isBefore(o.start, rootState.now) &&
        // Hasn't finished yet or finished right this (mili)second
        isAfter(o.end, rootState.now)
    )
    return course || null
  },
  nextCoursesIn: (_, { coursesIn, orderCourses }) => (
    start = null,
    end = null
  ) =>
    coursesIn(start || Date.now(), end, false).filter(o =>
      isAfter(o.start, start)
    ),
  prevCoursesIn: (_, { coursesIn, orderCourses }) => (
    start = null,
    end = null
  ) =>
    coursesIn(start, end || Date.now(), false).filter(o =>
      isBefore(o.start, start)
    ),
  nextCoursesOf: (_, { nextCoursesIn }) => (value, what = 'subject') => {
    const courses = nextCoursesIn(Date.now(), addWeeks(Date.now(), 2))
    if (what === 'subject' && typeof value === 'object')
      value = value.uuid || null
    if (!courses.length) return []
    if (what === 'subject') {
      return courses.filter(o => o.subject.uuid === value)
    }
    return courses.filter(o => o[what] === value)
  },
  prevCoursesOf: (_, { prevCoursesIn }, { now }) => (
    value,
    what = 'subject'
  ) => {
    const courses = prevCoursesIn(addWeeks(now, -2), now)
    if (what === 'subject' && typeof value === 'object')
      value = value.uuid || null
    if (!courses.length) return []
    if (what === 'subject') {
      return courses.filter(o => o.subject.uuid === value)
    }
    return courses.filter(o => o[what] === value)
  },
  todayCourses: (state, getters, rootState, rootGetters) =>
    getters.coursesIn(rootState.now),
  tomorrowCourses: (state, getters, rootState, rootGetters) =>
    getters.coursesIn(rootState.tomorrow),
  upcomingCourse: (_, { nextCoursesIn }, { now }) => {
    const nextCourses = nextCoursesIn(now)
    return nextCourses.length ? nextCourses[0] : null
  },
  nextCourseOf: (_, { nextCoursesOf }) => (value, what = 'subject') => {
    if (value === null) return null
    const nextCourses = nextCoursesOf(value, what)
      .sort((c1, c2) => isAfter(c1.start, c2.start))
      .filter(c => !isSameDay(c.start, Date.now()))
    if (nextCourses.length) return nextCourses[0]
    return null
  },
  startOfDay: (state, getters, rootState) => (start, end = null) => {
    start = start || rootState.now
    const courses = getters.orderCourses(getters.coursesIn(start, end))
    if (!courses.length) return null
    return courses[0].start
  },
  endOfDay: (state, getters, rootState) => (start, end = null) => {
    start = start || rootState.now
    const courses = getters.orderCourses(getters.coursesIn(start, end))
    if (!courses.length) return null
    return courses[courses.length - 1].end
  },
  currentSubject: (state, { currentCourse }) =>
    currentCourse ? currentCourse.subject : null,
  validateEvent: getValidator({
    constraints: {
      required: ['subject', 'start', 'end', 'day', 'week_type', 'room'],
      isAWeekType: ['week_type'],
    },
    customConstraints: [
      {
        message: "L'heure de début doit être avant l'heure de fin",
        field: 'start',
        constraint: (_, object) => {
          let { start, end } = object
          // Sometimes the start & end dates have different date parts. Fix this.
          start = setDate(start, 1)
          end = setDate(end, 1)
          start = setMonth(start, 1)
          end = setMonth(end, 1)
          start = setYear(start, 2020)
          end = setYear(end, 2020)
          console.log([start, end])
          if (!(start && end)) return true
          return isBefore(start, end)
        },
      },
      {
        message: 'Ce créneau horaire est déjà pris par un autre cours',
        field: null,
        // TODO: Move this to a getter
        // TODO: tell the conflicting course to the user
        constraint: ({ events }, object) => {
          const parseTime = time => parse(time, 'HH:mm:ss', Date.now())
          return !events.filter(o => {
            const [objStart, objEnd, start, end] = [
              object.start,
              object.end,
              o.start,
              o.end,
            ].map(t => parseTime(t))
            return (
              !isEqual(objStart, end) &&
              (isWithinInterval(objStart, { start, end }) ||
                isWithinInterval(objEnd, { start, end })) &&
              o.day === object.day &&
              (o.week_type === object.week_type || o.week_type === 'BOTH')
            )
          }).length
        },
      },
    ],
    fieldNames: {
      subject: { gender: 'F', name: 'matière' },
      start: { gender: 'F', name: 'heure de début' },
      end: { gender: 'F', name: 'heure de fin' },
      room: { gender: 'F', name: 'salle' },
      day: { gender: 'M', name: 'jour' },
      week_type: { gender: 'M', name: 'type de semaine' },
    },
    resourceName: { gender: 'M', name: 'cours' },
    debug: true,
  }),
  validateMutation: getValidator({
    constraints: {
      before: {
        added_end: ['added_start'],
      },
      required: ['subject'],
      maxLength: {
        300: ['room'],
      },
    },
    customConstraints: [
      {
        message: 'Un cours existe déjà à cette période',
        field: null,
        constraint: ({ getters }, object) => {
          /* Checks if -- when the mutation is rescheduled -- no courses already exists between the chosen dates */
          if (
            !(
              object.hasOwnProperty('added_start') &&
              object.hasOwnProperty('added_end')
            )
          )
            return !getters
              .coursesIn(object.added_start, object.added_end)
              .filter(
                o =>
                  (isSameMinute(o.start, object.added_start) ||
                    isAfter(object.added_end, o.end)) &&
                  (isSameMinute(o.end, object.added_end) ||
                    isBefore(object.added_end, o.end))
              ).length
        },
      },
      {
        message: "Aucun cours n'existe entre les dates de supression",
        constraint: ({ getters }, object) => {
          /* Checks if -- when the mutation is deleted -- some course(s) already exists between the chosen dates */
          if (
            !(
              object.hasOwnProperty('deleted_start') &&
              object.hasOwnProperty('deleted_end')
            )
          )
            return (
              getters
                .coursesIn(object.deleted_start, object.deleted_end)
                .filter(
                  o =>
                    (isSameMinute(o.start, object.deleted_start) ||
                      isAfter(object.deleted_end, o.end)) &&
                    (isSameMinute(o.end, object.deleted_end) ||
                      isBefore(object.deleted_end, o.end))
                ).length > 0
            )
        },
      },
      {
        message: 'Il y a plusieurs cours entre les deux dates de suppression',
        constraint: ({ getters }, object) => {
          /* Checks if -- when the mutation is deleted -- no more than one course already exists between the chosen dates */
          if (
            !(
              object.hasOwnProperty('deleted_start') &&
              object.hasOwnProperty('deleted_end')
            )
          )
            return (
              getters
                .coursesIn(object.deleted_start, object.deleted_end)
                .filter(
                  o =>
                    (isSameMinute(o.start, object.deleted_start) ||
                      isAfter(object.deleted_end, o.end)) &&
                    (isSameMinute(o.end, object.deleted_end) ||
                      isBefore(object.deleted_end, o.end))
                ).length <= 1
            )
        },
      },
    ],
    fieldNames: {
      subject: { gender: 'F', name: 'matière' },
      added_start: { gender: 'M', name: 'début du nouveau cours' },
      added_end: { gender: 'F', name: 'fin du nouveau cours' },
      deleted_start: { gender: 'M', name: 'début du cours supprimé' },
      deleted_end: { gender: 'F', name: 'fin du cours supprimé' },
      room: { gender: 'F', name: 'salle' },
    },
    resourceName: { gender: 'M', name: "changement d'emploi du temps" },
  }),
}

export const mutations = {
  ...getMutations('event', o => o, false),
  ...getMutations('mutation', o => o, false),
  MUTATIONS_POSTLOAD: state => (state.loadedMutations = true),
}

export const actions = {
  async load({ dispatch }, force = false) {
    await dispatch('loadEvents', force)
    await dispatch('loadMutations', force)
  },
  async loadEvents({ commit, state }, force = false) {
    if (!force && state.events.length) return
    try {
      const { data } = await this.$axios.get(`/events/`)
      // console.log(`[from API] GET /events/: OK`)
      if (data) commit('SET_EVENTS', data)
    } catch (error) {
      // console.error(`[from API] GET /events/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },

  async loadMutations({ commit, state }, force = false) {
    if (!force && state.loadedMutations) return
    try {
      const { data } = await this.$axios.get(`/events-mutations/`)
      // console.log(`[from API] GET /events-mutations/: OK`)
      if (data) {
        commit('SET_MUTATIONS', data)
        commit('MUTATIONS_POSTLOAD')
      }
    } catch (error) {
      // console.error(`[from API] GET /events-mutations/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },

  async postEvent({ commit, getters }, { event, force }) {
    force = force || false
    if (!force) {
      const validation = getters.validateEvent(event)
      if (!validation.validated) return validation
    }
    try {
      if (event.subject) event.subject = event.subject.uuid
      if (event.start)
        event.start = formatISO(event.start, { representation: 'time' })
      if (event.end)
        event.end = formatISO(event.end, { representation: 'time' })
      const res = await this.$axios.post(`/events/`, event)
      const { data } = await this.$axios.get(`/events/${res.data.uuid}`)
      if (data) commit('ADD_EVENT', data)
      // console.log("[from API] POST /events/: OK")
    } catch (error) {
      // console.error(`[from API] POST /events/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },

  async postMutation({ commit, dispatch }, mutation, force = false) {
    if (!force) {
      const validation = await dispatch('validateMutation', mutation)
      if (!validation.validated) return validation
    }
    try {
      const { data } = await this.$axios.post(`/events-mutations/`, mutation)
      if (data) commit('ADD_MUTATION', data)
      // console.log("[from API] POST /events-mutations/: OK")
    } catch (error) {
      // console.error(`[from API] POST /events-mutations/: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },

  async patchEvent(
    { commit, getters, dispatch },
    { uuid, modifications, force }
  ) {
    force = force || false
    if (!force) {
      let event = getters.event(uuid)
      event = { ...event, ...mutations }
      // Turn start / end dates into Date objects for validation
      event.start = parse(event.start, 'HH:mm:ss', new Date())
      event.end = parse(event.end, 'HH:mm:ss', new Date())
      const validation = getters.validateEvent(event)
      if (!validation.validated) return validation
    }
    try {
      if (modifications.subject)
        modifications.subject = modifications.subject.uuid
      if (modifications.start)
        modifications.start = formatISO(modifications.start, {
          representation: 'time',
        })
      if (modifications.end)
        modifications.end = formatISO(modifications.end, {
          representation: 'time',
        })
      await this.$axios.patch(`/events/${uuid}/`, modifications)
      const { data } = await this.$axios.get(`/events/${uuid}`)

      if (data) commit('PATCH_EVENT', { pk: uuid, modifications: data })
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  },

  async patchMutation({ commit, dispatch }, { uuid, modifications, force }) {
    force = force || false
    if (!force) {
      let mutation = getters.event(uuid)
      mutation = { ...mutation, ...mutations }
      const validation = await dispatch('validateMutation', mutation)
      if (!validation.validated) return validation
    }
    try {
      const { data } = await this.$axios.patch(
        `/events-mutations/${uuid}`,
        modifications
      )
      if (data) commit('PATCH_MUTATION', uuid, data)
      // console.log(`[from API] PATCH /events-mutations/${uuid}: OK`)
    } catch (error) {
      // console.error(`[from API] PATCH /events-mutations/${uuid}: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },

  async deleteEvent({ commit, dispatch, getters }, { uuid, toastMessage }) {
    try {
      console.log(uuid)
      // Stores the note object because we want to be able to cancel the deletion
      // eslint-disable-next-line no-unused-vars
      const event = getters.event(uuid)
      //
      await this.$axios.delete(`/events/${uuid}`)
      commit('DEL_EVENT', uuid)
      this.$toast.show(toastMessage || 'Cours supprimé', {
        // TODO: ↓
        // action: {
        //   text: 'Annuler',
        //   onClick: async (e, toast) => {
        //     await dispatch(`postEvent`, { event })
        //     toast.goAway(0)
        //   }
        // },
        duration: 8000,
      })
    } catch (error) {
      console.error(error)
    }
  },

  async deleteMutation({ commit }, uuid) {
    try {
      const { data } = await this.$axios.delete(`/events-mutations/${uuid}`)
      if (data) commit('DEL_MUTATION', uuid)
      // console.log(`[from API] DELETE /events-mutations/${uuid}: OK`)
    } catch (error) {
      // console.error(`[from API] DELETE /events-mutations/${uuid}: Error`)
      try {
        // console.error(error.response.data)
      } catch (_) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },
}
