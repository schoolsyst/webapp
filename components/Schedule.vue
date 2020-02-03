<template lang="pug">
  .schedule(:class="{ mnml: false }")
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
            td.week-type Paire
            td.week-type Impaire
      tbody
        tr(
          v-for="minute in minutes"
          :class="{ 'new-hour': minute.time.endsWith(':00'), 'has-events': minute.hasEvents }"
          :data-time="minute.time"
        )
          td.time(
            v-if="minute.time.endsWith(':00')"
            rowspan="60"
          ) {{ minute.time }}
          template(v-if="minute.hasEvents")
            template(v-for="(dayName, day) in dayNames")
              td.event(
                v-for="event in minute.events[day+1]"
                v-bind="cellAttrs(event)"
                @click="cellOnClick(event)"
              )
                template(v-if="!event.empty")
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
  differenceInMinutes,
  isWithinInterval,
  parse
} from 'date-fns'
// eslint-disable-next-line no-unused-vars
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
    courses() {
      return this.coursesIn(startOfWeek(new Date()), endOfWeek(new Date()), {
        includeBothWeekTypes: true,
        includeDeleted: true
      })
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
      let courses = this.courses
      const flatGroups = []
      // Add a `time` prop to each course in order to group them.
      courses = courses.map((course) => {
        let time = course.start
        time = format(time, 'HH:mm', new Date())
        return { ...course, time, empty: false }
      })
      const emptyEvent = { empty: true }
      const dayIndexes = [1, 2, 3, 4, 5, 6]
      Object.keys(this.emptyMinutes).forEach((time) => {
        let events = {}
        dayIndexes.forEach((day) => {
          const matchingEvents = courses.filter(
            (c) =>
              isWithinInterval(parse(time, 'HH:mm', c.start), {
                start: c.start,
                end: c.end
              }) && c.day === day
          )
          if (matchingEvents.length > 0) {
            events[day] = matchingEvents.filter((c) => c.time === time)
          } else {
            events[day] = [emptyEvent]
          }
        })
        if (time === '08:01')
          console.log(
            Object.values(events).filter(
              (e) => e.filter((y) => !y.empty).length > 0
            )
          )
        const emptyMinute =
          Object.values(events).filter(
            (e) => e.filter((y) => !y.empty).length > 0
          ).length === 0
        if (emptyMinute) events = {}
        flatGroups.push({ time, events, hasEvents: !emptyMinute })
      })
      return flatGroups
    }
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('settings/load')
    })
    window.iAmAMinimalist = () => {
      console.log('<Ewen Le Bihan> Me too!')
      console.log(
        '<Ewen Le Bihan> btw, if you like mmnl music, please take a listen over at https://youtube.com/c/mx3_music'
      )
      console.log(
        "<Ewen Le Bihan> (You also discovered schoolsyst's first easter egg, congrats!)"
      )
      console.log(
        '%cTo turn the schedule back to normal, simply refresh the page',
        'font-style: italic;'
      )
      document
        .querySelectorAll('.schedule')
        .forEach((el) => el.classList.add('mnml'))
      return 'good choice!'
    }
  },
  methods: {
    ...mapActions('schedule', { patch: 'patchEvent', del: 'deleteEvent' }),
    ...mapGetters(['textColor']),
    ...mapGetters('settings', { setting: 'value' }),
    cellStyles(event) {
      return {
        color: this.textColor()(event.subject.color),
        backgroundColor: event.subject.color,
        borderTopColor: event.subject.color,
        borderBottomColor: event.subject.color
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
    cellAttrs(event) {
      if (event.empty)
        return {
          class: 'empty',
          colspan: 2
        }
      else
        return {
          style: this.cellStyles(event),
          colspan: this.cellColspan(event),
          rowspan: this.cellRowspan(event)
        }
    },
    cellOnClick(event) {
      if (event.empty) return
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
  border-collapse collapse
thead
  td
    height 1.5rem
    text-align center
.week-type
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
  // min-height 1rem
  border-top 2px solid var(--grey)

.event:not(.empty)
  height 2rem
  text-align center
  padding 0.5em
  cursor pointer
  .room
    opacity: 0.75
    font-family var(--fonts-monospace-light)
  .subject
    overflow-x hidden
    overflow-y visible
    width 100%
    text-overflow ellipsis
    white-space normal
.event.empty
  height: 0 !important

.schedule.mnml
  thead
    opacity: 0
  .time
    opacity: 0
  td, tr
    border: none
</style>
