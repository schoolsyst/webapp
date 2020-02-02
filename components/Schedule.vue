<template lang="pug">
  .schedule
    ModalAddEvent(
      v-model="editingEvent"
      action="edit"
      @submit="patch({ modifications: editingEvent, uuid: editingEvent.uuid })"
      @delete="del({ uuid: editingEvent.uuid })"
    )
    table
      thead
        tr.days
          td.empty &nbsp;
          td(
            v-for="dayName in dayNames"
            colspan="2"
          ) {{ dayName }}
        tr.week-types
          td.empty &nbsp;
          template(
            v-for="dayName in dayNames"
          )
            td Q1
            td Q2
      tbody
        tr(
          v-for="minute in minutes"
          :class="{ 'new-hour': minute.time.endsWith(':00') }"
        )
          td.time(
            v-if="minute.time.endsWith(':00')"
            rowspan="60"
          ) {{ minute.time }}
          template(v-for="event in minute.events")
            td.event(
              :data-weektype="event.week_type"
              :style="cellStyles(event)",
              :rowspan="cellRowspan(event)"
              :colspan="cellColspan(event)"
              @click="cellOnClick(event)"
            )
              .subject {{ event.subject.name }}
              .room {{ event.room }}

</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import {
  setSeconds,
  setMinutes,
  setHours,
  format,
  startOfWeek,
  endOfWeek,
  addMinutes,
  differenceInMinutes
} from 'date-fns'
import groupBy from 'lodash.groupby'
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
      editingEvent: {
        ...defaults,
        uuid: null
      },
      dayNames: [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
        // 'Dimanche'
      ]
    }
  },
  computed: {
    ...mapState(['now']),
    ...mapGetters('schedule', ['coursesIn']),
    scheduleStart() {
      let start = new Date()
      start = setHours(start, 8)
      start = setMinutes(start, 0)
      start = setSeconds(start, 0)
      return start
    },
    scheduleEnd() {
      let end = new Date()
      end = setHours(end, 19)
      end = setMinutes(end, 0)
      end = setSeconds(end, 0)
      return end
    },
    emptyMinutes() {
      // Create an object <time>: [] with time being every minute from scheduleStart to scheduleEnd
      const keys = []
      let currentTime = this.scheduleStart
      while (currentTime.getTime() <= this.scheduleEnd.getTime()) {
        keys.push(format(currentTime, 'HH:mm'))
        currentTime = addMinutes(currentTime, 1)
      }
      const minutes = {}
      keys.forEach((time) => {
        minutes[time] = []
      })
      return minutes
    },
    minutes() {
      // Structure:
      /*
        [
          {
            time: <HH:mm>
            events: <Event>[]
          }
        ]
      */
      // In the DOM:
      /*
      <tr>
        <td class="hour"> {{ time.minutes == 0 ? time : "" }} </td>
        @each events
          <td :data-weektype="week_type"> (<Event> markup...) </td>
     */
      let courses = this.coursesIn(
        startOfWeek(new Date()),
        endOfWeek(new Date())
      )
      // Add a `time` prop to each course in order to group them.
      courses = courses.map((course) => {
        let time = course.start
        time = format(time, 'HH:mm', new Date())
        return { ...course, time }
      })
      const grouped = { ...this.emptyMinutes, ...groupBy(courses, 'time') }
      const flatGroups = Object.keys(grouped).map((time) => {
        return {
          time,
          events: grouped[time]
        }
      })
      return flatGroups
    }
  },
  methods: {
    ...mapActions('schedule', { patch: 'patchEvent', del: 'deleteEvent' }),
    ...mapGetters(['textColor']),
    cellStyles(event) {
      return {
        color: this.textColor()(event.subject.color),
        backgroundColor: event.subject.color
      }
    },
    cellRowspan(event) {
      const diff = differenceInMinutes(event.start, event.end)
      const minutes = Math.abs(diff)
      return minutes
    },
    cellColspan(event) {
      let colspan = 2
      if (event.week_type !== 'BOTH' && this.bothWeeks) {
        colspan = 1
      }
      return colspan
    },
    cellOnClick(event) {
      this.editingEvent = event
      this.$modal.open('edit-event')
      this.$emit('event-click', event)
    }
  }
}
</script>

<style lang="stylus" scoped>
.schedule
  overflow-x auto
table
  table-layout fixed
  width 100%
  min-width 6 * 7rem
  // This is essential, else the table looks like this: https://i.imgur.com/uQ74W44.png
  border-collapse collapse
thead
  td
    height 1.5rem
    text-align center
.week-types
  border-bottom 2px solid var(--black)
  td
    color var(--grey)

td.time
  border-right 2px solid var(--grey)
  height 5rem
  font-family var(--fonts-monospace-light)
  width 5 * 1ch + .5em
  text-align right
  padding 1em
  vertical-align top
tr.new-hour
  min-height 1rem
  border-bottom 2px solid var(--grey)

.event
  text-align center
  padding 0.5em
  cursor pointer
  .room
    opacity: 0.75
    font-family var(--fonts-monospace-light)
  .subject
    overflow-x hidden
    width 100%
    text-overflow ellipsis
    white-space normal
</style>
