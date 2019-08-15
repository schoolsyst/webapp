export const state = () => ({
    additions: [],
    deletions: [],
    events: [],
    currentCourse: {},
    upcomingCourse: {},
})

export const getters = { 
    allEvents (state, getters) {
        return state.events
    },
    currentCourse (state, getters) {
        return getters.allEvents[0]
    },
    upcomingCourse (state, getters) {
        return getters.allEvents[0]
    },
    allAdditions (state, getters) {
        return state.schedAdditions
    },
    allDeletions (state) {
        return state.schedDeletions
    },
    eventsIn: (state, getters) => (from, upto) => {
        // Check for errors
        let daysDelta = Date(upto - from) / 1000 / 3600 / 24
        if (daysDelta > 7) {
            throw `The requested range must be at most a week (7 days), not ${daysDelta} days`
            // If we had a range larger than a week, some events would start overlapping, since base events
            // don't store a date but simply a weekday.
        }
        
        // setup vars
        let computedEvents = []
        let baseEvents = getters.scheduleEvents
        let deletions = getters.scheduleDeletions
        let additions = getters.scheduleAdditions
        let dates = [];
        while (from <= upto) {
            // get dates between from and upto
            dates.push(from);

            from = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 1, // Will increase month if over range
            );
        }
        
        // loop through every date
        for (const date of dates) {
            weekday = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][date.getDay()]

            // loop through the events of that weekday
            for (const baseEvent of baseEvents.filter(event => event.day === weekday)) {
                // if we have at least one deletion for this event
                deleted = deletions.filter(deletion => deletion.event.id = baseEvent.id).length > 1

                computedEvents.push(Object.assign(
                    baseEvent, {deleted}
                ))
            }

            // loop thourgh the ADDED events of that weekday
            for (const addedEvent of additions.filter(event => event.date === date)) {
                computedEvents.push(Object.assign(
                    addedEvent, {
                        day: weekday,
                        weekType: 'Q1' // TODO: Get weektype
                    }
                ))
            }
        }

        return computedEvents
    }

}

export const mutations = { 
    setCourses(state, courses) {
        state.courses = courses
    }
 }

export const actions = {


 }
