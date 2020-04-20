<template lang="pug">
.--schedule
  ModalAddEvent(
    v-model="editingEvent"
    action="edit"
    @submit="patch({ modifications: editingEvent, uuid: editingEvent.uuid })"
    @delete="del({ uuid: editingEvent.uuid })"
  )
  v-stage(:config="canvasConfig")
    v-layer(
      @click="handleEventClick"
      @mouseenter="handleHover"
      @mouseleave="handleHover"
    )
      template(v-for="(event, i) in events")
        v-rect(
          :key="`${event.uuid}-rect`"
          :config="resolveRect(event)"
        )
        v-text(
          :key="`${event.uuid}-text`"
          :config="resolveText(event)"
        )
      template(v-for="day in days")
        v-text(:config="day" :key="day.text")
        template(v-if="showWeekTypesHeader")
          v-text(:config="weekTypes(day).even" :key="`${day.text}-even`")
          v-text(:config="weekTypes(day).odd" :key="`${day.text}-odd`")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import groupBy from 'lodash.groupby'
import clamp from 'lodash.clamp'
import { firstBy } from 'thenby'
import { parse } from 'date-fns'
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
    },
    pixelsPerMinute: {
      type: Number,
      default: 1.5
    },
    events: {
      type: Array,
      default: () => [
        {
          day: 1,
          room: 'L666',
          start: 8 * 3600,
          end: 9 * 3600,
          subject: {
            name: 'English',
            color: 'blue'
          },
          week_type: 'Q1'
        }
      ]
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
      recomputeCanvasWidth: 1
    }
  },
  computed: {
    headerHeight() {
      const dayHeaderHeight = 40
      const weekTypesHeaderHeight = 20
      let headerHeight = dayHeaderHeight
      if (this.showWeekTypesHeader) {
        headerHeight += weekTypesHeaderHeight
      }
      return headerHeight
    },
    showWeekTypesHeader() {
      return !this.allEventsAreOnBothWeeks && this.bothWeeks
    },
    dayNames() {
      const names = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
      if (this.colmunsCount >= 6) names.push('Samedi')
      if (this.colmunsCount === 7) names.push('Dimanche')
      return names
    },
    dayWidth() {
      return this.resolveWidth({ week_type: 'BOTH' })
    },
    days() {
      const dayConfigs = []
      // eslint-disable-next-line no-unused-vars
      for (const day of this.dayNames) {
        dayConfigs.push({
          text: day,
          y: 0,
          x: this.dayWidth * this.dayNames.indexOf(day),
          width: this.dayWidth,
          height: this.headerHeight / 2,
          fontSize: 20,
          fontFamily: 'Now',
          align: 'center'
        })
      }
      return dayConfigs
    },
    heightOfLongestDay() {
      // Get the latest event to end
      const latestEndingEvent = Math.max(
        ...this.events.map((event) => event.end)
      )
      return latestEndingEvent - this.earliestStartTimeOfWeek
    },
    earliestStartTimeOfWeek() {
      // Mapping of day: events[]
      const eventsByDay = groupBy(this.events, 'day')
      // List of events[] grouped by day
      const eventsDayGrouped = Object.values(eventsByDay)
      // Get the length of each day
      const dayStarts = eventsDayGrouped.map((events) => {
        const sorted = events.sort(firstBy('start'))
        const dayStart = sorted[0].start
        return dayStart
      })
      // Get the max length
      return Math.min(...dayStarts)
    },
    canvasConfig() {
      // Trick to allow for recomputation of values on window resize
      const windowWidth =
        window.innerWidth +
        this.recomputeCanvasWidth -
        +this.recomputeCanvasWidth
      return {
        // height: this.headerHeight + this.heightOfLongestDay, gives a strange NS_ERROR_FAILURE from konvaJS on ff only
        // it looks like any computation that involves this.events fails with the same error.
        // thus we assume calendars will be at most 12 hours long.
        height: this.headerHeight + 12 * 60 * this.pixelsPerMinute,
        // width: Math.min(windowWidth - 100, 1000)
        width: clamp(windowWidth - 100, 500, 1000)
      }
    },
    colmunsCount() {
      // Get an array of days of events (unique)
      const days = [...new Set(this.events.map((event) => event.day))]
      // Work week (excluding weekends)
      let colmunsCount = 5
      // If we have saturday, bump the column count to 6
      if (days.includes(6)) {
        colmunsCount = 6
      }
      // If we have sunday, bump to 7 (the whole week)
      if (days.includes(7)) {
        colmunsCount = 7
      }
      return colmunsCount
    },
    allEventsAreOnBothWeeks() {
      // Get all the events' week_types (unique)
      const weekTypes = [
        ...new Set(this.events.map((event) => event.week_type))
      ]
      return !weekTypes.includes('Q1') && !weekTypes.includes('Q2')
    }
  },
  mounted() {
    window.addEventListener('resize', (ev) => {
      this.recomputeCanvasWidth += 1
    })
  },
  methods: {
    ...mapGetters(['textColor']),
    ...mapGetters('schedule', ['event']),
    ...mapActions('schedule', { patch: 'patchEvent', del: 'deleteEvent' }),
    weekTypes(day) {
      const week = { ...day }
      week.y = this.headerHeight / 2
      week.width /= 2
      week.fontSize *= 0.75
      week.opacity = 0.5
      const evenWeek = { ...week }
      const oddWeek = { ...week }
      evenWeek.text = 'Paire'
      evenWeek.x = week.x
      oddWeek.text = 'Impaire'
      oddWeek.x += evenWeek.width
      return { even: evenWeek, odd: oddWeek }
    },
    resolveWidth(event) {
      // Get the total width the canvas should be
      const total = this.canvasConfig.width
      // The width is the total width divided by the number of columns there should be
      let width = total / this.colmunsCount
      // Half the width if its not on both week types
      if (event.week_type !== 'BOTH' && this.bothWeeks) {
        width /= 2
      }
      return width
    },
    resolveHeight(event) {
      // Get the duration of this event
      const duration = event.end - event.start
      // Multiply by the factor
      return (duration / 60) * this.pixelsPerMinute
    },
    resolvePosition(event) {
      // Get the day and multiply by the base width of an event
      const baseWidth = this.resolveWidth({ week_type: 'BOTH' })
      let x = baseWidth * event.day - baseWidth
      // If the event is in Q2, we need to offset it to the right
      if (event.week_type === 'Q2' && this.bothWeeks) x += baseWidth / 2
      // Get the difference between the start of the day and the start of this event,
      // Multiply by the height factor
      let y =
        ((event.start - this.earliestStartTimeOfWeek) / 60) *
        this.pixelsPerMinute
      // Make room for the table headers
      y += this.headerHeight
      return { x, y }
    },
    resolveRect(event) {
      const { x, y } = this.resolvePosition(event)
      return {
        width: this.resolveWidth(event),
        height: this.resolveHeight(event),
        x,
        y,
        fill: event.subject.color
      }
    },
    resolveText(event) {
      const rect = this.resolveRect(event)
      return {
        text: event.subject.name + '\n' + event.room,
        fontFamily: 'Now, sans-serif',
        y: rect.y,
        x: rect.x,
        width: rect.width,
        height: rect.height,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 15,
        wrap: 'none',
        ellipsis: true,
        padding: 3,
        fill: this.textColor()(rect.fill),
        lineHeight: 1.5,
        id: event.uuid
      }
    },
    handleEventClick(vueComponent) {
      if (this.readOnly) return
      const eventUUID = vueComponent.target.attrs.id
      if (!eventUUID) return
      console.log(vueComponent)
      const event = this.event()(eventUUID)
      this.editingEvent = {
        ...event,
        start: parse(event.start, 'HH:mm:ss', new Date(0)),
        end: parse(event.end, 'HH:mm:ss', new Date(0))
      }
      this.$modal.open('edit-event')
    },
    handleHover(evt) {
      if (this.readOnly) return
      const canvas = this.$el
      // Check if its an event
      if (!evt.target.attrs.id) return
      switch (evt.type) {
        case 'mouseenter':
          canvas.style.cursor = 'pointer'
          break

        case 'mouseleave':
          canvas.style.cursor = 'default'
          break
      }
    }
  }
}
</script>
