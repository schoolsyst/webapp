<template lang="pug">
  //TODO: no position:absolute, consider gaps as events. Do 1 event per 
  .schedule-wrapper(:style="{height: this.eventHeight * this.durationLongestDay + 'rem'}")
    ModalAddEvent(
      action="edit"
      v-model="editingEvent"
      @submit="patch({ modifications: editingEvent, uuid: editingEvent.uuid })"
      @delete="del({ uuid: editingEvent.uuid })"
    )
    ul.schedule
      li.day(v-for="events in days")
        ul.events
          li.event(
            v-for="event in events" :key="event.uuid" 
            :style="styles(event)"
            @click="onEventClick(event)"
            :class="{ deleted: event.deleted, [`weektype-${event.week_type.toLowerCase()}`]: bothWeeks }"
          )
            span.subject {{ event.subject.name }}
            span.room {{ event.room }}
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import groupBy from 'lodash.groupby'
import {
  startOfDay,
  startOfWeek,
  endOfWeek,
  differenceInMinutes
} from 'date-fns'
import ModalAddEvent from '~/components/ModalAddEvent.vue'

export default {
  components: { ModalAddEvent },
  props: {
    showDeleted: {
      type: Boolean,
      default: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    bothWeeks: {
      type: Boolean,
      default: false
    },
    namespace: {
      type: String,
      default: ''
    }
  },
  data() {
    const defaults = {
      subject: null,
      week_type: 'BOTH',
      day: null,
      start: null,
      end: null,
      room: null,
      identifier$action: 'edit'
    }
    return {
      eventWidth: 10,
      eventHeight: 0.125,
      editingEvent: {
        ...defaults,
        uuid: null
      }
    }
  },
  computed: {
    ...mapState(['now']),
    ...mapGetters('schedule', ['coursesIn']),
    days() {
      const courses = this.coursesIn(
        startOfWeek(this.now),
        endOfWeek(this.now),
        {
          includeDeleted: this.showDeleted,
          includeBothWeekTypes: this.bothWeeks
        }
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
    ...mapActions('schedule', { patch: 'patchEvent', del: 'deleteEvent' }),
    ...mapGetters(['textColor']),
    heightFromDates(left, right) {
      return (
        Math.abs(differenceInMinutes(left, right)) * this.eventHeight + 'rem'
      )
    },
    onEventClick(event) {
      if (!this.readOnly) {
        const modalName = this.namespace
          ? `${this.namespace}-edit-event`
          : 'edit-event'
        Object.assign(this.editingEvent, event)
        this.$modal.show(modalName)
      }
      this.$emit('event-click', event)
    },
    styles(event) {
      const firstCourseStart = this.startOfDay(startOfDay(event.start))
      const thisCourseStart = event.start
      const styles = {
        backgroundColor: event.subject.color,
        color: this.textColor()(event.subject.color),
        top: this.heightFromDates(firstCourseStart, thisCourseStart),
        left: (event.day - 1) * this.eventWidth,
        width: this.eventWidth,
        height: this.heightFromDates(event.start, event.end)
      }
      // When we are showing both week types at the same time, we need to show some events side by side
      if (this.bothWeeks && event.week_type !== 'BOTH') {
        styles.width /= 2
        if (event.week_type === 'Q2') {
          styles.left += styles.width
        }
      }
      // Add units
      styles.width += 'rem'
      styles.left += 'rem'
      return styles
    },
    handleInput(event) {
      console.log(event)
      Object.assign(this.editingEvent, event)
    }
  }
}
</script>

<style lang="stylus" scoped>
.schedule
  position: relative
  height: 100vh // TODO: use computed Schedule height
  border-top: 2px solid var(--grey)

.day
  border-right: 2px solid var(--grey)

.event
  position: absolute
  display: flex
  justify-content: center
  align-items: center
  text-align: center
  padding: 0.75em
  flex-direction: column
  cursor pointer

  .room
    position: absolute
    bottom: 0.75em
    right: 0.75em
    opacity: 0.75
    font-family: var(--fonts-monospace)

ul
  list-style: none
</style>
