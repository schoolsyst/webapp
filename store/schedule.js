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
  //TODO: offdays getter
  weekType: (state, getters) => date => {
    // get base Q1/Q2
    let base = getters.setting("starting_week_type").value;
    let start = getters.setting("year_start").value;
    // convert to week-of-year number, and get if its even or odd.
    // tested date will be [base] (Q1 or Q2) if its also even.
    let startingWeekIsEven = moment(start).isoWeek() % 2 === 0;
    let other = base === "Q1" ? "Q2" : "Q1";
    return moment(date, 'YYYY-MM-DD').isoWeek() % 2 === 0 && startingWeekIsEven
      ? base
      : other;
  },

  currentWeekType: (state, getters) => getters.weekType(moment()),

  coursesIn: (state, getters) => (start, upto, debug = null) => {
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
    for (let current = start; current.isBefore(upto); current.add(1, "day")) {
      //TODO: continue if date in getters.offdays
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
  upcomingCourse: (state, getters) => {
    let now = moment();
    let courses = getters.coursesIn(moment(), moment().endOf('day'), true);
    console.log(courses)
    if (courses.length) {
      courses = courses
        .filter(course => ptime(course.start).isAfter(now))
        .sort((a, b) => (ptime(a.start).isAfter(ptime(b.start)) ? 1 : -1)); // sort by start date

      if (courses.length) return courses[0];
    }
    return null;
  },
  currentCourse: (state, getters) => {
    let now = moment();
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
  currentCourseSubject: (state, getters) => {
    if (getters.currentCourse) {
      return getters.currentCourse.subject;
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
    // FIXME: shouldn't also get courses from today
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
  nextCourseOfCurrentSubject: (state, getters) => {
    if (!getters.currentCourse) {
      return null;
    }
    return getters.nextCourseOf(getters.currentCourse.subject);
  },
  offdays: (state, getters) => {
    let offdays;
    let offdaySeries = getters
      .setting("offdays").value // get offdays
      .split("\n") // split by line
      .forEach(offday => offday.replace("\r", "")); // fuck windows
    for (const offdaySerie of offdaySeries) {
      // for each line
      if (offdaySerie.match(/.+\s*-\s*.+/)) {
        // if its a range (start date - end date)
        // get start & end: split by "-", trim spaces, parse as date
        let [start, end] = offdaySerie.split("-").reduce(e => pdate(e.trim()));
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
  }
};

export const mutations = {
  SET_EVENTS(state, events) {
    state.events = events;
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
  async nuxtServerInit({commit}, {app}) {
    let res;

    res = await app.$axios.get("/events/");
    commit("schedule/SET_EVENTS", res.data);

    res = await app.$axios.get("/settings/");
    commit("SET_SETTINGS", res.data);

    res = await app.$axios.get("/event-additions/");
    commit("schedule/SET_ADDITIONS", res.data);

    res = await app.$axios.get("/event-deletions/");
    commit("schedule/SET_DELETIONS", res.data);
  }
};
