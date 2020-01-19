<template lang="pug">
  .schedule-wrapper(:style="{height: this.eventHeight * this.durationLongestDay + 'rem'}")
    ul.schedule
      li.day(v-for="events in days")
        ul.events
          li.event(
            v-for="event in events" :key="event.uuid" 
            :style="styles(event)"
            @click=""
            :class="{ deleted: event.deleted }"
          )
            span.subject {{ event.subject.name }}
            span.room {{ event.room }}
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import groupBy from 'lodash.groupby'
import {
  startOfDay,
  startOfWeek,
  endOfWeek,
  differenceInMinutes
} from 'date-fns'
export default {
  props: {
    showDeleted: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      eventWidth: 10,
      eventHeight: 0.125
    }
  },
  computed: {
    ...mapState(['now']),
    ...mapGetters('schedule', ['coursesIn']),
    days() {
      const courses = this.coursesIn(
        startOfWeek(this.now),
        endOfWeek(this.now),
        this.showDeleted
      )
      return groupBy(courses, 'day')
    },
    durationLongestDay() {
      // Get total durations for each day
      const durations =
        // Get the array of events for each day
        Object.values(this.days)
          // Get an array of total duration in minutes for each day
          .map((events) =>
            // Map each event to its duration in minutes
            events
              .map((event) => differenceInMinutes(event.end, event.start))
              // Sum the durations of each event of each day
              .reduce((acc, cur) => acc + cur)
          )
      // Get the longest duration sum
      return Math.max(...durations)
    }
  },
  async mounted() {
    await this.$store.dispatch('schedule/load')
  },
  methods: {
    ...mapGetters('schedule', ['startOfDay']),
    ...mapGetters(['textColor']),
    heightFromDates(left, right) {
      return (
        Math.abs(differenceInMinutes(left, right)) * this.eventHeight + 'rem'
      )
    },
    styles(event) {
      const firstCourseStart = this.startOfDay()(startOfDay(event.start))
      const thisCourseStart = event.start
      return {
        backgroundColor: event.subject.color,
        color: this.textColor()(event.subject.color),
        top: this.heightFromDates(firstCourseStart, thisCourseStart),
        left: (event.day - 1) * this.eventWidth + 'rem',
        width: this.eventWidth + 'rem',
        height: this.heightFromDates(event.start, event.end)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.schedule
  position: relative
  height: 100vh // TODO: use computed Schedule height

.event
  position: absolute
  display: flex
  justify-content: center
  align-items: center
  text-align: center
  padding: 0.75em
  flex-direction: column

  .room
    position: absolute
    bottom: 0.75em
    right: 0.75em
    opacity: 0.75
    font-family: var(--fonts-monospace)

ul
  list-style: none
</style>
