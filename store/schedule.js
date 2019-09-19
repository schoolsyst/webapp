// FIXME: don't cache "nextCourse"-related getters.
// CLARIFICATION: event(s) vs course(s)
// - events are "base" events as returned by the /events/ API endpoint.
//   They describe a normal week of the year
// - courses are events, with deletions, additions and offdays applied.
//   They have a `date` attribute instead of a `day` (day of the week)
//   They describe a *particular* week, and thus are tied to a date range, a specific
//   week of the year.
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

const ptime = time => moment(time, "HH:mm:ss");
const pdate = date => moment(date, ["DD/MM/YYYY", "YYYY-MM-DD"]);

export const state = () => ({
  additions: [],
  deletions: [],
  events: [],
  currentCourse: {},
  upcomingCourse: {}
});

export const getters = {
  allEvents(state, getters) {
    return state.events;
  },
  allAdditions(state, getters) {
    return state.additions;
  },
  allDeletions(state) {
    return state.deletions;
  },
  setting(state, getters, rootState, rootGetters) {
    return rootGetters.setting
  },
  trimesterStart: (state, getters, rootState, rootGetters) => trimester => {
    switch (trimester) {
      case 1:
        return pdate(getters.setting("year_start").value);
      case 2:
        return pdate(getters.setting("trimester_2_start").value);
      case 3:
        return pdate(getters.setting("trimester_3_start").value);
      // This is intentional, see the rest of the getter function to know why
      case 4:
        return pdate(getters.setting("year_end").value);
    }
  },
  weekType: (state, getters) => date => {
    // get base Q1/Q2
    let base = getters.setting("starting_week_type").value;
    let start = getters.setting("year_start").value;
    // convert to week-of-year number, and get if its even or odd.
    // tested date will be [base] (Q1 or Q2) if its also even.
    let startingWeekIsEven = moment(start, 'DD/MM/YYYY').isoWeek() % 2 === 0;
    let other = base === "Q1" ? "Q2" : "Q1";
    return moment(date, 'YYYY-MM-DD').isoWeek() % 2 === 0 && startingWeekIsEven
      ? base
      : other;
  },

  currentWeekType: (state, getters) => getters.weekType(moment()),

  coursesIn: (state, getters) => (start, upto, debug = null) => {
  // FIXME: SHOULD NOT MUTATE THE FUCKIN DATE PASSED TO IT! HOW DUMB AM I?
  // FIXME: coursesIn doesn't work when start == upto
    // setup vars
    /* if (debug) {
      debugger
    } */

    let computedEvents = [];
    let baseEvents = getters.allEvents;
    let deletions = getters.allDeletions;
    let additions = getters.allAdditions;
    let dates = [];
    let weekday, deleted, added, weekType;
    if (baseEvents.length < 1) return [];

    if (debug) console.log(start.format("D/M/Y"), "->", upto.format("D/M/Y"));
    // inclusive range, since we check for isBefore (and not isBefore && isSame, lot more costly)
    // EDIT: this should turn it into an inclusive range
    // start = start.subtract(1, 'day')
    // loop through every date between start and upto
    for (let current = start; current.isSameOrBefore(upto); current.add(1, "day")) {
      if (getters.offdays.map(d => d.toISOString()).includes(current.toISOString())) {
        continue
      }
      weekday = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      ][current.isoWeekday()-1];

      weekType = getters.weekType(current);
      if (debug)
        console.log(`${current.format("D/M/Y")}#${weekday}:${weekType}`);
      let dayBaseEvents = baseEvents.filter(ev => {
        return (
          ev.day === weekday &&
          (ev.week_type === "both" || ev.week_type === weekType)
        );
      });
      if (debug)
        console.log(
          dayBaseEvents.map(
            e => `${e.subject.abbreviation.toUpperCase()}@${e.start}`
          )
        );

      // loop through the events of that weekday
      for (const baseEvent of dayBaseEvents) {
        // if we have at least one deletion for this event
        if (deletions.length) {
          deleted =
            deletions.filter(deletion => deletion.event.id === baseEvent.id)
              .length >= 1;
        } else {
          deleted = false;
        }
        computedEvents.push({
          ...baseEvent,
          deleted,
          date: current.format("DD/MM/YYYY"),
          _date: current,
          added: false
        });
      }

      if (additions.length) {
        // loop thourgh the ADDED events of that weekday
        for (const addedEvent of additions.filter(event =>
          pdate(event.current).isSame(current)
        )) {
          computedEvents.push({
            ...addedEvent,
            day: weekday,
            weekType: weekType,
            added: true,
            deleted: false
          });
        }
      }
    }
    return computedEvents;
  },
  coursesInCurrentWeek: (state, getters) => {
    console.group('coursesInCurrentWeek')
    console.log("from " + moment().startOf("week").format("dddd MM YYYY")+" to "+moment().endOf('week').format('dddd MM YYYY'))
    console.groupEnd()
    return getters.coursesIn(moment().startOf("week"), moment().endOf("week"));
  },
  eventsOf: (state, getters) => subjectSlug => {
    return getters.allEvents.filter(
      event => event.subject.slug === subjectSlug
    );
  },
  upcomingCourse: (state, getters) => (now=null) => {
    if(!now) now = moment();
    let courses = getters.coursesIn(moment(), moment().endOf('day'));
    if (courses.length) {
      courses = courses
        .filter(course => ptime(course.start).isAfter(now))
        .sort((a, b) => (ptime(a.start).isAfter(ptime(b.start)) ? 1 : -1)); // sort by start date

      if (courses.length) return courses[0];
    }
    return null;
  },
  currentCourse: (state, getters) => (now=null) => {
    if(!now) now = moment();
    let courses = getters.coursesIn(moment().startOf('day'), moment().endOf('day'));
    if (courses.length) {
      courses = courses.filter(
        course => ptime(course.start).isSameOrBefore(moment())
               && ptime(course.end).isAfter(moment())
      );
      if (courses.length) return courses[0];
    }

    if (courses.length) return courses[0];
    return null;
  },
  currentCourseSubject: (state, getters) => (now=null) => {
    if(!now) now = moment();
    if (getters.currentCourse(now)) {
      let currentCourse = getters.currentCourse(now)
      return currentCourse.subject;
    } else {
      return {
        color: "#000000",
        name: "...",
        abbreviation: "...",
        slug: "...",
        _isPlaceholder: true
      };
    }
  },
  // note: doesn't get other courses in the same day as currentSubject
  nextCourseOf: (state, getters) => subjectSlug => {
    const tomorrow = moment().add(1, "days");
    // get courses that are after tomorrow
    let courses = getters.coursesIn(tomorrow, moment().add(2, "weeks"));
    if (!courses.length) return null;
    // console.log(courses.map(c => c.date.format('D/M/Y')))
    // and match the requested subject
    courses = courses.filter(course => course.subject.slug === subjectSlug);
    if (!courses.length) return null;
    // and sort them by ascending date
    courses = courses.sort((a, b) =>
      pdate(a.date).isAfter(pdate(b.date)) ? 1 : -1
    );
    return courses[0];
  },
  nextCourseOfCurrentSubject: (state, getters) => (now) => {
    if(!now) now = moment();
    if (!getters.currentCourse(now)) {
      return null;
    }
    return getters.nextCourseOf(getters.currentCourse.subject);
  },
  offdays: (state, getters) => {
    let offdays = [];
    let offdaySeries = getters.setting("offdays")
    if (offdaySeries) offdaySeries = offdaySeries.value
    else return []
    if (offdaySeries) offdaySeries = offdaySeries.trim()
    else return []

    offdaySeries = offdaySeries.split("\n") // split by line
    //  .forEach(offday => offday.replace("\r", "")); // fuck windows
    for (const offdaySerie of offdaySeries) {
      // for each line
      if (offdaySerie.match(/.+\s*-\s*.+/)) {
        // if its a range (start date - end date)
        // get start & end: split by "-", trim spaces, parse as date
        let [start, end] = offdaySerie.split("-").map(o => moment(o, 'DD/MM/YYYY'))
        // iterate over each date
        while (start.isBefore(end)) {
          // add in the array
          offdays.push(start);
          start = start.add(1, "day");
        }
      } else {
        // add in the array
        offdays.push(pdate(offdaySerie));
      }
    }
    return offdays;
  },
  event: (state, getters) => (eventUUID) => {
    return state.events.find(e => e.uuid === eventUUID)
  },
  //TODO: Remove duplicate code between subjectsToAddFor and subjectsToRemoveFor
  subjectsToAddFor: (state, getters) => (date, today=null) => {
    console.group('subjectsToAdd')
    let weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    // Get today 
    let dateCopy = date.clone()
    today = today || dateCopy.subtract(1, 'day') //Subtracting from `date` directly would mutate it

    console.log(`for window ${today.format('YYYY-MM-DD')}->${date.format('YYYY-MM-DD')}`)
    // Get today & date subjects
    let todayCopy = today.clone()
    let allSubjects = getters.coursesIn(todayCopy, date)
    
    let todaySubjects = allSubjects.filter(c => c.day === weekdays[today.isoWeekday()-1]).map(c => c.subject)
    let dateSubjects  = allSubjects.filter(c => c.day === weekdays[date .isoWeekday()-1]).map(c => c.subject)
    
    let diff = dateSubjects.filter(s => !todaySubjects.map(s => s.uuid).includes(s.uuid))
    console.log(diff.map(s => s.name))
    console.groupEnd()
    return diff
  },
  subjectsToRemoveFor: (state, getters) => (date, today=null) => {
    console.group('subjectsToRemove')
    let weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    // Get today 
    let dateCopy = date.clone()
    today = today || dateCopy.subtract(1, 'day') //Subtracting from `date` directly would mutate it

    console.log(`for window ${today.format('YYYY-MM-DD')}->${date.format('YYYY-MM-DD')}`)
    // Get today & date subjects
    let todayCopy = today.clone()
    let allSubjects = getters.coursesIn(todayCopy, date)
    
    let todaySubjects = allSubjects.filter(c => c.day === weekdays[today.isoWeekday()-1]).map(c => c.subject)
    let dateSubjects  = allSubjects.filter(c => c.day === weekdays[date .isoWeekday()-1]).map(c => c.subject)
    
    let diff = todaySubjects.filter(s => !dateSubjects.map(s => s.uuid).includes(s.uuid))
    console.log(diff.map(s => s.name))
    console.groupEnd()
    return diff
  },
  hoursCountFor: (state, getters) => (date) => {
    /* NOTE: Doing a two-days interval and taking only one because coursesIn does not support (date, date) yet (dates must be different)
    When this is fixed, this code will be a lot less ridiculous */
    console.group(`hoursCountFor: ${date.format('YYYY-MM-DD')}`)
    let weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    // Get today 
    let dateCopy = date.clone()
    let today = dateCopy.subtract(1, 'day') //Subtracting from `date` directly would mutate it

    let todayCopy = today.clone()
    let allSubjects = getters.coursesIn(todayCopy, date)
    
    let courses   = allSubjects.filter(c => c.day === weekdays[date .isoWeekday()-1])
    console.log(courses)
    let durations = courses.map(c => moment.duration(moment(c.end, 'HH:mm').diff(moment(c.start, 'HH:mm'))).as('hours'))
    console.log(durations)
    let total     = durations.reduce((acc,cur)=>acc+cur)
    console.log(total)

    console.groupEnd()
    return Math.round(Math.abs(total))
  }
};

export const mutations = {
  SET_EVENTS(state, events) {
    state.events = events;
  },
  CHANGE_EVENT(state, eventUUID, newEventData) {
    let i = state.events.indexOf(state.events.find(e=>e.uuid===eventUUID))
    Object.assign(state.events[i], newEventData)
  },
  SET_COURSES(state, courses) {
    state.courses = courses;
  },
  SET_ADDITIONS(state, additions) {
    state.additions = additions;
  },
  SET_DELETIONS(state, deletions) {
    state.deletions = deletions;
  }
  /*  UPDATE_EVENT(state, courseId, newCourse) {
    let course = state.getters
      .allEvents()
      .filter(event => event.id === courseId)[0];
    Object.assign(course, newCourse);
  }, */
};

export const actions = {
};
