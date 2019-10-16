import { endOfDay, startOfDay, addDays } from "date-fns";
import uniqBy from "lodash.uniqby";

export const store = () => ({});

export const getters = {
  _subjects: (state, getters, rootState, rootGetters) => (today = null) => {
    // Get days
    today = today || rootState.now;
    const tomorrow = addDays(now, 1);
    // Get courses for theses days
    const todayCourses = rootGetters["coursesIn"](
      startOfDay(today),
      endOfDay(today)
    );
    const tomorrowCourses = rootGetters["coursesIn"](
      startOfDay(tomorrow),
      endOfDay(tomorrow)
    );
    // Get subjects of theses courses
    let todaySubjects = todayCourses.map(o => o.subject);
    let tomorrowSubjects = tomorrowCourses.map(o => o.subject);
    // Remove duplicate subjects
    todaySubjects = uniqBy(todaySubjects, "uuid");
    tomorrowSubjects = uniqBy(tomorrowSubjects, "uuid");
    // Return both arrays
    return {
      todaySubjects,
      tomorrowSubjects,
    };
  },
  toAdd: (state, getters) => (today = null) => {
    /* Gets the subjects that are not present in today's courses
     * but are present in tomorrow's courses.
     */
    // Get subjects
    const { todaySubjects, tomorrowSubjects } = getters._subjects(today);
    // Get an array of UUIDs to check agains
    const todayUUIDs = todaySubjects.map(o => o.uuid);
    // Keep only tomorrow's subjects if their UUIDs are not in today's UUIDs.
    return tomorrowSubjects.filter(o => !todayUUIDs.includes(o.uuid));
  },
  toRemove: (state, getters) => (today = null) => {
    // Get subjects
    const { todaySubjects, tomorrowSubjects } = getters._subjects(today);
    // Get an array of UUIDs to check agains
    const tomorrowUUIDs = tomorrowSubjects.map(o => o.uuid);
    // Keep only today's subjects if their UUIDs are not in tomorrow's UUIDs.
    return todaySubjects.filter(o => !tomorrowUUIDs.includes(o.uuid));
  },
};
